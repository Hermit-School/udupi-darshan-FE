import { Details } from '../models/card';

export function natureSlug(name: string): string {
  const slug = name.normalize('NFC').toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '');
  return /^\d+$/.test(slug) ? 'place-' + slug : slug;
}

export function destinationRoute(category: string, item: Pick<Details, 'id' | 'name'>): string[] {
  const section = category.toLowerCase();
  const slug = section === 'nature' ? natureSlug(item.name) : '';
  return slug ? ['/nature', slug] : ['/details', section, String(item.id)];
}
