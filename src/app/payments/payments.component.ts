import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service'
import { PaymentService } from "../payment.service"
import { PaymentTransaction } from "../model/payment-transaction"

@Component({
  
  selector: 'app-payments',
  templateUrl: 'payments.component.html',
  styleUrls: ['payments.component.css']
})
export class PaymentsComponent implements OnInit {


  private payments
  constructor(private lg:LoginService, private ps:PaymentService) { }

  ngOnInit() {
    this.lg.promiseUser.then(pu =>{
      
      this.ps.getAllUserPaymentTransaction(pu.key).subscribe(data=>{
        this.payments = PaymentTransaction.load(data);
      })
    })
    
  }

}
