import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss']
})
export class AdvertisementComponent implements OnInit {
  isSmallScreen: boolean = false;
  slideIndex: number = 0;
  transitionStyle: string = 'transform 2s ease-in-out';
  images = [
    { src: 'assets/images/ad1.jpg', alt: 'Image 1' },
    { src: 'assets/images/add.jpg', alt: 'Image 2' },
    { src: 'assets/images/ad5.jpeg', alt: 'Image 3' },
    { src: 'assets/images/ad8.jpg', alt: 'Image 4' }
  ];

  ngOnInit() {
    this.checkScreenSize();
    this.startSlideshow();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 1000; 
  }

  startSlideshow() {
    setInterval(() => {
      if (this.slideIndex === this.images.length) {
        this.transitionStyle = 'none';
        this.slideIndex = 0;
        setTimeout(() => {
          this.transitionStyle = 'transform 2s ease-in-out';
          this.slideIndex++;
        }, 20); 
      } else {
        this.slideIndex++;
      }
    }, 3000); 
  }
}
