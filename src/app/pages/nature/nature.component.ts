import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

interface Card {
  image: string;
  title: string;
  id: number;
}

@Component({
  selector: 'app-nature',
  templateUrl: './nature.component.html',
  styleUrls: ['./nature.component.scss']
})
export class NatureComponent implements OnInit, OnDestroy {

  // Boolean to control view state
  viewAll = false;
  viewAllWildlife = false;
  viewAllBeaches = false;

  // Array of activity cards
  activityCards: Card[] = [
    { image: 'assets/images/a1.jpeg', title: 'Hoode Kayakking',id: 1 },
    { image: 'assets/images/a2.jpg', title: 'Hanging bridge',id: 2  },
    { image: 'assets/images/a3.jpg', title: 'Malpe Sea Walk',id: 3  },
    { image: 'assets/images/a4.jpg', title: 'Malpe Floating Bridge' ,id: 4 },
    { image: 'assets/images/a5.jpg', title: 'kaup Light House',id: 5  },
    { image: 'assets/images/a6.jpg', title: 'Kudlu Falls' ,id: 6 },
    { image: 'assets/images/a7.jpg', title: 'Manipal Lake' ,id: 7 },
    { image: 'assets/images/a8.jfif', title: 'Ajjarkad Badminton Court',id: 8  },
    { image: 'assets/images/a9.jpg', title: 'Tree Park' ,id: 9},
    { image: 'assets/images/a10.jfif', title: 'Trigger' ,id: 10}
  ];

  wildlifeCards: Card[] = [
    { image: 'assets/images/w1.jpg', title: 'Someshwara', id: 11 },
    { image: 'assets/images/w2.jpg', title: 'Mookambika Wildlife', id: 12 },
    { image: 'assets/images/w3.jfif', title: 'udupi goshale', id: 13 },
    { image: 'assets/images/w4.jfif', title: 'Neelavara goshale', id: 14 },
    { image: 'assets/images/w5.jfif', title: 'Kunjargiri', id: 15 },
    { image: 'assets/images/w6.jpg', title: 'Kaup beach', id: 16 },
    { image: 'assets/images/w7.jpg', title: 'Sharavathi', id: 17 },
    { image: 'assets/images/w8.jpg', title: 'Shettihalli', id: 18 },
    { image: 'assets/images/w9.jpg', title: 'Muthodi', id: 19 },
    { image: 'assets/images/w10.jpg', title: 'Malyadi', id: 20 }
  ];

  beachCards: Card[] = [
    { image: 'assets/images/be1.jpg', title: 'Malpe Beach', id: 21 },
    { image: 'assets/images/be2.jfif', title: 'Kaup Beach', id: 22 },
    { image: 'assets/images/be3.jpg', title: 'Delta Beach', id: 23 },
    { image: 'assets/images/be4.jpg', title: 'Padukere Beach', id: 24 },
    { image: 'assets/images/be5.jpg', title: 'Maravante Beach', id: 25 },
    { image: 'assets/images/be6.jpg', title: 'Mattu Beach', id: 26 },
    { image: 'assets/images/be7.JPG', title: 'Bengre Beach', id: 27 },
    { image: 'assets/images/be8.jpg', title: 'Muloor Beach', id: 28 },
    { image: 'assets/images/be9.jpg', title: 'Blue Whale Beach', id: 29 },
    { image: 'assets/images/be10.jpg', title: 'Kodi Beach', id: 30 }
  ];

  visibleActivityCards: Card[] = [];
  visibleWildlifeCards: Card[] = [];
  visibleBeachCards: Card[] = [];

  constructor(private router: Router) {}

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
