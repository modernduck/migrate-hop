import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CourseService } from "../course.service"
import { CartService } from "../cart.service"
const NOTIFY_LIMIT = 5

@Component({
  
  selector: 'courses-signup',
  template: `

    <a  class="btn {{buttonClass}}" routerLink="{{course.$key}}">{{displayButton}}</a>
    
    <div>
        <span *ngFor="let item of full_group">({{item}} Full)</span>
    </div>
  `,
  styleUrls: ['courses.component.css']
})
export class CoursesSignupButtonComponent implements OnChanges {
  
  @Input()
  course

  @Input()
  enroll
   
  constructor(private courseService:CourseService, private cartService:CartService) { }

  private displayButton = "SIGN UP";
  private buttonClass = "btn-success"
  private seat_left=0;
  private full_group=[]
  private group
  private isAdded = false;
  private isPlus = false;
  
  ngOnChanges(changes:SimpleChanges){
  //ngOnChanges(changes:SimpleChanges){
    this.group = this.course.group
    for(var g in this.group){
        if(this.group[g].public) {
            if(!this.isPlus)
            {
                this.seat_left+= this.group[g].limit;
                this.isPlus = true;
            }
            
            if(this.group[g].limit == 0) {
                this.full_group.push(this.group[g].name)
            }
        }
        
    }
    this.isAdded = this.cartService.isAddCourse(this.course["$key"])
     
    //
    if(this.seat_left <= NOTIFY_LIMIT && this.seat_left > 0)
    {
        this.displayButton = this.seat_left + " Left. Signup!"
        this.buttonClass = "btn-danger"
    }else if(this.seat_left <= 0)
    {
        this.displayButton = "SOLD OUT"
        this.buttonClass = "btn-default"
    }

    if(this.isAdded) {
        this.displayButton = "ADDED"
        this.buttonClass = "btn-default"
    }

    //console.log(this.enroll)
    if(this.enroll && this.enroll[this.course["$key"]])
    {
        this.displayButton = "ENROLL"
        this.buttonClass = "disabled"
    }
  

  }

}
