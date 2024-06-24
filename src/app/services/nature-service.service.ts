import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment, MockRoutes } from 'src/constants/routes';

export interface details {
  id : number;
  title : string;
  category : string;
  subCategory : string;
  thumbnail : string;
  images : string[];
  desc : string;
  tips : string[];
  best_time_to_visit : string;
  how_to_visit : how_to_visit;
} 

interface how_to_visit {
by_car : string;
by_public : string;
by_bike :string;
}

@Injectable({
  providedIn: 'root'
})

export class natureServiceService {

   natureData : details[] = [];
   
  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get<any[]>(Environment.local + MockRoutes.getNatureData);
  }
}
