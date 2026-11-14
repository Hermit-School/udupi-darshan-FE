import {adSlug,adExternal} from "../../content/ad-tiers";
import { DeleteRecordComponent } from '../../components/delete-record/delete-record.component';
import { ImagePickerComponent } from "../../components/image-picker/image-picker.component";
import { EditorPhoto, existingPhoto } from "../../util/media-image";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  DestroyRef,
  inject,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { finalize, timeout } from "rxjs";
import { API_BASE_URL } from "src/constants/routes";

const TYPES = {
  nature: {
    title: "Nature",
    url: "/v1/nature/postNature",
    labels: ["Parks", "Hills", "Lakes", "Rivers", "Beaches", "Waterfalls", "Wildlife", "Activities", "Islands"],
  },
  culture: {
    title: "Culture",
    url: "/v1/culture/postCulture",
    labels: ["Temples", "Mosques", "Churches", "Religious Architecture", "Native Art", "Historical Places", "Traditions", "Festivals"],
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
  imports: [ReactiveFormsModule, RouterLink, ImagePickerComponent, DeleteRecordComponent],
  selector: "app-content-editor",
  templateUrl: "./content-editor.component.html",
  styleUrls: ["./content-editor.component.scss"],
})
export class ContentEditorComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  recordName = "";
  removed(){void this.router.navigate(["/admindashboard/content",this.kind]);}
  readonly kind: Kind = this.readKind();
  readonly type = TYPES[this.kind];
  readonly labelOptions: string[] = this.type.labels;
  readonly destination = this.type.labels.length > 0;
  readonly story = this.kind === "story";
  readonly event = this.kind === "events";
  readonly editId = Number(this.route.snapshot.paramMap.get("id")) || null;
  loading = false;
  loadError = "";
  @ViewChildren(ImagePickerComponent) pickers?: QueryList<ImagePickerComponent>;
  photos: EditorPhoto[] = [];
  private relatedPhotoMap = new Map<AbstractControl, EditorPhoto[]>();
  uncertain = false;
  private requestKey = crypto.randomUUID();
  get imageBusy() {
    return this.pickers?.some((picker) => picker.validating) || false;
  }
  get adPagePath() {
    const slug=adSlug(this.form.controls.internalLink.value);
    return slug ? '/#/advertisements/' + slug : '';
  }
  get remainingUploads() {
    return 5 - this.allPhotos().filter((photo) => photo.file).length;
  }
  get photoLimit() {
    return this.ad || this.event ? 5 : 20;
  }
  relatedPhotos(group: AbstractControl) {
    return this.relatedPhotoMap.get(group) || [];
  }
  setRelatedPhotos(group: AbstractControl, photos: EditorPhoto[]) {
    this.relatedPhotoMap.set(group, photos);
  }
  private allPhotos() {
    return [
      ...this.photos,
      ...Array.from(this.relatedPhotoMap.values()).flat(),
    ];
  }
  private releasePreviews() {
    this.allPhotos()
      .filter((photo) => photo.file)
      .forEach((photo) => URL.revokeObjectURL(photo.preview));
  }

  private originalAdSource="";private originalAdWidth=0;private originalAdHeight=0;
  get adWidth(){const p=this.photos[0];return p?.width||(p?.source===this.originalAdSource?this.originalAdWidth:0);}
  get adHeight(){const p=this.photos[0];return p?.height||(p?.source===this.originalAdSource?this.originalAdHeight:0);}
  private storyStatus = "Published";
  readonly ad = this.kind === "ads";
  readonly lists = [
    { key: "keyPoints", label: "Highlights" },
    { key: "discover", label: "Things to discover" },
    { key: "impInfo", label: "Important information" },
  ] as const;
  readonly eventTaluks = ["Udupi", "Kapu", "Brahmavara", "Kundapura", "Byndoor", "Karkala", "Hebri"];
  readonly form = this.fb.group({
    taluk: ["", this.event ? [required, (control: AbstractControl) => this.eventTaluks.includes(control.value) ? null : { taluk: true }] : []],
    trending: [false],
    title: ["", [required, Validators.maxLength(255)]],
    label: ["", this.destination ? [required] : []],
    location: ["", this.event ? [required, Validators.maxLength(255)] : [Validators.maxLength(255)]],
    internalLink: ["", [Validators.maxLength(116), Validators.pattern(/^(?:\/?advertisements\/|\/)?[a-zA-Z][a-zA-Z0-9]*(?:[ -][a-zA-Z0-9]+)*$/)]],
    adTagline:["",Validators.maxLength(255)],adCategory:["",Validators.maxLength(80)],
    adPhone:["",[Validators.maxLength(30),Validators.pattern(/^(?=(?:\D*\d){5})[+0-9() .-]{5,30}$/)]],
    adAddress:["",Validators.maxLength(255)],adOpeningHours:["",Validators.maxLength(255)],
    adMapsUrl:["",Validators.maxLength(255)],adBackground:["#ece3d6",Validators.pattern(/^#[0-9a-fA-F]{6}$/)],
    adOfferings:[""],
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
    startsOn: [""],
    endsOn: [""],
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
  error = "";
  published = "";
  get related() {
    return this.form.controls.related;
  }

  constructor() {
    this.destroyRef.onDestroy(() => this.releasePreviews());
    if (this.editId) this.loadExisting();
  }
  loadExisting() {
    this.loading = true;
    this.loadError = "";
    const path = this.story
      ? "/v1/blogs/admin/content/" + this.editId
      : this.event
        ? "/v1/admin/events/" + this.editId
        : this.ad
          ? "/v1/ads/" + this.editId
          : "/v1/" + this.kind + "/" + this.editId;
    this.http
      .get<any>(API_BASE_URL + path)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const value = this.story
            ? response.content
            : this.event
              ? response.details.article || {}
              : response;
          this.recordName = value.name || value.title || "this record";
          this.form.patchValue({
            title: value.name || value.title || "",
            label: value.label || "",
            location: value.location || "",
            description: value.description || value.descr || value.content || "",
            internalLink: value.internalLink || (this.ad ? "ad-" + this.editId : ""),
            author: value.submittedBy || "",
            email: response.email || "",
            link: this.ad ? (value.website ?? value.externalLink ?? value.link ?? "") : value.link || "",
            adTagline:value.business?.tagline||"",adCategory:value.business?.category||"",adPhone:value.business?.phone||"",
            adAddress:value.business?.address||"",adOpeningHours:value.business?.openingHours||"",adMapsUrl:value.business?.mapsUrl||"",
            adBackground:value.business?.backgroundColor||"#ece3d6",adOfferings:(value.business?.offerings||[]).join("\n"),
            timings: value.timings || "",
            keyPoints: (value.keyPoints || []).join("\n"),
            discover: (value.discover || []).join("\n"),
            impInfo: (value.impInfo || []).join("\n"),
            byBike: value.howToVisit?.byBike || "",
            byCar: value.howToVisit?.byCar || "",
            byPublic: value.howToVisit?.byPublic || "",
            taluk: response.details?.taluk || "",
            startsOn: response.details?.startsOn || "",
            endsOn: response.details?.endsOn || "",
          });
          this.releasePreviews();
          this.relatedPhotoMap.clear();
          this.photos = (
            this.ad
              ? value.images?.length ? value.images : value.imageUrl ? [value.imageUrl] : []
              : value.images || []
          ).map(existingPhoto);
          if(this.ad){this.originalAdSource=this.photos[0]?.source||"";this.originalAdWidth=value.width||0;this.originalAdHeight=value.height||0;}
          this.form.controls.trending.setValue(response.details?.featured === true);
          this.storyStatus = value.status || "Published";
          this.related.clear();
          for (const item of value.dontMissThese || []) {
            const group = this.relatedPlace();
            group.patchValue(item);
            this.related.push(group);
            this.relatedPhotoMap.set(
              group,
              item.imageUrl ? [existingPhoto(item.imageUrl)] : [],
            );
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.loadError =
            "This record could not load. Try again before making changes.";
        },
      });
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
    if (this.related.length < 50) {
      const group = this.relatedPlace();
      this.related.push(group);
      this.relatedPhotoMap.set(group, []);
    }
  }

  removeRelated(index: number) {
    const group = this.related.at(index);
    this.relatedPhotos(group)
      .filter((photo) => photo.file)
      .forEach((photo) => URL.revokeObjectURL(photo.preview));
    this.relatedPhotoMap.delete(group);
    this.related.removeAt(index);
  }
  publish() {
    if (
      this.busy ||
      this.loading ||
      this.loadError ||
      this.published ||
      this.imageBusy
    )
      return;
    this.error = "";
    if (this.pickers?.some((picker) => !!picker.error)) {
      this.error = "Correct the photo selection before saving.";
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error =
        "Check the required fields and character limits before saving.";
      return;
    }
    if(this.ad){
      if(this.form.controls.link.value.trim()&&!adExternal(this.form.controls.link.value)||this.form.controls.adMapsUrl.value.trim()&&!adExternal(this.form.controls.adMapsUrl.value)){
        this.error="Use a full HTTPS URL for the website and map links.";return;
      }
      const offers=lines(this.form.controls.adOfferings.value);if(offers.length>20||offers.some(v=>v.length>255)){this.error="Add up to 20 offerings, at most 255 characters each.";return;}
    }
    if (this.ad && !this.form.controls.link.value.trim() && !this.form.controls.internalLink.value.trim()) {
      this.error = "Enter an internal link for this advertisement, or provide an external website.";
      return;
    }
    if (this.ad && !this.photos.length) {
      this.error = "Choose an image for this advertisement.";
      return;
    }
    if (this.photos.length > this.photoLimit || this.remainingUploads < 0) {
      this.error =
        "Too many photos selected. Upload up to 5 new photos per save.";
      return;
    }
    const v = this.form.getRawValue();
    if (this.event && v.startsOn && v.endsOn && v.endsOn < v.startsOn) {
      this.error = "The end date must be on or after the start date.";
      return;
    }
    if (
      this.lists.some(
        ({ key }) =>
          lines(v[key]).length > 50 ||
          lines(v[key]).some((item) => item.length > 255),
      )
    ) {
      this.error =
        "Use up to 50 lines per list, with 255 characters or fewer per line.";
      return;
    }
    const images = this.photos.map((photo) => photo.source);
    const dontMissThese = v.related.map((item, index) => ({
      name: item.name.trim(),
      description: item.description.trim(),
      link: item.link.trim(),
      imageUrl: this.relatedPhotos(this.related.at(index))[0]?.source || "",
    }));
    const title = v.title.trim(),
      link = v.link.trim();
    const article = {
      name: title,
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
    };
    const payload = this.event
      ? {
          article,
          district: "Udupi",
          taluk: v.taluk,
          startsOn: v.startsOn || null,
          endsOn: v.endsOn || null,
          featured: v.trending,
        }
      : this.destination
        ? { ...article, category: this.type.title }
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
           : { title, imageUrl: images[0] || "", images,website:link,externalLink: link, internalLink: adSlug(v.internalLink)||"", description: v.description.trim(),width:this.adWidth,height:this.adHeight,
              business:{tagline:v.adTagline.trim(),category:v.adCategory.trim(),phone:v.adPhone.trim(),address:v.adAddress.trim(),openingHours:v.adOpeningHours.trim(),mapsUrl:v.adMapsUrl.trim(),backgroundColor:v.adBackground,offerings:lines(v.adOfferings)} };
    const data = new FormData();
    data.append("data", JSON.stringify(payload));
    data.append("requestKey", this.requestKey);
    for (const photo of this.allPhotos())
      if (photo.file)
        data.append("file_" + photo.id, photo.file, photo.file.name);
    this.busy = true;
    this.http
      .post<{ id: number; kind: string }>(
        API_BASE_URL +
          "/v1/admin/content/" +
          this.kind +
          (this.editId ? "/" + this.editId : ""),
        data,
      )
      .pipe(
        timeout(90000),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.busy = false)),
      )
      .subscribe({
        next: (result) => {
          if (!result || !Number.isSafeInteger(result.id) || result.id <= 0) {
            this.uncertain = true;
            this.error = "Saving could not be confirmed. Retry the same save.";
            return;
          }
          this.uncertain = false;
          this.published = title;
          this.releasePreviews();
        },
        error: (err: unknown) => {
          if (
            !(err instanceof HttpErrorResponse) ||
            err.status === 0 ||
            err.status >= 500
          ) {
            this.uncertain = true;
            this.error =
              "Saving could not be confirmed. Retry without changing the selection; the same save will not create duplicate records.";
            return;
          }
          this.uncertain = false;
          this.error =
            err.status === 400 && typeof err.error?.detail === "string"
              ? err.error.detail
              : err.status === 401 || err.status === 403
                ? "Sign in with an administrator account to save."
                : "The record could not be saved. Please try again.";
        },
      });
  }
}
