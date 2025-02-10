import { Component } from '@angular/core';
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
  images = [
    { src: 'assets/images/a6.jpg', description: 'Discover Udupi with these 6 beautiful beaches' },
    { src: 'assets/images/a3.jpg', description: 'Discover Udupi with these 6 beautiful beaches' },
    { src: 'assets/images/a4.jpg', description: 'Discover Udupi with these 6 beautiful beaches' }
  ];
}
