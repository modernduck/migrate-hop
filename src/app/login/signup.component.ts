import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { LOGIN } from "../config/login"
import { GOOGLE_CAPTHA_KEY} from '../config/captcha'
import { AngularFire, FirebaseObjectObservable, FirebaseAuth } from 'angularfire2';
import { LoginService } from '../login.service'

@Component({
  
  selector: 'signup-box',
  template: `
    <h2>Sign up</h2>
    
     <div *ngIf="isHuman"  style="width:550px;margin-left:auto;margin-right:auto;">
      <form (submit)="signup()">
        <div class="row">
          <div class="col-md-3">
            Email
          </div>
          <div class="col-md-9">
            <input type="email" name="email" placeholder="Email"  class="form-control" [(ngModel)]="email" />
          </div>
        </div>
        <div class="row">
          <div class="col-md-3">
            Password 
            
          </div>
          <div class="col-md-9">
            <input type="password" name="password" placeholder="At least 8 Character"  class="form-control" [(ngModel)]="password" />

          </div>
        </div>
        <div class="row">
          <div class="col-md-3">
            Reconfirm Password
            
          </div>
          <div class="col-md-9">
            <input type="password" name="repassword" placeholder="At least 8 Character"  class="form-control" [(ngModel)]="repassword" />
          </div>
        </div>
        <input type="submit" class="btn btn-primary form-control" />
        </form>
        
     </div>
     <div *ngIf="!isHuman">
      {{robotMsg}}
     </div>
      <div  style="width:550px;margin-left:auto;margin-right:auto;">
        <re-captcha (captchaResponse)="handleCorrectCaptcha()"  site_key="{{key}}"></re-captcha>
      </div>
  `,
  styleUrls: ['login.component.css']
})
export class SignupComponent implements OnInit {
  private email:string="";
  private password:string="";
  private repassword:string="";
  private isHuman:Boolean = false;
  private key:string = GOOGLE_CAPTHA_KEY;
  private reasons:Array<string>;
  private robotMsg:string;
  constructor(private af:AngularFire, private auth:FirebaseAuth,  private router: Router, private loginService:LoginService) {
      this.reasons = [];
     this.robotMsg = LOGIN.MESSAGE_PLEASE_VERITY
   }

  ngOnInit() {
    this.af.auth.subscribe(user => {
      if(user)
      {
        this.router.navigate(["/profile"])
      }
    })
  }

  save():Boolean{
    if(this.validate())
      return false;
    this.loginService.signup(this.email, this.password)
    return true;
  }

  validate():Boolean{
    if(this.email.length < 0)
      return false;
    if(this.password.length >= LOGIN.PASSWORD_MIN_LENGTH)
      return false
    return this.password==this.repassword
  }

  handleCorrectCaptcha(){
      //console.log('ok you are human')
      this.isHuman = true;
  }

  signup(){
    if(this.save()){
      alert(LOGIN.MESSAGE_REGISTRATION_COMPLETE)
      this.router.navigate([''])
    }else
      alert(LOGIN.MESSAGE_REGISTRATION_FAILED)
  }

}
