import { Component, Input, OnInit } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminNewEntriesInterface } from 'src/app/models/adminnewentrydata';


@Component({
  selector: 'app-dashboardrequesttable',
  templateUrl: './dashboardrequesttable.component.html',
  styleUrls: ['./dashboardrequesttable.component.scss']
})
export class DashboardrequesttableComponent implements OnInit {

  @Input() data: any = [];
  adminNewEntryListData: any = [];


  searchTerm: string = '';
  page = 1;
  pageSize = 4;
  collectionSize: number = 100;
  currentRate = 4;

  constructor() { 

  }

  ngOnInit(): void {

    console.log("Child component:", this.data);
    this.adminNewEntryListData = this.data;
    this.collectionSize = this.data.length;
    console.log("Entry data child",this.adminNewEntryListData);
    this.adminNewEntryListData.forEach((element: any) => {
      console.log(element.postedtime);
    })
  }

  search(event: any): void {
    const searchFilter = event.target?.value;
    console.log("Search Parameter", searchFilter);
    this.adminNewEntryListData = this.data.filter((val: { name: string; }) =>
      val.name.toLowerCase().includes(searchFilter)
    );
    console.log("Search Result:", this.adminNewEntryListData);
    this.collectionSize = this.data.length;
  }

  unixTimestampToDate(unixTimestamp: number): string {
    // Convert Unix timestamp to milliseconds (if it's in seconds, multiply by 1000)
    let timestampInMilliseconds = unixTimestamp * 1000;

    // Create a new JavaScript Date object based on the timestamp
    let date = new Date(timestampInMilliseconds);

    // Format the date using Intl.DateTimeFormat (optional)
    let formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);

    return formattedDate;
}
}
