import { validateStoryPhotos } from "../../util/story-photos";
import { Details } from "../../models/card";
import { SharedService, SearchEntry } from "../../services/shared.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { finalize, map, forkJoin } from "rxjs";
import { API_BASE_URL } from "src/constants/routes";

const TYPES = {
  nature: {
    title: "Nature",
    url: "/v1/nature/postNature",
    labels: ["Best Of Nature", "Activity List", "Wildlife List", "Beach List"],
  },
  culture: {
    title: "Culture",
    url: "/v1/culture/postCulture",
    labels: ["Rathotsavas", "Mathas", "Festivals", "Beach list"],
  },
  food: {
    title: "Food",
    url: "/v1/food/postFood",
    labels: ["Best of Food", "Hotels", "Restaurants", "Tea & Snacks"],
  },
  story: { title: "Story", url: "/v1/blogs/admin/publish", labels: [] },
  events: { title: "Event", url: "/v1/events", labels: [] },
  ads: { title: "Ad", url: "/v1/ads", labels: [] },
};
type Kind = keyof typeof TYPES;
const required = (control: AbstractControl) =>
  control.value?.trim() ? null : { required: true };
const lines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  selector: "app-content-editor",
  templateUrl: "./content-editor.component.html",
  styleUrls: ["./content-editor.component.scss"],
})
export class ContentEditorComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  readonly kind: Kind = this.readKind();
  readonly type = TYPES[this.kind];
  readonly destination = this.type.labels.length > 0;
  readonly story = this.kind === "story";
  readonly event = this.kind === "events";
  readonly editId = Number(this.route.snapshot.paramMap.get("id")) || null;
  private savedEventId: number | null = null;
  private uploadKey = crypto.randomUUID();
  pendingPhotos: File[] = [];
  photoError = "";
  loading = false;
  readonly shared = inject(SharedService);
  relatedChoices: SearchEntry[] = [];
  readonly ad = this.kind === "ads";
  readonly lists = [
    { key: "keyPoints", label: "Highlights" },
    { key: "discover", label: "Things to discover" },
    { key: "impInfo", label: "Important information" },
  ] as const;
  readonly form = this.fb.group({
    title: [
      "",
      this.event
        ? [Validators.maxLength(255)]
        : [required, Validators.maxLength(255)],
    ],
    label: ["", this.destination ? [required] : []],
    location: ["", Validators.maxLength(255)],
    description: [
      "",
      this.story
        ? [required, Validators.maxLength(10000)]
        : [Validators.maxLength(10000)],
    ],
    author: ["", this.story ? [required, Validators.maxLength(255)] : []],
    email: [
      "",
      this.story ? [required, Validators.email, Validators.maxLength(255)] : [],
    ],
    link: [
      "",
      this.destination
        ? [required, Validators.maxLength(255)]
        : [Validators.maxLength(255)],
    ],
    imageUrl: ["", this.ad ? [required, Validators.maxLength(255)] : []],
    startsOn: [""],
    endsOn: [""],
    featured: [false],
    width: [300, [Validators.min(100), Validators.max(2000)]],
    height: [250, [Validators.min(60), Validators.max(2000)]],
    images: [""],
    timings: ["", Validators.maxLength(10000)],
    keyPoints: [""],
    discover: [""],
    impInfo: [""],
    byBike: ["", Validators.maxLength(10000)],
    byCar: ["", Validators.maxLength(10000)],
    byPublic: ["", Validators.maxLength(10000)],
    related: this.fb.array<ReturnType<ContentEditorComponent["relatedPlace"]>>(
      [],
    ),
  });
  busy = false;
  loadError = "";
  private storyStatus = "Published";

  constructor() {
    this.shared
      .loadIndex()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => (this.relatedChoices = items));
    if (this.editId) this.loadExisting();
  }
  loadExisting() {
    this.loading = true;
    this.loadError = "";
    const id = this.editId;
    const url = this.story
      ? "/v1/blogs/admin/content/" + id
      : this.event
        ? "/v1/events/" + id
        : this.ad
          ? "/v1/ads"
          : "/v1/" + this.kind + "/" + id;
    this.http
      .get<any>(API_BASE_URL + url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const value = this.ad
            ? response.find((ad: any) => ad.id === id)
            : this.story
              ? response.content
              : this.event
                ? response.details.article || {}
                : response;
          if (!value) {
            this.loading = false;
            this.loadError = "Listing not found.";
            return;
          }
          this.form.patchValue({
            title: value.name || value.title || "",
            label: value.label || "",
            location: value.location || "",
            description: value.descr || value.content || "",
            author: value.submittedBy || "",
            email: response.email || "",
            link: value.link || "",
            imageUrl: value.imageUrl || "",
            images: (value.images || []).join("\n"),
            timings: value.timings || "",
            keyPoints: (value.keyPoints || []).join("\n"),
            discover: (value.discover || []).join("\n"),
            impInfo: (value.impInfo || []).join("\n"),
            byBike: value.howToVisit?.byBike || "",
            byCar: value.howToVisit?.byCar || "",
            byPublic: value.howToVisit?.byPublic || "",
            startsOn: response.details?.startsOn || "",
            endsOn: response.details?.endsOn || "",
            featured: !!response.details?.featured,
            width: value.width || 300,
            height: value.height || 250,
          });
          this.storyStatus = value.status || "Published";
          for (const item of value.dontMissThese || []) {
            const group = this.relatedPlace();
            group.patchValue(item);
            this.related.push(group);
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.loadError = "The listing could not load. Try again.";
        },
      });
  }
  async selectPhotos(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    input.value = "";
    if (!files.length) return;
    this.busy = true;
    this.photoError = "";
    try {
      await validateStoryPhotos(
        files,
        lines(this.form.controls.images.value).length,
        5,
      );
      this.pendingPhotos = files;
      this.uploadKey = crypto.randomUUID();
    } catch (error) {
      this.photoError =
        error instanceof Error ? error.message : "Photos could not be read.";
    } finally {
      this.busy = false;
    }
  }
  chooseRelated(index: number, event: Event) {
    const key = (event.target as HTMLSelectElement).value;
    const item = this.relatedChoices.find(
      (value) => value.category + "/" + value.id === key,
    );
    if (!item) return;
    const group = this.related.at(index);
    this.busy = true;
    this.error = "";
    this.http
      .get<Details>(
        API_BASE_URL + "/v1/" + item.category.toLowerCase() + "/" + item.id,
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.busy = false)),
      )
      .subscribe({
        next: (detail) =>
          group.patchValue({
            name: detail.name,
            description: detail.descr?.slice(0, 500) || "",
            imageUrl: detail.images?.[0] || "",
            link: "/details/" + item.category.toLowerCase() + "/" + item.id,
          }),
        error: () =>
          (this.error =
            "Could not load that related article. Choose it again."),
      });
  }
  error = "";
  published = "";
  get related() {
    return this.form.controls.related;
  }

  private readKind(): Kind {
    const key = this.route.snapshot.paramMap.get("type");
    return key && Object.hasOwn(TYPES, key) ? (key as Kind) : "nature";
  }

  private relatedPlace() {
    return this.fb.group({
      name: ["", [required, Validators.maxLength(255)]],
      description: ["", Validators.maxLength(10000)],
      imageUrl: ["", Validators.maxLength(255)],
      link: ["", Validators.maxLength(255)],
    });
  }
  addRelated() {
    if (this.related.length < 50) this.related.push(this.relatedPlace());
  }

  publish() {
    if (this.busy || this.loading || this.loadError || this.published) return;
    this.error = "";
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error =
        "Check the required fields and any character limits before publishing.";
      return;
    }
    const v = this.form.getRawValue();
    const images = lines(v.images);
    if (
      this.event &&
      (images.length + this.pendingPhotos.length > 5 ||
        (v.startsOn && v.endsOn && v.endsOn < v.startsOn))
    ) {
      this.error =
        "Use up to 5 photos and an end date on or after the start date.";
      return;
    }
    if (
      images.length > 20 ||
      images.some((image) => image.length > 255) ||
      this.lists.some(
        ({ key }) =>
          lines(v[key]).length > 50 ||
          lines(v[key]).some((item) => item.length > 255),
      )
    ) {
      this.error =
        "Use up to 20 image URLs and 50 lines per list. Each line must be 255 characters or fewer.";
      return;
    }
    const link = v.link.trim();
    const dontMissThese = v.related.map((item) => ({
      name: item.name.trim(),
      description: item.description.trim(),
      imageUrl: item.imageUrl.trim(),
      link: item.link.trim(),
    }));
    const title = v.title.trim();
    const article = {
      name: title,
      label: v.label,
      category: this.type.title,
      location: v.location.trim(),
      descr: v.description.trim(),
      timings: v.timings.trim(),
      link,
      images,
      dontMissThese,
      keyPoints: lines(v.keyPoints),
      discover: lines(v.discover),
      impInfo: lines(v.impInfo),
      howToVisit: {
        byBike: v.byBike.trim(),
        byCar: v.byCar.trim(),
        byPublic: v.byPublic.trim(),
      },
    };
    const payload = this.event
      ? {
          article,
          startsOn: v.startsOn || null,
          endsOn: v.endsOn || null,
          featured: v.featured,
        }
      : this.destination
        ? {
            name: title,
            category: this.type.title,
            label: v.label,
            location: v.location.trim(),
            descr: v.description.trim(),
            timings: v.timings.trim(),
            link,
            images,
            dontMissThese,
            keyPoints: lines(v.keyPoints),
            discover: lines(v.discover),
            impInfo: lines(v.impInfo),
            howToVisit: {
              byBike: v.byBike.trim(),
              byCar: v.byCar.trim(),
              byPublic: v.byPublic.trim(),
            },
          }
        : this.story
          ? {
              title,
              content: v.description.trim(),
              submittedBy: v.author.trim(),
              email: v.email.trim(),
              link,
              images,
              dontMissThese,
              ...(this.editId ? { status: this.storyStatus } : {}),
            }
          : {
              title,
              imageUrl: v.imageUrl.trim(),
              link,
              width: v.width,
              height: v.height,
            };
    this.busy = true;
    const savedId = this.editId || this.savedEventId;
    const suffix = this.event
      ? "/v1/events/" + savedId
      : this.ad
        ? "/v1/ads/" + savedId
        : this.story
          ? "/v1/blogs/updateBlogs/" + savedId
          : "/v1/" + this.kind + "/update" + this.type.title + "/" + savedId;
    const url = API_BASE_URL + (savedId ? suffix : this.type.url);
    const confirmation =
      this.kind === "culture" && !savedId
        ? this.http
            .post(url, payload, { responseType: "text" })
            .pipe(map((value) => value === "Success"))
        : (savedId
            ? this.http.put<{ id: number }>(url, payload)
            : this.http.post<{ id: number }>(url, payload)
          ).pipe(
            map((value) => {
              if (this.event && value?.id) this.savedEventId = value.id;
              return !!value && Number.isSafeInteger(value.id) && value.id > 0;
            }),
          );
    confirmation
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          if (!this.event || !this.pendingPhotos.length || this.error)
            this.busy = false;
        }),
      )
      .subscribe({
        next: (confirmed) => {
          if (!confirmed) {
            this.error =
              "The server did not confirm publication. Check the public page before trying again.";
            return;
          }
          this.shared.invalidateIndex();
          if (this.event && this.pendingPhotos.length) {
            this.busy = true;
            const data = new FormData();
            data.append("uploadKey", this.uploadKey);
            for (const photo of this.pendingPhotos)
              data.append("files", photo, photo.name);
            this.http
              .post<any>(
                API_BASE_URL +
                  "/v1/events/" +
                  (this.editId || this.savedEventId) +
                  "/photos",
                data,
              )
              .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => (this.busy = false)),
              )
              .subscribe({
                next: () => {
                  this.pendingPhotos = [];
                  this.published = title || "Community event";
                },
                error: () =>
                  (this.error =
                    "Event saved, but photos could not be confirmed. Publish again to retry safely."),
              });
          } else this.published = title || "Community event";
        },
        error: (err: HttpErrorResponse) => {
          this.error =
            err.status === 400 && typeof err.error?.detail === "string"
              ? err.error.detail
              : err.status === 401 || err.status === 403
                ? "Sign in with an administrator account to publish."
                : "Publication could not be confirmed. Check the public page before trying again.";
        },
      });
  }
}
