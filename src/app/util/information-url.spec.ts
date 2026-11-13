import { describe, expect, it } from 'vitest';
import { informationUrl } from './information-url';

describe('information links across public detail pages', () => {
  it.each([null,undefined,'','   ','#','/food/woodlands','https://udupi-darshan.web.app/#/food/woodlands',
    'https://udupi-darshan.firebaseapp.com/#/details/nature/2','http://localhost:4173/#/home',
    'javascript:alert(1)','data:text/html,hello','https://person:secret@example.com','not a URL'])
    ('hides missing, internal, or unsafe value %s', value => expect(informationUrl(value,'http://localhost:4173')).toBeNull());
  it('preserves a genuine external information URL', () => {
    expect(informationUrl(' https://example.com/visitor-info?q=udupi ','http://localhost:4173')).toBe('https://example.com/visitor-info?q=udupi');
  });
});
