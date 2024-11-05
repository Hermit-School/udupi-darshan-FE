import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Details } from '../models/card';

@Injectable({
  providedIn: 'root'
})
export class CultureService {

  private apiUrl = 'http://localhost:8080/api/culture/getdata';

  constructor(private http: HttpClient) { }
  getAllCultures(): Observable<Details[]> {
    return this.http.get<Details[]>(this.apiUrl);
  }

  getCultureById(id: number): Observable<Details> {
    return this.http.get<Details>(`${this.apiUrl}/${id}`);
  }

  addCulture(culture: Details): Observable<Details> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Details>(this.apiUrl, culture, { headers });
  }

  updateCulture(id: number, culture: Details): Observable<Details> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Details>(`${this.apiUrl}/${id}`, culture, { headers });
  }

  deleteCulture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
