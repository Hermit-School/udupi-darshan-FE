import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-scrollable-navbar',
  templateUrl: './scrollable-navbar.component.html',
  styleUrls: ['./scrollable-navbar.component.css']
})
export class ScrollableNavbarComponent {

  @Output() sectionClicked = new EventEmitter<string>();

  showSection(section: string) {
    this.sectionClicked.emit(section);
  }
}
