import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service'
import { UploadService } from '../upload.service'
import { PaymentService } from "../payment.service"
import { Router} from "@angular/router";
import { PaymentTransaction } from "../model/payment-transaction"
import {  MESSAGES } from "../config/messages"
import 'rxjs/add/operator/take'

@Component({
  
  selector: 'app-payments',
  templateUrl: 'payments.component.html',
  styleUrls: ['payments.component.css']
})
export class PaymentsComponent implements OnInit {


  private payments
  private user_key:string;
  private user;
  constructor(private lg:LoginService, private ps:PaymentService, private us:UploadService,  private router: Router) { }

  ngOnInit() {
    this.lg.promiseUser.then(pu =>
    {
      if(pu.isNew())
      {
        alert(MESSAGES.PROFILE.PLEASE_FILL_INFO)
        this.router.navigate(['profile/update'])
      }

      pu.user.take(1).subscribe(real_user => {
        this.user =  real_user;
      })
      this.user_key  = pu.key
      this.ps.getAllUserPaymentTransaction(pu.key).subscribe(data=>{
        this.payments = PaymentTransaction.load(data, true);
      })
    })
    
  }

  download(item) {
    //console.log(item)
    this.us.download(item.payment_reference)
  }

  cancel(item) {
      console.log(item)
      this.ps.cancelPaymentTransaction(this.user_key, item.$key).then( () =>{
          //payments should update?
          console.log('cancel complete?')
      } )
  }

}
