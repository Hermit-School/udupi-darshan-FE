import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
// import Card from 'src/app/models/card';
import { CultureService } from 'src/app/services/culture.service';
import { Details } from 'src/app/models/card';

@Component({
  selector: 'app-culture',
  templateUrl: './culture.component.html',
  styleUrls: ['./culture.component.scss']
})
export class CultureComponent implements OnInit,OnDestroy{
  viewAllCulture = false;
  viewAllWildlife = false;
  viewAllActivity=false;
  viewAllBeaches = false;

  allData:any=[]
 
  visibleCultureCards:Details[]=[];
  visibleActivityCards: Details[] = [];
  visibleWildlifeCards: Details[] = [];
  visibleBeachCards: Details[] = [];
  
  constructor(private router:Router,private cultureService:CultureService){
  }

  loadData() {
    this.cultureService.getData().subscribe(data => {
      this.allData = data;
      this.updateVisibleBestOfCultureCard();
      this.updateActivityList();
      this.updateBeachList();
      this.updateWildlifeList();
    })}

  ngOnInit() {
    this.loadData()
  
    window.addEventListener('resize', this.updateVisibleBestOfCultureCard.bind(this));
    window.addEventListener('resize', this.updateActivityList.bind(this));
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
    window.addEventListener('resize', this.updateBeachList.bind(this));
    window.addEventListener('resize', this.updateWildlifeList.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize',this.updateBeachList.bind(this));
    window.removeEventListener('resize', this.updateActivityList.bind(this));
    window.removeEventListener('resize', this.updateWildlifeList.bind(this));
    window.removeEventListener('resize', this.updateBeachList.bind(this));
  }
  
  updateVisibleBestOfCultureCard(){
  
    this.visibleCultureCards=this.allData.filter((_:Details)=>(_.subCategory=='Rathotsavas')).slice(0,  4);
  }

  toggleViewAll() {
    this.viewAllActivity = !this.viewAllActivity;
    this.updateActivityList();
  }
updateActivityList() {
    const isMobile = window.innerWidth < 1000; 
    if (this.viewAllActivity) {
      this.visibleActivityCards = this.allData.filter((_:Details)=>(_.subCategory=='Mathas'));
    } else {
      this.visibleActivityCards = this.allData.filter((_:Details)=>(_.subCategory=='Mathas')).slice(0, isMobile ? 2 : 4);
    }
  }
toggleViewAllWildlife() {
    this.viewAllWildlife = !this.viewAllWildlife;
    this.updateWildlifeList();
  }

  updateWildlifeList() {
    const isMobile = window.innerWidth < 1000; 
    if (this.viewAllWildlife) {
      this.visibleWildlifeCards = this.allData.filter((_:Details)=>(_.subCategory=='Festivals'));
    } else {
      this.visibleWildlifeCards = this.allData.filter((_:Details)=>(_.subCategory=='Festivals')).slice(0, isMobile ? 2 : 4);
    }
  }
 toggleViewAllBeaches():void {
    this.viewAllBeaches = !this.viewAllBeaches;
    this.updateBeachList();
  }
  updateBeachList():void {
    const isMobile = window.innerWidth < 1000; 
    if (this.viewAllBeaches) {
      this.visibleBeachCards = this.allData.filter((item:any)=>item.subCategory==='Beach List');
    } else {
      this.visibleBeachCards = this.allData.filter((item:any)=>item.subCategory==='Beach List').slice(0, isMobile ? 2 : 4);
    }
  }
goToDetails(id: number) {
    this.router.navigate(['/details/culture',id]);
  }
}