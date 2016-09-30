import { Component, Input , OnChanges , SimpleChanges, EventEmitter, Output } from '@angular/core';
import { CourseService } from "../course.service"

@Component({
  
  selector: 'courses-type',
  template: `
    <select (ngModelChange)="update($event)"  [(ngModel)] = "selectedChoice" class="form-control">
        <option   *ngFor="let item of course_types" [value]="item.$key">{{item.name}}</option>
    </select>
  `,
  styleUrls: ['./courses.component.css']
})
export class CourseTypeComponent implements OnChanges {
    private course_types
    private selectedChoice={};

    @Input()
    type

    @Output()
    onSelected

    constructor(cs:CourseService){
        this.onSelected = new EventEmitter<string>();
        cs.getAllType().subscribe(types => {
            this.course_types = types;
            
        })
    }

    update(newValue){
        this.onSelected.emit(newValue)
    }

    ngOnChanges(changes:SimpleChanges){
        
        if(this.type)
            for(var key in this.type)
                if(this.type[key])  
                    this.selectedChoice = key  
    }

}
