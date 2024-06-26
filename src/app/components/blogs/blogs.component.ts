import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service';
import  {Blog}  from 'src/app/models/blog';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss'],
})
export class BlogsComponent implements OnInit {
  blogs: Blog[] = [];

  constructor(private router: Router, private blogService: BlogService) { }

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe((blogs: Blog[]) => {
      this.blogs = blogs;
    });
  }

  viewDetails(blogId: number): void {
    this.router.navigate(['/story', blogId]);
  }
}
