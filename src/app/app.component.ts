import { Injectable,Component, OnInit } from '@angular/core';

import {AngularFire } from "angularfire2"
import { LoginService } from './login.service'
import { LoginComponent } from "./login/login.component"


@Component({
  
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
  
  isWhiteBg = false;
  constructor(private af:AngularFire) {
  }

  ngOnInit(){

      this.af.auth.subscribe(user => {
          if(user)
          {
              this.isWhiteBg = true;
          }
        })
  }



}
