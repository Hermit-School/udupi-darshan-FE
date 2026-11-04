import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import {
  StoryQueue,
  StoryReview,
  ReviewStatus,
  StorySubmissionsService,
} from 'src/app/services/story-submissions.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  selector: 'app-story-review',
  templateUrl: './story-review.component.html',
  styleUrls: ['./story-review.component.scss'],
})
export class StoryReviewComponent implements OnDestroy {
  @ViewChild('reviewPanel') panel?: ElementRef<HTMLElement>;
  readonly statuses: ReviewStatus[] = ['Submitted', 'Published', 'Rejected'];
  status: ReviewStatus = 'Submitted';
  queue: StoryQueue = { items: [], total: 0, page: 0, totalPages: 0 };
  loading = true;
  error = '';
  query = '';
  selected: StoryReview | null = null;
  detailLoading = false;
  detailError = '';
  saving = false;
  notice = '';
  photos: { url: string; failed: boolean }[] = [];
  private listRequest?: Subscription;
  private detailRequest?: Subscription;
  private actionRequest?: Subscription;
  constructor(
    private stories: StorySubmissionsService,
    private auth: AuthService,
    private router: Router,
  ) {
    this.load();
  }
  get photosPending(): boolean {
    return this.photos.some((p) => !p.url);
  }
  get visible() {
    const q = this.query.trim().toLowerCase();
    return this.queue.items.filter((x) =>
      [x.title, x.submittedBy].join(' ').toLowerCase().includes(q),
    );
  }
  label(status: ReviewStatus): string {
    return status === 'Submitted' ? 'Awaiting review' : status;
  }
  load(page = 0): void {
    this.listRequest?.unsubscribe();
    this.loading = true;
    this.error = '';
    this.listRequest = this.stories.list(this.status, page).subscribe({
      next: (q) => {
        this.queue = q;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'The review queue could not load. Please try again.';
      },
    });
  }
  filter(status: ReviewStatus): void {
    if (this.saving) return;
    this.status = status;
    this.query = '';
    this.close();
    this.notice = '';
    this.load();
  }
  open(id: number): void {
    if (this.saving) return;
    this.close();
    this.detailLoading = true;
    const request = new Subscription();
    this.detailRequest = request;
    request.add(
      this.stories.review(id).subscribe({
        next: (story) => {
          this.selected = story;
          this.detailLoading = false;
          if (window.matchMedia('(max-width:850px)').matches)
            requestAnimationFrame(() =>
              this.panel?.nativeElement.scrollIntoView({
                behavior: window.matchMedia('(prefers-reduced-motion:reduce)')
                  .matches
                  ? 'auto'
                  : 'smooth',
                block: 'start',
              }),
            );
          for (const path of story.photos || []) {
            const photo = { url: '', failed: false };
            this.photos.push(photo);
            if (path.startsWith('/v1/blogs/photos/'))
              request.add(
                this.stories.photo(path).subscribe({
                  next: (blob) => {
                    photo.url = URL.createObjectURL(blob);
                  },
                  error: () => {
                    photo.failed = true;
                  },
                }),
              );
            else if (/^https?:\/\//i.test(path)) photo.url = path;
            else photo.failed = true;
          }
        },
        error: () => {
          this.detailLoading = false;
          this.detailError =
            'This submission could not load. Select it again to retry.';
        },
      }),
    );
  }
  close(): void {
    if (this.saving) return;
    this.detailRequest?.unsubscribe();
    this.selected = null;
    this.detailLoading = false;
    this.detailError = '';
    for (const p of this.photos)
      if (p.url.startsWith('blob:')) URL.revokeObjectURL(p.url);
    this.photos = [];
  }
  decide(decision: 'publish' | 'reject'): void {
    if (
      !this.selected ||
      this.saving ||
      this.selected.status !== 'Submitted' ||
      (decision === 'publish' && this.photosPending)
    )
      return;
    const story = this.selected;
    this.saving = true;
    this.detailError = '';
    this.notice = '';
    this.actionRequest = this.stories.decide(story.id, decision).subscribe({
      next: () => {
        this.saving = false;
        story.status = decision === 'publish' ? 'Published' : 'Rejected';
        this.notice =
          decision === 'publish'
            ? 'Story published. It is now visible on the website.'
            : 'Story rejected. It remains private.';
        this.load(this.queue.page);
      },
      error: (err) => {
        this.saving = false;
        this.detailError =
          err.status === 400
            ? 'This story may have been reviewed already. Open it again to refresh.'
            : 'The decision could not be saved. Please try again.';
      },
    });
  }
  signOut(): void {
    this.auth.logout().subscribe({ error: () => {} });
    void this.router.navigate(['/admin']);
  }
  ngOnDestroy(): void {
    this.listRequest?.unsubscribe();
    this.actionRequest?.unsubscribe();
    this.saving = false;
    this.close();
  }
}
