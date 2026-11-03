import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { API_BASE_URL } from 'src/constants/routes';
import { Component, OnInit } from '@angular/core';
import { AdvertisementsService } from 'src/app/services/advertisements.service';

@Component({ standalone: false,
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.scss']
})
export class AdvertisementsComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  publishedAds: { id: number; title: string; imageUrl: string; link?: string }[] = [];
  images: any[] = [];
  largeImage: any;
  smallImages: any[] = [];
  email:any;

  constructor(private imageService: AdvertisementsService) {
    this.email = 'Udupidarshan@gmail.com';
   }

  ngOnInit(): void {
    this.http.get<typeof this.publishedAds>(API_BASE_URL + '/v1/ads')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: ads => { this.publishedAds = ads; }, error: () => { /* Keep the existing gallery available. */ } });
    this.imageService.getImages().subscribe(data => {
      this.images = data;
      this.largeImage = this.images[4];
      this.smallImages = this.images.slice(5, 11);
    });
  }
}
