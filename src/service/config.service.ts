import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/';
import { Config } from './config.interface';
//import 'rxjs/add/operator/catch';

@Injectable()
export class ConfigService {
  private configUrl = 'assets/config.json';

  constructor(private http: HttpClient) {}

  getConfig(): Observable<Config[]> {
    return this.http.get<Config[]>(this.configUrl);
  }
}


