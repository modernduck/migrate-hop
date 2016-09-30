import { FirebaseObjectObservable } from "angularfire2"
export class PromiseUser{
    
    user:FirebaseObjectObservable<any>;
    notifications:FirebaseObjectObservable<any>;
    key:string;
    
    constructor(user:FirebaseObjectObservable<any>, notification:FirebaseObjectObservable<any>, user_key:string){
        this.user = user;
        this.notifications = notification;
        this.key = user_key;
    }
}