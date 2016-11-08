import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { FirebaseObjectObservable } from 'angularfire2';
import { UploadService } from "../upload.service"
import { UserService } from "../user.service"
import { Router } from "@angular/router"

@Component({
  
  selector: 'app-profile-edit',
  templateUrl: 'profile-edit.component.html',
  styleUrls: ['profile.component.css']
})
export class ProfileEditComponent implements OnInit {

  private uploadEvent
  private fullname;
  private nickname;
  private pictureUrl;
  private country;
  private phone;
  private _group

  constructor(private lg:LoginService, private uploadService:UploadService, private userService:UserService, private router:Router ) {
      
   }

  ngOnInit() {
    //this.fullname = this.lg.currentUser.fullname
    
    this.lg.getCurrentUser(data=>{
      this.fullname = data.fullname;
      this.nickname = data.nickname;
      this.pictureUrl = data.picture
      this._group = data.group
      this.country = data.country;
      this.phone = data.phone;
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
    

  save()
  {
    /*this.lg.currentUser.update({fullname:this.fullname, nickname:this.nickname}).then( ()=>{
         this.router.navigate(['profile'])
    } )*/
    this.userService.updateUser(this.lg.currentUserKey, {fullname:this.fullname, nickname:this.nickname, group:this._group, country:this.country, phone:this.phone}).then(() =>{
      this.router.navigate(['profile'])
    })
    
    
  }


}
