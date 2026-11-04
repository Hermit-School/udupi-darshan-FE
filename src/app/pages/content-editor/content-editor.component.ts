import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, map } from 'rxjs';
import { API_BASE_URL } from 'src/constants/routes';

const TYPES = {
  nature: { title: 'Nature', url: '/v1/nature/postNature', labels: ['Best Of Nature', 'Activity List', 'Wildlife List', 'Beach List'] },
  culture: { title: 'Culture', url: '/v1/culture/postCulture', labels: ['Rathotsavas', 'Mathas', 'Festivals', 'Beach list'] },
  food: { title: 'Food', url: '/v1/food/postFood', labels: ['Best of Food', 'Hotels', 'Restaurants', 'Tea & Snacks'] },
  story: { title: 'Story', url: '/v1/blogs/admin/publish', labels: [] },
  ads: { title: 'Ad', url: '/v1/ads', labels: [] },
};
type Kind = keyof typeof TYPES;
const required = (control: AbstractControl) => control.value?.trim() ? null : { required: true };
const lines = (value: string) => value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-content-editor',
  templateUrl: './content-editor.component.html',
  styleUrls: ['./content-editor.component.scss'],
})
export class ContentEditorComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  readonly kind: Kind = this.readKind();
  readonly type = TYPES[this.kind];
  readonly destination = this.type.labels.length > 0;
  readonly story = this.kind === 'story';
  readonly ad = this.kind === 'ads';
  readonly lists = [
    { key: 'keyPoints', label: 'Highlights' }, { key: 'discover', label: 'Things to discover' },
    { key: 'impInfo', label: 'Important information' },
  ] as const;
  readonly form = this.fb.group({
    title: ['', [required, Validators.maxLength(255)]],
    label: ['', this.destination ? [required] : []],
    location: ['', Validators.maxLength(255)],
    description: ['', this.story ? [required, Validators.maxLength(555)] : [Validators.maxLength(10000)]],
    author: ['', this.story ? [required, Validators.maxLength(255)] : []],
    email: ['', this.story ? [required, Validators.email, Validators.maxLength(255)] : []],
    link: ['', this.destination ? [required, Validators.maxLength(255)] : [Validators.maxLength(255)]],
    imageUrl: ['', this.ad ? [required, Validators.maxLength(255)] : []],
    images: [''], timings: ['', Validators.maxLength(10000)],
    keyPoints: [''], discover: [''], impInfo: [''],
    byBike: ['', Validators.maxLength(10000)], byCar: ['', Validators.maxLength(10000)], byPublic: ['', Validators.maxLength(10000)],
    related: this.fb.array<ReturnType<ContentEditorComponent['relatedPlace']>>([]),
  });
  busy = false;
  error = '';
  published = '';
  get related() { return this.form.controls.related; }

  private readKind(): Kind {
    const key = this.route.snapshot.paramMap.get('type');
    return key && Object.hasOwn(TYPES, key) ? key as Kind : 'nature';
  }

  private relatedPlace() {
    return this.fb.group({
      name: ['', [required, Validators.maxLength(255)]],
      description: ['', Validators.maxLength(10000)],
      imageUrl: ['', Validators.maxLength(255)],
      link: ['', Validators.maxLength(255)],
    });
  }
  addRelated() { if (this.related.length < 50) this.related.push(this.relatedPlace()); }

  publish() {
    if (this.busy || this.published) return;
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Check the required fields and any character limits before publishing.';
      return;
    }
    const v = this.form.getRawValue();
    const images = lines(v.images);
    if (images.length > 20 || images.some(image => image.length > 255)
      || this.lists.some(({key}) => lines(v[key]).length > 50 || lines(v[key]).some(item => item.length > 255))) {
      this.error = 'Use up to 20 image URLs and 50 lines per list. Each line must be 255 characters or fewer.';
      return;
    }
    const link = v.link.trim();
    const dontMissThese = v.related.map(item => ({
      name: item.name.trim(), description: item.description.trim(),
      imageUrl: item.imageUrl.trim(), link: item.link.trim(),
    }));
    const title = v.title.trim();
    const payload = this.destination ? {
      name: title, category: this.type.title, label: v.label, location: v.location.trim(),
      descr: v.description.trim(), timings: v.timings.trim(), link, images, dontMissThese,
      keyPoints: lines(v.keyPoints), discover: lines(v.discover), impInfo: lines(v.impInfo),
      howToVisit: { byBike: v.byBike.trim(), byCar: v.byCar.trim(), byPublic: v.byPublic.trim() },
    } : this.story ? {
      title, content: v.description.trim(), submittedBy: v.author.trim(), email: v.email.trim(),
      link, images, dontMissThese,
    } : { title, imageUrl: v.imageUrl.trim(), link };
    this.busy = true;
    const url = API_BASE_URL + this.type.url;
    // Culture's existing endpoint acknowledges a saved entry with plain text.
    const confirmation = this.kind === 'culture'
      ? this.http.post(url, payload, { responseType: 'text' }).pipe(map(result => result === 'Success'))
      : this.http.post<{ id: number }>(url, payload).pipe(
        map(result => !!result && Number.isSafeInteger(result.id) && result.id > 0),
      );
    confirmation
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.busy = false))
      .subscribe({
        next: confirmed => {
          if (!confirmed) {
            this.error = 'The server did not confirm publication. Check the public page before trying again.';
            return;
          }
          this.published = title;
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.status === 400 && typeof err.error?.detail === 'string' ? err.error.detail
            : err.status === 401 || err.status === 403 ? 'Sign in with an administrator account to publish.'
            : 'Publication could not be confirmed. Check the public page before trying again.';
        },
      });
  }
}
