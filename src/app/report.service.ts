import { Injectable } from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import { PaymentOrder, PaymentOrderItem } from "./model/payment-order"
import {  Report } from "./model/report"
import { CourseService } from "./course.service"
import {  PaymentTransaction, PaymentTransfer } from "./model/payment-transaction"

const ROOT_PATH = "report/"

@Injectable()
export class ReportService {

  constructor(private af:AngularFire) { }

  //move all completed transaction to archive 
  //and create report table that point to the set of these transaction
  createReport(){
    let now = new Date();
    let report_key = now.getTime();
    //copy all completed in payment_transaction_status_complete to ROOT_PATH + report_key

    //then move all completed in payment_transaction_status_complete to payment_transaction_status => archive


  }

  getReport(key:string){
    //do like copy report

  }

}
