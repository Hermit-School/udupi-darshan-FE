import {AD_TIERS,AdTier} from './ad-tiers';
export interface AdPrice {price:string;note:string;}
export type AdPricing=Record<AdTier,AdPrice>;
export function normalizeAdPricing(value?:Partial<Record<AdTier,Partial<AdPrice>>>|null):AdPricing{
 return Object.fromEntries(AD_TIERS.map(({id})=>{const item=value?.[id];const price=typeof item?.price==='string'?item.price.trim():'';const note=typeof item?.note==='string'?item.note.trim():null;return [id,{price:price&&price.length<=40?price:'Ask us',note:note!==null&&note.length<=80?note:'for pricing'}];})) as AdPricing;
}
