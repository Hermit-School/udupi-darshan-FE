import { Component, OnInit } from '@angular/core';
import { ApicallService } from '../../services/apicall.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data: any;

  constructor(private apicallService: ApicallService) { } // Adjust the service name

  ngOnInit(): void {
    this.apicallService.getUsers().subscribe((data: any) => { // Call the correct service method
      this.data = data;
    });
  }
}
