import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AdminNewEntriesInterface } from 'src/app/models/adminnewentrydata';
import { AdminserviceService } from 'src/app/services/adminservice.service';

@Component({ standalone: false,
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.scss']
})
export class AdmindashboardComponent implements OnInit {

  adminNewEntryListData$: AdminNewEntriesInterface | undefined;

  constructor(private adminService: AdminserviceService, private auth: AuthService, private router: Router) {
    this.onLoadData();
   }
  signOut(): void {
    this.auth.logout().subscribe({ error: () => { /* Local session was already cleared. */ } });
    void this.router.navigate(['/admin']);
  }
  ngOnInit(): void {
  }
  onLoadData() {
    this.adminService.adminEntryData.subscribe((data) => {
      console.log(data);
      this.adminNewEntryListData$ = data;
    })
  }

}
