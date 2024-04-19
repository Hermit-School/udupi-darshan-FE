import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Config {
  heroesUrl: string;
  textfile: string;
  date: any;
}

@Injectable()
export class ConfigService {
  configUrl = 'assets/data.json';
  
  constructor(private http: HttpClient) { }

  getConfig(): Observable<Config> {
    return this.http.get<Config>(this.configUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching configuration:', error);
          return throwError('Something went wrong while fetching configuration data.');
        })
      );
  }
}
