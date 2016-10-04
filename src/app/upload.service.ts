import { Injectable, NgZone } from '@angular/core';

const uploadHtmlUrl = "upload.html"
const downloadHtmlUrl = "download.html";
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


  download(ref:string){
    window.open(downloadHtmlUrl + "?ref=" + ref )
  }

  /*upload(url, callback){

  /*upload(url, callback){
>>>>>>> 9e02dfb7711773ae4682e2ca566b2546b89df3f8
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
  }*/



  upload(url):Promise<any>{
    return new Promise( (resolve, reject) => {
      localStorage['_image_upload_status'] = "waiting";


       this._ngZone.runOutsideAngular(() => {
       this._listenEvent((data)=>{
          resolve(data)
       })

       //open popup
        if(typeof(url) == "string")
          window.open(uploadHtmlUrl + "?url=" +  url + "/", "Upload Stuff",'height=200,width=250');
        else if(typeof(url) == "object")
        {
          console.log(url)
          console.log('gonna upload with obj stuff')
          window.open(uploadHtmlUrl + "?url=" +  url.url + "/" + "&file_name=" + url.file_name , "Upload Stuff",'height=200,width=250');
        }
    });

    })


  }

}
