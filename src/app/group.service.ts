import { Injectable } from '@angular/core';
import {AngularFire, FirebaseObjectObservable, FirebaseAuth, FirebaseAuthState} from 'angularfire2';

const FIX_GROUP_NAME =["admin", "banking", "teacher", "newbie","new" ]
const ROOT_PATH = "groups/"
const MEMBER_PATH = "group_members/"


@Injectable()
export class GroupService {

  

  constructor(private af:AngularFire) { }

  private canSetGroup(name)
  {
    var can_set = true
    //check from fix_group
    FIX_GROUP_NAME.forEach(item => {
      if(item==name)
        can_set = false
    })


    return can_set
  }

  

 public slugify(text)
  {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

  getGroupName(slug)
  {
    return this.af.database.object(ROOT_PATH  + slug + "/name")
  }

  getBlankGroup()
  {
    return {
      "member_count":0,
      "name":"New Group Name"
    }
  }

  getAllGroup()
  {
    return this.af.database.list(ROOT_PATH)
  }

  getGroup(slug)
  {
    return this.af.database.object(ROOT_PATH + slug)
  }

  renameGroup(slug, name)
  {
    this.af.database.object(ROOT_PATH + slug + "/name").set(name)
  }
  //[!stupid] this wont check if user craete the gorup alreay or not
  createGroup(name)
  {
    var key_name =  this.slugify(name);
    
    var saveObject = {
      'name':name,
      "member_count":0
    }
    this.af.database.object(ROOT_PATH + key_name).set(saveObject);
  }

  deleteGroup(slug)
  {
    this.af.database.object(ROOT_PATH + slug).remove();
    this.af.database.object(MEMBER_PATH + slug ).remove();
  }
  
  getAllMember(slug:string)
  {
    return this.af.database.list(MEMBER_PATH + slug)
  }

  addMember(slug:string, user)
  {
     this.af.database.object(MEMBER_PATH + slug + "/" + user.$key).set(user.nickname)
     this.af.database.object("users/" + user.$key + "/group/" + slug).set(true);
   
     
  }

  updateMemberCount(slug:string, count) {
    this.af.database.object(ROOT_PATH + slug).update({"members_count": count})
  }

  removeMember(slug:string, user_key:string)
  {
    this.af.database.object(MEMBER_PATH + slug + "/" + user_key).remove()
    this.af.database.object("users/" + user_key + "/group/" + slug).remove()
     
  }



}
