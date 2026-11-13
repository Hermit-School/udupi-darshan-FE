import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { finalize, forkJoin, timeout } from 'rxjs';
import { API_BASE_URL } from 'src/constants/routes';
import { BACKGROUND_REQUEST } from './background-request';

/** Recommendation photos must never come from the site's advertisement catalog. */
@Injectable({providedIn: 'root'})
export class RelatedPhotosService {
  private readonly ready = signal(false);
  private blocked = new Set<string>();
  private readonly duplicates = signal(new Set<string>());
  private pending = false;
  private loadedAt = 0;

  constructor(private readonly http: HttpClient) {}

  prepare(items?: {imageUrl?: string}[]): void {
    const counts = new Map<string,number>();
    for (const item of items ?? []) {
      const key = this.key(item.imageUrl);
      if (key) counts.set(key,(counts.get(key) ?? 0)+1);
    }
    this.duplicates.set(new Set([...counts].filter(([,count]) => count > 1).map(([key]) => key)));
    if (!items?.some(item => !!item.imageUrl) || this.pending ||
        (this.loadedAt && Date.now() - this.loadedAt < 60000)) return;
    this.pending = true;
    this.ready.set(false);
    const context = new HttpContext().set(BACKGROUND_REQUEST, true);
    forkJoin({
      bundled: this.http.get<{src: string}[]>('assets/data/advertisements.json', {context}),
      managed: this.http.get<{imageUrl: string}[]>(API_BASE_URL + '/v1/ads', {context}),
    }).pipe(timeout(10000), finalize(() => this.pending = false)).subscribe({
      next: ({bundled, managed}) => {
        if (!Array.isArray(bundled) || !Array.isArray(managed) ||
            bundled.some(item => typeof item?.src !== 'string') ||
            managed.some(item => typeof item?.imageUrl !== 'string')) return;
        this.blocked = new Set([...bundled.map(item => this.key(item.src)),
          ...managed.map(item => this.key(item.imageUrl))].filter((key): key is string => !!key));
        this.loadedAt = Date.now();
        this.ready.set(true);
      },
      // Keep recommendation text/links visible when the catalog cannot be verified.
      error: () => this.ready.set(false),
    });
  }

  imageUrl(image?: string): string | null {
    if (!image || !this.ready()) return null;
    const key = this.key(image);
    if (!key || this.duplicates().has(key) || /(?:^|\/)(?:ads[0-9]*\.(?:png|jpe?g|webp|gif|svg)|h1\.jpe?g)$/i.test(key) || this.blocked.has(key)) return null;
    return image;
  }

  private key(image?: string): string | null {
    if (!image) return null;
    try {
      const url = new URL(image, 'https://udupi-darshan.web.app/');
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
      const path = decodeURIComponent(url.pathname);
      return ['https://udupi-darshan.web.app', 'https://udupi-darshan.firebaseapp.com'].includes(url.origin)
        ? path : url.origin + path;
    } catch { return null; }
  }
}
