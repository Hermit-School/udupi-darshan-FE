import { Component, Input, OnInit } from '@angular/core';
import { AdminNewEntriesInterface } from 'src/app/models/adminnewentrydata';


@Component({
  selector: 'app-dashboardrequesttable',
  templateUrl: './dashboardrequesttable.component.html',
  styleUrls: ['./dashboardrequesttable.component.scss']
})
export class DashboardrequesttableComponent implements OnInit {

  @Input() data: AdminNewEntriesInterface | undefined;
  constructor() { }

  ngOnInit(): void {
    console.log("Child component:", this.data);
  }

}
