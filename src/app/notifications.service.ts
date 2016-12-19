import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from "angularfire2"
import { LoginService } from "./login.service"
import { Observable }     from 'rxjs/Observable'
import { PromiseUser } from "./model/promise-user"
import { Notifications } from "./model/notifications"
import { Notification } from "./model/notification"
import { EmailObject } from "./model/email-object"
import { EMAIL_SERVER } from "./config/system"
import 'rxjs/add/operator/map';
import { Http, RequestOptions, Headers, Response }    from '@angular/http';

const ROOT_PATH ="notifications/"
const COURSE_PATH = "courses/"
@Injectable()
export class NotificationsService {

  //public notifcation_list:Promise<Array<any>>;
  private user_key;
  
  private notifications:FirebaseObjectObservable<any>
  
  constructor(private af:AngularFire, private lg:LoginService, private http:Http) { 
      this.notifications = new FirebaseObjectObservable<any>();
      this.lg.promiseUser.then(promise_user =>{
           this.notifications = promise_user.notifications;
           this.user_key = promise_user.key
       })

  }
  
  subcribe(callback: (notificaitons:any ) => any) {
      this.lg.promiseUser.then( promise_user => {
          promise_user.notifications.subscribe(_notification=>{

              callback(new Notifications(_notification) )
          })
      })
  }

  send(to_user_key:string, nt:Notification){
    this.af.database.object(ROOT_PATH + to_user_key + "/" + nt.getKey()).set(nt.getData())
  }

  sendToTeacher(course_key:string, nt:Notification){
      this.af.database.object(COURSE_PATH + course_key).subscribe(data=>{
          for(var user_key in data.teacher)
          {
              this.send(user_key, nt);
          }
      })

  }

  read(notification_key:string) {
      //console.log("read:"+ ROOT_PATH + this.user_key + "/" +  notification_key)
      return this.af.database.object(ROOT_PATH + this.user_key + "/" +  notification_key).remove()
  }

  private  readEmailResponse(res:Response){
        let body = res.json();
        return body || { } 
    }

    sendEmail(obj:EmailObject){
        let reqOptions = new RequestOptions({
            headers: new Headers({ 'Content-Type': 'application/json' })
        })
        return this.http.post(EMAIL_SERVER, obj.toData(), reqOptions).map(this.readEmailResponse)
    }



}
