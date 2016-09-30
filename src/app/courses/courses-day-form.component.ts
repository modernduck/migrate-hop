import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CourseService } from "../course.service"


@Component({
  
  selector: 'courses-day-form',
  template: `
  <div  class="courses-day-form">
        <div *ngIf="isEdit">
                <input type="checkbox"  [(ngModel)]="daysObject.mon"> MON
                <input type="checkbox" [(ngModel)]="daysObject.tue"> TUE
                <input type="checkbox"  [(ngModel)]="daysObject.wed"> WED
                <input type="checkbox" [(ngModel)]="daysObject.thu"> THU
                <input type="checkbox"  [(ngModel)]="daysObject.fri"> FRI
                <input type="checkbox" [(ngModel)]="daysObject.sat"> SAT
                <input type="checkbox"  [(ngModel)]="daysObject.sun"> SUN
                <button (click)="update()" class="btn btn-primary">Update Day(s)</button>
                <span class="warning">!need to update first to make it save</span>
        </div>
        <div *ngIf="!isEdit">
            <ul>
                <li *ngIf="daysObject.mon">MON</li>
                <li *ngIf="daysObject.tue">TUE</li>
                <li *ngIf="daysObject.wed">WED</li>
                <li *ngIf="daysObject.thu">THU</li>
                <li *ngIf="daysObject.fri">FRI</li>
                <li *ngIf="daysObject.sat">SAT</li>
                <li *ngIf="daysObject.sun">SUN</li>
                </ul>
                <button (click)="isEdit=true" class="btn btn-primary">Edit</button>
        </div>
    </div>
  `,
  styleUrls: ['courses.component.css']
})
export class CoursesDayFormComponent implements OnInit {
  private _daysNumber;
  private isEdit = true;
  @Input()
  set daysNumber(num)
  {
       var obj = CourseService.daysToObject(num)
       if(obj)
        this.daysObject = obj;
      this._daysNumber = num;
      if(num > 1)
        this.isEdit = false;
  }

 get daysNumber(){
      return this._daysNumber;
  }
  
  @Output()
  onUpdate

 

  daysObject;

  constructor(private courseService:CourseService) { 
      this.onUpdate = new EventEmitter<Number>();
  }

  //ngOnChanges(changes: SimpleChanges) {
  ngOnInit(){
    
   
  }

  update()
  {
      
      this.onUpdate.emit(CourseService.daysToNumber(this.daysObject))
      this.isEdit = false;
  }

}
