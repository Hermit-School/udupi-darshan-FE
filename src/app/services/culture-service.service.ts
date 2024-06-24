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

export class CultureService {

   cultureData : details[] = [];
   
  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get<details[]>(Environment.local + MockRoutes.geCultureData);
  }

  getDataByCategory(category : string){
    return this.cultureData.filter((item)=>{
      return item.category == category;
    })
  }


  getDataById(id : number){
    return this.cultureData.filter((item)=>{
      return item.id == id;
    })[0]
  }
}
