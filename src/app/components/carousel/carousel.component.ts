// file changes made by rashmi on 10-06-2024
import { Component, OnInit } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  images: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.images = [
      'assets/images/stmarys1.jpg',
      'assets/images/food4.jpg',
      'assets/images/madhwasarovar1.jpg'
    ];
  }

}