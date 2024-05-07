// carousel.component.ts
import { Component } from '@angular/core';
import { Slide } from 'src/app/slide.interface';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  slides: Slide[] = [
    { imageUrl: 'assets/slide1.jpeg' },
    { imageUrl: 'assets/slide2.jpeg' },
    { imageUrl: 'assets/slide3.jpeg' },
    // Add more slides as needed
  ];
}
