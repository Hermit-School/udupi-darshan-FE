import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { StorySubmissionsService } from 'src/app/services/story-submissions.service';

type StoryField = 'title' | 'name' | 'email' | 'message';
const nonBlank: ValidatorFn = (control) =>
  typeof control.value === 'string' && control.value.trim()
    ? null
    : { required: true };
const noNullCharacter: ValidatorFn = (control) =>
  typeof control.value === 'string' && control.value.includes('\0')
    ? { invalidCharacters: true }
    : null;

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
    title: ['', [nonBlank, noNullCharacter, Validators.maxLength(200)]],
    name: ['', [nonBlank, noNullCharacter, Validators.maxLength(100)]],
    email: [
      '',
      [
        nonBlank,
        noNullCharacter,
        Validators.email,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
        Validators.maxLength(255),
      ],
    ],
    message: ['', [nonBlank, noNullCharacter, Validators.maxLength(5000)]],
  });
  photos: { file: File; url: string }[] = [];
  error = '';
  photoError = '';
  submitting = false;
  submitted = false;
  attempted = false;
  validatingPhotos = false;
  private destroyed = false;
  private changes?: Subscription;
  private key = '';
  private request?: Subscription;
  constructor(
    private fb: FormBuilder,
    private stories: StorySubmissionsService,
    private element: ElementRef<HTMLElement>,
  ) {
    this.changes = this.form.valueChanges.subscribe(() => {
      this.error = '';
    });
  }

  validationMessage(field: StoryField): string | null {
    const control = this.form.controls[field];
    if (!control.touched && !this.attempted) return null;
    const labels = {
      title: 'story title',
      name: 'name',
      email: 'email address',
      message: 'story',
    };
    if (control.hasError('required')) return `Enter your ${labels[field]}.`;
    if (control.hasError('maxlength'))
      return `Use ${control.getError('maxlength').requiredLength} characters or fewer.`;
    if (control.hasError('invalidCharacters'))
      return 'Remove invalid characters from this field.';
    if (control.hasError('email') || control.hasError('pattern'))
      return 'Enter a valid email address, such as name@example.com.';
    return null;
  }

  trimEmail(): void {
    const control = this.form.controls.email;
    if (control.value !== control.value.trim())
      control.setValue(control.value.trim());
  }

  clearPhotoError(): void {
    this.photoError = '';
    this.error = '';
  }

  private focusFirstError(): void {
    const field = (['title', 'name', 'email', 'message'] as const).find(
      (key) => this.form.controls[key].invalid,
    );
    this.element.nativeElement
      .querySelector<HTMLElement>(field ? '#story-' + field : '#story-photos')
      ?.focus();
  }

  async selectPhotos(event: Event): Promise<void> {
    if (
      this.submitting ||
      this.validatingPhotos ||
      this.submitted ||
      this.destroyed
    )
      return;
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    input.value = '';
    if (!files.length) return;
    this.photoError = '';
    this.error = '';
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
    if (!unique.length) return;
    this.validatingPhotos = true;
    try {
      for (const file of unique) {
        const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
        const png = [137, 80, 78, 71, 13, 10, 26, 10].every(
          (value, index) => header[index] === value,
        );
        const jpeg =
          header[0] === 255 && header[1] === 216 && header[2] === 255;
        if (!(file.type === 'image/png' ? png : jpeg))
          throw new Error('format');
        const image = await createImageBitmap(file);
        try {
          if (
            !image.width ||
            !image.height ||
            image.width * image.height > 20_000_000
          )
            throw new Error('dimensions');
        } finally {
          image.close();
        }
      }
      if (!this.destroyed)
        this.photos.push(
          ...unique.map((file) => ({ file, url: URL.createObjectURL(file) })),
        );
    } catch {
      if (!this.destroyed)
        this.photoError =
          'Choose readable JPEG or PNG photos, up to 20 megapixels each. No new photos were added.';
    } finally {
      this.validatingPhotos = false;
    }
  }
  removePhoto(index: number): void {
    URL.revokeObjectURL(this.photos[index].url);
    this.photos.splice(index, 1);
    this.photoError = '';
    this.error = '';
  }
  submit(): void {
    if (this.submitting || this.validatingPhotos || this.submitted) return;
    this.attempted = true;
    this.error = '';
    this.form.markAllAsTouched();
    this.trimEmail();
    if (this.form.invalid || this.photoError) {
      this.error = 'Please correct the highlighted fields before submitting.';
      this.focusFirstError();
      return;
    }
    const value = this.form.getRawValue();
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
    this.destroyed = true;
    this.changes?.unsubscribe();
    this.request?.unsubscribe();
    for (const photo of this.photos) URL.revokeObjectURL(photo.url);
  }
}
