import { Component, OnInit } from "@angular/core";
import { BentoService } from "src/app/services/bento.service";

@Component({
  selector: 'app-bento',
  templateUrl: './bento.component.html',
  styleUrls: ['./bento.component.scss'],
})

export class BentoComponent implements OnInit{
  cards: any[] = [];  

  constructor(private bentoService: BentoService) { }  

  ngOnInit(): void {
    this.bentoService.getCards().subscribe((data) => {
      this.cards = data;  
    });
    
  }
}