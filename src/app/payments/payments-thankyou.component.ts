import { Component, OnInit } from '@angular/core';
import { CartService } from "../cart.service"
import { PaymentService } from "../payment.service"
import { ActivatedRoute, Params } from "@angular/router"
@Component({
  
  selector: 'payments-thankyou',
  template: `
    <h2>Thank you</h2>
    <div *ngIf="type=='transfer'">
      You could check your payment status at Payment
    </div>
    <div *ngIf="type=='paypal'">
      You could check your receipt at Payment and see you in the dance floor.
    </div>
  `,
  styleUrls: ['payments.component.css']
})
export class PaymentsThankyouComponent implements OnInit {
  private type
  constructor(private cartService:CartService, private paymentService:PaymentService, private route:ActivatedRoute) { }

  ngOnInit(){
    this.route.params.forEach( (params:Params) => {
      this.type = params['type']
    } )

  }

}