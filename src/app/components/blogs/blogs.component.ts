// src/app/components/blogs/blogs.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss'],
})
export class BlogsComponent implements OnInit {
  blogs = [
    {
      id: 1,
      title: 'Kaup Light house',
      content: 'Quite evident by the name, there is a lighthouse on the beach which promises panoramic views of the sea, the beach and the neighbouring areas.',
      content1:'Submitted by: Anusha Shetty on 12/12/2022',
      image: 'assets/images/b1.jpeg',
      relatedImages: ['assets/images/a1.jpeg', 'assets/images/a2.jpg', 'assets/images/a1.jpeg', 'assets/images/a2.jpg'],
      relatedContent: [
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.',
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.',
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.',
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.',
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.'
      ],
      cards: [
        { id: 1, image: 'assets/images/a2.jpg',title:'Best Of Food', text: 'Experience the depth of the ocean by scubadiving in th.' },
        { id: 2, image: 'assets/images/a2.jpg',title:'Best Of Food', text: 'Experience the depth of the ocean by scubadiving in th.'  },
        { id: 3, image: 'assets/images/a2.jpg', title:'Best Of Food', text: 'Experience the depth of the ocean by scubadiving in th.' },
        { id: 4, image: 'assets/images/a2.jpg', title:'Best Of Food', text: 'Experience the depth of the ocean by scubadiving in th.' },
        { id: 5, image: 'assets/images/a2.jpg', title:'Best Of Food', text: 'Experience the depth of the ocean by scubadiving in th.' }
      ]
    },
     
    {
      id: 2,
      title: 'Malpe Beach',
      content: 'Malpe is one of the exquisite unexplored beaches of the Indian West Coast. Located at the mouth of the Udayavar River, the most famous being St. Mary’s Island.',
      image: 'assets/images/bl2.webp',
      relatedImages: ['assets/images/a3.jpg', 'assets/images/a4.jpg', 'assets/images/a3.jpg', 'assets/images/a3.jpg'],
      relatedContent: [
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.',
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.',
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.',
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.',
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.'
      ],
      cards: [
        { id: 1, image: 'assets/images/a2.jpg', text: 'Card 1 content' },
        { id: 2, image: 'assets/images/a2.jpg', text: 'Card 2 content' },
        { id: 3, image: 'assets/images/a2.jpg', text: 'Card 3 content' },
        { id: 4, image: 'assets/images/a2.jpg', text: 'Card 4 content' },
        { id: 5, image: 'assets/images/a2.jpg', text: 'Card 5 content' }
      ]
    },
    {
      id: 3,
      title: 'Krishna Matta',
      content: 'The story of this temple starts with the birth of a child to a couple called Narayana Bhatta and his wife Vedavati in a village called Pajakakshetra near Udupi.',
      image: 'assets/images/bl4.jpg',
      relatedImages: ['assets/images/a7.jpg', 'assets/images/a7.jpg', 'assets/images/a7.jpg', 'assets/images/a7.jpg'],
      relatedContent: [
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.',
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.',
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.',
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.',
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.'
      ],
      cards: [
        { id: 1, image: 'assets/images/a2.jpg', text: 'Card 1 content' },
        { id: 2, image: 'assets/images/a2.jpg', text: 'Card 2 content' },
        { id: 3, image: 'assets/images/a2.jpg', text: 'Card 3 content' },
        { id: 4, image: 'assets/images/a2.jpg', text: 'Card 4 content' },
        { id: 5, image: 'assets/images/a2.jpg', text: 'Card 5 content' }
      ]
    },
    {
      id: 4,
      title: 'Maravante Beach',
      content: 'Maravanthe is a uniquely positioned beach in Coastal Karnataka with Arabian Sea on one side and Souparnika river on the other.',
      image: 'assets/images/bl5.jpg',
      relatedImages: ['assets/images/a1.jpeg', 'assets/images/a1.jpeg', 'assets/images/a1.jpeg', 'assets/images/a1.jpeg'],
      relatedContent: [
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.',
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.',
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.',
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.',
        'Hesaraghatta Falls is a picturesque waterfall located near Bangalore, Karnataka, known for its serene surroundings and lush greenery. It\'s a popular spot for nature lovers and photographers, especially during the monsoon season when the falls are at their fullest.'
      ],
      cards: [
        { id: 1, image: 'assets/images/a2.jpg', text: 'Card 1 content' },
        { id: 2, image: 'assets/images/a2.jpg', text: 'Card 2 content' },
        { id: 3, image: 'assets/images/a2.jpg', text: 'Card 3 content' },
        { id: 4, image: 'assets/images/a2.jpg', text: 'Card 4 content' },
        { id: 5, image: 'assets/images/a2.jpg', text: 'Card 5 content' }
      ]
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void { }

  viewDetails(blogId: number): void {
    this.router.navigate(['/story', blogId]);
  }
}
