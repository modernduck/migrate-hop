import { Pipe, PipeTransform } from '@angular/core';
import { CourseService } from "../course.service"
/*
 * Transform object to list of array
 * Usage:
 *   [{"nickname":"sompop"}, {"nickname":"sompap"}] | filterByNickname:"pop"
 * Example:
 *   [{"nickname":"sompop"}, {"nickname":"sompap"}] | filterByNickname:"pop"
 *   formats to: [{"nickname":"pop"}]
*/
@Pipe({name: 'daysNumber2Object'})
export class DaysNumber2ObjectPipe implements PipeTransform {
  transform(days:Number ): any{
    
        return CourseService.daysToObject(days)
    
  }
}

