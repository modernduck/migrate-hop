import { Component, OnInit } from '@angular/core';
import { CourseService } from "../course.service"
import { LoginService } from "../login.service"
import { ActivatedRoute, Params } from "@angular/router"
import { CartService } from '../cart.service'

@Component({
  
  selector: 'courses-detail',
  templateUrl: 'courses-detail.component.html',
  styleUrls: ['courses.component.css']
})
export class CoursesDetailComponent implements OnInit {
  private course;
  private course_key
  private currentGroup;
  private ckeditorContent;

  private cart;
  private canRegister = true;
  private isQualify = true;
  constructor(private courseService:CourseService, private lg:LoginService, private route:ActivatedRoute, private cartService:CartService) { }

  ngOnInit() {
      //load course
      
      this.route.params.forEach((params:Params) => {
          this.courseService.getCourse(params['key']).subscribe(c =>{
            this.course_key = params['key']
            this.course = c;
            this.canRegister = !this.cartService.isAddCourse(this.course_key)
             //load current group
             this.lg.currentUser.subscribe( user => {
                 this.isQualify = CourseService.canJoin(this.course, user)
             })
            /*this.lg.getCurrentUser(user=>{
              //this.currentGroup = user.group
            

            })*/
        })
      })
    this.cart = this.cartService.getCart();

   
  }

  signup(class_group){
    this.cartService.addCourseToCart(this.course, class_group)
    this.canRegister = !this.cartService.isAddCourse(this.course_key)
  }

  clear()
  {
    this.cartService.removeCourseFromCart(this.course_key)
    this.canRegister = !this.cartService.isAddCourse(this.course_key)
  }

  requestToJoin(){
//    this.courseService.requestToJoin(this.course_key, )
//console.log(this.lg.getCurrentUser)
    this.lg.currentUser.subscribe( user => {
    //this.lg.getCurrentUser(user=>{
      this.courseService.requestToJoin(this.course, user)
    })
  }
  

}
