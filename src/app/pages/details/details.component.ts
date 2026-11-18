import { destinationRoute, namedRecord, nameSlug } from '../../util/destination-route';
import { informationUrl } from '../../util/information-url';
import { FoodRecommendationsService } from '../../services/food-recommendations.service';
import { RelatedPhotosService } from 'src/app/services/related-photos.service';
import { VisitorMotionDirective } from 'src/app/directives/visitor-motion.directive';
import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { natureServiceService } from "src/app/services/nature.service";
import { CultureService } from "src/app/services/culture.service";
import { Details } from "src/app/models/card";
import { FoodService } from "src/app/services/food.service";
import { map, of, Subscription, switchMap } from "rxjs";
import {
  matchesDestinationSlug,
  SharedService,
} from "src/app/services/shared.service";

class DestinationRouteRedirect {
  constructor(readonly section: string, readonly segment: string, readonly card: Details) {}
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, VisitorMotionDirective],
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent implements OnInit, OnDestroy {
  loading = false;
  error = "";
  private routeSubscription?: Subscription;
  private requestSubscription?: Subscription;
  private relatedSubscription?: Subscription;
  relatedCards: Details["dontMissThese"] = [];
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
    readonly relatedPhotos: RelatedPhotosService,
    private foodRecommendations: FoodRecommendationsService,
  ) {}
  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      const rawId = params["id"];
      const category =
        params["category"] ?? this.route.snapshot.data["legacyCategory"];
      this.currentCategory = category;
      if (this.route.snapshot.data["legacyCategory"] && !/^\d+$/.test(rawId)) {
        const navigation = this.router.currentNavigation() ?? this.router.lastSuccessfulNavigation();
        const redirect = navigation?.extras.info;
        if (redirect instanceof DestinationRouteRedirect && redirect.section === category && redirect.segment === rawId) {
          this.showCard(redirect.card, category);
        } else {
          this.fetchLegacy(category, rawId);
        }
      } else {
        this.fetchData(category, Number(rawId), true);
      }
    });
  }

  fetchData(category: string, id: number, redirectToName = false): void {
    this.requestSubscription?.unsubscribe();
    this.relatedSubscription?.unsubscribe();
    this.relatedCards = [];
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
    this.requestSubscription = service(id).pipe(
      switchMap(card => redirectToName && nameSlug(card.name)
        ? this.shared.loadIndex().pipe(map(items => ({
            card, route: destinationRoute(section, card, items.filter(item => item.category.toLowerCase() === section)),
          })))
        : of({ card, route: null })),
    ).subscribe({
      next: ({ card, route }) => {
        this.showCard(card, section);
        if (route) {
          void this.router.navigate(route, {
            replaceUrl: true,
            queryParamsHandling: 'preserve',
            preserveFragment: true,
            info: new DestinationRouteRedirect(section, route[1], card),
          });
        }
      },
      error: () => {
        this.loading = false;
        this.error = "Unable to load this destination. Please try again.";
      },
    });
  }

  private showCard(card: Details, section: string): void {
    this.card = card;
    this.loading = false;
    this.prepareRelated(card, section);
  }

  private fetchLegacy(section: string, slug: string): void {
    this.requestSubscription?.unsubscribe();
    this.relatedSubscription?.unsubscribe();
    this.relatedCards = [];
    this.card = null;
    this.error = "";
    this.currentSlideIndex = 0;
    this.loading = true;
    this.requestSubscription = this.shared
      .loadIndex()
      .pipe(
        switchMap((items) => {
          const categoryItems = items.filter(item => item.category.toLowerCase() === section);
          const exact = namedRecord(slug, categoryItems);
          const aliases = exact ? [] : categoryItems.filter(item => matchesDestinationSlug(item, slug));
          const id = exact?.id ?? (aliases.length === 1 ? aliases[0].id : undefined);
          if (id === undefined) return of(null);
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
          if (card) {
            this.prepareRelated(card, section);
          }
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
    return informationUrl(this.card?.link);
  }

  private prepareRelated(card: Details, section: string): void {
    this.relatedCards = card.dontMissThese ?? [];
    const update = (items: Details['dontMissThese']) => {
      if (this.card !== card) return;
      this.relatedCards = items;
      this.shared.resolveRelatedLinks(items);
      this.relatedPhotos.prepare(items);
    };
    update(this.relatedCards);
    if (section === 'food') this.relatedSubscription = this.foodRecommendations.forDestination(card).subscribe(update);
  }

  relatedLink(link?: string): string | string[] | null {
    return this.shared.relatedLink(link);
  }

  ngOnDestroy(): void {
    this.relatedSubscription?.unsubscribe();
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
