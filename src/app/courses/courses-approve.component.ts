import { Component, OnInit } from '@angular/core';
import { CourseService } from "../course.service"
import { NotificationsService } from "../notifications.service"
import { ActivatedRoute, Params } from "@angular/router"


@Component({
  
  selector: 'courses-approve',
  template: `
  <a routerLink="/courses/{{this.course_key}}" class='btn btn-primary'>View Course</a>
    <table class="table table-striped">
        <thead>
            <tr>    
                <th>Name</th>
                <th>Require</th>
                <th>Exclude</th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr *ngFor="let student of students">
                <td>{{student.name}}</td>
                <td>{{student.require | json}}</td>
                <td>{{student.exclude  | json}}</td>
                <td><button (click)="approve(student)" class="btn btn-success">Approve</button></td>
                <td><button (click)="denial(student)" class="btn btn-danger">Denial</button></td>
            </tr>
        </tbody>
    </table>
  `,
  styleUrls: ['courses.component.css']
})
export class CoursesApproveComponent implements OnInit {
  private course;
  private course_key
  private students;
  constructor(private courseService:CourseService, private nt:NotificationsService, private route:ActivatedRoute) { }

  ngOnInit() {
      //load course
      this.route.params.forEach((params:Params) => {
         this.course_key = params['key']
         this.courseService.getAllUnapproveStudent(this.course_key).subscribe(data => {
             this.students = data
         })
      })
  }

  approve(item) {
      this.courseService.approveStudent(this.course_key, item.$key, item.require, item.exclude)
  }

  denial(item) {
      this.courseService.denialStudent(this.course_key, item.$key, item.require, item.exclude)
  }

  
}
