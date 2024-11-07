import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminNewEntriesInterface } from '../models/adminnewentrydata';
import { MockRoutes, Environment } from '../../constants/routes';

@Injectable({
  providedIn: 'root'
})
export class AdminserviceService {

  constructor(private http: HttpClient) { }

  get adminEntryData() {
    return this.http.get<AdminNewEntriesInterface>(Environment.local + MockRoutes.getAdminEntryData);
  }

  sendOtp() {
    return this.http.get<any>(`${Environment.production}${MockRoutes.generateOtp}`);
  }
}
