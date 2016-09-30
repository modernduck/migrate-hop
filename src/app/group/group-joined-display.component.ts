import { Component, OnInit, Input } from '@angular/core';
import { GroupService } from "../group.service"

@Component({
  
  selector: 'group-joined-display',
  template: `
    <div class="group-joined-display">
      <ul>
        <li *ngFor="let group of groups | objectTrue2Array">{{group.$key }}</li>  
      </ul>
    </div>
  `,
  styleUrls: ['group.component.css']
})
export class GroupJoinedDisplayComponent implements OnInit {
  
  @Input()
  groups
  //test
  constructor() { }

  ngOnInit() {
    
  }

}
