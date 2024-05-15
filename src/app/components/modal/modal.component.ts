import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  public isModalOpen: boolean = false;

  constructor() {}

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  uploadPhotos() {
    // Implement your logic for uploading photos here
  }

  exit() {
    // Implement your logic for exiting the modal here
  }
}
