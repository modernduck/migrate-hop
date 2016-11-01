import { Injectable } from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import { PaymentOrder, PaymentOrderItem } from "./model/payment-order"
import 'rxjs/add/operator/take'
import {  Report } from "./model/report"
import { CourseService } from "./course.service"
import { PaymentService } from "./payment.service"
import {  PaymentTransaction, PaymentTransfer } from "./model/payment-transaction"

const ROOT_PATH = "report/"
const INDEX_PATH = "report_index/"
const PAYMENT_STATUS_PATH = "payment_transactions_status/"

@Injectable()
export class ReportService {

  constructor(private af:AngularFire, private paymentService:PaymentService) { }

  //move all completed transaction to archive 
  //and create report table that point to the set of these transaction
  //return report key
  createReport():Promise<Number>{
    let now = new Date();
    let report_key = now.getTime();
    
    let pm = new Promise<any>((resolve, reject) => {
      this.af.database.object(PAYMENT_STATUS_PATH + "completed").take(1).subscribe( data =>{
        //copy all completed in payment_transaction_status_complete to ROOT_PATH + report_key
          delete data['$key'];
          delete data['$exists'];
          this.af.database.object(INDEX_PATH + report_key).set(true);
          this.af.database.object(ROOT_PATH + report_key + "/").set(data).then( () => {
            //set all available course  to status to private? 
            //get and remove all course_en

            //then move all completed in payment_transaction_status_complete to payment_transaction_status => archive
            this.paymentService.removeAllPaymentStatus("completed").then( () => {
              
              resolve(data)
            })
          })
      }  )
    })
            

    

    return pm;
  }

  listReport(){
      return this.af.database.list(INDEX_PATH)
  }

  getReport(key:string){
    //do like copy report
    //return this.af.database.object(ROOT_PATH + key)
    return new Promise<Report>( (resolve, reject) => {
      this.af.database.list(ROOT_PATH + key).take(1).subscribe( payment_transaction_weird_keys => {
          //resolve(PaymentTransaction.load(payment_transactions, true))
          console.log('---->')
          console.log(payment_transaction_weird_keys)
          let index = 0;
          let transactions_counter = 0;
          let orders_counter = 0;
          let payment_transactions_promises:Array<Promise<PaymentTransaction>> = [] //= new Promise<PaymentTransaction>
          let payment_orders_promises:Array<Promise<PaymentOrder>> = [];
          let _payment_transactions:Array<PaymentTransaction> = [];
          let _payment_user_keys:Array<string> = [];
          let _payment_orders:Array<PaymentOrder> = [];

          let checkPromise = (transactions_counter, orders_counter) => {
            if(transactions_counter >= payment_transaction_weird_keys.length && orders_counter >= payment_transaction_weird_keys.length)
               
              resolve(new Report(
                _payment_transactions,
                _payment_orders,
                _payment_user_keys
              ))
             
          }

          payment_transaction_weird_keys.forEach(item => {
            
            let tmp = item.$key.split("-")
            _payment_user_keys.push(tmp[0])
            
            payment_transactions_promises[index] = new Promise<PaymentTransaction>( (rs, rj) => {
               this.paymentService.getPaymentTransaction(tmp[0], tmp[1]).take(1).subscribe(pmt => {
                  rs(pmt)
              } )
            })
            payment_transactions_promises[index].then( pmt => {

              _payment_transactions.push( PaymentTransaction.loadSingle(pmt))
              transactions_counter++;
              //if load all traction then resolve
              checkPromise(transactions_counter, orders_counter)
            })

            payment_orders_promises[index] = new Promise<PaymentOrder>( (rs, rj) => {
              this.paymentService.getPaymentOrder(tmp[0], tmp[1]).take(1).subscribe( po => {
                rs( PaymentOrder.load(po))
              })
            })

            payment_orders_promises[index].then( po => {
              _payment_orders.push( po)
              orders_counter++;
              checkPromise(transactions_counter, orders_counter)
            })

            index++;
          })
        })//end subscribe  )
    } )
    
  }

}
