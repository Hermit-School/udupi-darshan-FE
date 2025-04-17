import { Component, OnInit } from '@angular/core';
import { AdvertisementsService } from 'src/app/services/advertisements.service'; 

@Component({
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.scss']
})
export class AdvertisementsComponent implements OnInit {
  images: any[] = [];
  largeImage: any;
  smallImages: any[] = [];
  email:any;

  constructor(private imageService: AdvertisementsService) {
    this.email = 'Udupidarshan@gmail.com';
   }

  ngOnInit(): void {
    this.imageService.getImages().subscribe(data => {
      this.images = data;
      this.largeImage = this.images[4]; 
      this.smallImages = this.images.slice(5, 11); 
    });
  }
}
