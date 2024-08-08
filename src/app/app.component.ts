import { Component, OnInit ,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { DetailsComponent } from './pages/details/details.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(DetailsComponent) detailsComponent!: DetailsComponent;

  loading = true;

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 2800);
  }             
}
