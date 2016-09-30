import { Pipe, PipeTransform } from '@angular/core';
/*
 * Transform object to list of array
 * Usage:
 *   obj | object2Array
 * Example:
 *   {{ { "A":{....}, "B":{....} }}
 *   formats to: [ {$key:"A", ....}, {$key:"B", .... } ]
*/
@Pipe({name: 'object2Array'})
export class Object2ArrayPipe implements PipeTransform {
  transform(obj ): any{
    //check if it's null value
    if(obj != null && typeof(obj.$value) != "undefined" && obj.$value == null)
     return [];
      var result = [];
      for(var key in obj)
      {
          var tmp={}
          tmp["$key"] = key;
          for(var k in obj[key])
            tmp[k] = obj[key][k]
          if(key != "$key")//dont include key
            result.push(tmp)
      }
      return result;
    
  }
}


@Pipe({name: 'objectTrue2Array'})
export class ObjectTrue2ArrayPipe implements PipeTransform {
  transform(obj): any{
      //
      var result = [];
      for(var key in obj)
      {
          if(obj[key])
         {
            var tmp={}
            tmp[key] = obj[key]
            tmp["$key"] = key
            result.push(tmp)
         }
      }
      return result;
    //return Math.pow(value, isNaN(exp) ? 1 : exp);
  }
}


/*
 * Transform object to list of array
 * Usage:
 *   [{"nickname":"sompop"}, {"nickname":"sompap"}] | filterByAttribute:"nickname":"pop"
 * Example:
 *   [{"nickname":"sompop"}, {"nickname":"sompap"}] | filterByAttribute:"nickname":"pop"
 *   formats to: [{"nickname":"pop"}]
*/
@Pipe({name: 'filterByAttribute'})
export class FilterByAttributePipe implements PipeTransform {
  transform(input_array:Array<any>, attribute_name:string , attribute_value:string): any{
      
      if(input_array)
        return input_array.filter((value, index, arr) =>{
          
            if( value != null && value[attribute_name] && attribute_value && typeof value[attribute_name] == "string")   
              return  value[attribute_name].toLowerCase().indexOf(attribute_value.toLowerCase()) >= 0
            else if((typeof value[attribute_name] == "boolean" || typeof value[attribute_name] == "number") )
              return value[attribute_name] == attribute_value

          return true; 

        })
      else
        return input_array
    
  }
}

