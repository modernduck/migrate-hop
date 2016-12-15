import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { FirebaseObjectObservable } from 'angularfire2';
import { UploadService } from "../upload.service"
import { UserService } from "../user.service"
import { Router } from "@angular/router"
import { MESSAGES } from "../config/messages"

@Component({
  
  selector: 'app-profile-edit',
  templateUrl: 'profile-edit.component.html',
  styleUrls: ['profile.component.css']
})
export class ProfileEditComponent implements OnInit {

  private uploadEvent
  private fullname;
  private firstname;
  private lastname;
  private nickname;
  private pictureUrl;
  private country;
  private phone;
  private _group
  private gender;
  private picture;                                                                                                                                              

  private isReady:boolean;

  constructor(private lg:LoginService, private uploadService:UploadService, private userService:UserService, private router:Router ) {
      
   }

  ngOnInit() {
    //this.fullname = this.lg.currentUser.fullname
    this.isReady = false;
    this.lg.refreshPromise().then( pu => {
      if(pu.isNew() && !pu.info.isRefresh)
        pu.user.update({"isRefresh":true}).then( () => {
            window.location.reload();
        })
        //cant find proper way yet
      let data = pu.info;
      this.firstname = data.firstname
      this.lastname = data.lastname;
      this.pictureUrl = data.picture
      this._group = data.group
      this.country = data.country;
      this.phone = data.phone;                                                                
      this.gender = data.gender;
      this.country = data.country;                                                                                                                                
      this.picture = data.picture;  
      this.isReady  = true;
    })
    
  }


  upload()
  {
    
    /*this.uploadService.upload('profile/' + this.lg.currentUserKey, data=>{
      console.log('gonna update')
      console.log(data)
        this.userService.updatePicture(this.lg.currentUserKey, data.downloadUrl[0])
        
        this.pictureUrl = data.downloadUrl[0]
    })*/
    this.uploadService.upload('profile/' + this.lg.currentUserKey).then(data => {

      this.userService.updatePicture(this.lg.currentUserKey, data.downloadUrl[0])
      this.pictureUrl = data.downloadUrl[0]
    })
  }
  

  validate() :boolean{
    let require_string = [ this.firstname, this.lastname, this.gender ];

    return require_string.filter( item => {
      //text length > 0  
        if(item)
          return item.length > 0;
        else
          return false;
    }).length == require_string.length

  }



  save()
  {
    
    if(this.validate()){
      console.log('data')

      this.userService.updateUser(this.lg.currentUserKey, {firstname:this.firstname, lastname:this.lastname, group:this._group, country:this.country, phone:this.phone, gender:this.gender}).then(() =>{
        this.lg.refreshPromise().then( ()=>{
          this.router.navigate(['courses'])
        })
        
      })
    }else
      alert(MESSAGES.PROFILE.REQUIRE_FIELDS)
    
    
    
  }


}
