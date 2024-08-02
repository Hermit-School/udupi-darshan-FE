import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdvertisementsService {

  private jsonUrl = 'assets/data/advertisements.json';

  constructor(private http: HttpClient) { }

  getImages(): Observable<any[]> {
    return this.http.get<any[]>(this.jsonUrl);
  }
}
