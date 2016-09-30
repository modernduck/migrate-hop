import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2'

const COURSE_ENROLL_USERS = "course_enroll_users/";
const ROOT_PATH = "checkin/";

@Injectable()
export class CheckinService {

  

  constructor(private af:AngularFire) { }

  loadAvailableCourse(){
    return this.af.database.list(COURSE_ENROLL_USERS)
  }

  

  list(course_key:string,  date:string){
     return this.af.database.object(ROOT_PATH + course_key + "/" + date );
  }

  init(course_key:string, date:string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.list(course_key, date).subscribe(data_list=>{
        
        if(  typeof data_list.$value != "undefined"){
          //create new shit
          //get list from COURSE_ENROLL_USERS
          
          this.af.database.object(COURSE_ENROLL_USERS + course_key).subscribe(data =>{
            //got item
            var init_data ={};
            for(var key in data)
              init_data[key] = false;
            
              delete init_data['$key']

            this.af.database.object(ROOT_PATH + course_key + "/" + date).set(init_data);
            
            resolve(init_data)
          })
        }else
          resolve( data_list);

      })
    })
  }

  subscribe(course_key:string, date:string, callback){
    this.af.database.object(ROOT_PATH + course_key + "/" + date ).subscribe(data=>{
      callback(data);
    })
  }

  checkin(course_key:string, user_key:string, date:string){
   return this.af.database.object(ROOT_PATH + course_key + "/" + date + "/" + user_key).set(new Date().getTime())
   
  }

  setFalse(course_key:string, user_key:string, date:string){
    console.log('set false')
    return this.af.database.object(ROOT_PATH + course_key + "/" + date + "/" + user_key).set(false)
  }

  remove(course_key:string, user_key:string, date:string){
    return this.af.database.object(ROOT_PATH + course_key + "/" + date + "/" + user_key).remove();
  }



}
