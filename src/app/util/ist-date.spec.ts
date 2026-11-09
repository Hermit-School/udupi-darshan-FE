import { describe, expect, it } from 'vitest';
import { IstDatePipe } from './ist-date.pipe';
import { istDay } from './ist-date';
describe('IST dates',()=>{
 const pipe=new IstDatePipe();
 it('preserves calendar-only event dates',()=>{expect(istDay('2026-11-09')).toBe('2026-11-09');expect(pipe.transform('2026-11-09')).toBe('9 Nov 2026');});
 it('converts UTC instants into the following day in India',()=>{expect(istDay('2026-11-08T20:00:00Z')).toBe('2026-11-09');expect(pipe.transform('2026-11-08T20:00:00Z')).toBe('9 Nov 2026');});
 it('keeps instants before India midnight on the same day',()=>expect(pipe.transform('2026-11-08T18:00:00Z')).toBe('8 Nov 2026'));
 it('handles absent or invalid dates without crashing',()=>{expect(pipe.transform(null)).toBe('');expect(pipe.transform('invalid')).toBe('');});
});
