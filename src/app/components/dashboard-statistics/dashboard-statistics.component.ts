import { Component, DestroyRef, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HttpClient, HttpContext } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, map, timeout } from 'rxjs';
import { API_BASE_URL } from 'src/constants/routes';
import { BACKGROUND_REQUEST } from '../../services/background-request';

const CARDS = [
  { key: 'nature', title: 'Nature', detail: 'Articles', icon: 'tree' },
  { key: 'culture', title: 'Culture', detail: 'Articles', icon: 'bank' },
  { key: 'food', title: 'Food', detail: 'Articles', icon: 'cup-hot' },
  { key: 'stories', title: 'Stories', detail: 'Published stories', icon: 'journal-text' },
  { key: 'events', title: 'Events', detail: 'Event records', icon: 'calendar-event' },
  { key: 'ads', title: 'Advertisements', detail: 'Ad records', icon: 'megaphone' },
] as const;
type Counts = Record<typeof CARDS[number]['key'], number>;

@Component({
  selector: 'app-dashboard-statistics', standalone: true, imports: [DecimalPipe],
  templateUrl: './dashboard-statistics.component.html',
  styleUrls: ['./dashboard-statistics.component.scss'],
})
export class DashboardStatisticsComponent {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  readonly cards = CARDS;
  counts: Counts | null = null;
  loading = false;
  failed = false;

  constructor() { this.refresh(); }

  refresh(): void {
    if (this.loading) return;
    this.loading = true;
    this.failed = false;
    this.counts = null;
    this.http.get<Counts>(API_BASE_URL + '/v1/admin/statistics', {
      context: new HttpContext().set(BACKGROUND_REQUEST, true),
    }).pipe(
      timeout(15000),
      map(counts => {
        if (!counts || CARDS.some(card => !Number.isSafeInteger(counts[card.key]) || counts[card.key] < 0)) {
          throw new Error('Invalid statistics');
        }
        return counts;
      }),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading = false),
    ).subscribe({ next: counts => this.counts = counts, error: () => this.failed = true });
  }
}
