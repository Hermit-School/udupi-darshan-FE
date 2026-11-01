import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ standalone: false,
  name: 'listFilter',
})
export class ListFilterPipe implements PipeTransform {
  transform(list: any[], filterText: string): any {
    return list
      ? list.filter(
          (item) => String(item.name || '').toLowerCase().includes((filterText || '').toLowerCase())
        )
      : [];
  }
}
