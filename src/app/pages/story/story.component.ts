import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Story } from 'src/app/models/story';
import { StoryService } from 'src/app/services/story.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  stories: Story[] = [];
  chunkedStories: Story[][] = [];

  constructor(private router: Router, private storyService: StoryService) { }

  ngOnInit(): void {
    this.fetchStories();
    this.storyService.getAllStories().subscribe((stories: Story[]) => {
      this.stories = stories;
    }
    );

  }
  viewDetails(storyId: number): void {
    this.router.navigate(['/story', storyId]);
  }

  fetchStories(): void {
    this.storyService.getAllStories().subscribe(data => {
      this.stories = data;
      this.stories = data;
      this.chunkStories();
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