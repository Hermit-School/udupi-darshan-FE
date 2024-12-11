import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Story } from 'src/app/models/story';
import { Environment } from '../../constants/routes';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  private readonly apiUrl = `${Environment.production}${Environment.routes.storyData}`;
  constructor(private http: HttpClient) { }

  getAllStories(): Observable<Story[]> {
    return this.http.get<Story[]>(this.apiUrl);
  }

  getStoryById(id: number): Observable<Story> {
    return this.http.get<Story>(`${this.apiUrl}/${id}`);
  }

  addStory(story: Story): Observable<Story> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Story>(this.apiUrl, story, { headers });
  }

  updateStory(id: number, story: Story): Observable<Story> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Story>(`${this.apiUrl}/${id}`, story, { headers });
  }

  deleteStory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
