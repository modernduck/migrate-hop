import { Injectable } from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import { NotificationsService } from "./notifications.service"
import { Notification } from "./model/notification"

const DAY_OBJECT = {"mon":2, "tue":3, "wed":5, "thu":7, "fri":11, "sat":13, "sun":17}
const TYPE_PATH = "courses_type/"
const ROOT_PATH = "courses/"
const APPROVE_PATH = "users_waiting_approve_courses/"
const USER_PATH = "users/"
const USER_ENROLL_PATH = "users_enroll_courses/"
const USER_PENDING_PATH = "users_pending_courses/"
const COURSE_ENROLL_USERS = "course_enroll_users/"
@Injectable()
export class CourseService {

  public static slugify(text)
  {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

  constructor(private af:AngularFire, private ns:NotificationsService) {

   }

   public static canJoin(course, user) {
     //check exclude
    for(var key in course.exclude)
      if(user.group[key] === true)
        return false;
     var result = true;
     //check require
     for(var key in course.require)
      if(!user.group[key] || user.group[key] != true)
        return false;
      return true;
   }

  getAllCourses(){
    
    return this.af.database.list(ROOT_PATH)
  }

  getAllType()
  {
    return this.af.database.list(TYPE_PATH)
  }

  getAllUnapproveStudent(key)
  {
    return this.af.database.list(APPROVE_PATH + key)
  }

  requestToJoin(course, student){
    console.log(course)
    console.log(student)
    var require= {};
    for(var require_group in course.require)
      if(!student.group[require_group])
        require[require_group] = true;
    var exclude = {}
    for(var exclude_group in course.exclude)
      if(student.group[exclude_group])
        exclude[exclude_group] = true;
    console.log('watch require and exclude')
    console.log(require)
    console.log(exclude)
    //get require
    this.af.database.object(APPROVE_PATH + course.$key + "/" + student.$key).set({
            "require":require,
            "exclude":exclude,
            "name":student.nickname 
    })
    //notify all teacher in the course
    for(var teacher_key in course.teacher)
      this.ns.send(teacher_key, new Notification("request_course", {
          student_name:student.nickname,
          course_name:course.name
      },  "courses/approve/" + course.$key ))
  }

  approveStudent(course_key, student_key, require, exclude)
  {
    //remove student from group
    this.af.database.object(APPROVE_PATH + course_key + "/" + student_key).remove()
    //add student in require if got any
    var student_group = {}
    if(require){
      for(var group_name in require)
        student_group[group_name] = true;
    }
    if(exclude){
      for(var group_name in exclude)
        student_group[group_name] = false;
    }
    
    
    this.af.database.object(USER_PATH + student_key + "/group").update(student_group)
    //send notification
    this.ns.send(student_key, new Notification("approved_course", {
      course_name:course_key
    }, "/courses/" + course_key))
  }

  denialStudent(course_key, student_key, require, exclude)
  {
    this.af.database.object(APPROVE_PATH + course_key + "/" + student_key).remove()
    this.ns.send(student_key, new Notification("denied_course", {
      course_name:course_key
    }, "/courses/" + course_key))
    

  }

  

  getCourse(key)
  {
    
    return this.af.database.object(ROOT_PATH  + key)
  }

  setCourse(key, course) {
    console.log('path: ' +  (ROOT_PATH + key))
    console.log(course)

    if(course.$key)
      delete course.$key

    if(course.$exists)
      delete course.$exists
    var promise = this.af.database.object((ROOT_PATH + key)).set(course)
    promise.then(_ => console.log('success'))
  .catch(err => console.log(err, 'You dont have access!')); 
  }

  getBlankCourse()
  {
    return {
      name:"",
      code:"",
      description:"",
      start_date:"",
      end_date:"",
      days:1,
      teacher:{},
      public:true,

    }
  }

  private updateLimit(course_key:string, reference:string, operation:string, update_amount:number){
    var current_subcribe;
    var pm = new Promise<any>((resolve, reject)=>{
      console.log('updateing:' + ROOT_PATH + course_key + "/group/" + reference)
      current_subcribe = this.af.database.object(ROOT_PATH + course_key + "/group/" + reference).subscribe(data=>{
        resolve(data.limit)
      })
    })
    pm.then(limit =>{
      current_subcribe.unsubscribe();
      console.log('to ' + operation + update_amount);
      console.log('path ' + ROOT_PATH + course_key + "/group/" + reference)
      if(operation == "-" && limit - update_amount >= 0)
          this.af.database.object(ROOT_PATH + course_key + "/group/" + reference).update({limit:(limit - update_amount)})
      else if(operation == "+")
        this.af.database.object(ROOT_PATH + course_key + "/group/" + reference).update({limit:(limit + update_amount)})
        
    })
  }

  /*
  * use email to be key in course_enroll and 
  */
  enrollUser(course_key:string, user_key:string, reference:string){
    this.af.database.object(COURSE_ENROLL_USERS + course_key + "/" + user_key).set(reference)
    this.af.database.object(USER_ENROLL_PATH + user_key + "/" + course_key).set(reference)
    //decrese accept amount
    this.updateLimit(course_key, reference, "-", 1);
    
  }

  removeEnrollUser(course_key:string, user_key:string, reference:string){
    this.af.database.object(COURSE_ENROLL_USERS + course_key + "/" + user_key).remove()
    this.af.database.object(USER_ENROLL_PATH + user_key + "/" + course_key).remove()
    //increse limit amount
    this.updateLimit(course_key, reference, "+", 1);
  }

  getPendingCourses(user_key:string){
    console.log('-------------------------------------')
    console.log(USER_PENDING_PATH + user_key)
    return this.af.database.object(USER_PENDING_PATH + user_key)
  }

  getEnrollCourses(user_key:string){
    return this.af.database.object(USER_ENROLL_PATH + user_key)
  }

  getEnrollUsers(course_key:string):Promise<Array<any>>{
    //return this.af.database.object(COURSE_ENROLL_USERS + course_key);
    return new Promise<Array<any>>((resolve, reject) =>{
      
        this.af.database.object(COURSE_ENROLL_USERS + course_key).subscribe(data=>{
          //var users = [];
          var _users = {};
          var count = 0;
          var _do_count = 0;
          for(var user_key in data)
            if(user_key != "$key")
            {
              _users[user_key] = { reference:data[user_key] };
              this.af.database.object('users/' + user_key).subscribe(user=>{
                  _users[user.$key].user = user;
                  _do_count++;
                  if(_do_count == count){
                    var users =[];
                    for(var k in _users)
                      users.push(_users[k]);
                    resolve(users)
                  }

              })
              count++;
            }
              
          
          //resolve(users)
        })
    })
  }

  public static daysToObject(days_number) {
    var days = {
      mon:false, 
      tue:false,
      wed:false,
      thu:false,
      fri:false,
      sat:false,
      sun:false
  } 
    for(var key in DAY_OBJECT)
    {
      if(days_number % DAY_OBJECT[key] == 0)
        days[key] = true;
    }
    return days;
  }

  public static daysToNumber(days_object)
  {
    var start_number = 1;
    for(var key in days_object)
      if(days_object[key] === true)
        start_number *= DAY_OBJECT[key]

    return start_number
  }

  public static getCourseKey(code){
    return code + (new Date().getTime())
  }

  public  getInfoFromKey(course_key){
    var result ={code:'', create_time:''}
    //13 = get Time()
    result.code = course_key.slice(0, course_key.length - 13)
    result.create_time = course_key.slice( course_key.length - 13)
    return result; 
    
  }



}
