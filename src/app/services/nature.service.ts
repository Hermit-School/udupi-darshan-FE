import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Details } from '../models/card';
import { Environment } from 'src/constants/routes';

@Injectable({
  providedIn: 'root'
})
export class natureServiceService {

  private readonly apiUrl = `${Environment.production}${Environment.routes.natureData}`;

  constructor(private http: HttpClient) { }
  getAllNatures(): Observable<Details[]> {
    return this.http.get<Details[]>(this.apiUrl);
  }

  getNatureById(id: number): Observable<Details> {
    return this.http.get<Details>(`${this.apiUrl}/${id}`);
  }

  addNature(nature: Details): Observable<Details> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Details>(this.apiUrl, nature, { headers });
  }

  updateNature(id: number, nature: Details): Observable<Details> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Details>(`${this.apiUrl}/${id}`, nature, { headers });
  }

  deleteNature(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
