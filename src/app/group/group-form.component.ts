import { Component, OnInit } from '@angular/core';
import { GroupService } from "../group.service"
import { UserService } from "../user.service"
import { ActivatedRoute, Params, Router  } from "@angular/router"

@Component({
  
  selector: 'app-group-form',
  templateUrl: 'group-form.component.html',
  styleUrls: ['group.component.css']
})
export class GroupFormComponent implements OnInit {
  private members =[]
  private slug
  private group
  private isNew 
  private isAddUser = false;
  private selectedUser = null;
  constructor(private groupService:GroupService, private userService:UserService, private route:ActivatedRoute, private router:Router) {
     
   }

  ngOnInit() {
    
       this.route.params.forEach((params: Params) => {
          this.slug = params['slug']
          this.isNew = this.slug == "new"
          if(!this.isNew) {
            this.groupService.getGroup(this.slug).subscribe(group=>{
              this.group = group;
            })
            this.groupService.getAllMember(this.slug).subscribe(members => {
              this.members = members
            })
          }else
            this.group = this.groupService.getBlankGroup()

        });
       
  }

  onSelectedUser(user)
  {
    this.selectedUser = user;
    this.isAddUser = false;
    this.groupService.addMember(this.slug ,user);
    this.groupService.updateMemberCount(this.slug, this.members.length)
  }

  removeUser(user_key)
  {
    this.groupService.removeMember(this.slug, user_key)
  }

  save()
  {
    if(!this.isNew)
    {
      //just rename
      //and deal with member i guess?
      this.router.navigate(['group'])
    }else
    {
      this.groupService.createGroup(this.group.name)
      
      this.router.navigate(['group/', this.groupService.slugify(this.group.name) ])
    }
    
  }

  delete()
  {
    if(!this.isNew)
      if(confirm("Are you sure to delete this group? this cannot be revert"))
      {
        this.groupService.deleteGroup(this.group.$key)
        this.router.navigate(['group'])
      }
  }

}
