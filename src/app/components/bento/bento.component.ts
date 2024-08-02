import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-bento',
  templateUrl: './bento.component.html',
  styleUrls: ['./bento.component.scss'],
})

export class BentoComponent implements OnInit{
  cards = [
    { id: 34, imgSrc: 'assets/images/udupi2.jpg', text: 'Krishna Matt' },
    { id: 35, imgSrc: 'assets/images/b3.jpg', text: 'Ananteshwara temple' },
    { id: 36, imgSrc: 'assets/images/b4.jpg', text: 'Hasta Heritage' },
    { id: 37, imgSrc: 'assets/images/b5.jpg', text: 'Hasta Shilpa Heritage', imgClass: 'card-img-top1' },
    { id: 38, imgSrc: 'assets/images/b6.png', text: 'Corporation Bank Heritage Museum', largeCard: true, imgClass: 'bordered-img' }
  ];
  constructor(){}
  ngOnInit(): void {
    
  }
  
}