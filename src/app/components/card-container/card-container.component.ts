import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.scss']
})
export class CardContainerComponent implements OnInit {
  cards: any[] = [
    {
      imageUrl: 'assets/images/c1.jpg',
      alt: 'Card 1',
      title: 'LIGHT HOUSE',
      description: 'Come experience the serene beauty of Kaup from the top of the lighthouse.'
    },
    {
      imageUrl: 'assets/images/c2.jpg',
      alt: 'Card 2',
      title: 'MURUDESHWARA',
      description: 'The heart of Udupi.'
    },
    {
      imageUrl: 'assets/images/c3.jpg',
      alt: 'Card 3',
      title: 'St.MARYs Island',
      description: 'Come experience peace.'
    },
    {
      imageUrl: 'assets/images/b4.jpg',
      alt: 'Card 4',
      title: 'HASTA HERITAGE',
      description: 'Showcasing Udupi\'s rich heritage.'
    },
    {
      imageUrl: 'assets/images/c5.jpg',
      alt: 'Card 5',
      title: 'ANANTHESHWARA TEMPLE',
      description: 'Udupi\'s vast and beautiful heritage place.'
    },
    {
      imageUrl: 'assets/images/c6.jpg',
      alt: 'Card 6',
      title: 'CHURCH',
      description: 'Museum enthusiasts, this is the place for you.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Slice the cards array to display only the first 7 cards
    this.cards = this.cards.slice(0, 6);
  }

}
