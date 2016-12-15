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
  private isShow =false;
  private user;
  constructor(private lg:LoginService) { }

  ngOnInit() {
    this.lg.auth.subscribe( state => {
      console.log('state change : menu')
      console.log(state)
      if(state && state.uid)
       this.lg.refreshPromise().then( pu => {
        this.isShow = true;
        this.user = pu.info
      })
    else
      this.isShow = false;
    }, err => {}, () =>{
      console.log('login complete')
     
    })
    
  }

}
