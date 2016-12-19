import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { FirebaseObjectObservable } from 'angularfire2';
import 'rxjs/add/operator/map';
import { Http, RequestOptions, Headers, Response }    from '@angular/http';

@Component({
  
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css']
})
export class ProfileComponent implements OnInit {

  
  
  constructor(private lg:LoginService, private http:Http) {
      
      
    
    
   }

   mapData(res:Response)
   {
       let body = res.json();
       console.log(body)
      return body || { } 
   }

   testEmail(){
     let reqOptions = new RequestOptions({
       headers: new Headers({ 'Content-Type': 'application/json' })
     })
     this.http.post('http://localhost:7878', {

       data:{
         to:"sompop.kulapalanont@gmail.com",
         subject:"Test message",
         name:"Sompop",
         user:"admin@bangkokswing.com",
         password:"12345678"
       },
       template:"user-signup-complete.html"

       
       
     }, reqOptions ).map(this.mapData).subscribe(data => {
       console.log('then result')
       console.log(data)
     })
   }

  ngOnInit() {
    
    
  }

  
}
