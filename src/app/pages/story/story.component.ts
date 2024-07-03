import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Story } from 'src/app/models/story';
import { StoryService } from 'src/app/services/story.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  stories: Story[] = [];
  chunkedStories: Story[][] = [];

  constructor(private storyService: StoryService) { }

  ngOnInit(): void {
    this.fetchStories();
  }

  fetchStories(): void {
    this.storyService.getStories().subscribe(data => {
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
}