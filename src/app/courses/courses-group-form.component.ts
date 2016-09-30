import { Component, Input, OnInit, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { CourseService } from "../course.service"

const DEFAULT_LIMIT = 10, DEFAULT_NAME = "", DEFAULT_PRICE = 2400
@Component({
  
  selector: 'courses-group-form',
  template: `
    <table class='courses-group' *ngIf="groups.length > 0">
        <thead>
            <th>Name</th>
            <th>Limit</th>
            <th>Price</th>
            <th>Public</th>
            <th></th>
        </thead>
        <tbody>
            <tr *ngFor="let g of groups" class="group-item">
                <td><input type="text" (change)="updateKey(g)" [(ngModel)]="g.name" class="form-control" /></td>
                <td><input type="number" (change)="updateAny(g)" [(ngModel)]="g.limit"  class="form-control"/></td>
                <td><input type="number" (change)="updateAny(g)" [(ngModel)]="g.price"  class="form-control"/></td>
                <td><input type="checkbox" (change)="updateAny(g)" [(ngModel)]="g.public"></td>
                <td>
                    <button *ngIf="g.isUpToDate && isNew" (click)="remove(g)" class="btn btn-danger">X</button>
                    <button *ngIf="!g.isUpToDate" (click)="save(g)" class="btn btn-inverse">+</button>
                </td>
            </tr>
        </tbody>
    </table>
    
    <button (click)="addGroup()" class="btn btn-primary">ADD GROUP</button>
  `,
  styleUrls: ['courses.component.css']
})
export class CoursesGroupFormComponent implements OnInit {
  
  private groups:Array<any>;
  private _group;
     
  @Input()
  isNew

  @Input()
  set group(g) {
    this._group = g;
    this.groups=[];
    for(var key in g )
    {
        var item = g[key]
        this.groups.push({
            name:item.name,
            price:item.price,
            limit:item.limit,
            public:item.public,
            key:key,
            isUpToDate:true
        })
    }
  }
  get group() { return this._group; }

  @Output()
  onUpdateGroup


  daysObject; 
  constructor(private courseService:CourseService) { 
      this.onUpdateGroup = new EventEmitter()
      
  }

  private getUIgroup() {
      return {
          "name":DEFAULT_NAME,
          "limit":DEFAULT_LIMIT,
          "price":DEFAULT_PRICE,
          "public":true,
          "key":"yo"
          
      }
  }

  ngOnInit(){
  
      if(typeof this.isNew == "undefined")
        this.isNew = true;
    

  }

  addGroup(){
      this.groups.push(this.getUIgroup())
  }

  updateAny(group)
  {
      group.isUpToDate = false;
  }

  updateKey(group) {
      if(group.name)
        group.key = CourseService.slugify(group.name)
     group.isUpToDate = false;
  }
  

  remove(group) {
      
    this.groups = this.groups.filter((item, index, arr)=>{
        return item.key != group.key
    })
  }
  
  save(group) {
      group.isUpToDate = true;
      var _groups = this.groups.filter((item, index, arr)=>{
          return item.isUpToDate == true
      })
      var response_group = {}
      _groups.forEach( item =>{
          
          response_group[item.key]= {};
          for(var key in item)
            if(key!="key" && key != "isUpToDate"  ) 
                response_group[item.key][key] = item[key]
      })
      this.onUpdateGroup.emit(response_group)

  }
    

}
