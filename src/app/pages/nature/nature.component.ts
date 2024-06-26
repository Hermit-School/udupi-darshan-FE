import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { natureServiceService } from 'src/app/services/nature.service';
import { Details } from 'src/app/models/card';


@Component({
  selector: 'app-nature',
  templateUrl: './nature.component.html',
  styleUrls: ['./nature.component.scss']
})

export class NatureComponent implements OnInit, OnDestroy {
  viewAllNature = false;
  viewAllWildlife = false;
  viewAllActivity = false;
  viewAllBeaches = false;

  allData : any = []

  visibleNatureCards: Details[] = [];
  visibleActivityCards: Details[] = [];
  visibleWildlifeCards: Details[] = [];
  visibleBeachCards: Details[] = [];

  constructor(private router: Router , private natureService : natureServiceService) {
  }

 ngOnInit() {
    this.loadData()

    window.addEventListener('resize', this.updateVisibleBestOfNatureCard.bind(this));
    window.addEventListener('resize', this.updateActivityList.bind(this));
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
    window.addEventListener('resize', this.updateBeachList.bind(this));
    window.addEventListener('resize', this.updateWildlifeList.bind(this));

  }

  loadData() {
    this.natureService.getData().subscribe(data => {
      this.allData = data;
      this.updateVisibleBestOfNatureCard();
      this.updateActivityList();
      this.updateBeachList();
      this.updateWildlifeList();
    })}


  ngOnDestroy() {
    window.removeEventListener('resize', this.updateVisibleBestOfNatureCard.bind(this));
    window.removeEventListener('resize', this.updateActivityList.bind(this));
    window.removeEventListener('resize',this.updateWildlifeList.bind(this));
    window.removeEventListener('resize',this.updateBeachList.bind(this));
  }

  updateVisibleBestOfNatureCard() {
    const isMobile = window.innerWidth < 1000;
    if (this.viewAllNature) {
      this.visibleNatureCards = this.allData.filter((_ : Details) => (_.subCategory == 'Best Of Nature'));
    } else {
      this.visibleNatureCards = this.allData.filter((_ : Details) => (_.subCategory == 'Best Of Nature')).slice(0, isMobile ? 2 : 4);
    }
  }

  toggleViewAllNature() {
    this.viewAllNature = !this.viewAllNature;
    this.updateVisibleBestOfNatureCard();
  }

  updateActivityList() {
    const isMobile = window.innerWidth < 1000;
    if (this.viewAllActivity) {
      this.visibleActivityCards = this.allData.filter((_ : Details) => (_.subCategory == 'Activity List'));
    } else {
      this.visibleActivityCards = this.allData.filter((_ : Details) => (_.subCategory == 'Activity List')).slice(0, isMobile ? 2 : 4);
    }
  }

  toggleViewActivity() {
    this.viewAllActivity = !this.viewAllActivity;
    this.updateActivityList();
  }

updateWildlifeList(){
  const isMobile=window.innerWidth<1000;
  if(this.viewAllWildlife){
    this.visibleWildlifeCards=this.allData.filter((_:Details)=>(_.subCategory=='Wildlife List'));
  }else{
    this.visibleWildlifeCards=this.allData.filter((_:Details)=>(_.subCategory=='Wildlife List')).slice(0,isMobile? 2:4);
  }
}
toggleViewAllWildlife(){
  this.viewAllWildlife=!this.viewAllWildlife;
  this.updateWildlifeList();
}

updateBeachList(): void {
    const isMobile = window.innerWidth < 1000;
    if (this.viewAllBeaches) {
      this.visibleBeachCards = this.allData.filter((item: any) => item.subCategory === 'Beach List');
    } else {
      this.visibleBeachCards = this.allData
        .filter((item: any) => item.subCategory === 'Beach List')
        .slice(0, isMobile ? 2 : 4);
    }
  }

  toggleViewAllBeaches(): void {
    this.viewAllBeaches = !this.viewAllBeaches;
    this.updateBeachList();
  }

goToDetails(id: number) {
    this.router.navigate(['/details/nature',id]);
  }
}
