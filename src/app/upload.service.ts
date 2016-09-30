import { Injectable, NgZone } from '@angular/core';

const uploadHtmlUrl = "upload.html"
const ON_START_UPLOAD =1, UPLOAD_DONE=2 
@Injectable()
export class UploadService {
  private uploadEvent;
  private name;

  constructor(private _ngZone: NgZone) {
    
    

   }



  _listenEvent(doneCallback:(data) => void){
    var uploadEvent = window.addEventListener('storage', function(e) {
       
          if(localStorage['_image_upload_status'] == "complete")
          {
             var data = JSON.parse(localStorage['_image_upload_data'])
              doneCallback(data);
              
              //window.removeEventListener('storage', uploadEvent)
          }
      });
  }

  setName(name) {
    this.name = name;
  }

  upload(url, callback){
    localStorage['_image_upload_status'] = "waiting"
    
     this._ngZone.runOutsideAngular(() => {
       this._listenEvent((data)=>{
          callback(data)
       })
    });
    
    if(typeof(url) == "string")
      window.open(uploadHtmlUrl + "?url=" +  url + "/", "Upload Stuff",'height=200,width=250');
    else if(typeof(url) == "object")
    {
      console.log(url)
      console.log('gonna upload with obj stuff')
      window.open(uploadHtmlUrl + "?url=" +  url.url + "/" + "&file_name=" + url.file_name , "Upload Stuff",'height=200,width=250');
    }
  }

}
