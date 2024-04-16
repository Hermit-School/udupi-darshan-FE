import { Component, OnInit } from '@angular/core';
import { ApicallService } from '../../services/apicall.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  users: any[] = []; // Initialize users as an empty array

  constructor(private dataService: ApicallService) { }

  ngOnInit(): void {
    this.dataService.getUsers().subscribe((data: any[]) => {
      console.log(data); // Log the received data to the console for inspection
      this.users = data;
    });
  }
}
