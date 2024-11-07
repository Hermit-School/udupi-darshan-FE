import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CultureService } from 'src/app/services/culture.service';
import { Details } from 'src/app/models/card';

@Component({
  selector: 'app-culture',
  templateUrl: './culture.component.html',
  styleUrls: ['./culture.component.scss']
})
export class CultureComponent implements OnInit, OnDestroy {
  viewAllCulture = false;
  viewAllWildlife = false;
  viewAllActivity = false;
  viewAllBeaches = false;

  allData: Details[] = [];

  visibleCultureCards: Details[] = [];
  visibleActivityCards: Details[] = [];
  visibleWildlifeCards: Details[] = [];
  visibleBeachCards: Details[] = [];

  constructor(private router: Router, private cultureService: CultureService) { }

  loadData(): void {
    this.cultureService.getAllCultures().subscribe(data => {
      this.allData = data;
      this.updateVisibleCultureCards();
      this.updateActivityList();
      this.updateBeachList();
      this.updateWildlifeList();
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
    this.updateVisibleCultureCards();
    this.updateActivityList();
    this.updateBeachList();
    this.updateWildlifeList();
  }

  updateVisibleCultureCards(): void {
    this.visibleCultureCards = this.allData.filter(card => card.label === 'Rathotsavas').slice(0, 4);
  }

  toggleViewAll() {
    this.viewAllActivity = !this.viewAllActivity;
    this.updateActivityList();
  }

  updateActivityList(): void {
    const isMobile = window.innerWidth < 1000;
    const allActivityCards = this.allData.filter(card => card.label === 'Mathas');
    this.visibleActivityCards = this.viewAllActivity ? allActivityCards : allActivityCards.slice(0, isMobile ? 2 : 4);
  }

  toggleViewAllWildlife(): void {
    this.viewAllWildlife = !this.viewAllWildlife;
    this.updateWildlifeList();
  }

  updateWildlifeList(): void {
    const isMobile = window.innerWidth < 1000;
    const allWildlifeCards = this.allData.filter(card => card.label === 'Festivals');
    this.visibleWildlifeCards = this.viewAllWildlife ? allWildlifeCards : allWildlifeCards.slice(0, isMobile ? 2 : 4);
  }

  toggleViewAllBeaches(): void {
    this.viewAllBeaches = !this.viewAllBeaches;
    this.updateBeachList();
  }

  updateBeachList(): void {
    const isMobile = window.innerWidth < 1000;
    const allBeachCards = this.allData.filter(card => card.label === 'Beach list');
    this.visibleBeachCards = this.viewAllBeaches ? allBeachCards : allBeachCards.slice(0, isMobile ? 2 : 4);
  }

  goToDetails(id: number): void {
    this.router.navigate(['/details/culture', id]);
  }
}
