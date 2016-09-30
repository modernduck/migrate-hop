import { Component, OnInit } from '@angular/core';
import { CartService } from "../cart.service"

@Component({
  
  selector: 'app-checkout',
  templateUrl: 'checkout.component.html',
  styleUrls: ['checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  private cart
  
  constructor(private cartService:CartService) { }

  ngOnInit() {
    this.cart = this.cartService.getCart();
    
  }

  remove(item) {
    this.cartService.removeCourseFromCart(item.key)
    this.cart = this.cartService.getCart();
  }

}
