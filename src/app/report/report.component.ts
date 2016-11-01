import { Component, OnInit } from '@angular/core';
import { ReportService } from "../report.service"


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  reports:Array<any> = [];
  constructor(private rs:ReportService) { }

  ngOnInit() {
    this.rs.listReport().subscribe(data => {
      this.reports = data;
    })
  }

}
