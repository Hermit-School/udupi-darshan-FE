import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../service/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  data: any;
  title = 'Udupi Darshan';
  showOutput = false; 

  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.configService.getConfig().subscribe((response) => {
      this.data = response;
    });
  }
  toggleOutput() {
    this.showOutput = !this.showOutput; // Toggle the value
  }
}
