export interface AdBusiness {tagline?:string;category?:string;phone?:string;address?:string;openingHours?:string;mapsUrl?:string;backgroundColor?:string;offerings?:string[];}
export interface LocalAdvertisement {id:number;title:string;imageUrl:string;images?:string[];website?:string;externalLink?:string;link?:string;internalLink?:string;description?:string;width?:number;height?:number;business?:AdBusiness;}
export type AdTier='small'|'medium'|'large'|'showcase';
export const AD_TIERS=[
 {id:'small' as AdTier,name:'Small',span:2,range:'Below 800 px wide',ideal:'800 × 600',description:'Your image, business name, tagline and a clear way to get in touch.'},
 {id:'medium' as AdTier,name:'Medium',span:3,range:'800–1199 px wide',ideal:'1000 × 800',description:'A photo, a short description, and Call or Website buttons.'},
 {id:'large' as AdTier,name:'Large',span:4,range:'1200–1600 px wide',ideal:'1600 × 1200',description:'A larger image, business details, and space for directions and contact buttons.'},
 {id:'showcase' as AdTier,name:'Showcase',span:6,range:'More than 1600 px wide',ideal:'1920 × 1080',description:'Half the desktop page width and half the screen height. Link to your website or your own page here.'}
] as const;
export function adTier(width:number):AdTier{return width>1600?'showcase':width>=1200?'large':width>=800?'medium':'small';}
export function adExternal(value?:string|null):string|null{try{const u=new URL(value?.trim()||'');return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}}
export function adWebsite(ad:LocalAdvertisement){return adExternal(ad.website??ad.externalLink??ad.link);}
export function adSlug(value?:string):string|null{
 const slug=(value||'').trim().toLowerCase().replace(/^\/?advertisements\//,'').replace(/^\/(?!\/)/,'').replace(/\s+/g,'-');
 return /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(slug)&&slug.length<=100?slug:null;
}
export function adPath(ad:LocalAdvertisement){return '/advertisements/'+(adSlug(ad.internalLink)||ad.id);}
