import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Details } from '../models/card';

@Injectable({
    providedIn: 'root',
})
export class SharedService {
    private searchTextSource = new BehaviorSubject<string>('');
    searchText$ = this.searchTextSource.asObservable();
    private detailsData: Details[] = [];
    private updatedAt = 0;
    private searchResults = new BehaviorSubject<Details[]>([]);

    constructor() { }

    setSearchText(text: string): void {
        this.searchTextSource.next(text);
        this.search(text);
    }

    setDetailsData(data: Details[]): void {
        this.detailsData = [...data];
        this.updatedAt = Date.now();
        if (this.searchTextSource.value) this.search(this.searchTextSource.value);
    }

    private search(query: string): void {
        const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
        this.searchResults.next(words.length ? this.detailsData.filter(item => {
            const text = [item.name, item.descr, item.category, item.label, item.location].join(' ').toLowerCase();
            return words.every(word => text.includes(word));
        }) : []);
    }

    cachedDestination(section: string, id: number): Details | undefined {
        if (Date.now() - this.updatedAt > 60_000) return undefined;
        return this.detailsData.find(item => item.id === id && item.category?.toLowerCase() === section);
    }

    relatedRoute(slug: string): string[] | null {
        const matches = this.detailsData.filter(item => matchesDestinationSlug(item, slug));
        return matches.length === 1 ? ['/details', matches[0].category.toLowerCase(), String(matches[0].id)] : null;
    }

  relatedLink(link?: string): string | string[] | null {
    if (!link || link.startsWith('//') || link.includes('\\')) return null;
    try {
      const site = 'https://udupi-darshan.web.app';
      const url = new URL(link, site);
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
      if (url.origin !== site && url.origin !== 'https://udupi-darshan.firebaseapp.com') return url.href;
      const segments = (url.hash.startsWith('#/') ? url.hash.slice(2) : url.pathname.slice(1))
        .split('?')[0].split('/').filter(Boolean).map(decodeURIComponent);
      if (segments.length === 3 && segments[0] === 'details' && /^(nature|culture|food)$/i.test(segments[1]) && /^[1-9]\d*$/.test(segments[2])) {
        return ['/details', segments[1].toLowerCase(), segments[2]];
      }
      if (segments.length === 2 && /^(nature|culture|food)$/i.test(segments[0])) return ['/' + segments[0].toLowerCase(), segments[1]];
      if (segments.length === 1 && /^(home|nature|culture|food|story|advertisements)$/.test(segments[0])) return ['/' + segments[0]];
      return segments.length === 1 ? this.relatedRoute(segments[0]) : null;
    } catch { return null; }
  }

    getSearchResults(): Observable<Details[]> {
        return this.searchResults.asObservable();
    }

    searchNature(query: string): void {
        const lowerQuery = query.toLowerCase();
        const filtered = this.detailsData.filter((item) =>
            item.name.toLowerCase().includes(lowerQuery) &&
            item.category?.toLowerCase() === 'nature'
        );
        this.searchResults.next(filtered);
    }
}

export function matchesDestinationSlug(item: Details, slug: string): boolean {
    const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!normalize(slug)) return false;
    const tail = item.link?.split(/[/?#]/).filter(Boolean).at(-1);
    return normalize(item.name) === normalize(slug) || (!!tail && normalize(tail) === normalize(slug));
}
