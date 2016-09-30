import { Component, OnInit, Input} from '@angular/core';
import { UserService } from "../user.service"


@Component({
  
  selector: 'users-display',
  template: `

<div class="users-display" *ngIf="user">
    <div class="row">
        <div class="col-md-3">
                <img src="{{user.picture}}"/>
        </div>
        <div class="col-md-9">
            <h5>{{user.fullname}} ({{user.nickname}})</h5>
            <b>{{user.email}}</b>
        </div>

    </div>

</div>
  `,
  styleUrls: ['users.component.css']
})
export class UsersDisplayComponent implements OnInit{
    @Input('userKey')
    user_key

    private user;
    constructor(private userService:UserService){
        
    }

    ngOnInit(){
        this.userService.getUser(this.user_key).subscribe(data=>{
            this.user = data;
        })
    }
}
