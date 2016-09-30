/*
* View all enroll user of the course
* have navigate button to checkin path
*/
import { Component, OnInit } from '@angular/core';
import { CourseService } from "../course.service"
import { ActivatedRoute, Params } from "@angular/router"

@Component({
  
  selector: 'courses-enroll',
  template: `
    <table class="table table-striped">
        <thead>
            <th>Nickname</th>
            <th>Reference</th>
        </thead>
        <tbody>
            <tr *ngFor="let item of users">
                <td>{{item.user.nickname}}</td>
                <td>{{item.reference}}</td>
            </tr>
        </tbody>

    </table>

  `,
  styleUrls: ['courses.component.css']
})
export class CoursesEnrollComponent implements OnInit {
    private users;
    constructor(private courseService:CourseService, private route:ActivatedRoute){

    }

    ngOnInit() {
        this.route.params.forEach((params:Params) =>{
            this.courseService.getEnrollUsers(params['key']).then(data=>{
                this.users = data;
            })
            
        })
        //this.courseService.getEnrollUsers()

    }
}