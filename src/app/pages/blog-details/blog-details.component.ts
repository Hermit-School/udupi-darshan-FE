import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service'; 
import  {Blog} from 'src/app/models/blog';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {
  blog: Blog | undefined;
  relatedImages: string[] = [];
  relatedContent: string[] = [];
  cards: any[] = [];

  constructor(private route: ActivatedRoute, private blogService: BlogService) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      const blogId = +idParam;
      this.blogService.getBlogById(blogId).subscribe(blog => {
        if (blog) {
          this.blog = blog;
          this.relatedImages = blog.relatedImages;
          this.relatedContent = blog.relatedContent;
          this.cards = blog.cards;
        } else {
          console.error(`Blog with id ${blogId} not found`);
        }
      });
    }
  }
}
