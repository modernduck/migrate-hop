import { Component, OnInit } from '@angular/core';
import { CartService } from "../cart.service"
import { PaymentService } from "../payment.service"
@Component({
  
  selector: 'payments-method',
  templateUrl: "payments-method.component.html",
  styleUrls: ['payments.component.css']
})
export class PaymentsMethodComponent implements OnInit {
  private cart
  private payment_types:Array<any>=[];
  private selectedPaymentType;
  constructor(private cartService:CartService, private paymentService:PaymentService) { }

  ngOnInit() {
      console.log('init?')
      this.cart = this.cartService.getCart();
      /*this.paymentService.getTypes().then(types=>{
          
          this.payment_types = types;
          console.log(this.payment_types)
      });*/
      this.paymentService.getTypes().subscribe(types => {
          this.payment_types = types;
      })
      //this.payment_types =this.p 
  }

  deselectAll(){
      this.payment_types.forEach(item=>{
          item.style=""
          item.btn_style=""
      })
  }
  

  select(item){
      this.deselectAll()
      item.style="selected"
      item.btn_style = "disabled"
      this.selectedPaymentType = item.$key
  }

}
