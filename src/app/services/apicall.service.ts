// Path: src/app/services/apicall.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Config{
  heroesUrl:string;
  textfile:string;
  date:any;
}

@Injectable()
export class ApicallService {

  configUrl='assets.data.json';

  constructor(private http: HttpClient) { }

  getConfig(): Observable<Config> {
    return this.http.get<Config>(this.configUrl)
    .pipe(
      catchError(error=>{
        console.error('Error fetching configuration:',error);
        return throwError('something went wrong while fetching');
        
      })
      );
  
  }
}
