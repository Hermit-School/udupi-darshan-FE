import { afterEach, describe, expect, it, vi } from 'vitest';
import { EventBadgeComponent } from './event-badge.component';
describe('Event badge dates',()=>{
 afterEach(()=>vi.useRealTimers());
 function badge(date?:string,endDate?:string){vi.useFakeTimers();vi.setSystemTime(new Date('2026-11-08T20:00:00Z'));const c=new EventBadgeComponent();c.date=date;c.endDate=endDate;return c;}
 it('uses the event location date in India across the UTC midnight boundary',()=>expect(badge('2026-11-09').status).toBe('Ongoing'));
 it('identifies future events',()=>expect(badge('2026-11-10').status).toBe('Upcoming'));
 it('identifies completed events',()=>expect(badge('2026-11-08').status).toBe('Past'));
 it('keeps a multi-day event ongoing until its last day',()=>expect(badge('2026-11-06','2026-11-09').status).toBe('Ongoing'));
 it('handles dates to be announced',()=>expect(badge().status).toBe('Undated'));
});
