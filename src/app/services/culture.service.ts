import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment, MockRoutes } from 'src/constants/routes';
import { Details } from 'src/app/models/card';

@Injectable({
  providedIn: 'root'
})

export class CultureService {

   cultureData : Details[] = [];
   
  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get<Details[]>(Environment.local + MockRoutes.geCultureData);
  }
}
