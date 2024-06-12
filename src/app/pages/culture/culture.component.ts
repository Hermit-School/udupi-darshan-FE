import { Component, OnInit } from '@angular/core';
interface Card {
  image: string;
  title: string;
}

@Component({
  selector: 'app-culture',
  templateUrl: './culture.component.html',
  styleUrls: ['./culture.component.scss']
})
export class CultureComponent implements OnInit {
  viewAll = false;
  viewAllWildlife = false;
  viewAllBeaches = false;
  activityCards: Card[] = [
    { image: 'assets/images/matha0.jpg', title: 'Palimaru Matha' },
    { image: 'assets/images/matha1.jpg', title: 'Krishnapura Matha' },
    { image: 'assets/images/udupi3.jpg', title: 'Shiroor Matha' },
    { image: 'assets/images/matha3.jpg', title: 'Sode Matha' },
    { image: 'assets/images/matha5.jpeg', title: 'Pejavara Matha' },
    { image: 'assets/images/matha5.jpeg', title: 'Puttige Matha' },
    { image: 'assets/images/matha0.jpg', title: 'Kaniyur Matha' },
    { image: 'assets/images/matha1.jpg', title: 'Adamaru Matha' },
    { image: 'assets/images/matha0.jpg', title: 'Krishna Matha' },
    { image: 'assets/images/matha1.jpg', title: 'kanakana kindi' }
  ];



  wildlifeCards: Card[] = [
    { image: 'assets/images/f1.jpg', title: 'Ashtami' },
    { image: 'assets/images/f2.jpg', title: 'Holi' },
    { image: 'assets/images/f3.jpg', title: 'Paryaya' },
    { image: 'assets/images/f4.webp', title: 'Dance' },
    { image: 'assets/images/f5.jpg', title: 'Ganesh Chathurthi' },
    { image: 'assets/images/f1.jpg', title: 'Ashtami' },
    { image: 'assets/images/f2.jpg', title: 'Marnami' },
    { image: 'assets/images/f4.webp', title: 'Holi' },
    { image: 'assets/images/f4.webp', title: 'Deepavali' },
    { image: 'assets/images/f4.webp', title: 'Paryaya' }
  ];
  beachCards: Card[] = [
    { image: 'assets/images/be1.jpg', title: 'Malpe Beach' },
    { image: 'assets/images/be2.jfif', title: 'Kaup Beach' },
    { image: 'assets/images/be3.jpg', title: 'Delta Beach' },
    { image: 'assets/images/be4.jpg', title: 'Padukere Beach' },
    { image: 'assets/images/be5.jpg', title: 'Maravante Beach' },
    { image: 'assets/images/be6.jpg', title: 'Mattu Beach' },
    { image: 'assets/images/be7.JPG', title: 'Bengre Beach' },
    { image: 'assets/images/be8.jpg', title: 'Muloor Beach' },
    { image: 'assets/images/be9.jpg', title: 'Blue Whale Beach' },
    { image: 'assets/images/be10.jpg', title: 'Kodi Beach' }
  ];

  visibleActivityCards: Card[] = [];
  visibleWildlifeCards: Card[] = [];
  visibleBeachCards: Card[] = [];

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

  // Method to toggle the view state for Activity cards
  toggleViewAll() {
    this.viewAll = !this.viewAll;
    this.updateVisibleActivityCards();
  }

  // Method to update the visible Activity cards based on the view state and screen size
  updateVisibleActivityCards() {
    const isMobile = window.innerWidth < 1000; // Bootstrap's breakpoint for sm
    if (this.viewAll) {
      this.visibleActivityCards = this.activityCards;
    } else {
      this.visibleActivityCards = this.activityCards.slice(0, isMobile ? 2 : 4);
    }
  }

  // Method to toggle the view state for Wildlife cards
  toggleViewAllWildlife() {
    this.viewAllWildlife = !this.viewAllWildlife;
    this.updateVisibleWildlifeCards();
  }

  // Method to update the visible Wildlife cards based on the view state and screen size
  updateVisibleWildlifeCards() {
    const isMobile = window.innerWidth < 1000; // Bootstrap's breakpoint for sm
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
    const isMobile = window.innerWidth < 1000; // Bootstrap's breakpoint for sm
    if (this.viewAllBeaches) {
      this.visibleBeachCards = this.beachCards;
    } else {
      this.visibleBeachCards = this.beachCards.slice(0, isMobile ? 2 : 4);
    }
  }
  
}
