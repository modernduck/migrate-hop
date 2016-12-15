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

   checkNavigate(){
     
     this.loginService.refreshPromise().then( (data)=>{
       if(data.isNew())
       {
         this.router.navigate(["/profile/update"])
       }else
       {
         this.router.navigate(["/courses"])
       }
     });
   }

  ngOnInit() {
    
    this.loginService.promiseUser.then( pu => {
      //pu.user
      
       if(pu.isNew())
        this.loginService.refreshPromise().then( (data)=>{
          console.log('before naviate')
          console.log(data)
          this.router.navigate(["/profile/update"])
        })
        else if(!pu.isGuest())
          this.router.navigate(["/courses"])
        
        
    })
  }

  logout(){
    this.loginService.logout()
  }

  

  login(){
    this.loginService.login(error => {
      alert("Some thing off")
      console.log(error)
    }).then(state => {
      
      this.checkNavigate()
    })
  }

  passwordLogin(){
    this.loginService.passwordLogin(this.email, this.password, error => {
      alert("Some thing off")
      console.log(error)
    }).then(state => {
     this.checkNavigate()
      
    });
  }

  signup(){
    this.loginService.signup(this.email, this.password)
  }

  facebookLogin(){
    this.loginService.facebookLogin().then(state => {
     this.checkNavigate()
      
    })
  }

}
