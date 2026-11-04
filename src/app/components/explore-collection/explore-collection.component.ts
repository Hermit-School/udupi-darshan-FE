import { CommonModule } from "@angular/common";
import { Component, DestroyRef, Input, OnInit, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import { Details } from "src/app/models/card";
import { natureServiceService } from "src/app/services/nature.service";
import { CultureService } from "src/app/services/culture.service";
import { FoodService } from "src/app/services/food.service";

@Component({
  selector: "app-explore-collection",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./explore-collection.component.html",
  styleUrls: ["./explore-collection.component.scss"],
})
export class ExploreCollectionComponent implements OnInit {
  @Input() category: "nature" | "culture" | "food" = "nature";
  private readonly nature = inject(natureServiceService);
  private readonly culture = inject(CultureService);
  private readonly food = inject(FoodService);
  private readonly destroyRef = inject(DestroyRef);
  items: Details[] = [];
  loading = true;
  failed = false;
  query = "";
  selected = "All";
  limit = 12;
  readonly copy = {
    nature: {
      title: "A breath of fresh air.",
      intro:
        "From the coast to the forest. Find your own way into the outdoors.",
    },
    culture: {
      title: "Traditions worth discovering.",
      intro:
        "Explore the places, celebrations and heritage that give Udupi its character.",
    },
    food: {
      title: "Follow your appetite.",
      intro:
        "Discover local flavours, neighbourhood favourites and a place for your next break.",
    },
  };
  get labels(): string[] {
    return [...new Set(this.items.map((x) => x.label).filter(Boolean))];
  }
  get filtered(): Details[] {
    const words = this.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return this.items.filter(
      (x) =>
        (this.selected === "All" || x.label === this.selected) &&
        words.every((word) =>
          [x.name, x.location, x.descr, x.label]
            .join(" ")
            .toLowerCase()
            .includes(word),
        ),
    );
  }
  ngOnInit(): void {
    this.load();
  }
  load(): void {
    this.loading = true;
    this.failed = false;
    const request =
      this.category === "nature"
        ? this.nature.getAllNatures()
        : this.category === "culture"
          ? this.culture.getAllCultures()
          : this.food.getAllFoods();
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: () => {
        this.failed = true;
        this.loading = false;
      },
    });
  }
  filter(label: string): void {
    this.selected = label;
    this.limit = 12;
  }
  search(event: Event): void {
    this.query = (event.target as HTMLInputElement).value;
    this.limit = 12;
  }
  reset(): void {
    this.query = "";
    this.selected = "All";
    this.limit = 12;
  }
}
