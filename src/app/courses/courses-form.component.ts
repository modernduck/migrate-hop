import { Component, OnInit } from '@angular/core';
import { CourseService } from "../course.service"
import { LoginService } from "../login.service"
import { ActivatedRoute, Params } from '@angular/router'


const require_rules = {
  "string": ["name", "code" ], //check if not ''
  "date": ["start_date", "end_date"],//check if format yyyy-mm-dd => not empty
  "time": ["start_time", "end_time"],//chck if format hh:mm:ss => not empty
  "days": ["days"],
  "object" : ["group", "teacher", "type"] ,// at least have one key
  "boolean" : ["public"]
}
const cloneObject = (obj) =>{
  var _obj = {};
  for(var key in obj)
    _obj[key] = obj[key]
  return _obj;
}

@Component({
  
  selector: 'app-courses-form',
  templateUrl: 'courses-form.component.html',
  styleUrls: ['courses.component.css']
})
export class CoursesFormComponent implements OnInit {
  private course;
  private course_key;
  
  private isAddTeacher = false;
  private isNew = false;
  private require_fields = [];
  constructor(private courseService:CourseService, private lg:LoginService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.course = this.courseService.getBlankCourse();
    
    this.route.params.forEach((params:Params) => {
       if(params['key'] == 'new') {
         this.isNew = true;
         
       }else {
         
         this.courseService.getCourse(params['key']).subscribe(c =>{
           this.course_key = params['key']
           this.course = c;
         })
       }
        
    });
  }

  onSelectedType (type) {
      this.course.type ={}
      this.course.type[type] = true;
  }

  onUpdateGroup(group) {
    //update group?
    this.course.group = group
  }

  onUpdateDay(day_number){
    this.course.days = day_number
  }


  onAddTeacher(user) {
    console.log('gonna:' + user.$key)
    console.log(this.course)
    var tmp = cloneObject(this.course.teacher)
    tmp[user.$key] = true;
    //this.course.teacher[user.$key] = true
    this.course.teacher = tmp;
  }

  removeAllTeacher()
  {
    this.course.teacher = {}
    
  }

  validate() {
    this.require_fields = [];
    
    for(var rule_key in require_rules) {
      switch (rule_key) {
        case "string":
        case "date":
        case "time":
          require_rules[rule_key].forEach( field_name => {
            if(!( this.course[field_name] && this.course[field_name].length > 0 ))
              this.require_fields.push(field_name)
          })
          break;
        case "days":
           require_rules[rule_key].forEach( field_name => {
             //if one day at least 2
              if(!( this.course[field_name] && this.course[field_name] >= 2 ))
                this.require_fields.push(field_name)
            })
          break;
        case "object":
          require_rules[rule_key].forEach( field_name => {
              var key_count =0;
              if(this.course[field_name])
                for(var key in this.course[field_name])
                  key_count++;
              if( key_count <= 0)
                this.require_fields.push(field_name)
            })

          break;
        case "booelean":
           require_rules[rule_key].forEach( field_name => {
              if(!(this.course[field_name] && typeof(this.course[field_name]) == "boolean"))
                this.require_fields.push(field_name)
           });
          break;
        default:
          break;
      }
    }
    return this.require_fields.length == 0
  }



  save() {
    //!save without validate
    if(!this. validate()){
      alert("Can't save require: " + this.require_fields.join(','))
      return false;
    }
    if(!this.isNew)
      this.courseService.setCourse(this.course.$key ,this.course)
    else
      this.courseService.setCourse(this.course.code + (new Date().getTime()), this.course)
    return true; 
  }

  keyToArray(obj) {
    var arr =[]
    for(var key in obj)
      if(key != "$key")
        arr.push(key)
    return arr
  }

  removeExclude(group_name) {
    delete this.course.exclude[group_name]
  }

  removeRequire(group_name) {
    delete this.course.require[group_name]
  }

  onSelectedExclude(group) {
    if(!this.course.exclude)
      this.course.exclude = {}
    this.course.exclude[group.$key] = true
      
  }

  onSelectedRequire(group) {
    if(!this.course.require)
      this.course.require = {}
    this.course.require[group.$key] = true
  }

}
