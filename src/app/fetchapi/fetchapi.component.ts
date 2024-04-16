import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs'; 
import { ApicallService } from '../services/apicall.service';

@Component({
  selector: 'app-fetchapi',
  templateUrl: './fetchapi.component.html',
  styleUrls: ['./fetchapi.component.scss']
})
export class FetchapiComponent implements OnInit {
  getUsers!: Observable<any[]>; 

  constructor(private appService: ApicallService) {}

  ngOnInit(): void {
    this.getUsers = this.appService.getUsers();
  }
}
