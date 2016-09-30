import { Component, OnInit } from '@angular/core';
import { CartService } from "../cart.service"
import { PaymentService } from "../payment.service"
import { UploadService } from "../upload.service"
import { LoginService } from "../login.service"
import { Router } from "@angular/router"
import { PaymentTransaction, PaymentTransfer} from "../model/payment-transaction"

@Component({
  
  selector: 'payments-transfer',
  templateUrl: "payments-transfer.component.html",
  styleUrls: ['payments.component.css']
})
export class PaymentsTransferComponent implements OnInit {
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
              
             this.upload_reference = data;
          })
      })
      this.payment_transfer = new PaymentTransfer();
      this.payment_transaction = new PaymentTransaction();   
      this.payment_transaction.payment_type = "transfer";
      this.payment_transaction.discount = 0;
      this.payment_transaction.fee = 0;//need to change later 
    
  }

  ngOnInit() {
      //since this is transfer fix it
     //this.paymentService
     
     this.paymentService.getType('transfer').subscribe(data => {
         this.payment_type = data;
     })
  }

  validate() {
      //validate_fields
      var isValid = true
      this.validate_transfer_fields.forEach(field_name =>{
          if(field_name == "amount")
            isValid = this.payment_transfer[field_name] > 0
           else
            isValid = this.payment_transfer[field_name] != "" && typeof(this.payment_transfer[field_name]) != "undefined"
      })
      if(!isValid)
        return false;
      //isUploaded  
      return this.isUploaded;
  }

  save(){
      if(!this.validate())
        return false;
    this.paymentService.createTransferTransaction(this.current_user_key, this.payment_order, this.payment_transfer, this.payment_transaction).then(data=>{
        this.cartService.clearCart();
        console.log('transaction complete')
        this.router.navigate(['payment/transfer/thankyou']);
    })
    
  }

  upload() {
      
      this.uploadService.upload({
          url:this.upload_reference.url, 
          file_name:this.upload_reference.file_name
        }, data => {
          console.log('already upload')
          console.log(data)
          this.isUploaded = true;
          this.payment_transfer.slip_url = data.downloadUrl;
          this.payment_transaction.payment_reference = data.fullPath;

      })
  }

  

}
