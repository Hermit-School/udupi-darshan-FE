import { RelatedPhotosService } from 'src/app/services/related-photos.service';
import { VisitorMotionDirective } from 'src/app/directives/visitor-motion.directive';
import { CommonModule } from "@angular/common";
import { SharedService } from "src/app/services/shared.service";
import { Component, DestroyRef, OnInit, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { StoryService } from "src/app/services/story.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Story } from "src/app/models/story";

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, VisitorMotionDirective],
  selector: "app-story-details",
  templateUrl: "./story-details.component.html",
  styleUrls: ["./story-details.component.scss"],
})
export class StoryDetailsComponent implements OnInit {
  story!: Story;
  loading = true;
  failed = false;
  private readonly destroyRef = inject(DestroyRef);
  selectedIndex: number = 0;

  constructor(
    private storyService: StoryService,
    private route: ActivatedRoute,
    readonly shared: SharedService,
    readonly relatedPhotos: RelatedPhotosService,
  ) {}

  ngOnInit(): void {
    const storyId = this.route.snapshot.paramMap.get("id");
    if (storyId) {
      this.storyService
        .getStoryById(+storyId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data: Story) => {
            this.story = data;
            this.loading = false;
            this.shared.resolveRelatedLinks(data.dontMissThese);
            this.relatedPhotos.prepare(data.dontMissThese);
          },
          error: () => {
            this.loading = false;
            this.failed = true;
          },
        });
    } else {
      this.loading = false;
      this.failed = true;
    }
  }

  onImageClick(index: number): void {
    this.selectedIndex = index;
  }
}
