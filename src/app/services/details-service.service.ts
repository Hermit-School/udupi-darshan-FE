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



export class detailsService {

   data : details[] = [];
   
  constructor(private http: HttpClient) { }

  getNatureData() {
    return this.http.get<details[]>(Environment.local + MockRoutes.getNatureData);
  }

  getCultureData() {
    return this.http.get<details[]>(Environment.local + MockRoutes.geCultureData);
  }

}
