import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from "../user.service"


@Component({
  
  selector: 'users-finder',
  templateUrl: 'users-finder.component.html',
  styleUrls: ['users.component.css']
})
export class UsersFinderComponent implements OnInit {
  private users;
  private q;
  private last_filter;
  public selectedUser;

  @Input()
  display

  @Input()
  group

  @Input()
  scope

  @Output()
  onSelected = new EventEmitter<any>();

  constructor(private userService:UserService) { 
      
  }

  ngOnInit() {
     this.users = this.userService.getAllUser()
     if(typeof this.display == "undefined")
        this.display = true;

     if(typeof this.group == "undefined")
        this.group = "";
      
      
  }

  select(user)
  {
    
    this.selectedUser = user;
    this.onSelected.emit(user)
  }

  onKeyPress(e)
  {
    

  }

  
}
