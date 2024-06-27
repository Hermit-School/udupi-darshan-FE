import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment, MockRoutes } from 'src/constants/routes';
import { Details } from '../models/card';
@Injectable({
  providedIn: 'root'
})

export class natureServiceService {

   natureData : Details[] = [];
   
  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get<any[]>(Environment.local + MockRoutes.getNatureData);
  }
}