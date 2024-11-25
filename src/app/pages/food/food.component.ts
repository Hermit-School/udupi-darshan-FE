import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FoodService } from 'src/app/services/food.service';
import { Details } from 'src/app/models/card';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit, OnDestroy {
  viewAllBestOfFood = false;
  viewAllHotels = false;
  viewAllRestaurants = false;
  viewAllTeaSnacks = false;

  allData: Details[] = [];

  visibleBestOfFoodCards: Details[] = [];
  visibleHotelsCards: Details[] = [];
  visibleRestaurantsCards: Details[] = [];
  visibleTeaSnacksCards: Details[] = [];

  constructor(private router: Router, private foodService: FoodService) { }

  loadData(): void {
    this.foodService.getAllFoods().subscribe(data => {
      this.allData = data;
      this.updateVisibleBestOfFoodCards();
      this.updateHotelsList();
      this.updateRestaurantsList();
      this.updateTeaSnacksList();
    });
  }

  ngOnInit(): void {
    this.loadData();

    window.addEventListener('resize', this.updateLists.bind(this));
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.updateLists.bind(this));
  }

  updateLists(): void {
    this.updateVisibleBestOfFoodCards();
    this.updateHotelsList();
    this.updateRestaurantsList();
    this.updateTeaSnacksList();
  }

  updateVisibleBestOfFoodCards(): void {
    this.visibleBestOfFoodCards = this.allData.filter(card => card.label === 'Best of Food').slice(0, 4);
  }

  toggleViewAllBestOfFood(): void {
    this.viewAllBestOfFood = !this.viewAllBestOfFood;
    this.updateVisibleBestOfFoodCards();
  }

  updateHotelsList(): void {
    const isMobile = window.innerWidth < 1000;
    const allHotelsCards = this.allData.filter(card => card.label === 'Hotels');
    this.visibleHotelsCards = this.viewAllHotels ? allHotelsCards : allHotelsCards.slice(0, isMobile ? 2 : 4);
  }

  toggleViewAllHotels(): void {
    this.viewAllHotels = !this.viewAllHotels;
    this.updateHotelsList();
  }

  updateRestaurantsList(): void {
    const isMobile = window.innerWidth < 1000;
    const allRestaurantsCards = this.allData.filter(card => card.label === 'Restaurants');
    this.visibleRestaurantsCards = this.viewAllRestaurants ? allRestaurantsCards : allRestaurantsCards.slice(0, isMobile ? 2 : 4);
  }

  toggleViewAllRestaurants(): void {
    this.viewAllRestaurants = !this.viewAllRestaurants;
    this.updateRestaurantsList();
  }

  updateTeaSnacksList(): void {
    const isMobile = window.innerWidth < 1000;
    const allTeaSnacksCards = this.allData.filter(card => card.label === 'Tea & Snacks');
    this.visibleTeaSnacksCards = this.viewAllTeaSnacks ? allTeaSnacksCards : allTeaSnacksCards.slice(0, isMobile ? 2 : 4);
  }

  toggleViewAllTeaSnacks(): void {
    this.viewAllTeaSnacks = !this.viewAllTeaSnacks;
    this.updateTeaSnacksList();
  }

  goToDetails(id: number): void {
    this.router.navigate(['/details/food', id]);
  }
}
