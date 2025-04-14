import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboardnavbar',
  templateUrl: './dashboardnavbar.component.html',
  styleUrls: ['./dashboardnavbar.component.scss']
})
export class DashboardnavbarComponent implements OnInit {

  isDarkMode = false;

  ngOnInit() {
    // Load dark mode preference from localStorage
    const savedMode = localStorage.getItem('darkMode') === 'true';
    this.isDarkMode = savedMode;
    this.applyDarkMode();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.applyDarkMode();
  }

  applyDarkMode() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}