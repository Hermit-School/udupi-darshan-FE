// Path: src/app/fetchapi/fetchapi.component.ts

import { Component, OnInit } from '@angular/core';
import { ApicallService } from '../services/apicall.service';

@Component({
  selector: 'app-fetchapi',
  templateUrl: './fetchapi.component.html',
  //styleUrls: ['./fetchapi.component.scss']
})
export class FetchapiComponent implements OnInit {
  users: any[] = [];

  constructor(private apicallService: ApicallService) {}

  ngOnInit(): void {
    this.apicallService.getUsers().subscribe((data: any[]) => {
      this.users = data;
    });
  }
}
