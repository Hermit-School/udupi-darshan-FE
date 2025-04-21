import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs';
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

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta, private sharedService: SharedService,
    private natureService: natureServiceService,
    private cultureService: CultureService,
    private foodService: FoodService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 2800);
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child?.firstChild) {
            child = child.firstChild;
          }
          return child?.snapshot.data;
        })
      )
      .subscribe(data => {
        if (data?.['title']) {
          this.titleService.setTitle(data['title']);
        }
        if (data?.['metaDescription']) {
          this.metaService.updateTag({ name: 'description', content: data['metaDescription'] });
        }
      });

    const allData: Details[] = [];
  }

  private updateSharedService(data: Details[]): void {
    this.sharedService.setDetailsData([...data]);
  }
}
