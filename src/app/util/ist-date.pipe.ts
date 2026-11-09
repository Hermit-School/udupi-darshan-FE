import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { istDay, istInstant, IST_OFFSET } from './ist-date';
@Pipe({name:'istDate',standalone:true})
export class IstDatePipe implements PipeTransform {
 transform(value:string|null|undefined,format='d MMM yyyy'):string {
  return value && istDay(value) ? formatDate(istInstant(value),format,'en-US',IST_OFFSET) : '';
 }
}
