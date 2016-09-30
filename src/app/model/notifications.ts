import { Notification } from "./notification"
export class Notifications{

    private _data;
    constructor(notifications:any){
        this._data = notifications;
    }

    toArray():Array<any> {
        var arr = []
        if(typeof this._data['$value'] !='undefined' )
            return arr;
        for(var key in this._data) {
            if(key != "$key")
            {
                this._data[key].$key = key
                arr.push(Notification.load(this._data[key]))
            }
        }
        return arr;
    }

}