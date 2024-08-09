import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BentoService {

  constructor() { }
  getCards(): Observable<any[]> {
    const cards = [
      { id: 34, imgSrc: 'assets/images/udupi2.jpg', text: 'Krishna Matt' },
      { id: 35, imgSrc: 'assets/images/b3.jpg', text: 'Ananteshwara temple' },
      { id: 36, imgSrc: 'assets/images/b4.jpg', text: 'Hasta Heritage' },
      { id: 37, imgSrc: 'assets/images/b5.jpg', text: 'Hasta Shilpa Heritage', imgClass: 'card-img-top1' },
      { id: 38, imgSrc: 'assets/images/b6.png', text: 'Corporation Bank Heritage Museum',largeCard: true, imgClass: 'card custom-large-card bordered-img' }
    ];
    
    return of(cards); 
  }
  
}
