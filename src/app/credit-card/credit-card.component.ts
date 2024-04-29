import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent implements OnInit {
  cardNumber: string = '';
  errorMessage: string = '';
  isInputInvalid: boolean = false;
  ngOnInit(): void {
    
  }

  onCardNumberChange(event: any) {
    // Remove all non-digit characters from the input
    let inputDigits = event.target.value.replace(/[^0-9]/g, '');
    if (inputDigits.length >= 19) {
      event.preventDefault(); // Prevent further input
      return; // Exit the function
    }
    // Format the card number with hyphens after every 4 digits
    this.cardNumber = inputDigits.replace(/(.{4})/g, '$1-');
  
    // Remove the last hyphen if it's there
    this.cardNumber = this.cardNumber.replace(/-$/, '');
  
    // Check if the input differs from the formatted card number
    if (event.target.value !== this.cardNumber) {
      event.target.value = this.cardNumber; // Update the input value
    }
  

    // Check if the card number is exactly 16 digits long
    if (this.cardNumber.length !== 19) {
      this.errorMessage = 'Invalid card number.';
    } else {
      this.errorMessage = '';
    }
  }
}