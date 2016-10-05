import { Injectable } from '@angular/core';
import {AngularFire, FirebaseObjectObservable, FirebaseAuth, FirebaseAuthState, } from 'angularfire2';

const MEMBER_GROUP_PATH="group_members/"
const ROOT_PATH = "users/"
const USER_ENROLL_COURSES = "users_enroll_courses/"
const TEMP_USER_PATH = "temp_users/"
@Injectable()
export class UserService {

  constructor(private af:AngularFire) { }

  private getDefaultGroup()
  {
    return {
      
      newbie:true,
      
    }
  }

  public getNewGoogleUser(userAuth)
  {
    return {
      "email": userAuth.email,
      "nickname":userAuth.displayName?userAuth.displayName:userAuth.email,
      "fullname":userAuth.displayName?userAuth.displayName:userAuth.email,
      "picture":userAuth.photoURL,
      "group":this.getDefaultGroup()

    }
  }

  private update_group(user_key, user) {
    
    for(let group_name in user.group)
    {
      
      if( user.group[group_name])
      {
        
        this.af.database.object(MEMBER_GROUP_PATH +group_name +"/" + user_key).set(user.nickname)
      }else
      {
        
        this.af.database.object(MEMBER_GROUP_PATH +group_name +"/" + user_key).remove()
      }
    }

  }

  public updateUser(user_key:string, user){
      
      this.update_group(user_key, user);
      return this.af.database.object('users/' + user_key).update(user)
  }

  public setUser(user_key, user){
    this.af.database.object('users/' + user_key).set(user)
    //update user group
    //[!stupid]now this is really stupid cause it update everytime user set 
    this.update_group(user_key, user);


  }

  public  getTempKey(email:string){
    var t = email.replace("@", "-AT-")
    t = t.replace(".", "-DOT-");
    return t
  }

  public createTempUser(email:string, nickname?:string){
      var user = {
        email:email,
        nickname:nickname?nickname:email,
        fullname:nickname?nickname:email,
        group:this.getDefaultGroup(),
        is_temp:true
      }
      this.af.database.object(ROOT_PATH + this.getTempKey(email) ).set(user);
      this.af.database.object(TEMP_USER_PATH + this.getTempKey(email)).set(true);
      this.update_group(this.getTempKey(email), user);
  }

  public isTempUser(email:string):Promise<boolean>{
    return new Promise<boolean>((resolve, reject) => {
      this.af.database.object(TEMP_USER_PATH + this.getTempKey(email)).subscribe(data =>{
        resolve(data.$value)
      })
    })
  }

  private _replace_course_enroll_users(course_key:string, old_key:string, user_key:string){
    var course_enroll_path = 'course_enroll_users/' + course_key + "/"
    /*this.af.database.object(course_enroll_path + old_key).take(1).subscribe(data =>{
        delete data.$key  
        this.af.database.object(course_enroll_path + user_key).set(data)
        this.af.database.object(course_enroll_path + old_key).remove();
    })*/
  }

  private _replace_checkin(course_key:string, old_key:string, user_key:string){
   /* this.af.database.object("checkin/" + course_key).take(1).subscribe(checkin_data=>{
      var replace_obj = {}
      for(var day_date in checkin_data){
        
         replace_obj[day_date] = {}
        for(var _user_key in checkin_data[day_date]){
          if(_user_key != old_key)
            replace_obj[day_date][_user_key] = true;
          else
            replace_obj[day_date][user_key] = true;
        }
      }
      delete replace_obj['$key']
      this.af.database.object("checkin/" + course_key).set(replace_obj)
    })*/

  }

  public moveTempUser(user_key:string, email:string){
      var old_key = this.getTempKey(email)
      
      //get all payment transactions
     /* this.af.database.object('payment_transactions/' + old_key).take(1).subscribe(data =>{
          
            for(var time_key in data){
              if(time_key != "$key"){
                var value = data[time_key];
                //payment_transactions_status
                this.af.database.object('payment_transactions_status/' + value.status + "/" + old_key + "-" + time_key).remove()
                this.af.database.object('payment_transactions_status/' + value.status + "/" + user_key + "-" + time_key).set(true)
              }
            }//end time_key
            
         var payment_order_path = "payment_order/";
        this.af.database.object(payment_order_path + old_key).take(1).subscribe(data =>{
            delete data.$key
            this.af.database.object(payment_order_path + user_key).set(data)
            this.af.database.object(payment_order_path + old_key).remove()
        })
        delete data.$key
        this.af.database.object('payment_transactions/' + user_key).set(data)
        this.af.database.object('payment_transactions/' + old_key).remove()             
          
      })
      //move all courses
      this.af.database.object(USER_ENROLL_COURSES + old_key).take(1).subscribe(data => {
          //course_enroll_user
          
          for(var course_key in data){
            if(course_key != "$key"){
              this._replace_course_enroll_users(course_key, old_key, user_key)
              this._replace_checkin(course_key, old_key, user_key)
            }
          }
          delete data.$key
          this.af.database.object(USER_ENROLL_COURSES + user_key).set(data)
          this.af.database.object(USER_ENROLL_COURSES + old_key).remove()
      })
    
      //move all user
      this.af.database.object(ROOT_PATH + old_key).take(1).subscribe(data =>{
          for(var group_name in data.group){
            
            this.af.database.object("group_members/" + group_name + "/" + old_key).remove()
            this.af.database.object("group_members/" + group_name + "/" + user_key).set(true)
          }
          delete data.$key
          this.af.database.object(ROOT_PATH + user_key).set(data)
          this.af.database.object(ROOT_PATH + old_key).remove()
      })
      
      
      
    */
  }


  public getAllUser(limit?: number)
  {
    console.log('get em all')
    if(limit)
      return this.af.database.list('users', {
        query:{
          limitToLast:limit
        }
      })
    else
      return this.af.database.list('users')
  }

  public updatePicture(user_key, pictureUrl)
  {
    this.af.database.object('users/' + user_key + '/picture').set(pictureUrl);
  }

  public getUser(user_key)
  {
    return this.af.database.object('users/' + user_key)
  }

  public getUserNickname(user_key)
  {
    //console.log('user_key: ' + user_key)
    return this.af.database.object('users/' + user_key + '/nickname')
  }

  public deleteUser(user_key)
  {
    //remove all users
    this.af.database.object(ROOT_PATH + user_key).remove();
  }



}
