import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AngularFire, FirebaseObjectObservable, FirebaseAuth } from 'angularfire2';
import { LoginService } from '../login.service'
import 'rxjs/add/operator/take'

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
    /*this.af.auth.subscribe(user => {
      if(user)
      {
        //when first time
        this.router.navigate(["/profile/update"])
      }
    })*/
    this.loginService.promiseUser.then( pu => {
      //pu.user

      this.router.navigate(["courses"])
    })
  }

  logout(){
    this.loginService.logout()
  }

  

  login(){
    this.loginService.login(error => {
      alert("Some thing off")
      console.log(error)
    })
  }

  passwordLogin(){
    this.loginService.passwordLogin(this.email, this.password, error => {
      alert("Some thing off")
      console.log(error)
    });
  }

  signup(){
    this.loginService.signup(this.email, this.password)
  }

  facebookLogin(){
    this.loginService.facebookLogin()
  }

}
