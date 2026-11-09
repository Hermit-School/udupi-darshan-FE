import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-event-badge', standalone: true, imports: [DatePipe],
  template: `<span class="event-date-badge d-inline-flex align-items-stretch rounded-pill" role="group" [attr.aria-label]="status + ' event'">
    <span class="badge rounded-end-0" [class.text-bg-primary]="status==='Upcoming'" [class.text-bg-warning]="status==='Ongoing'" [class.text-bg-secondary]="status==='Past'" [class.text-bg-light]="status==='Undated'">Event</span>
    <span class="badge text-bg-light border border-start-0 rounded-start-0">@if(date){<time [attr.datetime]="date">{{date | date:'d MMM':'UTC'}}</time>}@else{Date TBA}</span>
  </span>`,
  styles: [`:host{display:inline-block;max-width:100%;margin-bottom:.6rem}.event-date-badge{font-size:.85rem;line-height:1;vertical-align:middle}.badge{display:inline-flex;align-items:center;padding:.5em .7em;line-height:1.2}`]
})
export class EventBadgeComponent {
  @Input() date: string | null | undefined;
  @Input() endDate: string | null | undefined;
  get status(): 'Upcoming'|'Ongoing'|'Past'|'Undated' {
    if(!this.date) return 'Undated';
    const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    if((this.endDate || this.date)<today) return 'Past';
    return this.date<=today ? 'Ongoing' : 'Upcoming';
  }
}
