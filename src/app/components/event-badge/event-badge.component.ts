import { Component, Input } from '@angular/core';
import { IstDatePipe } from '../../util/ist-date.pipe';
import { istDay, istToday } from '../../util/ist-date';
@Component({
  selector: 'app-event-badge', standalone: true, imports: [IstDatePipe],
  template: `<span class="event-date-badge d-inline-flex align-items-stretch rounded-pill" role="group" [attr.aria-label]="status + ' event'">
    <span class="badge rounded-end-0" [class.text-bg-primary]="status==='Upcoming'" [class.text-bg-warning]="status==='Ongoing'" [class.text-bg-secondary]="status==='Past'" [class.text-bg-light]="status==='Undated'">Event</span>
    <span class="badge text-bg-light border border-start-0 rounded-start-0">@if(day){<time [attr.datetime]="date">{{date | istDate:'d MMM'}}</time>}@else{Date TBA}</span>
  </span>`,
  styles: [`:host{display:inline-block;max-width:100%;margin-bottom:.6rem}.event-date-badge{font-size:.85rem;line-height:1;vertical-align:middle}.badge{display:inline-flex;align-items:center;padding:.5em .7em;line-height:1.2}`]
})
export class EventBadgeComponent {
  @Input() date: string | null | undefined;
  @Input() endDate: string | null | undefined;
  get day():string|null { return this.date ? istDay(this.date) : null; }
  get status(): 'Upcoming'|'Ongoing'|'Past'|'Undated' {
    const start=this.day;
    if(!start) return 'Undated';
    const today=istToday();
    if((this.endDate && istDay(this.endDate) || start)<today) return 'Past';
    return start<=today ? 'Ongoing' : 'Upcoming';
  }
}
