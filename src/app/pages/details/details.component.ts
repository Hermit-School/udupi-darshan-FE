import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { natureServiceService } from "src/app/services/nature.service";
import { CultureService } from "src/app/services/culture.service";
import { Details } from "src/app/models/card";
import { FoodService } from "src/app/services/food.service";
import { of, Subscription, switchMap } from "rxjs";
import {
  matchesDestinationSlug,
  SharedService,
} from "src/app/services/shared.service";

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent implements OnInit, OnDestroy {
  loading = false;
  error = "";
  private routeSubscription?: Subscription;
  private requestSubscription?: Subscription;
  @Input() description: string | undefined;
  card: Details | null = null;
  currentSlideIndex: number = 0;
  currentCategory: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private natureService: natureServiceService,
    private cultureService: CultureService,
    private foodService: FoodService,
    private shared: SharedService,
  ) {}
  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      const rawId = params["id"];
      const category =
        params["category"] ?? this.route.snapshot.data["legacyCategory"];
      this.currentCategory = category;
      if (this.route.snapshot.data["legacyCategory"] && !/^\d+$/.test(rawId))
        this.fetchLegacy(category, rawId);
      else this.fetchData(category, Number(rawId));
    });
  }

  fetchData(category: string, id: number): void {
    this.requestSubscription?.unsubscribe();
    this.card = null;
    this.error = "";
    this.currentSlideIndex = 0;
    const section = (category || "").toLowerCase().split("-")[0];
    const service =
      section === "nature"
        ? this.natureService.getNatureById.bind(this.natureService)
        : section === "culture"
          ? this.cultureService.getCultureById.bind(this.cultureService)
          : section === "food"
            ? this.foodService.getFoodById.bind(this.foodService)
            : null;
    if (!service || !Number.isSafeInteger(id) || id <= 0) {
      this.loading = false;
      this.error = "Destination not found.";
      return;
    }
    this.loading = true;
    this.requestSubscription = service(id).subscribe({
      next: (card) => {
        this.card = card;
        this.loading = false;
        this.shared.resolveRelatedLinks(card.dontMissThese);
      },
      error: () => {
        this.loading = false;
        this.error = "Unable to load this destination. Please try again.";
      },
    });
  }

  private fetchLegacy(section: string, slug: string): void {
    this.requestSubscription?.unsubscribe();
    this.card = null;
    this.error = "";
    this.currentSlideIndex = 0;
    this.loading = true;
    this.requestSubscription = this.shared
      .loadIndex()
      .pipe(
        switchMap((items) => {
          const matches = items.filter(
            (item) =>
              item.category.toLowerCase() === section &&
              matchesDestinationSlug(item, slug),
          );
          if (matches.length !== 1) return of(null);
          const id = matches[0].id;
          return section === "nature"
            ? this.natureService.getNatureById(id)
            : section === "culture"
              ? this.cultureService.getCultureById(id)
              : this.foodService.getFoodById(id);
        }),
      )
      .subscribe({
        next: (card) => {
          this.card = card;
          this.error = card
            ? ""
            : this.shared.indexError()
              ? "Unable to load this destination. Please try again."
              : "Destination not found.";
          this.loading = false;
          if (card) this.shared.resolveRelatedLinks(card.dontMissThese);
        },
        error: () => {
          this.loading = false;
          this.error = "Unable to load this destination. Please try again.";
        },
      });
  }

  get mapUrl(): string {
    return (
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(
        [this.card?.name, this.card?.location, "Udupi"]
          .filter(Boolean)
          .join(" "),
      )
    );
  }
  get informationUrl(): string | null {
    try {
      const url = new URL(this.card?.link || "");
      return ["http:", "https:"].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  }

  relatedLink(link?: string): string | string[] | null {
    return this.shared.relatedLink(link);
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.requestSubscription?.unsubscribe();
  }

  onPrevClick() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    }
  }

  onNextClick() {
    if (this.currentSlideIndex < (this.card?.images.length ?? 0) - 1) {
      this.currentSlideIndex++;
    }
  }

  isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
  }
}
