import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import Card from 'src/app/models/card';

@Component({
  selector: 'app-culture',
  templateUrl: './culture.component.html',
  styleUrls: ['./culture.component.scss']
})
export class CultureComponent implements OnInit,OnDestroy{
  viewAll = false;
  viewAllWildlife = false;
  viewAllBeaches = false;
  activityCards: Card[] = [
    { image: 'assets/images/matha0.jpg', title: 'Palimaru Matha',id: 31 },
    { image: 'assets/images/matha1.jpg', title: 'Krishnapura Matha',id: 32},
    { image: 'assets/images/udupi3.jpg', title: 'Shiroor Matha' ,id: 33},
    { image: 'assets/images/matha3.jpg', title: 'Sode Matha',id: 34 },
    { image: 'assets/images/matha5.jpeg', title: 'Pejavara Matha',id: 35 },
    { image: 'assets/images/matha5.jpeg', title: 'Puttige Matha',id: 36 },
    { image: 'assets/images/matha0.jpg', title: 'Kaniyur Matha' ,id: 37},
    { image: 'assets/images/matha1.jpg', title: 'Adamaru Matha',id: 38},
    { image: 'assets/images/matha0.jpg', title: 'Krishna Matha' ,id: 39},
    { image: 'assets/images/matha1.jpg', title: 'kanakana kindi',id: 40 }
  ];
  wildlifeCards: Card[] = [
    { image: 'assets/images/f1.jpg', title: 'Ashtami',id: 41 },
    { image: 'assets/images/f2.jpg', title: 'Holi',id: 42 },
    { image: 'assets/images/f3.jpg', title: 'Paryaya',id: 43 },
    { image: 'assets/images/f4.webp', title: 'Dance' ,id: 44},
    { image: 'assets/images/f5.jpg', title: 'Ganesh Chathurthi' ,id: 45},
    { image: 'assets/images/f1.jpg', title: 'Ashtami' ,id: 46},
    { image: 'assets/images/f2.jpg', title: 'Marnami',id: 47 },
    { image: 'assets/images/f4.webp', title: 'Holi' ,id: 48},
    { image: 'assets/images/f4.webp', title: 'Deepavali' ,id: 49},
    { image: 'assets/images/f4.webp', title: 'Paryaya',id: 50 }
  ];
  beachCards: Card[] = [
    { image: 'assets/images/be1.jpg', title: 'Malpe Beach' ,id: 51},
    { image: 'assets/images/be2.jfif', title: 'Kaup Beach',id: 52 },
    { image: 'assets/images/be3.jpg', title: 'Delta Beach',id: 53 },
    { image: 'assets/images/be4.jpg', title: 'Padukere Beach' ,id: 54},
    { image: 'assets/images/be5.jpg', title: 'Maravante Beach' ,id: 55},
    { image: 'assets/images/be6.jpg', title: 'Mattu Beach',id: 56 },
    { image: 'assets/images/be7.JPG', title: 'Bengre Beach',id: 57 },
    { image: 'assets/images/be8.jpg', title: 'Muloor Beach' ,id: 58},
    { image: 'assets/images/be9.jpg', title: 'Blue Whale Beach',id: 59 },
    { image: 'assets/images/be10.jpg', title: 'Kodi Beach' ,id: 60}
  ];
  visibleActivityCards: Card[] = [];
  visibleWildlifeCards: Card[] = [];
  visibleBeachCards: Card[] = [];
  constructor(private router:Router){}

  ngOnInit() {
    this.updateVisibleActivityCards();
    this.updateVisibleWildlifeCards();
    this.updateVisibleBeachCards();
    window.addEventListener('resize', this.updateVisibleActivityCards.bind(this));
    window.addEventListener('resize', this.updateVisibleWildlifeCards.bind(this));
    window.addEventListener('resize', this.updateVisibleBeachCards.bind(this));
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
  }
  ngOnDestroy() {
    window.removeEventListener('resize', this.updateVisibleActivityCards.bind(this));
    window.removeEventListener('resize', this.updateVisibleWildlifeCards.bind(this));
    window.removeEventListener('resize', this.updateVisibleBeachCards.bind(this));
  }
  toggleViewAll() {
    this.viewAll = !this.viewAll;
    this.updateVisibleActivityCards();
  }
  updateVisibleActivityCards() {
    const isMobile = window.innerWidth < 1000; 
    if (this.viewAll) {
      this.visibleActivityCards = this.activityCards;
    } else {
      this.visibleActivityCards = this.activityCards.slice(0, isMobile ? 2 : 4);
    }
  }
  toggleViewAllWildlife() {
    this.viewAllWildlife = !this.viewAllWildlife;
    this.updateVisibleWildlifeCards();
  }
  updateVisibleWildlifeCards() {
    const isMobile = window.innerWidth < 1000; 
    if (this.viewAllWildlife) {
      this.visibleWildlifeCards = this.wildlifeCards;
    } else {
      this.visibleWildlifeCards = this.wildlifeCards.slice(0, isMobile ? 2 : 4);
    }
  }
  toggleViewAllBeaches() {
    this.viewAllBeaches = !this.viewAllBeaches;
    this.updateVisibleBeachCards();
  }
  updateVisibleBeachCards() {
    const isMobile = window.innerWidth < 1000; 
    if (this.viewAllBeaches) {
      this.visibleBeachCards = this.beachCards;
    } else {
      this.visibleBeachCards = this.beachCards.slice(0, isMobile ? 2 : 4);
    }
  }
goToDetails(id: number) {
    this.router.navigate(['/details',id]);
  }
}