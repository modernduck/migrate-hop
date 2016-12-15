import { Component, OnInit } from '@angular/core';
//import { PaymentTransaction } from "../model/payment-transaction"
import { Report } from "../model/report"
import { PAYMENT } from "../config/payment"
import { PaymentService } from "../payment.service"
import { ReportService } from "../report.service"
import { UploadService } from "../upload.service"
import { CourseService } from "../course.service"
import { ActivatedRoute, Params, Router } from "@angular/router"
@Component({
  
  selector: 'payments-report',
  template: `
  <h2>Create New Report</h2>
  <button (click)="downloadCSV()" class="btn btn-success" >DOWNLOAD</button>
  <button (click)="createReport()" class="btn btn-primary"> Create A Report</button>
  <!--<div class="row">
    <div class="col-md-12" ><chart [options]="options" style="width:800px;" ></chart></div>
  </div>

  <div class="row">
   Payment <select>
        <option>All</option>
        <option>Tranfer</option>
        <option>Cash</option>
    </select>
    From <input type="date" />
    To <input type="date" />
  </div>-->
  <h4>Overview</h4>
  <table class="table">
    <thead>
        <th>Class</th>
        <th>Code</th>
        <th>Instuctor</th>
        <th>Total Paid</th>
    </thead>
    <tbody>
        <tr *ngFor="let item of reportOverviews">
            <td>{{item.class_name}}</td>
            <td>{{item.class_code}}</td>
            <td>{{item.teacher}}</td>
            <td>{{item.total | number}}</td>
        </tr>
    </tbody>
  </table>
  



  <h4>Each Data</h4>
  <table class="table table-striped" *ngIf='report'>
    <thead>
        <th>Reference Order.</th>
        <th>Course Key.</th>
        <th>Transfer Time.</th>
        <th>Amount.</th>
        <th>Expect Amount. </th>
        
        <th>From </th>
        <th>Type </th>
    </thead>
    <tbody>
        <tr *ngFor="let item of report.items" class="normal-{{item.amount == item.expect_amount}}">
            <td><a routerLink="../list/{{item.buyer_user_key}}/{{item.reference_order}}"><span [ngStyle]="{'padding': '5px',  'background-color': toColor(item.reference_order)}">
                {{item.reference_order}}
            </span></a></td>
            <td>{{item.course_key}}</td>
            <td>{{item.transfer_time | date:'fullDate'}}</td>
            <td class="amount">{{item.amount | number}}</td>
            <td  class="amount">{{item.expect_amount |number}}</td>
            
            <td>{{item.buyer_user_key}}</td>
            <td >{{item.payment_type}}</td>
        </tr>
        <tr>
            <td colspan="3">Total</td>
            <td class="amount">{{report.getTotal() | number}}</td>
            <td class="amount">{{report.getExpectedTotal() | number}}</td>
            <td>{{report.getBuyerCount() | number}} user(s)</td>
            <td></td>
        </tr>
    </tbody>
  </table>
  

  
  
  `,
  styleUrls: ['payments.component.css']
})
export class PaymentsReportComponent implements OnInit {
    private report:Report;
    private options = {};
    private reportOverviews= [];
    constructor(private pm:PaymentService, private router:Router, private rs:ReportService, private courseService:CourseService){

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
            this.reportOverviews = [];
            this.report = report;
            this.rs.convertReportToOverview(this.report).then(overviews =>{
                console.log('---------overviews')
                console.log(overviews)
                for(var key in overviews)
                {
                    this.reportOverviews.push(overviews[key])
                }
                
            })
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

    createReport(){
        if(confirm(PAYMENT.CREATE_REPORT_WARNING_MESSAGE))
        {
            console.log('create report na')
            this.rs.createReport().then( report_key => {
                console.log('done create report')
                this.router.navigate(["/payment/list"])
            })
            
        }       
    }
  
}