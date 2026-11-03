import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter, map, forkJoin, of, catchError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SharedService } from './services/shared.service';
import { CultureService } from './services/culture.service';
import { FoodService } from './services/food.service';
import { natureServiceService } from './services/nature.service';
import { Details } from './models/card';

@Component({ standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  hidePublicChrome = false;

  private readonly destroyRef = inject(DestroyRef);

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta, private sharedService: SharedService,
    private natureService: natureServiceService,
    private cultureService: CultureService,
    private foodService: FoodService
  ) { }

  ngOnInit() {
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
        this.hidePublicChrome = data?.['hidePublicChrome'] === true;
        if (data?.['title']) {
          this.titleService.setTitle(data['title']);
        }
        if (data?.['metaDescription']) {
          this.metaService.updateTag({ name: 'description', content: data['metaDescription'] });
        }
      });

    forkJoin([
      this.natureService.getAllNatures().pipe(catchError(() => of([]))),
      this.cultureService.getAllCultures().pipe(catchError(() => of([]))),
      this.foodService.getAllFoods().pipe(catchError(() => of([])))
    ]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(groups => {
      this.sharedService.setDetailsData(groups.flat());
    });
  }

  private updateSharedService(data: Details[]): void {
    this.sharedService.setDetailsData([...data]);
  }
}
