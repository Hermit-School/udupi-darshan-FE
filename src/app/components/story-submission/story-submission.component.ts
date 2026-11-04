import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StorySubmissionsService } from 'src/app/services/story-submissions.service';

@Component({
  selector: 'app-story-submission',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './story-submission.component.html',
  styleUrls: ['./story-submission.component.scss'],
})
export class StorySubmissionComponent implements OnDestroy {
  @Output() busy = new EventEmitter<boolean>();
  @Output() close = new EventEmitter<void>();
  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(255)],
    ],
    message: ['', [Validators.required, Validators.maxLength(5000)]],
  });
  photos: { file: File; url: string }[] = [];
  error = '';
  photoError = '';
  submitting = false;
  submitted = false;
  attempted = false;
  private key = '';
  private request?: Subscription;
  constructor(
    private fb: FormBuilder,
    private stories: StorySubmissionsService,
  ) {}
  selectPhotos(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    input.value = '';
    this.photoError = '';
    const unique = files.filter(
      (f) =>
        !this.photos.some(
          (p) =>
            p.file.name === f.name &&
            p.file.size === f.size &&
            p.file.lastModified === f.lastModified,
        ),
    );
    if (this.photos.length + unique.length > 3) {
      this.photoError = 'Choose up to 3 photos in total.';
      return;
    }
    if (
      unique.some(
        (f) =>
          !['image/jpeg', 'image/png'].includes(f.type) ||
          f.size === 0 ||
          f.size > 5 * 1024 * 1024,
      )
    ) {
      this.photoError = 'Choose JPEG or PNG photos, at most 5 MB each.';
      return;
    }
    this.photos.push(
      ...unique.map((file) => ({ file, url: URL.createObjectURL(file) })),
    );
  }
  removePhoto(index: number): void {
    URL.revokeObjectURL(this.photos[index].url);
    this.photos.splice(index, 1);
    this.photoError = '';
  }
  submit(): void {
    if (this.submitting || this.submitted) return;
    this.attempted = true;
    this.error = '';
    this.form.markAllAsTouched();
    const value = this.form.getRawValue();
    if (
      this.form.invalid ||
      !value.title.trim() ||
      !value.name.trim() ||
      !value.message.trim()
    ) {
      this.error = 'Please complete the title, name, email and story.';
      return;
    }
    const body = new FormData();
    body.set('title', value.title.trim());
    body.set('submittedBy', value.name.trim());
    body.set('email', value.email.trim());
    body.set('content', value.message.trim());
    this.key ||= crypto.randomUUID();
    body.set('submissionKey', this.key);
    for (const photo of this.photos) body.append('photos', photo.file);
    this.submitting = true;
    this.busy.emit(true);
    this.request = this.stories.submit(body).subscribe({
      next: () => {
        this.submitting = false;
        this.busy.emit(false);
        this.submitted = true;
      },
      error: (err) => {
        this.submitting = false;
        this.busy.emit(false);
        this.error =
          err.status === 413
            ? 'These photos are too large. Use files under 5 MB each.'
            : err.status === 400
              ? err.error?.detail ||
                'Check your story and photos, then try again.'
              : 'Your story could not be submitted. Your draft is still here; please try again.';
      },
    });
  }
  ngOnDestroy(): void {
    this.request?.unsubscribe();
    for (const photo of this.photos) URL.revokeObjectURL(photo.url);
  }
}
