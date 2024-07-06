import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Details } from '../models/card';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CultureService {
  private jsonUrl = 'assets/data/culture.json';
  constructor(private http: HttpClient) { }

  getData(): Observable<Details[]> {
    return this.http.get<Details[]>(this.jsonUrl);
  }
}
