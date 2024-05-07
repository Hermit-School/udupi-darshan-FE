import { Component } from '@angular/core';
import { Slide } from 'src/app/slide.interface';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  selectedSection: string=''; // Define selectedSection property here

  slides: Slide[] = [
    { imageUrl: 'assets/slide1.jpg' },
    { imageUrl: 'assets/slide2.jpg' },
    { imageUrl: 'assets/slide3.jpg' },
    // Add more slides as needed
  ];

  // Other component logic
}
