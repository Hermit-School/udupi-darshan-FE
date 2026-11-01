import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Details } from '../models/card';
import { API_BASE_URL } from 'src/constants/routes';

@Injectable({
  providedIn: 'root'
})
export class natureServiceService {

  private readonly resourceUrl = `${API_BASE_URL}/v1/nature`;
  private readonly apiUrl = `${this.resourceUrl}/getNature`;

  constructor(private http: HttpClient) { }
  getAllNatures(): Observable<Details[]> {
    return this.http.get<Details[]>(this.apiUrl);
  }

  getNatureById(id: number): Observable<Details> {
    return this.http.get<Details>(`${this.resourceUrl}/${id}`);
  }

  addNature(nature: Details): Observable<Details> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Details>(`${this.resourceUrl}/postNature`, nature, { headers });
  }

  updateNature(id: number, nature: Details): Observable<Details> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Details>(`${this.resourceUrl}/updateNature/${id}`, nature, { headers });
  }

  deleteNature(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/deleteNature/${id}`);
  }
}
