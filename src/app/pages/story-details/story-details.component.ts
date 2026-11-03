import { CommonModule } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StoryService } from 'src/app/services/story.service';
import { Story } from 'src/app/models/story';

@Component({ standalone: true, imports: [CommonModule, RouterLink],
  selector: 'app-story-details',
  templateUrl: './story-details.component.html',
  styleUrls: ['./story-details.component.scss']
})
export class StoryDetailsComponent implements OnInit {
  story!: Story;
  selectedIndex: number = 0;

  constructor(private storyService: StoryService, private route: ActivatedRoute, readonly shared: SharedService) { }

  ngOnInit(): void {
    const storyId = this.route.snapshot.paramMap.get('id');
    if (storyId) {
      this.storyService.getStoryById(+storyId).subscribe((data: Story) => {
        this.story = data;
        this.shared.resolveRelatedLinks(data.dontMissThese);
      });
    }
  }

  onImageClick(index: number): void {
    this.selectedIndex = index;
  }
}
