import { SharedService } from "../../services/shared.service";
import { Component, DestroyRef, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RouterLink, ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { API_BASE_URL } from "src/constants/routes";
import { switchMap, catchError, of } from "rxjs";
const paths: Record<string, string> = {
  nature: "/nature/getNature",
  culture: "/culture/getCulture",
  food: "/food/getFood",
  story: "/blogs/getBlogs",
  ads: "/ads",
  events: "/events",
};
const removePaths: Record<string, string> = {
  nature: "/nature/deleteNature/",
  culture: "/culture/deleteCulture/",
  food: "/food/deleteFood/",
  story: "/blogs/deleteBlogs/",
  ads: "/ads/",
  events: "/events/",
};
@Component({
  standalone: true,
  imports: [RouterLink, FormsModule],
  selector: "app-content-manager",
  template: `<main class="editor">
    <header>
      <a routerLink="/admindashboard">← Dashboard</a>
      <div class="intro">
        <span>ADMIN WORKSPACE</span>
        <h1>Manage {{ kind }}</h1>
        <p>Edit a published listing or remove one that is no longer needed.</p>
      </div>
    </header>
    <nav class="ud-chips" aria-label="Content types">
      @for (type of types; track type) {
        <a
          class="ud-chip"
          [routerLink]="['/admindashboard/content', type]"
          [attr.aria-current]="kind === type ? 'page' : null"
          >{{ type }}</a
        >
      }
    </nav>
    <section class="panel">
      <a class="ud-button" [routerLink]="['/new-entry', kind]">Add {{ kind }}</a
      ><label class="manager-search"
        >Search listings<input type="search" [(ngModel)]="query"
      /></label>
      @if (loading) {
        <p role="status">Loading listings…</p>
      }
      @if (error) {
        <p role="alert">{{ error }}</p>
        <button type="button" (click)="load()">Try again</button>
      }
      @if (notice) {
        <p role="status">{{ notice }}</p>
      }
      @for (item of visible; track item.id) {
        <article class="manager-row">
          <div>
            <h2>{{ title(item) }}</h2>
            <p>{{ item.location || item.details?.article?.location }}</p>
          </div>
          <a class="ud-link" [routerLink]="['/edit-entry', kind, item.id]"
            >Edit</a
          ><button type="button" [disabled]="busy" (click)="pending = item">
            Delete
          </button>
        </article>
      } @empty {
        @if (!loading && !error) {
          <p>No matching listings.</p>
        }
      }
    </section>
    @if (pending) {
      <section
        class="panel delete-confirm"
        role="alert"
        aria-labelledby="delete-title"
      >
        <h2 id="delete-title">Delete {{ title(pending) }}?</h2>
        <p>
          This removes the listing from the public site. This cannot be undone.
        </p>
        <button
          type="button"
          class="primary"
          [disabled]="busy"
          (click)="remove()"
        >
          {{ busy ? "Deleting…" : "Delete listing" }}
        </button>
        <button type="button" [disabled]="busy" (click)="pending = null">
          Keep listing
        </button>
      </section>
    }
  </main>`,
  styleUrls: ["../content-editor/content-editor.component.scss"],
})
export class ContentManagerComponent {
  private shared = inject(SharedService);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private destroy = inject(DestroyRef);
  types = Object.keys(paths);
  kind = "nature";
  items: any[] = [];
  query = "";
  error = "";
  notice = "";
  loading = false;
  busy = false;
  pending: any = null;
  private request?: import("rxjs").Subscription;
  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((params) => {
        const kind = params.get("type") || "nature";
        this.kind = paths[kind] ? kind : "nature";
        this.pending = null;
        this.query = "";
        this.notice = "";
        this.load();
      });
  }
  title(item: any) {
    return (
      item.name ||
      item.title ||
      item.details?.article?.name ||
      "Community event"
    );
  }
  get visible() {
    const q = this.query.trim().toLowerCase();
    return this.items.filter((item) =>
      this.title(item).toLowerCase().includes(q),
    );
  }
  load() {
    this.request?.unsubscribe();
    this.loading = true;
    this.error = "";
    this.items = [];
    this.request = this.http
      .get<any[]>(API_BASE_URL + "/v1" + paths[this.kind])
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (items) => {
          this.items = items;
          this.loading = false;
        },
        error: () => {
          this.error = "Listings could not load.";
          this.loading = false;
        },
      });
  }
  remove() {
    if (this.busy || !this.pending) return;
    this.busy = true;
    const id = this.pending.id;
    this.http
      .delete(API_BASE_URL + "/v1" + removePaths[this.kind] + id)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: () => {
          this.items = this.items.filter((i) => i.id !== id);
          this.pending = null;
          this.busy = false;
          this.shared.invalidateIndex();
          this.notice = "Listing deleted.";
        },
        error: () => {
          this.busy = false;
          this.error =
            "Could not confirm deletion. Refresh the list before trying again.";
        },
      });
  }
}
