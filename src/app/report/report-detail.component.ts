import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/take'
import { Report } from "../model/report"
import { PAYMENT } from "../config/payment"
import { PaymentService } from "../payment.service"
import { ReportService } from "../report.service"
import { UploadService } from "../upload.service"
import { ActivatedRoute, Params, Router } from "@angular/router"


@Component({
  selector: 'app-report',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportDetailComponent implements OnInit {
    private report:Report   
    private options;
    private key
  toColor(num) {
        num >>>= 0;
        var b = num & 0xFF,
            g = (num & 0xFF00) >>> 8,
            r = (num & 0xFF0000) >>> 16,
            a = ( (num & 0xFF000000) >>> 24 ) / 255 ;
        return "rgba(" + [r, g, b, a].join(",") + ")";
    }

  constructor(private route:ActivatedRoute, private rs:ReportService) { }

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

  ngOnInit() {
      this.route.params.forEach( (params:Params) => {
          params['key']
          this.key = params['key']
          this.rs.getReport(params['key']).then( report => {
              this.report = report;
              let all_data =  this.report.getAllGrossGraphData();
                this.options = {
                    title : {text : 'Income'},
                    series: all_data.series,
                    xAxis:{
                        categories:all_data.labels
                    }
                }
          })
      })

  }

}
