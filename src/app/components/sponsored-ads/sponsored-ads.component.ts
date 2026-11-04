import { Component, DestroyRef, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpContext } from "@angular/common/http";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { API_BASE_URL } from "src/constants/routes";
import { BACKGROUND_REQUEST } from "../../services/background-request";
export interface PublishedAd {
  id: number;
  title: string;
  imageUrl: string;
  link?: string;
  width?: number;
  height?: number;
}
@Component({
  selector: "app-sponsored-ads",
  standalone: true,
  imports: [CommonModule],
  template: `@if (ads.length) {
    <aside class="sponsored" aria-label="Sponsored local businesses">
      <p class="ud-eyebrow">From our local businesses · Advertisement</p>
      <div class="ad-strip">
        @for (ad of ads; track ad.id) {
          <article [style.width.px]="ad.width || 300">
            <a
              [attr.href]="ad.link || null"
              target="_blank"
              rel="noopener noreferrer"
              ><img
                [src]="ad.imageUrl"
                [alt]="ad.title"
                [attr.width]="ad.width || 300"
                [attr.height]="ad.height || 250"
                loading="lazy"
                referrerpolicy="no-referrer"
                [style.aspect-ratio]="
                  (ad.width || 300) + ' / ' + (ad.height || 250)
                "
            /></a>
            <p>{{ ad.title }}</p>
          </article>
        }
      </div>
    </aside>
  }`,
})
export class SponsoredAdsComponent {
  ads: PublishedAd[] = [];
  constructor() {
    inject(HttpClient)
      .get<PublishedAd[]>(API_BASE_URL + "/v1/ads", {
        context: new HttpContext().set(BACKGROUND_REQUEST, true),
      })
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe({
        next: (ads) => {
          this.ads = ads
            .map((ad) => ({ ad, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .slice(0, 2)
            .map((x) => x.ad);
        },
        error: () => {},
      });
  }
}
