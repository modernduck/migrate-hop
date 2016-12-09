import { Component, OnInit } from '@angular/core';
import { CartService } from "../cart.service"
import { Router } from "@angular/router"

@Component({
  
  selector: 'checkout-bar',
  template: `
     <div class="checkout-bar">
        <a *ngIf="isShow" class=" btn btn-danger" routerLink="/checkout">Check Out</a>
    </div>
  `,
  styleUrls: ['checkout.component.css']
})
export class CheckoutBarComponent implements OnInit {
  private cart
  private orderCount:number = 0;
  private isShow = true;
  private isShowByUrl = true;

  private checkShouldShow(){
    if(!this.isShowByUrl)
      this.isShow = false;
    else 
      if(this.orderCount ==0)
          this.isShow =false;
        else
          this.isShow = true;
  }
  

  constructor(private cartService:CartService, private router:Router) {
      this.router.events.subscribe(change=>{
        //console.log(change)
          if(change.url != "/checkout" && change.url != "/payment/new")
            this.isShowByUrl = true;
          else
            this.isShowByUrl = false;
           this.checkShouldShow()
      })    
      this.cartService.subcribe(cart =>{
        this.orderCount = cart.orderCount;
        this.checkShouldShow()
      })
   }

  ngOnInit() {
    
    
  }


}
