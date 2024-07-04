import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import  {Story}  from  'src/app/models/story';  

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private jsonUrl = 'assets/data/story.json';

  constructor(private http: HttpClient) { }

  getStories(): Observable<Story[]> {
    return this.http.get<Story[]>(this.jsonUrl);
  }
  getStoryById(id: number): Observable<Story | undefined> {
    return this.getStories().pipe(
      map(blogs => blogs.find(story => story.id === id))
    );
  }
}

