import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Card } from 'src/app/models/food';
@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit, OnDestroy {
  viewAllHotel = false;
  viewAllRestaurants = false;
  viewAllTeaPoints = false;
  hotelCards: Card[] = [];
  restaurantCards: Card[] = [];
  teaPointCards: Card[] = [];
  visibleHotelCards: Card[] = [];
  visibleRestaurantCards: Card[] = [];
  visibleTeaPointCards: Card[] = [];
  private dataSubscription: Subscription | undefined;
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.dataSubscription = this.http.get<any>('assets/data/food.json').subscribe(data => {
      this.hotelCards = data.hotelCards;
      this.restaurantCards = data.restaurantCards;
      this.teaPointCards = data.teaPointCards;
      this.updateVisibleHotelCards();
      this.updateVisibleRestaurantCards();
      this.updateVisibleTeaPointCards();
    });
    window.addEventListener('resize', this.updateVisibleHotelCards.bind(this));
    window.addEventListener('resize', this.updateVisibleRestaurantCards.bind(this));
    window.addEventListener('resize', this.updateVisibleTeaPointCards.bind(this));
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
  }
  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    window.removeEventListener('resize', this.updateVisibleHotelCards.bind(this));
    window.removeEventListener('resize', this.updateVisibleRestaurantCards.bind(this));
    window.removeEventListener('resize', this.updateVisibleTeaPointCards.bind(this));
  }
  toggleViewAll() {
    this.viewAllHotel = !this.viewAllHotel;
    this.updateVisibleHotelCards();
  }
  updateVisibleHotelCards() {
    const isMobile = window.innerWidth < 1000;
    if (this.viewAllHotel) {
      this.visibleHotelCards = this.hotelCards;
    } else {
      this.visibleHotelCards = this.hotelCards.slice(0, isMobile ? 2 : 4);
    }
  }
  toggleViewAllRestaurants() {
    this.viewAllRestaurants = !this.viewAllRestaurants;
    this.updateVisibleRestaurantCards();
  }
  updateVisibleRestaurantCards() {
    const isMobile = window.innerWidth < 1000;
    if (this.viewAllRestaurants) {
      this.visibleRestaurantCards = this.restaurantCards;
    } else {
      this.visibleRestaurantCards = this.restaurantCards.slice(0, isMobile ? 2 : 4);
    }
  }
  toggleViewAllTeaPoints() {
    this.viewAllTeaPoints = !this.viewAllTeaPoints;
    this.updateVisibleTeaPointCards();
  }
  updateVisibleTeaPointCards() {
    const isMobile = window.innerWidth < 1000;
    if (this.viewAllTeaPoints) {
      this.visibleTeaPointCards = this.teaPointCards;
    } else {
      this.visibleTeaPointCards = this.teaPointCards.slice(0, isMobile ? 2 : 4);
    }
  }
}
