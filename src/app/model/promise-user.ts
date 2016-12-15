import { FirebaseObjectObservable } from "angularfire2"
export class PromiseUser{
    
    user:FirebaseObjectObservable<any>;
    notifications:FirebaseObjectObservable<any>;
    key:string;
    info:any;
    
    constructor(user:FirebaseObjectObservable<any>, notification:FirebaseObjectObservable<any>, user_key:string, info){
        this.user = user;
        this.notifications = notification;
        this.key = user_key;
        this.info = info;

        
    }

    isNew():boolean{
        return  (typeof this.info.firstname == 'undefined'  || this.info.firstname == this.info.email)
    }

    isGuest():boolean{
        console.log('check if guest')
        console.log(this.info)
        return typeof this.info.firstname == 'undefined';
    }
}