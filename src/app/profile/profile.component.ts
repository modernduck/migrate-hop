import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { FirebaseObjectObservable } from 'angularfire2';

@Component({
  
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css']
})
export class ProfileComponent implements OnInit {

  
  
  constructor(private lg:LoginService) {
      
      
    
    
   }

  ngOnInit() {
    
    
  }

  
}
