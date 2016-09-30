import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AngularFire, FirebaseObjectObservable, FirebaseAuth } from 'angularfire2';
import { LoginService } from '../login.service'

@Component({
  
  selector: 'login-box',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  private email:string;
  private password:string;
  constructor(private af:AngularFire, private auth:FirebaseAuth,  private router: Router, private loginService:LoginService) {
    
     
   }

  ngOnInit() {
    this.af.auth.subscribe(user => {
      if(user)
      {
        this.router.navigate(["/profile"])
      }
    })
  }

  logout(){
    this.loginService.logout()
  }

  

  login(){
    this.loginService.login()
  }

  passwordLogin(){
    this.loginService.passwordLogin(this.email, this.password);
  }

  signup(){
    this.loginService.signup(this.email, this.password)
  }

}
