import { Pipe, PipeTransform } from '@angular/core';


const groupFilter = (users, group) => {
  if(!users)
    return users;
  return users.filter((value, index, arr) =>{
            if(group && group!='')
              return  value.group[group]
            return true; 

          })
}
/*
 * Transform object to list of array
 * Usage:
 *   [{"nickname":"sompop"}, {"nickname":"sompap"}] | filterByNickname:"pop"
 * Example:
 *   [{"nickname":"sompop"}, {"nickname":"sompap"}] | filterByNickname:"pop"
 *   formats to: [{"nickname":"pop"}]
*/
@Pipe({name: 'filterByUserAttribute'})
export class FilterByUserAttributePipe implements PipeTransform {
  transform(users:Array<any> , query:string): any{
      //
      if(users)
      {
        var attribute_string_search = ['nickname', 'fullname', 'email']
        var result_search = [];
        attribute_string_search.forEach(attr=>{
          result_search.push(users.filter((value, index, arr) =>{
            
            if(query)
            {
              return  value[attr].toLowerCase().indexOf(query.toLowerCase()) >= 0
            }
            return true; 

          }));
        })
       //seach for group
        result_search.push(groupFilter(users, query))
        var keys={};
        var result=[];
        result_search.forEach(search_result=>{
          search_result.forEach(item=>{
            if(keys[item.$key])
            {

            }else
            {
              result.push(item);
              keys[item.$key] = true;
            }
          })
          
        })


        return result;
      }
      else
        return users
    
  }
}


@Pipe({name: 'filterByUserGroup'})
export class FilterByUserGroupPipe implements PipeTransform {
  transform(users:Array<any> , group:string): any{
    if(group!="") {
      return groupFilter(users, group)
    }else
      return users;
  }
}

@Pipe({name: 'filterByUserScope'})
export class FilterByUserScopePipe implements PipeTransform {
  transform(users:Array<any> , scope:any): any{
      if(typeof scope != "undefined" && users)
        return users.filter((value, index, arr)=>{
          
          if(!scope[value.$key] && typeof( scope[value.$key]) == "boolean")
          {
            value.scope = false;
            return true;
          }else{
            value.scope = true;
            return scope[value.$key]
          }
            
        })
      else
        return users;
    
  }
}
