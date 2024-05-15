// navbar.component.ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() openModalEvent = new EventEmitter<void>();

  constructor() {}

  openModal() {
    this.openModalEvent.emit();
  }
}
