import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoryService } from 'src/app/services/story.service';
import { Story } from 'src/app/models/story';

@Component({
  selector: 'app-story-details',
  templateUrl: './story-details.component.html',
  styleUrls: ['./story-details.component.scss']
})
export class StoryDetailsComponent implements OnInit {
  selectedImage: string | undefined;
  selectedIndex: number | null = null;
  story: Story | undefined;
  relatedImages: string[] = [];
  relatedContent: string[] = [];
  cards: any[] = [];
  constructor(private route: ActivatedRoute, private storyService: StoryService) { }
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      const storyId = +idParam;
      this.storyService.getStoryById(storyId).subscribe(story => {
        if (story) {
          this.story = story;
          this.relatedImages = story.relatedImages;
          this.relatedContent = story.relatedContent;
          this.cards = story.cards;
          if (this.relatedImages.length > 0) {
            this.selectedImage = this.relatedImages[0];
            this.selectedIndex = 0;
          }
        }
      });
    }
  }
  onImageClick(relatedImage: string, index: number) {
    this.selectedImage = relatedImage;
    this.selectedIndex = index;
  }
}
