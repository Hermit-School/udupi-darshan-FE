import {describe,it,expect} from 'vitest';
import {adTier,adSlug,adWebsite,adPath} from './ad-tiers';
describe('advertisement sizing and destinations',()=>{
 it('assigns exact image-width boundaries to the four requested tiers',()=>{expect([799,800,1199,1200,1600,1601].map(adTier)).toEqual(['small','medium','medium','large','large','showcase']);});
 it('uses an explicitly empty website to clear legacy links and rejects unsafe destinations',()=>{
  const ad={id:1,title:'Shop',imageUrl:'image.jpg',link:'https://example.org/old',externalLink:'https://example.org/shop'};
  expect(adWebsite(ad)).toBe('https://example.org/shop');expect(adWebsite({...ad,website:''})).toBeNull();
  for(const website of ['javascript:alert(1)','//evil.invalid','http://example.org','https://user:secret@example.org'])expect(adWebsite({...ad,website})).toBeNull();
 });
 it('normalizes relative paths within the advertisement namespace without allowing traversal',()=>{
  for(const p of ['Coastal Cafe','/coastal-cafe','/advertisements/coastal-cafe','advertisements/coastal-cafe'])expect(adSlug(p)).toBe('coastal-cafe');
  for(const p of ['../admin','//evil.invalid','https://evil.invalid','coastal-cafe?next=admin'])expect(adSlug(p)).toBeNull();
  expect(adPath({id:5,title:'Shop',imageUrl:'image.jpg',internalLink:'/advertisements/coastal-cafe'})).toBe('/advertisements/coastal-cafe');
 });
});
