import { DeleteRecordComponent } from '../../components/delete-record/delete-record.component';
import { Component, DestroyRef, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RouterLink, ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { API_BASE_URL } from "src/constants/routes";
import { Subscription } from "rxjs";
const sections = {
  nature: { title: "Nature", path: "/nature/getNature" },
  culture: { title: "Culture", path: "/culture/getCulture" },
  food: { title: "Food", path: "/food/getFood" },
  story: { title: "Stories", path: "/blogs/getBlogs" },
  ads: { title: "Ads", path: "/ads" },
  events: { title: "Events", path: "/admin/events" },
};
type Kind = keyof typeof sections;
interface RecordSummary {
  id: number;
  name?: string;
  title?: string;
  location?: string;
  details?: { article?: { name?: string; location?: string } | null };
}
@Component({
  standalone: true,
  imports: [RouterLink, FormsModule, DeleteRecordComponent],
  selector: "app-content-manager",
  templateUrl: "./content-manager.component.html",
  styleUrls: ["./content-manager.component.scss"],
})
export class ContentManagerComponent {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private destroy = inject(DestroyRef);
  private request?: Subscription;
  kind: Kind = "nature";
  items: RecordSummary[] = [];
  query = "";
  loading = false;
  error = "";
  page = 1;
  readonly pageSize = 20;
  get section() {
    return sections[this.kind];
  }
  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((params) => {
        const type = params.get("type") || "nature";
        this.kind = Object.hasOwn(sections, type) ? (type as Kind) : "nature";
        this.query = "";
        this.page = 1;
        this.load();
      });
  }
  get canDelete(){return ['nature','culture','food','story'].includes(this.kind);}
  removed(id:number){this.items=this.items.filter(item=>item.id!==id);this.page=Math.min(this.page,this.pages);}
  name(item: RecordSummary) {
    return (
      item.name ||
      item.title ||
      item.details?.article?.name ||
      "Community event"
    );
  }
  get filtered() {
    const q = this.query.trim().toLowerCase();
    return this.items.filter((item) =>
      [this.name(item), item.location, item.details?.article?.location]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }
  get visible() {
    return this.filtered.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize,
    );
  }
  get pages() {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }
  load() {
    this.request?.unsubscribe();
    this.items = [];
    this.loading = true;
    this.error = "";
    this.request = this.http
      .get<RecordSummary[]>(API_BASE_URL + "/v1" + this.section.path)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (items) => {
          this.items = items;
          this.loading = false;
        },
        error: () => {
          this.error = "These records could not load. Please try again.";
          this.loading = false;
        },
      });
  }
}
