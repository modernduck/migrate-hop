import { Component, Input,  OnChanges, SimpleChanges } from '@angular/core';
import { UserService } from "../user.service"


@Component({
  
  selector: 'courses-teacher',
  template: `
    <span class="teacher-name"><span *ngFor="let t of teachers">{{t.$value }} </span></span>
  `,
  styleUrls: ['courses.component.css']
})
export class CoursesTeacherDisplayComponent implements OnChanges {
  private teachers = [];
  @Input()
  teacher

    
  constructor(private userService:UserService) { }

  ngOnChanges(changes: SimpleChanges) {

    this.teachers = [];      
        for(var k in this.teacher)
          if(this.teacher[k])
              this.userService.getUserNickname(k).subscribe(data=>{
                  this.teachers.push(data)
            })
          
      

  }

}
