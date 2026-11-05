import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DashboardStatisticsComponent } from '../../components/dashboard-statistics/dashboard-statistics.component';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [RouterLink, DashboardStatisticsComponent],
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.scss'],
})
export class AdmindashboardComponent {
  readonly sections = [
    { title: 'Nature', icon: 'tree', path: '/new-entry/nature', description: 'Beaches, trails, and scenic places.' },
    { title: 'Culture', icon: 'bank', path: '/new-entry/culture', description: 'Temples, traditions, and heritage.' },
    { title: 'Food', icon: 'cup-hot', path: '/new-entry/food', description: 'Local dishes, cafés, and restaurants.' },
    { title: 'Stories', icon: 'journal-text', path: '/new-entry/story', description: 'Publish a story about Udupi.' },
    {title:'Events',icon:'calendar-event',path:'/new-entry/events',description:'Community gatherings and dates around Udupi.'},
    { title: 'Ads', icon: 'megaphone', path: '/new-entry/ads', description: 'Add an ad image and an optional website link.' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  signOut(): void {
    this.auth.logout().subscribe({ error: () => { /* Local session was already cleared. */ } });
    void this.router.navigate(['/admin']);
  }
}
