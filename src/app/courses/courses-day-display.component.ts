import { Component, Input, OnInit } from '@angular/core';
import { CourseService } from "../course.service"


@Component({
  
  selector: 'courses-day',
  template: `
    <ul class="courses-day">
      <li *ngIf="daysObject.mon">MON</li>
      <li *ngIf="daysObject.tue">TUE</li>
      <li *ngIf="daysObject.wed">WED</li>
      <li *ngIf="daysObject.thu">THU</li>
      <li *ngIf="daysObject.fri">FRI</li>
      <li *ngIf="daysObject.sat">SAT</li>
      <li *ngIf="daysObject.sun">SUN</li>
    </ul>
  `,
  styleUrls: ['courses.component.css']
})
export class CoursesDayDisplayComponent implements OnInit {
  
  @Input()
  daysNumber

  daysObject; 
  constructor(private courseService:CourseService) { }

  //ngOnChanges(changes: SimpleChanges) {
  ngOnInit(){
      this.daysObject = CourseService.daysToObject(this.daysNumber)
  }

}
