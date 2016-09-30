export class NotificationMessages{
    public static MESSAGES = {
        "approved_course":{
            "message":`Your Request to join %c have been approved`,
            "parameter":{
                "course_name":"%c"
            }
        },
        "denied_course":{
            "message":`Your Request to join Course have been denied`,
            "parameter":{
                "course_name":"%c"
            }
        },
        "request_course":{
            "message":`%s have request to join %c`,
            "parameter":{
                "student_name":"%s",
                "course_name":"%c"
            }
        },
        "course_approved":{
            "message":`Student have joined to %c`,
            "parameter":{
                "course_name":"%c"
            }
        }


    }
    public static get(filter:string, parameter:any) {
        if(NotificationMessages.MESSAGES[filter])
        {
            var msg:string = NotificationMessages.MESSAGES[filter].message;
            for(var para_key in NotificationMessages.MESSAGES[filter].parameter )
                msg = msg.replace(NotificationMessages.MESSAGES[filter].parameter[para_key], parameter[para_key]);
            return msg;
        }else
            return "Something wrong so weird"
    }
    constructor(){}
}
