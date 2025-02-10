import { Component, OnInit, ViewChild } from '@angular/core';
import { DetailsComponent } from './pages/details/details.component';
import { SharedService } from './services/shared.service';
import { CultureService } from './services/culture.service';
import { FoodService } from './services/food.service';
import { natureServiceService } from './services/nature.service';
import { Details } from './models/card';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  @ViewChild(DetailsComponent) detailsComponent!: DetailsComponent;

  loading = true;

  constructor(private sharedService: SharedService,
    private natureService: natureServiceService,
    private cultureService: CultureService,
    private foodService: FoodService) { }

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 2800);
    const allData: Details[] = [];

    this.natureService.getAllNatures().subscribe((natureData) => {
      allData.push(...natureData);
      this.updateSharedService(allData);
    });

    this.cultureService.getAllCultures().subscribe((cultureData) => {
      allData.push(...cultureData);
      this.updateSharedService(allData);
    });

    this.foodService.getAllFoods().subscribe((foodData) => {
      allData.push(...foodData);
      this.updateSharedService(allData);
    });
  }

  private updateSharedService(data: Details[]): void {
    this.sharedService.setDetailsData([...data]);
  }
}
