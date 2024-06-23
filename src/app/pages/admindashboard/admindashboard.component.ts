import { Component, OnInit } from '@angular/core';
import { AdminNewEntriesInterface } from 'src/app/models/adminnewentrydata';
import { AdminserviceService } from 'src/app/services/adminservice.service';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.scss']
})
export class AdmindashboardComponent implements OnInit {

  adminNewEntryListData: AdminNewEntriesInterface | undefined;
  flag = true;

  constructor(private adminService: AdminserviceService) {
    this.onLoadData();
   }

  ngOnInit(): void {
  }
  onLoadData() {
    this.adminService.adminEntryData.subscribe((data) => {
      console.log(data);
      this.adminNewEntryListData = data;
    })
  }

}
