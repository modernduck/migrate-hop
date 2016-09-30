import { Component, OnInit } from '@angular/core';
import { CheckinService } from "../checkin.service"
import { CourseService } from "../course.service"
import { PaymentService } from "../payment.service"
import { UserService } from "../user.service"

@Component({
  
  selector: 'app-checkin',
  templateUrl: 'checkin.component.html',
  styleUrls: ['checkin.component.css']
})
export class CheckinComponent implements OnInit {
  private avaialable_course
  private active_course_index;
  private key_date;
  private scope_course;
  private _show_add_user:boolean;
  private add_user;
  private showWalkin:boolean;
  private showFinder:boolean;
  constructor(private cs:CheckinService, private courseService:CourseService, private paymentService:PaymentService, private userService:UserService) { }

  ngOnInit() {
    this.key_date =  new Date().toISOString().slice(0, 10);//2016-10-01
    this.cs.loadAvailableCourse().subscribe(data => {
      this.avaialable_course = data;
    })
    this.showFinder =false;

  }

  addUser(user){
    this.add_user  = user;
    this._show_add_user = false;
  }

  enrollUser(user_key, value){
    this.courseService.enrollUser(this.avaialable_course[this.active_course_index].$key, user_key, value)
    
  }

  noPaymentAdd(user){
    this.enrollUser(user.$key, user.reference);
    this.cs.checkin(this.avaialable_course[this.active_course_index].$key, user.$key, this.key_date);
    this.showWalkin = false;
  }

  promptAmount(user){
    var t = prompt("Payment Amount")
    if(isNaN(Number(t))){
      alert("this is not a number")
      return false;
    }else{
      this.paymentAdd(user, Number(t))
      
    }
  }

  paymentAdd(user, amount:number){
    //this.noPaymentAdd(user);
    this.paymentService.createCourseCashTransaction(user.$key, this.avaialable_course[this.active_course_index].$key, user.reference, amount)
    this.cs.checkin(this.avaialable_course[this.active_course_index].$key, user.$key, this.key_date);
    this.showWalkin = false;
    //this.paymentService.c
    //this.paymentService.setPaymentTransaction(user.$key, )
  }

  createWalkInUser(){
    var email = prompt("Email ?")
    var nickname = prompt("Name ?")
    if(confirm("register " + email  + " ( " + nickname + " ) "))
      this.userService.createTempUser(email, nickname);
      //this.u
  }

  select(user){
    if(!user.scope){
      //console.log('gonna check in ' + this.avaialable_course[this.active_course_index].$key + "," + user.$key + "," + this.key_date)
      this.cs.checkin(this.avaialable_course[this.active_course_index].$key, user.$key, this.key_date)
      
    }else 
      this.cs.setFalse(this.avaialable_course[this.active_course_index].$key, user.$key, this.key_date)
      //this.cs.
  }

  chooseCourse(index){
    this.active_course_index = index;
    this.showFinder = true;
    //console.log('course_key :' + this.avaialable_course[index].$key)
    this.cs.init(this.avaialable_course[index].$key, this.key_date).then( data=>{
      //console.log('init')
      //console.log(data)
    })
    this.cs.subscribe(this.avaialable_course[index].$key, this.key_date, data=>{
      //subcribe ?
      
      //console.log(data)
      this.scope_course = data;
    })

  }

}
