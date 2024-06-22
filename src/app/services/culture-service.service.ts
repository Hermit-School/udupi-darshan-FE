import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivityCards } from '../models/activityCards';
import { Environment, MockRoutes } from '../../constants/routes';
@Injectable({
  providedIn: 'root'
})

export class CultureService {

  constructor(private http: HttpClient) { }

  getCultureData() {
    return this.http.get<ActivityCards>(Environment.local + MockRoutes.getCultureData);
  }
}
