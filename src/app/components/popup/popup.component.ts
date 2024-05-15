import { Component } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  public isPopupOpen: boolean = false;

  constructor() {}

  openPopup() {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  limitWords(inputElement: HTMLInputElement) {
    const maxWords = 5;
    const words = inputElement.value.trim().split(/\s+/);
    if (words.length > maxWords) {
      inputElement.value = words.slice(0, maxWords).join(' ');
    }
  }
}
