import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule

interface Card {
  image: string[];
  title: string;
  id: number;
  // description: string; // Add a description property
}


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  card: Card | null = null;
  currentSlideIndex: number = 0;


  activityCards: Card[] = [
    { image: ['assets/images/a1.jpeg','assets/images/b1.jpeg','assets/images/b1-2.webp'], title: 'Hoode Kayakking', id: 1 },
    { image: ['assets/images/a2.jpg','assets/images/a2.jpg','assets/images/a2.jpg'],title: 'Hanging bridge', id: 2 },
    { image: ['assets/images/a3.jpg','assets/images/a3.jpg','assets/images/a3.jpg'], title: 'Malpe Sea Walk', id: 3 },
    { image: ['assets/images/a4.jpg','assets/images/a4.jpg','assets/images/a4.jpg'], title: 'Malpe Floating Bridge', id: 4},
    { image: ['assets/images/a5.jpg','assets/images/a5.jpg','assets/images/a5.jpg'], title: 'Kaup Light House', id: 5},
    { image: ['assets/images/a6.jpg','assets/images/a6.jpg','assets/images/a6.jpg'], title: 'Kudlu Falls', id: 6},
    { image: ['assets/images/a7.jpg','assets/images/a7.jpg','assets/images/a7.jpg'], title: 'Manipal Lake', id: 7 },
    { image: ['assets/images/a7.jpg','assets/images/a7.jpg','assets/images/a7.jpg'], title: 'Manipal Lake', id: 7 },
    { image: ['assets/images/a8.jfif','assets/images/a8.jfif','assets/images/a8.jfif'], title: 'Ajjarkad Badminton Court', id: 8 },
    { image: ['assets/images/a9.jpg','assets/images/a9.jpg','assets/images/a9.jpg'], title: 'Tree Park', id: 9 },
    { image: ['assets/images/a10.jfif','assets/images/a10.jfif','assets/images/a10.jfif'], title: 'Trigger', id: 10 },
    { image: ['assets/images/matha0.jpg','assets/images/matha0.jpg','assets/images/matha0.jpg'], title: 'Palimaru Matha',id: 31 },
    { image: ['assets/images/matha1.jpg','assets/images/matha1.jpg','assets/images/matha1.jpg'], title: 'Krishnapura Matha',id: 32},
    { image: ['assets/images/udupi3.jpg','assets/images/udupi3.jpg','assets/images/udupi3.jpg'], title: 'Shiroor Matha' ,id: 33},
    { image: ['assets/images/matha3.jpg','assets/images/matha3.jpg','assets/images/matha3.jpg'], title: 'Sode Matha',id: 34 },
    { image: ['assets/images/matha5.jpeg','assets/images/matha5.jpeg','assets/images/matha5.jpeg'], title: 'Pejavara Matha',id: 35 },
    { image: ['assets/images/matha5.jpeg','assets/images/matha5.jpeg','assets/images/matha5.jpeg'], title: 'Puttige Matha',id: 36 },
    { image: ['assets/images/matha0.jpg','assets/images/matha0.jpg','assets/images/matha0.jpg'], title: 'Kaniyur Matha' ,id: 37},
    { image: ['assets/images/matha1.jpg','assets/images/matha1.jpg','assets/images/matha1.jpg'], title: 'Adamaru Matha',id: 38},
    { image: ['assets/images/matha1.jpg','assets/images/matha1.jpg','assets/images/matha1.jpg'], title: 'Adamaru Matha',id: 38},
    { image: ['assets/images/matha0.jpg','assets/images/matha0.jpg','assets/images/matha0.jpg'], title: 'Krishna Matha' ,id: 39},
    { image: ['assets/images/matha1.jpg','assets/images/matha1.jpg','assets/images/matha1.jpg'], title: 'kanakana kindi',id: 40 }
    
  ];

  wildlifeCards: Card[] = [
    { image: ['assets/images/w1.jpg','assets/images/w1.jpg','assets/images/w1.jpg'], title: 'Someshwara', id: 11 },
    { image: ['assets/images/w2.jpg','assets/images/w2.jpg','assets/images/w2.jpg'], title: 'Mookambika Wildlife', id: 12 },
    { image: ['assets/images/w3.jfif','assets/images/w3.jfif','assets/images/w3.jfif'], title: 'Udupi Goshale', id: 13 },
    { image: ['assets/images/w4.jfif','assets/images/w4.jfif','assets/images/w4.jfif'], title: 'Neelavara Goshale', id: 14 },
    { image: ['assets/images/w5.jfif','assets/images/w5.jfif','assets/images/w5.jfif'], title: 'Kunjargiri', id: 15 },
    { image: ['assets/images/w6.jpg','assets/images/w6.jpg','assets/images/w6.jpg'], title: 'Kaup Beach', id: 16 },
    { image: ['assets/images/w7.jpg','assets/images/w7.jpg','assets/images/w7.jpg'], title: 'Sharavathi', id: 17 },
    { image: ['assets/images/w8.jpg','assets/images/w8.jpg','assets/images/w8.jpg'], title: 'Shettihalli', id: 18 },
    { image: ['assets/images/w9.jpg','assets/images/w9.jpg','assets/images/w9.jpg'], title: 'Muthodi', id: 19 },
    { image: ['assets/images/w10.jpg','assets/images/w10.jpg','assets/images/w10.jpg'], title: 'Malyadi', id: 20 },
    { image: ['assets/images/f1.jpg','assets/images/f1.jpg','assets/images/f1.jpg'], title: 'Ashtami',id: 41 },
    { image: ['assets/images/f1.jpg','assets/images/f1.jpg','assets/images/f1.jpg'], title: 'Ashtami',id: 41 },
    { image: ['assets/images/f1.jpg','assets/images/f1.jpg','assets/images/f1.jpg'], title: 'Ashtami',id: 41 },
    { image: ['assets/images/f1.jpg','assets/images/f1.jpg','assets/images/f1.jpg'], title: 'Ashtami',id: 41 },
    { image: ['assets/images/f2.jpg','assets/images/f2.jpg','assets/images/f2.jpg'], title: 'Holi',id: 42 },
    { image: ['assets/images/f3.jpg','assets/images/f3.jpg','assets/images/f3.jpg'], title: 'Paryaya',id: 43 },
    { image: ['assets/images/f4.webp','assets/images/f4.webp','assets/images/f4.webp'], title: 'Dance' ,id: 44},
    { image: ['assets/images/f5.jpg','assets/images/f5.jpg','assets/images/f5.jpg'], title: 'Ganesh Chathurthi' ,id: 45},
    { image: ['assets/images/f1.jpg','assets/images/f1.jpg','assets/images/f1.jpg'], title: 'Ashtami' ,id: 46},
    { image: ['assets/images/f2.jpg','assets/images/f2.jpg','assets/images/f2.jpg'], title: 'Marnami',id: 47 },
    { image: ['assets/images/f4.webp','assets/images/f4.webp','assets/images/f4.webp'], title: 'Holi' ,id: 48},
    { image: ['assets/images/f4.webp','assets/images/f4.webp','assets/images/f4.webp'], title: 'Deepavali' ,id: 49},
    { image: ['assets/images/f4.webp','assets/images/f4.webp','assets/images/f4.webp'], title: 'Paryaya',id: 50 }
  ];

  beachCards: Card[] = [
    { image: ['assets/images/be1.jpg','assets/images/be1.jpg','assets/images/be1.jpg'], title: 'Malpe Beach', id: 21 },
    { image: ['assets/images/be2.jfif','assets/images/be2.jfif','assets/images/be2.jfif'], title: 'Kaup Beach', id: 22 },
    { image: ['assets/images/be3.jpg','assets/images/be3.jpg','assets/images/be3.jpg'], title: 'Delta Beach', id: 23 },
    { image: ['assets/images/be4.jpg','assets/images/be4.jpg','assets/images/be4.jpg',], title: 'Padukere Beach', id: 24 },
    { image: ['assets/images/be5.jpg','assets/images/be5.jpg','assets/images/be5.jpg'], title: 'Maravante Beach', id: 25 },
    { image: ['assets/images/be6.jpg','assets/images/be6.jpg','assets/images/be6.jpg'], title: 'Mattu Beach', id: 26 },
    { image: ['assets/images/be7.JPG','assets/images/be7.JPG','assets/images/be7.JPG'], title: 'Bengre Beach', id: 27 },
    { image: ['assets/images/be8.jpg','assets/images/be8.jpg','assets/images/be8.jpg'], title: 'Muloor Beach', id: 28 },
    { image: ['assets/images/be9.jpg','assets/images/be9.jpg','assets/images/be9.jpg'], title: 'Blue Whale Beach', id: 29 },
    { image: ['assets/images/be10.jpg','assets/images/be10.jpg','assets/images/be10.jpg'], title: 'Kodi Beach', id: 30 },
    { image: ['assets/images/be1.jpg','assets/images/be1.jpg','assets/images/be1.jpg'], title: 'Malpe Beach' ,id: 51},
    { image: ['assets/images/be2.jfif','assets/images/be2.jfif','assets/images/be2.jfif'], title: 'Kaup Beach',id: 52 },
    { image: ['assets/images/be3.jpg','assets/images/be3.jpg','assets/images/be3.jpg'], title: 'Delta Beach',id: 53 },
    { image: ['assets/images/be4.jpg','assets/images/be4.jpg','assets/images/be4.jpg'], title: 'Padukere Beach' ,id: 54},
    { image: ['assets/images/be5.jpg','assets/images/be5.jpg','assets/images/be5.jpg'], title: 'Maravante Beach' ,id: 55},
    { image: ['assets/images/be6.jpg','assets/images/be6.jpg','assets/images/be6.jpg'], title: 'Mattu Beach',id: 56 },
    { image: ['assets/images/be7.JPG','assets/images/be7.JPG','assets/images/be7.JPG'], title: 'Bengre Beach',id: 57 },
    { image: ['assets/images/be8.jpg','assets/images/be8.jpg','assets/images/be8.jpg'], title: 'Muloor Beach' ,id: 58},
    { image: ['assets/images/be9.jpg','assets/images/be9.jpg','assets/images/be9.jpg'], title: 'Blue Whale Beach',id: 59 },
    { image: ['assets/images/be10.jpg','assets/images/be10.jpg','assets/images/be10.jpg'], title: 'Kodi Beach' ,id: 60}
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.card = this.getCardDetails(id);
    });
  }

  getCardDetails(id: number): Card | null {
    const allCards = [...this.activityCards, ...this.wildlifeCards, ...this.beachCards];
    return allCards.find(card => card.id === id) || null;
  }

  onSlideChange(event: any) {
    const activeElement = document.querySelector('.carousel-item.active');
    if (activeElement) {
      this.currentSlideIndex = Array.from(activeElement.parentElement!.children).indexOf(activeElement);
    }
  }

  onPrevClick() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    }
  }

  onNextClick() {
    if (this.currentSlideIndex < (this.card?.image.length ?? 0) - 1) {
      this.currentSlideIndex++;
    }
  }
}

@NgModule({
  declarations: [DetailsComponent],
  imports: [
    CommonModule // Ensure CommonModule is imported here
    // Other modules as needed
  ]
})
export class DetailsModule {}