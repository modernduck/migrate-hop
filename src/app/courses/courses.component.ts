import { Component, OnInit } from '@angular/core';
import { CourseService } from "../course.service"
import { LoginService } from "../login.service"
import { Router } from '@angular/router'
import {  MESSAGES } from "../config/messages"
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
  constructor(private courseService:CourseService, private lg:LoginService,  private router: Router) { }

  ngOnInit() {
     this.courseService.getAllCourses().subscribe(data => {
       this.courses = data
     })


     this.lg.promiseUser.then(pu => {
       this.user = pu.info 
       if(pu.isNew()){
         alert(MESSAGES.PROFILE.PLEASE_FILL_INFO)
         this.router.navigate(['profile/update'])
       }
        


       this.currentGroup = this.user.group
        this.courseService.getEnrollCourses(this.user.$key).subscribe(courses=>{
          console.log(courses)
          this.enroll_course = courses;
        })
        this.courseService.getPendingCourses(this.user.$key).subscribe(cc=>{
          
          this.pending_course = cc
        });
     })

   
  }

}
