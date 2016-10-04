import { Injectable } from '@angular/core';

import {AngularFire, FirebaseObjectObservable, FirebaseAuth, FirebaseAuthState, AuthMethods, AuthProviders} from 'angularfire2';

import { UserService } from './user.service'
import { PromiseUser } from "./model/promise-user"
const ROOT_PATH = 'users/'
const ROOT_NOTIFCATION_PATH = 'notifications/'
@Injectable()
export class LoginService {

  
  _isLogin = false;
  _callbackSuccess:any;
  public currentUserKey:string;
  public promiseUser:Promise<PromiseUser>
  public test = "yo"
  public currentUser:FirebaseObjectObservable<any> = null;
  
  public info:FirebaseObjectObservable<any> = null;
  private user:FirebaseAuthState;
  
  private getDefaultGroup()
  {
    return {
      admin:false,
      banking:false,
      newbie:true,
      teacher:false
    }
  }

  private fetchInfo ( uid )
  {
    
    this.info = this.af.database.object('users/' + uid)
    this.info.subscribe(data=>{
       
      if(typeof data.email == "undefined")
      {
        //if new new do this
        this.userService.isTempUser(this.user.auth.email).then(is_temp_user =>{
          if(!is_temp_user)
            this.userService.setUser(uid, this.userService.getNewGoogleUser(this.user.auth))
          else
            this.userService.moveTempUser(uid, this.user.auth.email)
        })
        
        
      }
      
      
    })
  }

  constructor(private af: AngularFire,public auth: FirebaseAuth, private userService:UserService) {
    //this.info = this.af.database.object('users/hlCJ4pmv09f5aoHk73X08cWaxcn2')
    this.promiseUser = new Promise<PromiseUser>((resolve, reject) =>{
      this.af.auth.subscribe(user=>{
          
          if(user)
          {
            this.user = user;
            this.currentUserKey = this.user.uid
            this._isLogin = true;
            
            var currentUser:FirebaseObjectObservable<any> = this.af.database.object(ROOT_PATH);
            var currentUserNotification:FirebaseObjectObservable<any> = this.af.database.object(ROOT_NOTIFCATION_PATH + this.currentUserKey);
            resolve(new PromiseUser(currentUser, currentUserNotification, this.currentUserKey))
            //new PromiseUser(this.af.database.object(ROOT_PATH), this.af.database.list(ROOT_NOTIFCATION_PATH + this.currentUserKey), this.currentUserKey)

            this.currentUser =this.userService.getUser(this.user.uid)
            this.fetchInfo(user.uid)
          }else
          {

            this._isLogin = false;
        
           
          }
          //this.af.auth.unsubscribe()
        })
        
    })
    
   
    
   }
  login(){
     this.auth.login();
   }
  isLogin(){
    return this._isLogin;
  }
  logout(){
    this.auth.logout();
  }

  signup(email:string, password:string){
    this.auth.createUser({
      email:email,
      password:password
    })
  }

  passwordLogin(email:string, password:string){
    this.auth.login({
        email:email,
        password:password
    },{
      provider: AuthProviders.Password,
      method: AuthMethods.Password,
    })
  }


  getCurrentUser(callback)
  {
    this.af.auth.subscribe(user=>{
      if(user)
      {
        this.af.database.object('users/' + user.uid).subscribe(data =>{
          callback(data)
        })
      }
    //  this.af.auth.unsubscribe()
    });
     

  }

}
