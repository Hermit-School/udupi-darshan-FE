export interface AdBusiness {tagline?:string;category?:string;phone?:string;address?:string;openingHours?:string;mapsUrl?:string;backgroundColor?:string;offerings?:string[];}
export interface LocalAdvertisement {id:number;title:string;imageUrl:string;images?:string[];website?:string;externalLink?:string;link?:string;internalLink?:string;description?:string;width?:number;height?:number;business?:AdBusiness;layoutSize?:AdTier;layoutPosition?:number;}
export type AdTier='large'|'medium'|'small'|'xs';
export const AD_TIERS=[
 {id:'large' as AdTier,name:'Large',span:12,range:'Full width',description:'A full-width feature for your business.'},
 {id:'medium' as AdTier,name:'Medium',span:6,range:'Half width',description:'Two advertisements fit across the page.'},
 {id:'small' as AdTier,name:'Small',span:4,range:'One-third width',description:'Three advertisements fit across the page.'},
 {id:'xs' as AdTier,name:'Extra-small',span:3,range:'One-quarter width',description:'Four advertisements fit across the page.'}
] as const;
export function adTier(size?:string):AdTier{return AD_TIERS.some(t=>t.id===size)?size as AdTier:'small';}
export function adExternal(value?:string|null):string|null{try{const u=new URL(value?.trim()||'');return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}}
export function adWebsite(ad:LocalAdvertisement){return adExternal(ad.website??ad.externalLink??ad.link);}
export function adSlug(value?:string):string|null{
 const slug=(value||'').trim().toLowerCase().replace(/^\/?advertisements\//,'').replace(/^\/(?!\/)/,'').replace(/\s+/g,'-');
 return /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(slug)&&slug.length<=100?slug:null;
}
export function adPath(ad:LocalAdvertisement){return '/advertisements/'+(adSlug(ad.internalLink)||ad.id);}
