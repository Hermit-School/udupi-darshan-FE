import { RelatedPhotosService } from 'src/app/services/related-photos.service';
import { VisitorMotionDirective } from 'src/app/directives/visitor-motion.directive';
import { CommonModule } from "@angular/common";
import { SharedService } from "src/app/services/shared.service";
import { Component, DestroyRef, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { StoryService } from "src/app/services/story.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Story } from "src/app/models/story";
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { namedRecord, nameSlug, storyNames, storyRoute } from '../../util/destination-route';

class StoryRouteRedirect {
  constructor(readonly segment: string, readonly story: Story) {}
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, VisitorMotionDirective],
  selector: "app-story-details",
  templateUrl: "./story-details.component.html",
  styleUrls: ["./story-details.component.scss"],
})
export class StoryDetailsComponent implements OnInit {
  story?: Story;
  loading = true;
  failed = false;
  private readonly destroyRef = inject(DestroyRef);
  selectedIndex: number = 0;

  constructor(
    private storyService: StoryService,
    private route: ActivatedRoute,
    private router: Router,
    readonly shared: SharedService,
    readonly relatedPhotos: RelatedPhotosService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.loading = true;
        this.failed = false;
        this.story = undefined;
        this.selectedIndex = 0;
        const segment = params.get('id') ?? '';
        const navigation = this.router.currentNavigation() ?? this.router.lastSuccessfulNavigation();
        const redirect = navigation?.extras.info;
        if (redirect instanceof StoryRouteRedirect && redirect.segment === segment) {
          return of({ story: redirect.story, route: null });
        }
        return this.loadStory(segment).pipe(catchError(() => of({ story: undefined, route: null })));
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(({ story, route }) => {
      this.story = story;
      this.loading = false;
      this.failed = !story;
      if (!story) return;

      this.shared.resolveRelatedLinks(story.dontMissThese);
      this.relatedPhotos.prepare(story.dontMissThese);
      if (route) {
        void this.router.navigate(route, {
          replaceUrl: true,
          queryParamsHandling: 'preserve',
          preserveFragment: true,
          info: new StoryRouteRedirect(route[1], story),
        });
      }
    });
  }

  private loadStory(segment: string): Observable<{ story: Story | undefined; route: string[] | null }> {
    if (!segment) return of({ story: undefined, route: null });
    if (/^\d+$/.test(segment)) {
      const id = Number(segment);
      if (!Number.isSafeInteger(id) || id <= 0) return of({ story: undefined, route: null });
      return this.storyService.getStoryById(id).pipe(
        switchMap(story => nameSlug(story.title)
          ? this.storyService.getAllStories().pipe(
              map(catalog => ({ story, route: storyRoute(story, catalog) })),
              catchError(() => of({ story, route: null })),
            )
          : of({ story, route: null })),
      );
    }
    return this.storyService.getAllStories().pipe(map(catalog => {
      const match = namedRecord(segment, storyNames(catalog));
      return { story: catalog.find(story => story.id === match?.id), route: null };
    }));
  }

  onImageClick(index: number): void {
    this.selectedIndex = index;
  }
}
