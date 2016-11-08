import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service'

import 'rxjs/add/operator/take'


@Component({
  
  selector: 'main-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.css']
})
export class MenuComponent implements OnInit {
  private isShowMenu=false;
  private user;
  constructor(private lg:LoginService) { }

  ngOnInit() {
    this.lg.promiseUser.then(user => {
      user.user.take(1).subscribe( real_user => {
        this.user = real_user
        console.log(this.user)
      })
    } )
  }

}
