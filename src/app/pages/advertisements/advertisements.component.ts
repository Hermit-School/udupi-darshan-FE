import { VisitorMotionDirective } from 'src/app/directives/visitor-motion.directive';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { API_BASE_URL } from 'src/constants/routes';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({ standalone: true, imports: [CommonModule, RouterLink, VisitorMotionDirective],
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.scss']
})
export class AdvertisementsComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  publishedAds: { id: number; title: string; imageUrl: string; link?: string; externalLink?: string; internalLink?: string; description?: string }[] = [];
  private readonly route = inject(ActivatedRoute);
  readonly detailId = this.route.snapshot.paramMap.get('id');
  loading = true;
  error = '';
  email = 'Udupidarshan@gmail.com';

  external(ad: {externalLink?: string; link?: string}): string | null {
    const value = ad.externalLink ?? ad.link;
    try { return value && new URL(value).protocol === 'https:' ? value : null; } catch { return null; }
  }
  internal(ad: {id: number; internalLink?: string}): string { return '/advertisements/' + (ad.internalLink || ad.id); }

  ngOnInit(): void {
    this.http.get<any>(API_BASE_URL + '/v1/ads' + (this.detailId ? (/^\d+$/.test(this.detailId) ? '/' : '/page/') + encodeURIComponent(this.detailId) : ''))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: result => { this.publishedAds = this.detailId ? [result] : result; this.loading = false; },
        error: () => { this.error = this.detailId ? 'This advertisement is unavailable.' : 'Advertisements could not be loaded. Please try again later.'; this.loading = false; }
      });
  }
}
