import { Component, OnInit } from '@angular/core';
import { CartService } from "../cart.service"
import { PaymentService } from "../payment.service"
import { ActivatedRoute, Params} from "@angular/router"

@Component({
  
  selector: 'payments-method',
  template: `
    <h2>Display Receipt</h2> 
    
  `,
  styleUrls: ['payments.component.css']
})
export class PaymentReceiptComponent implements OnInit {
  constructor(private paymentService:PaymentService, private route:ActivatedRoute) { }
  private key;
  ngOnInit() {
    this.route.params.forEach( (params:Params) => {
      this.key = params['key']
    })  
  }

}
