const REQUEST_NOTIFICATION = 1;
const REPORT_NOTIFICATION = 2
import { NotificationMessages } from "../messages/notification" 
export class Notification{
    filter:string;
    parameter:any;
    href:string;
    private $key:string;
    
    constructor(filter:string, parameter:any, href:string, $key?:any){
        this.filter = filter;
        this.parameter = parameter;
        this.href = href;
        if(typeof $key == "string" && $key)
            this.$key = $key
        else
            this.$key = new Date().getTime()+""
    }

    public static load(data){
        return new Notification(data.filter, data.parameter, data.href, data.$key)
    }

    public getMessage(){
        return NotificationMessages.get(this.filter, this.parameter)
    }

    public getKey()
    {
        return this.$key;
    }

    public getData(){
        return {
            filter:this.filter,
            parameter:this.parameter,
            href:this.href
        }
    }

}