import { Component, Input, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { natureServiceService } from 'src/app/services/nature.service';
import { CultureService } from 'src/app/services/culture.service';
import { Details } from 'src/app/models/card';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @Input() description: string | undefined;
  card: Details | null = null;
  isOverlayActive: boolean = false;
  currentSlideIndex: number = 0;
  currentCategory: string | null = null;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private natureService: natureServiceService,
    private cultureService: CultureService
  ) {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      const category = params['category'];
      this.currentCategory = category;

      switch (category) {
        case 'nature':
          this.natureService.getData().subscribe(data => {
              this.card = data.filter(_ => (_.id == id))[0];
            });
          break;

        case 'culture':
          this.cultureService.getData().subscribe(data => {
              this.card = data.filter(_ => (_.id == id))[0];
            });
          break;
      
        default:
          break;
      }
    });
  }

  ngOnInit() {}

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
