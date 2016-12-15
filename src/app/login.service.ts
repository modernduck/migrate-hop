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

  private fetchInfo ( uid ) :Promise<any>
  {
    
    let userInfo = new Promise<any>( (resolve, reject) => {
      console.log('fetching : ' + 'users/' + uid)
       this.info = this.af.database.object('users/' + uid)
        this.info.subscribe(data=>{
          console.log('get fretch')
          console.log(data)
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
          resolve(data)
          
        })
    })
   return userInfo;
  }

  refreshPromise() :Promise<PromiseUser> {
    this.promiseUser = new Promise<PromiseUser>((resolve, reject) =>{
        this.af.auth.take(1).subscribe(user=>{
            this.user = user;
          
          
          
            this.currentUserKey = user.uid
            console.log('should work' + this.currentUserKey )
              var currentUser:FirebaseObjectObservable<any> = this.af.database.object(ROOT_PATH + this.currentUserKey);
              var currentUserNotification:FirebaseObjectObservable<any> = this.af.database.object(ROOT_NOTIFCATION_PATH + this.currentUserKey);
              this.fetchInfo(user.uid).then(info => {
                  console.log('should resolve')
                  resolve(new PromiseUser(currentUser, currentUserNotification, this.currentUserKey, info))
                })
          
          

        });

    });
    return this.promiseUser;
  }

  constructor(private af: AngularFire,public auth: FirebaseAuth, private userService:UserService) {
    //this.info = this.af.database.object('users/hlCJ4pmv09f5aoHk73X08cWaxcn2')
    this.promiseUser = new Promise<PromiseUser>((resolve, reject) =>{
      this.af.auth.subscribe(user=>{
          
          if(user)
          {
            this.user = user;
            
            this._isLogin = true;
            this.currentUserKey = this.user.uid
            var currentUser:FirebaseObjectObservable<any> = this.af.database.object(ROOT_PATH + this.currentUserKey);
            var currentUserNotification:FirebaseObjectObservable<any> = this.af.database.object(ROOT_NOTIFCATION_PATH + this.currentUserKey);
            
            //new PromiseUser(this.af.database.object(ROOT_PATH), this.af.database.list(ROOT_NOTIFCATION_PATH + this.currentUserKey), this.currentUserKey)

            this.currentUser =this.userService.getUser(this.user.uid)
            this.fetchInfo(user.uid).then(info => {
              if(resolve)
                resolve(new PromiseUser(currentUser, currentUserNotification, this.currentUserKey, info))
            })
            
            
          }else
          {

            this._isLogin = false;
        
           
          }
          //this.af.auth.unsubscribe()
        })
        
    })
    
   
    
   }
  login(onReject:(error)=> void):firebase.Promise<FirebaseAuthState>{
     let result =  this.auth.login()
     result.catch(onReject);
     return result;
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

  passwordLogin(email:string, password:string, onReject:any):firebase.Promise<FirebaseAuthState>{
    let result = this.auth.login({
        email:email,
        password:password
    },{
      provider: AuthProviders.Password,
      method: AuthMethods.Password,
    })
    result.catch( onReject )
    return result;
  }

  facebookLogin():firebase.Promise<FirebaseAuthState>{
    return this.auth.login({
      provider:AuthProviders.Facebook,
      method:AuthMethods.Redirect
    })
  }


 /* getCurrentUser(callback)
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
     

  }*/

}
