import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Story } from 'src/app/models/story';
import { Environment } from '../../constants/routes';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  private readonly apiUrl = `${Environment.production}${Environment.routes.storyData}`;
  constructor(private http: HttpClient) { }

  getAllStories(): Observable<Story[]> {
    return this.http.get<Story[]>(this.apiUrl).pipe(map(items => items.map(item => this.withPhotoUrls(item))));
  }

  getStoryById(id: number): Observable<Story> {
    return this.http.get<Story>(`${this.apiUrl}/${id}`).pipe(map(item => this.withPhotoUrls(item)));
  }

  private withPhotoUrls(story:Story):Story {
    return {...story,images:(story.images || []).map(path=>path.startsWith('/v1/blogs/photos/')?Environment.production+path:path)};
  }

  addStory(story: Story): Observable<Story> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Story>(`${Environment.production}/v1/blogs/postBlogs`, story, { headers });
  }

  updateStory(id: number, story: Story): Observable<Story> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Story>(`${Environment.production}/v1/blogs/updateBlogs/${id}`, story, { headers });
  }

  deleteStory(id: number): Observable<void> {
    return this.http.delete<void>(`${Environment.production}/v1/blogs/deleteBlogs/${id}`);
  }
}
