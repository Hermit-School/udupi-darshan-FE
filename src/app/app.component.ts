import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    private metaService: Meta
  ) { }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
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

  }
}
