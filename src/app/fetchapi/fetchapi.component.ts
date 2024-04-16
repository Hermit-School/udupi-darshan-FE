import { Component, OnInit } from '@angular/core';
import { ApicallService } from '../services/apicall.service';

@Component({
  selector: 'app-fetchapi',
  templateUrl: './fetchapi.component.html',
  styleUrls: ['./fetchapi.component.scss']
})
export class FetchapiComponent implements OnInit {
  users: any[] = [];

  constructor(private appService: ApicallService) {}

  ngOnInit(): void {
    this.appService.getUsers().subscribe((data: any[]) => {
      this.users = data;
    });
  }
}
