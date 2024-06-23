import { Component, Input, OnInit } from '@angular/core';
import { AdminNewEntriesInterface } from 'src/app/models/adminnewentrydata';
import { SearchEntryService } from 'src/app/util/search.service';

@Component({
  selector: 'app-dashboardrequesttable',
  templateUrl: './dashboardrequesttable.component.html',
  styleUrls: ['./dashboardrequesttable.component.scss']
})
export class DashboardrequesttableComponent implements OnInit {

  @Input() data: AdminNewEntriesInterface | undefined;
  constructor(public service: SearchEntryService) { }

  ngOnInit(): void {
    console.log("Child component:", this.data);
  }

}
