import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogsComponent } from 'src/app/components/blogs/blogs.component';
@Component({
  selector: 'app-story-details',
  templateUrl: './story-details.component.html',
  styleUrls: ['./story-details.component.scss'],
  providers: [BlogsComponent]
})
export class StoryDetailsComponent implements OnInit {
  blog: any;
  relatedImages: string[] = [];
  relatedContent: string[] = [];
  cards: any[] = [];

  constructor(private route: ActivatedRoute, private blogsComponent: BlogsComponent) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      const blogId = +idParam;
      this.blog = this.blogsComponent.blogs.find(blog => blog.id === blogId);
      if (this.blog) {
        this.relatedImages = this.blog.relatedImages;
        this.relatedContent = this.blog.relatedContent;
        this.cards=this.blog.cards;
      }
    }
  }
}