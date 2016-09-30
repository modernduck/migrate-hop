import { Component, OnInit } from '@angular/core';
import { PaymentTransaction } from "../model/payment-transaction"
import { PaymentService } from "../payment.service"
import { ActivatedRoute, Params } from "@angular/router"
@Component({
  
  selector: 'payments-list',
  template: `
  
   Payment Transaction Status <select (ngModelChange)="loadData($event)" [(ngModel)]="current_show_status">
        <option value="completed">Completed</option>
        <option value="uploaded">Uploaded</option>
        <option value="denied">Denied</option>
    </select>
    <table class="table">
      <thead>
        <th>#</th>
        <th></th>
      </thead>
      <tbody>
        <tr *ngFor="let item of display_payments">
          <td>{{item.$value }}</td>
          <td><a routerLink="{{item.$key}}/{{item.$value}}" class="btn btn-success">View</a></td>
        </tr>
      </tbody>
    </table>
  `,
  styleUrls: ['payments.component.css']
})
export class PaymentsListComponent implements OnInit {
  private current_show_status = "uploaded"
  constructor(private paymentService:PaymentService) { }
  private display_payments;


  transformPayment(raw_data){
    var result =[];
      raw_data.forEach(item=>{
        var arr = item.$key.split('-')
        if(arr[1] != "AT")
          result.push({
            "$key":arr[0],
            "$value":arr[1]
          })
        else  
          result.push({
            "$key": arr[0] + "-" + arr[1] + "-" + arr[2] + "-" + arr[3] + "-" + arr[4],
            "$value":arr[5]
          })
      })
      return result;
  }

  loadData(event?:any){
      if(!event)
        event = this.current_show_status
      //  console.log(event)
      //console.log('load data')
      console.log(event)
      this.paymentService.getAllPaymentTransaction(event).subscribe(data=>{
        console.log('load data')
        console.log(data)
          this.display_payments = this.transformPayment(data);
      })
  }

getViewItem(payment_status_item){
    return PaymentTransaction.getDataFromListItem(payment_status_item)
  }


  ngOnInit(){
    
      this.loadData();
  }

}