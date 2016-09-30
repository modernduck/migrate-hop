import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GroupService } from "../group.service"

@Component({
  
  selector: 'group-finder',
  template: `
    <div class="group-finder">
        <div class="row">
            
            <div class="col-md-12">
                <input  placeholder="Type group names" (keypress)="check($event)" [(ngModel)]="q" type="text" class="form-control" style="width:100%" />
            </div>
        </div>
        <table class="table" *ngIf="show_groups.length >0">
            <thead>
                <th>Name</th>
                <th>Member</th>
            </thead>
            <tbody>
                <tr *ngFor="let item of show_groups; let i = index; trackBy: trackByFn" (click)="select(item)" class="item-{{i}}">
                    <td>{{item.name}}</td>
                    <td>{{item.members_count}}</td>
                </tr>
            </tbody>
        </table>
    </div>
  `,
  styleUrls: ['group.component.css']
})
export class GroupFinderComponent implements OnInit{

    @Input()
    display

    @Output()
    onSelected   

    private groups =[];
    private show_groups =[];
    private q:String;
    private selectedIndex = 0;
    constructor(private groupService:GroupService){
        this.onSelected = new EventEmitter<any>();
    }

    ngOnInit()
    {
        this.groupService.getAllGroup().subscribe(groups=>{
            this.groups = groups;
        })
    }

    check($event)
    {
        
        if(this.q) {
            this.show_groups = this.groups.filter((value, index, arr)=>{
                
                return value.name.toLowerCase().indexOf(this.q) >= 0
            })
            
        }
        if($event.key == "Enter" && this.show_groups.length > 0) {
            this.onSelected.emit(this.show_groups[0]);
            this.q ="";
            this.show_groups=[]
            //console.log(this.selectedIndex)
        }
        
    }

    select(group) {
        this.q = "";
        this.onSelected.emit(group);
    }
}