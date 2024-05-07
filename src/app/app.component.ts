import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedSection: string;

  constructor() {
    // Initialize selectedSection to an empty string
    this.selectedSection = '';
  }

  showCarousel(section: string) {
    this.selectedSection = section;
  }
}
