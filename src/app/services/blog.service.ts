import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import  {Blog}  from 'src/app/models/blog';  

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private blogsUrl = 'assets/data/blogs.json';

  constructor(private http: HttpClient) { }

  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.blogsUrl);
  }

  getBlogById(id: number): Observable<Blog | undefined> {
    return this.getBlogs().pipe(
      map(blogs => blogs.find(blog => blog.id === id))
    );
  }
}
