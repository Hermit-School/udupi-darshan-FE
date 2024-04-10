import { Component, OnInit } from '@angular/core';
import { DataService } from './data-service.service.';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dummyData: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dummyData = this.dataService.getDummyData();
  }
}
