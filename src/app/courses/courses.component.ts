import { Component, OnInit } from '@angular/core';
import { CourseService } from "../course.service"
import { LoginService } from "../login.service"
import 'rxjs/add/operator/take'

@Component({
  
  selector: 'app-courses',
  templateUrl: 'courses.component.html',
  styleUrls: ['courses.component.css']
})
export class CoursesComponent implements OnInit {
  private courses = [];
  private currentGroup;
  private user;
  private ckeditorContent;
  private enroll_course;
  private pending_course
  constructor(private courseService:CourseService, private lg:LoginService) { }

  ngOnInit() {
     this.courseService.getAllCourses().subscribe(data => {
       this.courses = data
     })
    this.lg.getCurrentUser(user=>{
      this.user = user;
      this.currentGroup = user.group
      this.courseService.getEnrollCourses(user.$key).subscribe(courses=>{
        console.log(courses)
        this.enroll_course = courses;
      })
      this.courseService.getPendingCourses(user.$key).subscribe(cc=>{
        //console.log('===pending')
        //console.log(cc)
        this.pending_course = cc
      });
      //console.log(user.$key)
    })
  }

}
