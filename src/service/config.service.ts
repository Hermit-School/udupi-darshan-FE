import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface GlossDef {
  para: string;
  GlossSeeAlso: string[];
}

export interface GlossEntry {
  ID: string;
  SortAs: string;
  GlossTerm: string;
  Acronym: string;
  Abbrev: string;
  GlossDef: GlossDef;
  GlossSee: string;
}

export interface GlossList {
  GlossEntry: GlossEntry;
}

export interface GlossDiv {
  title: string;
  GlossList: GlossList;
}

export interface Glossary {
  title: string;
  GlossDiv: GlossDiv;
}

export interface Data {
  glossary: Glossary;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  configUrl = 'assets/data.json';
  
  constructor(private http: HttpClient) { }

  getConfig(): Observable<Data> {
    return this.http.get<Data>(this.configUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching configuration:', error);
          return throwError('Something went wrong while fetching configuration data.');
        })
      );
  }
}
