import { Component, OnInit, inject, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Story } from 'src/app/models/story';
import { StoryService } from 'src/app/services/story.service';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  stories: Story[] = [];
  chunkedStories: Story[][] = [];

  private modalService = inject(NgbModal);

  constructor(private router: Router, private storyService: StoryService) { }

  ngOnInit(): void {
    this.fetchStories();
  }
  viewDetails(storyId: number): void {
    this.router.navigate(['/story', storyId]);
  }

  fetchStories(): void {
    this.storyService.getAllStories().subscribe(data => {
      if (data = []) {
        this.nodataShow();
      }
      else {
        this.stories = data;
        this.chunkStories();
      }
    });
  }
  nodataShow() {
    let modalRef = null;
    modalRef = this.modalService.open(NgbdModalContent, {
      centered: true
    });
    modalRef.componentInstance.name = 'No data';
  }
  chunkStories(): void {
    const chunkSize = 4;
    this.chunkedStories = [];
    for (let i = 0; i < this.stories.length; i += chunkSize) {
      this.chunkedStories.push(this.stories.slice(i, i + chunkSize));
    }
  }
  getTruncatedContent(content: string, limit: number): string {
    return content.length > limit ? content.substring(0, limit) + '...' : content;
  }
}

@Component({
  selector: 'ngbd-modal-content',
  standalone: true,
  template: `
		<div class="modal-header justify-content-center">
        No Data , Please Try Again Later
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-danger" (click)="closeModal()">Close</button>
		</div>
	`,
})
export class NgbdModalContent {
  activeModal = inject(NgbActiveModal);

  constructor(private router: Router) { }

  closeModal(){
    this.router.navigate(['/home']);
    this.activeModal.close('close click');
  }
}