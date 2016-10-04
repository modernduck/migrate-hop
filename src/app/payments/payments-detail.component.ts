import { Component, OnInit } from '@angular/core';
import { PaymentTransaction } from "../model/payment-transaction"
import { PaymentService } from "../payment.service"
import { UploadService } from "../upload.service"
import { ActivatedRoute, Params } from "@angular/router"
@Component({
  
  selector: 'payments-detail',
  template: `
  <section *ngIf="payment_transaction">
    <h3>Transaction</h3> 
    <div class="row">
      <div class="col-md-1">Status</div>
      <div class="col-md-5">
        <select [(ngModel)]="payment_transaction.status">
          <option value="uploaded">Uploaded</option>
          <option value="completed">Completed</option>
          <option value="denied">Denied</option>
        </select>
        
        </div>
      <div class="col-md-1">Total</div>
      <div class="col-md-5"><input type="number" [(ngModel)]="payment_transaction.total" class="form-control"></div>
    </div>
    <div class="row">
      <div class="col-md-1">Transfer Date</div>
      <div class="col-md-5"><input type="date" [(ngModel)]="payment_transaction.transfer_date" ></div>
      <div class="col-md-1">Transfer Time</div>
      <div class="col-md-5"><input type="time" [(ngModel)]="payment_transaction.transfer_time" ></div>
    </div>
    <div class="row">
      <div class="col-md-1">Reference</div>
      <div class="col-md-5"><a (click)="download()">{{payment_transaction.payment_reference}}</a></div>
      <div class="col-md-1">Type</div>
      <div class="col-md-5">({{payment_transaction.payment_type}})</div>
    </div>
  </section>
  <h3>Order</h3>
  <table class='table table-striped'>
    <tr *ngFor="let item of payment_order">
      <td>{{item.$key}}</td>
      <td>{{item.quantity}}</td>
      <td>{{item.unit_price}}</td>

    </tr>
  </table>
  <h3>User</h3>
  
  <users-display [userKey]="user_key"></users-display>
  <div >
    <a class="btn btn-primary" routerLink="../..">Back</a>
    <button class="btn btn-success" (click)="save()">Save</button>
  </div>
  
  `,
  styleUrls: ['payments.component.css']
})
export class PaymentsDetailComponent implements OnInit {
  private current_show_status = "uploaded"
  constructor(private paymentService:PaymentService, private route:ActivatedRoute, private up:UploadService) { }
  private user_key;
  private time_key;
  private payment_order;
  private payment_transaction;


  loadData(event?:any){
     
  }


  save(){
    this.paymentService.setPaymentTransaction(this.user_key, this.time_key, this.payment_transaction)
    
  

  }

  download(){
    this.up.download(this.payment_transaction.payment_reference)
  }


  ngOnInit(){
    this.route.params.forEach((params:Params) =>{
        
        this.user_key = params['user_key']
        this.time_key = params['time_key']
        this.paymentService.getPaymentTransaction(this.user_key, this.time_key).subscribe(data=>{
          this.payment_transaction = data;
        })
        this.paymentService.getPaymentOrder(this.user_key, this.time_key).subscribe(data => {
          this.payment_order = data;
        })
    })
      
  }

}