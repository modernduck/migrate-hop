import { Injectable } from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';

import { PaymentOrder, PaymentOrderItem } from "./model/payment-order"
import { CourseService } from "./course.service"
import {  PaymentTransaction, PaymentTransfer } from "./model/payment-transaction"
import { NotificationsService } from "./notifications.service"
import { Notification } from "./model/notification"

const ROOT_PATH = "payments/"
const TYPE_PATH = "payment_types/"
const TRANSACTION_PATH = "payment_transactions/"
const ORDER_PATH = "payment_order/"
const PAYMENT_STATUS_PATH = "payment_transactions_status/"
const USER_ENROLL_PATH = "users_enroll_courses/"
const COURSE_HAS_USERS = "course_enroll_users/"
const COURSE_ROOT_PATH = "courses/"
var global_is_update = false;
@Injectable()
export class PaymentService {

  constructor(private af:AngularFire, private nt:NotificationsService, private courseService:CourseService) { }

  getTypes() {
    return this.af.database.list(TYPE_PATH);
  }

  getType(type:string) {
    return this.af.database.object(TYPE_PATH + type)
  }

  generateKey(user_key){
    return user_key + "-" + (new Date()).getTime()
  }

  getUploadReference(user_key):Promise<any> {
    var reference = new Promise<any>( (resolve, reject) => {
      
      this.af.database.object(TRANSACTION_PATH + user_key  + "/slip_count").subscribe( data=>{
      
          if(data.$value)
            resolve({
              url: ("slip/" + user_key ),
              file_name:data.$value
            })
          else
             resolve({
              url: ("slip/" + user_key ),
              file_name:0
            })
      } )

    })

    return reference
    
  }

  generatePaymentStatusKey(user_key:string, now:number){
    return user_key + "-" + now;
  }
  /*
  * create payment_order
  * create payment_transactions
  */
  createTransferTransaction(user_key:string, payment_order:PaymentOrder, payment_transfer:PaymentTransfer, payment_transaction:PaymentTransaction):firebase.Promise<any>{
      
        var now = new Date().getTime()
        var count_request = 0;
        //update slip_count
        global_is_update = false
        var is_update = false;
        var pm = new Promise<any>( (resolve, reject) =>{
          this.af.database.object(TRANSACTION_PATH + user_key + "/slip_count").subscribe(data=>{
            if(data && typeof data.$value == "number")
              resolve(data.$value)
            else
              resolve(0)//default value

          })
        })

        pm.then(data =>{
            if(!is_update)
              this.af.database.object(TRANSACTION_PATH + user_key + "/slip_count").set(data + 1);
            is_update = true;
        })

        
        payment_transaction.discount = 0;
        payment_transaction.fee = 0;
        payment_transaction.payment_type = "transfer";
        payment_transaction.total = payment_transfer.amount;
        payment_transaction.status = "uploaded";
        payment_transaction.transfer_date = payment_transfer.date;
        payment_transaction.transfer_time = payment_transfer.time;


        this.af.database.object(TRANSACTION_PATH + user_key + "/" + now).set(payment_transaction.getData())
        //update payment status
        this.af.database.object(PAYMENT_STATUS_PATH + "uploaded/" + user_key + "-"  + now ).set(true )
        
        //this.af.database.object(USER_ENROLL_PATH + user_key + "/" + course_id).set(true)

        //create payment_order
        
         return   this.af.database.object(ORDER_PATH + user_key + "/" + now).set(payment_order)
         

     
  }

  /*
  * 
  */
  createCourseCashTransaction(user_key:string, course_key:string, reference:string, payment_amount:number){
    
    this.af.database.object(COURSE_ROOT_PATH + course_key + "/group/" + reference).subscribe( course_group =>{
        //var price = course_group.price;
        var payment_order = PaymentOrder.getCourseOrder(course_key, course_group.price, reference)
        this.courseService.enrollUser(course_key, user_key, reference);
        var payment_transaction = new PaymentTransaction();
        payment_transaction.payment_type = "cash";
        payment_transaction.status = "completed"
        payment_transaction.total = payment_amount;
        payment_transaction.fee = 0;
        payment_transaction.discount = 0;
        var now_js_date = new Date();
        payment_transaction.transfer_date = now_js_date.toISOString().slice(0, 10);
        payment_transaction.transfer_time = now_js_date.toISOString().slice(11,19);
        payment_transaction.payment_reference = "current user login";
        var now = now_js_date.getTime()
        this.af.database.object(TRANSACTION_PATH + user_key + "/" + now).set(payment_transaction.getData())
        this.af.database.object(PAYMENT_STATUS_PATH + "completed/" + user_key + "-" + now ).set(true )
        this.af.database.object(ORDER_PATH + user_key + "/" + now).set(payment_order.getData())

    })
    //var payment_order = new PaymentOrder()
  }




  getPaymentTransaction(user_key:string, time_key){
    return this.af.database.object(TRANSACTION_PATH + user_key + "/" + time_key)
  }

  getPaymentOrder(user_key:string, time_key){
    return this.af.database.list(ORDER_PATH + user_key + "/" + time_key)
  }

  getAllUserPaymentTransaction(user_key){
      return this.af.database.list(TRANSACTION_PATH + user_key)
  }

  getAllPaymentTransaction(status:string){
    
    return this.af.database.list(PAYMENT_STATUS_PATH + status)
  }

  setPaymentTransaction(user_key:string, time_key, payment_transaction){
    var is_update = false;
    var pm = new Promise<any>((resolve, reject) => {
      this.af.database.object(TRANSACTION_PATH + user_key + "/" + time_key).subscribe(data =>{
        resolve(data)
      })  
    })
    pm.then(data=>{
      if(!is_update)
      {
        if((data.status == "uploaded" || payment_transaction.status == "denied" )&& payment_transaction.status == "completed")
        {
          //register all class
          this.af.database.list(ORDER_PATH + user_key + "/" + time_key).subscribe(payment_order =>{
            payment_order.forEach(item=>{
              var cart_item = PaymentOrderItem.loadToCart(item)
              //USER_ENROLL_PATH
              //need to check if item is course or not
              this.courseService.enrollUser(cart_item.key, user_key, cart_item.reference)
              /*this.af.database.object(USER_ENROLL_PATH + user_key + "/" + cart_item.key).set(cart_item.reference)
              this.af.database.object(COURSE_HAS_USERS + cart_item.key + "/" + user_key).set(cart_item.reference)*/

              this.nt.sendToTeacher(cart_item.key, new Notification("course_approved", {
                "course_name" : cart_item.key
              }, "/courses"))    
              this.nt.send(user_key, new Notification("approved_course", {
                "course_name" : cart_item.key
              }, "/courses"))
            })
          })
          //notify teacher
          
          //notify student
        }else if(data.status == "completed" && (payment_transaction.status == "uploaded" || payment_transaction.status == "denied") ){
          //remove all enroll class?
          this.af.database.list(ORDER_PATH + user_key + "/" + time_key).subscribe(payment_order =>{
            payment_order.forEach(item=>{
              var cart_item = PaymentOrderItem.loadToCart(item)
              //USER_ENROLL_PATH
              //need to check if item is course or not
              this.courseService.removeEnrollUser(cart_item.key, user_key, cart_item.reference)
              //this.af.database.object(USER_ENROLL_PATH + user_key + "/" + cart_item.key).remove()
              //this.af.database.object(COURSE_HAS_USERS + cart_item.key + "/" + user_key).remove()
               this.nt.send(user_key, new Notification("denied_course", {
                "course_name" : cart_item.key
              }, "/courses"))
            })
          });
        }
        if(data.status != payment_transaction.status)
        {
          console.log('remove status: ' + PAYMENT_STATUS_PATH + data.status + "/"+ user_key + "-" + data.$key)
          console.log('add status:' + PAYMENT_STATUS_PATH + payment_transaction.status + "/" + user_key + "-" + time_key)
          
          var pm:firebase.Promise<void> = this.af.database.object(PAYMENT_STATUS_PATH + data.status + "/"+ user_key + "-" + data.$key ).remove()
          pm.then(data=>{
            console.log('delete success')
          }).catch(err =>{
            console.log('cant delete')
          })
          this.af.database.object(PAYMENT_STATUS_PATH + payment_transaction.status + "/" + user_key + "-" + time_key ).set(true)
        }
        delete payment_transaction.$key
        
        this.af.database.object(TRANSACTION_PATH + user_key + "/" + time_key).set(payment_transaction)
        is_update = true;
      }
    })

  }
  
  


}
