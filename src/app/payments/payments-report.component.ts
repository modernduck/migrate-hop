import { Component, OnInit } from '@angular/core';
//import { PaymentTransaction } from "../model/payment-transaction"
import { Report } from "../model/report"
import { PaymentService } from "../payment.service"
import { UploadService } from "../upload.service"
import { ActivatedRoute, Params } from "@angular/router"
@Component({
  
  selector: 'payments-report',
  template: `
  <h2>Create New Report</h2>
  <button (click)="downloadCSV()" class="btn btn-success" >DOWNLOAD</button>
  <div class="row">
    <div class="col-md-12" ><chart [options]="options" style="width:800px;" ></chart></div>
  </div>
  <table class="table table-striped" *ngIf='report'>
    <thead>
        <th>Reference Order.</th>
        <th>Course Key.</th>
        <th>Transfer Time.</th>
        <th>Amount.</th>
        <th>Expect Amount. </th>
        <th>From </th>
    </thead>
    <tbody>
        <tr *ngFor="let item of report.items" class="normal-{{item.amount == item.expect_amount}}">
            <td><a routerLink="../list/{{item.buyer_user_key}}/{{item.reference_order}}"><span [ngStyle]="{'padding': '5px',  'background-color': toColor(item.reference_order)}">
                {{item.reference_order}}
            </span></a></td>
            <td>{{item.course_key}}</td>
            <td>{{item.transfer_time | date:'fullDate'}}</td>
            <td class="amount"><input type="number" [(ngModel)]="item.amount" ></td>
            <td  class="amount">{{item.expect_amount |number}}</td>
            <td>{{item.buyer_user_key}}</td>
        </tr>
        <tr>
            <td colspan="3">Total</td>
            <td class="amount">{{report.getTotal() | number}}</td>
            <td class="amount">{{report.getExpectedTotal() | number}}</td>
            <td>{{report.getBuyerCount() | number}} user(s)</td>
        </tr>
    </tbody>
  </table>
  

  
  
  `,
  styleUrls: ['payments.component.css']
})
export class PaymentsReportComponent implements OnInit {
    private report:Report;
    private options = {};
    constructor(private pm:PaymentService){

    }

    toColor(num) {
        num >>>= 0;
        var b = num & 0xFF,
            g = (num & 0xFF00) >>> 8,
            r = (num & 0xFF0000) >>> 16,
            a = ( (num & 0xFF000000) >>> 24 ) / 255 ;
        return "rgba(" + [r, g, b, a].join(",") + ")";
    }

    ngOnInit(){
        console.log('load data')
        this.pm.getCurrentReport().then( report => {
            this.report = report;
            console.log('report')
            console.log(this.report)
            let all_data =  this.report.getAllGrossGraphData();
            this.options = {
                title : {text : 'Income'},
                series: all_data.series,
                xAxis:{
                    categories:all_data.labels
                }
            }
            
        } )
       

    }

    downloadCSV(){
        let csvContent = this.report.toCSV();
        let title ="MY REPORT"
         var filename = title.replace(/ /g,'')+'.csv'; //gen a filename using the title but getting rid of spaces
        var blob = new Blob([csvContent], { "type": 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) 
        { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } 
        else //create a link and click it
        {
            var link = document.createElement("a");
            if (link.download !== undefined) // feature detection
            { 
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob); 
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            }
        }
    }
  
}