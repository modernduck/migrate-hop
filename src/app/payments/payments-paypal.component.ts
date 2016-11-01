import { Component, OnInit } from '@angular/core';
import { CartService } from "../cart.service"
import { PaymentService } from "../payment.service"
import { UploadService } from "../upload.service"
import { LoginService } from "../login.service"
import { Router } from "@angular/router"
import { PaymentTransaction, PaymentTransfer} from "../model/payment-transaction"

@Component({
  
  selector: 'payments-paypal',
  templateUrl: "payments-paypal.component.html",
  styleUrls: ['payments.component.css']
})
export class PaymentsPaypalComponent implements OnInit {
  private cart
  private payment_type;
  private payment_order;
  private current_user_key;
  private payment_transaction_key;
  private upload_reference;
  private isUploaded:boolean = false;
  private payment_transaction:PaymentTransaction
  private payment_transfer;
  private validate_transfer_fields = ["date", "time", "amount"]
  constructor(private cartService:CartService, private paymentService:PaymentService, private router:Router, private uploadService:UploadService, private lg:LoginService) { 
      this.cart = this.cartService.getCart();
      if(this.cart.length <= 0)
        this.router.navigate(['/courses'])
      this.payment_order = this.cartService.getPaymentOrder();
      this.lg.promiseUser.then(data =>{
          this.current_user_key = data.key;
          this.payment_transaction_key = this.paymentService.generateKey(this.current_user_key)
          this.paymentService.getUploadReference(this.current_user_key).then(data=>{
            console.log('upload ref' )
            console.log(data)
             this.upload_reference = data;
          })
      })
      
  }

  ngOnInit() {
      //since this is transfer fix it
     //this.paymentService
     
     this.paymentService.getType('paypal').subscribe(data => {
         this.payment_type = data;
     })
  }

  validate() {
      
  }

  save(){
      
    
  }

  

}
