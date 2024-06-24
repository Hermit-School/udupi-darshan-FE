import { Component, Input, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { detailsService, details } from 'src/app/services/details-service.service';


interface Card {
  image: string[];
  title: string;
  id: number;
  description?: string; 
}


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @Input() description: string | undefined;
  card: details | null = null;
  isOverlayActive: boolean = false;
  currentSlideIndex: number = 0;

  constructor(private route: ActivatedRoute, private detailsService: detailsService) {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      const category = params['category'];

      switch (category) {
        case 'nature':
          this.detailsService.getNatureData().subscribe(data => {
              this.card = data.filter(_ => (_.id == id))[0]
            })
          break;

          case 'culture':
          this.detailsService.getCultureData().subscribe(data => {
              this.card = data.filter(_ => (_.id == id))[0]
            })
          break;
      
        default:
          break;
      }
    });
  }

  ngOnInit() {

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
}

@NgModule({
  declarations: [DetailsComponent],
  imports: [
    CommonModule 
  ]
})
export class DetailsModule { }
