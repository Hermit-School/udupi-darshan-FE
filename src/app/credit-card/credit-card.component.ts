import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent implements OnInit {
  cardNumber: string = '';
  errorMessage: string = '';
  ngOnInit(): void {
    
  }

  onCardNumberChange(event: any) {
    // Remove non-digit characters from the input
    this.cardNumber = event.target.value.replace(/\D/g, '');
    // Format the card number with hyphens after every 4 digits
    this.cardNumber = this.cardNumber.replace(/(.{4})/g, '$1-');
    // Remove the last hyphen if it's there
    this.cardNumber = this.cardNumber.replace(/-$/, '');

    // Check if the card number is exactly 16 digits long
    if (this.cardNumber.length !== 19) {
      this.errorMessage = 'Card number must be 16 digits long.';
    } else {
      this.errorMessage = '';
    }
  }
}