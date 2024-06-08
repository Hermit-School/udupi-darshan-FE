import { Component, OnInit  } from '@angular/core';
interface Card {
  image: string;
  title: string;
}
@Component({
  selector: 'app-nature',
  templateUrl: './nature.component.html',
  styleUrls: ['./nature.component.scss']
})
export class NatureComponent implements OnInit{


  // Boolean to control view state
  viewAll = false;
  viewAllWildlife = false;
  viewAllBeaches = false;

  // Array of activity cards
  activityCards: Card[] = [
    { image: 'assets/images/a1.jpeg', title: 'Hoode Kayakking' },
    { image: 'assets/images/a2.jpg', title: 'Hanging bridge' },
    { image: 'assets/images/a3.jpg', title: 'Malpe Sea Walk' },
    { image: 'assets/images/a4.jpg', title: 'Malpe Floating Bridge' },
    { image: 'assets/images/a5.jpg', title: 'kaup Light House' },
    { image: 'assets/images/a6.jpg', title: 'Kudlu Falls' },
    { image: 'assets/images/a7.jpg', title: 'Manipal Lake' },
    { image: 'assets/images/a8.jfif', title: 'Ajjarkad Badminton Court' },
    { image: 'assets/images/a9.jpg', title: 'Tree Park' },
    { image: 'assets/images/a10.jfif', title: 'Trigger' }
  ];
  wildlifeCards: Card[] = [
    { image: 'assets/images/w1.jpg', title: 'Someshwara' },
    { image: 'assets/images/w2.jpg', title: 'Mookambika Wildlife' },
    { image: 'assets/images/w3.jfif', title: 'udupi goshale' },
    { image: 'assets/images/w4.jfif', title: 'Neelavara goshale' },
    { image: 'assets/images/w5.jfif', title: 'Kunjargiri' },
    { image: 'assets/images/w6.jpg', title: 'Kaup beach' },
    { image: 'assets/images/w7.jpg', title: 'Sharavathi' },
    { image: 'assets/images/w8.jpg', title: 'Shettihalli' },
    { image: 'assets/images/w9.jpg', title: 'Muthodi' },
    { image: 'assets/images/w10.jpg', title: 'Malyadi' }
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
