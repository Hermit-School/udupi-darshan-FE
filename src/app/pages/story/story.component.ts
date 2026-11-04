import { VisitorMotionDirective } from 'src/app/directives/visitor-motion.directive';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Story } from 'src/app/models/story';
import { StoryService } from 'src/app/services/story.service';
import { Router, RouterLink } from '@angular/router';

@Component({ standalone: true, imports: [CommonModule, RouterLink, VisitorMotionDirective],
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  stories: Story[] = [];
  chunkedStories: Story[][] = [];

  private readonly destroyRef = inject(DestroyRef);
  loading = true;
  failed = false;

  constructor(private router: Router, private storyService: StoryService) { }

  ngOnInit(): void {
    this.fetchStories();
  }
  viewDetails(storyId: number): void {
    this.router.navigate(['/story', storyId]);
  }

  fetchStories(): void {
    this.storyService.getAllStories().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: data => { this.stories = data; this.chunkStories(); this.loading = false; },
      error: () => { this.failed = true; this.loading = false; },
    });
  }
  chunkStories(): void {
    const chunkSize = 4;
    this.chunkedStories = [];
    for (let i = 0; i < this.stories.length; i += chunkSize) {
      this.chunkedStories.push(this.stories.slice(i, i + chunkSize));
    }
  }
  getTruncatedContent(content: string, limit: number): string {
    return content.length > limit ? content.substring(0, limit) + '...' : content;
  }
}
