import { validateStoryPhotos } from 'src/app/util/story-photos';
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
  pendingPhotos: { file: File; url: string }[] = [];
  photoError = '';
  uploadError = '';
  validatingPhotos = false;
  uploading = false;
  private uploadKey = '';
  private destroyed = false;
  private uploadRequest?: Subscription;
  get busy(): boolean {
    return this.saving || this.uploading || this.validatingPhotos;
  }
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
    if (this.busy) return;
    this.status = status;
    this.query = '';
    this.close();
    this.notice = '';
    this.load();
  }
  open(id: number): void {
    if (this.busy) return;
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
    if (this.busy) return;
    this.detailRequest?.unsubscribe();
    this.selected = null;
    this.detailLoading = false;
    this.detailError = '';
    this.clearPendingPhotos();
    for (const p of this.photos)
      if (p.url.startsWith('blob:')) URL.revokeObjectURL(p.url);
    this.photos = [];
  }
  decide(decision: 'publish' | 'reject'): void {
    if (
      !this.selected ||
      this.busy ||
      this.selected.status !== 'Submitted' ||
      (decision === 'publish' &&
        (this.photosPending ||
          this.pendingPhotos.length > 0 ||
          !!this.photoError))
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
        this.clearPendingPhotos();
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
  async selectPhotos(event: Event): Promise<void> {
    if (this.busy || !this.selected || this.selected.status !== 'Submitted')
      return;
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    input.value = '';
    if (!files.length) return;
    const unique = files.filter(
      (file) =>
        !this.pendingPhotos.some(
          (p) =>
            p.file.name === file.name &&
            p.file.size === file.size &&
            p.file.lastModified === file.lastModified,
        ),
    );
    this.photoError = '';
    this.uploadError = '';
    if (!unique.length) return;
    this.validatingPhotos = true;
    try {
      await validateStoryPhotos(
        unique,
        this.selected.photos.length + this.pendingPhotos.length,
      );
      if (!this.destroyed) {
        this.pendingPhotos.push(
          ...unique.map((file) => ({ file, url: URL.createObjectURL(file) })),
        );
        this.uploadKey = '';
      }
    } catch (error) {
      if (!this.destroyed) this.photoError = (error as Error).message;
    } finally {
      this.validatingPhotos = false;
    }
  }
  removePendingPhoto(index: number): void {
    if (this.busy) return;
    URL.revokeObjectURL(this.pendingPhotos[index].url);
    this.pendingPhotos.splice(index, 1);
    this.photoError = '';
    this.uploadError = '';
    this.uploadKey = '';
  }
  clearPhotoError(): void {
    this.photoError = '';
  }
  private clearPendingPhotos(): void {
    for (const photo of this.pendingPhotos) URL.revokeObjectURL(photo.url);
    this.pendingPhotos = [];
    this.photoError = '';
    this.uploadError = '';
    this.uploadKey = '';
  }
  savePhotos(): void {
    if (
      this.busy ||
      !this.selected ||
      this.selected.status !== 'Submitted' ||
      !this.pendingPhotos.length ||
      this.photoError
    )
      return;
    const id = this.selected.id;
    this.uploadKey ||= crypto.randomUUID();
    this.uploading = true;
    this.uploadError = '';
    this.notice = '';
    this.uploadRequest = this.stories
      .addPhotos(
        id,
        this.pendingPhotos.map((p) => p.file),
        this.uploadKey,
      )
      .subscribe({
        next: () => {
          this.uploading = false;
          this.clearPendingPhotos();
          this.notice = 'Photos saved. Review them before publishing.';
          this.open(id);
          this.load(this.queue.page);
        },
        error: (err) => {
          this.uploading = false;
          this.uploadError =
            err.status === 400
              ? err.error?.detail ||
                'Check the photo limit and refresh the story if it has been reviewed.'
              : err.status === 413
                ? 'These photos are too large. Use files under 5 MB each.'
                : 'Photos could not be saved. Your selection is still here; please try again.';
        },
      });
  }
  signOut(): void {
    this.auth.logout().subscribe({ error: () => {} });
    void this.router.navigate(['/admin']);
  }
  ngOnDestroy(): void {
    this.destroyed = true;
    this.uploadRequest?.unsubscribe();
    this.uploading = false;
    this.validatingPhotos = false;
    this.listRequest?.unsubscribe();
    this.actionRequest?.unsubscribe();
    this.saving = false;
    this.close();
  }
}
