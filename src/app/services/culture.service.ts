import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Details } from '../models/card';
import { API_BASE_URL } from 'src/constants/routes';

@Injectable({
  providedIn: 'root'
})
export class CultureService {

  private readonly resourceUrl = `${API_BASE_URL}/v1/culture`;
  private readonly apiUrl = `${this.resourceUrl}/getCulture`;

  constructor(private http: HttpClient) { }

  getAllCultures(): Observable<Details[]> {
    return this.http.get<Details[]>(this.apiUrl);
  }

  getCultureById(id: number): Observable<Details> {
    return this.http.get<Details>(`${this.resourceUrl}/${id}`);
  }

  addCulture(culture: Details): Observable<Details> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Details>(`${this.resourceUrl}/postCulture`, culture, { headers });
  }

  updateCulture(id: number, culture: Details): Observable<Details> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Details>(`${this.resourceUrl}/updateCulture/${id}`, culture, { headers });
  }

  deleteCulture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/deleteCulture/${id}`);
  }
}
