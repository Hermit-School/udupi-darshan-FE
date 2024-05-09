import { Component, OnInit, ElementRef } from '@angular/core';
 import * as bootstrap from 'bootstrap'; // Import Bootstrap library

@Component({
  selector: 'app-scroll',
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.scss']
})
export class ScrollComponent implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    const carouselElement = this.elementRef.nativeElement.querySelector('#carouselExample');
    const carouselInner = carouselElement.querySelector('.carousel-inner');
    const carouselItems = carouselElement.querySelectorAll('.carousel-item');
    const cardWidth = carouselItems[0].offsetWidth;
    const carouselWidth = carouselInner.scrollWidth;

    let scrollPosition = 0;

    if (window.matchMedia("(min-width: 576px)").matches) { // Check if window width is greater than or equal to 576px
      const carousel = new bootstrap.Carousel(carouselElement, {
        interval: false
      });

      this.elementRef.nativeElement.querySelector('.carousel-control-next').addEventListener('click', () => {
        if (scrollPosition < (carouselWidth - (cardWidth * 7))) {
          console.log('next');
          scrollPosition += cardWidth;
          carouselInner.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
          });
        }
      });

      this.elementRef.nativeElement.querySelector('.carousel-control-prev').addEventListener('click', () => {
        if (scrollPosition > 0) {
          console.log('prev');
          scrollPosition -= cardWidth;
          carouselInner.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
          });
        }
      });
    } else {
      carouselElement.classList.add('slide');
    }
  }
}
