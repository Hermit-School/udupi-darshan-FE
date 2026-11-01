import { Component, Input, NgModule, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { natureServiceService } from 'src/app/services/nature.service';
import { CultureService } from 'src/app/services/culture.service';
import { Details } from 'src/app/models/card';
import { FoodService } from 'src/app/services/food.service';
import { Subscription } from 'rxjs';

@Component({ standalone: false,
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  loading = false;
  error = "";
  private routeSubscription?: Subscription;
  private requestSubscription?: Subscription;
  @Input() description: string | undefined;
  card: Details | null = null;
  isOverlayActive: boolean = false;
  currentSlideIndex: number = 0;
  currentCategory: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private natureService: natureServiceService,
    private cultureService: CultureService,
    private foodService: FoodService
  ) { }
  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      const id = Number(params['id']);
      const category = params['category'];
      this.currentCategory = category;
      this.fetchData(category, id);
    });
  }

  fetchData(category: string, id: number): void {
    this.requestSubscription?.unsubscribe();
    this.card = null; this.error = ''; this.currentSlideIndex = 0;
    const section = (category || '').toLowerCase().split('-')[0];
    const service = section === 'nature' ? this.natureService.getNatureById.bind(this.natureService)
      : section === 'culture' ? this.cultureService.getCultureById.bind(this.cultureService)
      : section === 'food' ? this.foodService.getFoodById.bind(this.foodService) : null;
    if (!service || !Number.isSafeInteger(id) || id <= 0) {
      this.loading = false; this.error = 'Destination not found.'; return;
    }
    this.loading = true;
    this.requestSubscription = service(id).subscribe({
      next: card => { this.card = card; this.loading = false; },
      error: () => { this.loading = false; this.error = 'Unable to load this destination. Please try again.'; }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe(); this.requestSubscription?.unsubscribe();
  }

  showOverlay(): void {
    this.isOverlayActive = true;
  }

  hideOverlay(): void {
    this.isOverlayActive = false;
  }

  onSlideChange(event: any) {
    const activeElement = document.querySelector('.carousel-item.active');
    if (activeElement) {
      this.currentSlideIndex = Array.from(activeElement.parentElement!.children).indexOf(activeElement);
    }
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

@NgModule({
  declarations: [DetailsComponent],
  imports: [
    CommonModule
  ]
})
export class DetailsModule { }
