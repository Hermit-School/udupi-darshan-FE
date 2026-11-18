import { Story } from '../models/story';

type NamedRecord = { id: number; name: string };

export function nameSlug(name: string): string {
  const slug = name.normalize('NFC').toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '');
  return /^\d+$/.test(slug) ? 'place-' + slug : slug;
}

function recordSegment(item: NamedRecord, catalog: NamedRecord[]): string {
  const slug = nameSlug(item.name);
  if (!slug) return String(item.id);
  // Keep the existing URL when another record is added with the same name.
  return catalog.some(other => other.id < item.id && nameSlug(other.name) === slug)
    ? slug + '--' + item.id
    : slug;
}

export function namedRecord<T extends NamedRecord>(segment: string, catalog: T[]): T | undefined {
  const [slug, id] = segment.split('--', 2);
  const matches = catalog.filter(item => nameSlug(item.name) === slug &&
    (id === undefined || segment === slug + '--' + item.id));
  return matches.reduce<T | undefined>((first, item) => !first || item.id < first.id ? item : first, undefined);
}

export function destinationRoute(category: string, item: NamedRecord, catalog: NamedRecord[]): string[] {
  return ['/' + category.toLowerCase(), recordSegment(item, catalog)];
}

export function storyRoute(story: Story, catalog: Story[]): string[] {
  return ['/story', recordSegment({ id: story.id, name: story.title }, storyNames(catalog))];
}

export function storyNames(catalog: Story[]): NamedRecord[] {
  return catalog.map(({ id, title }) => ({ id, name: title }));
}
