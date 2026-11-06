import {
  Component,
  ElementRef,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: false,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnDestroy {
  @ViewChild('storyForm') storyForm!: TemplateRef<unknown>;
  @ViewChild('mobileMenu') mobileMenu?: ElementRef<HTMLElement>;
  private modal?: NgbModalRef;
  private destroyed = false;
  submittingStory = false;
  constructor(
    private router: Router,
    private dialogs: NgbModal,
  ) {}

  isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  skipToContent(): void {
    document.getElementById('main-content')?.focus();
  }

  openStoryForm(): void {
    const open = () => {
      if (this.destroyed || this.modal) return;
      const dialog = this.dialogs.open(this.storyForm, {
        centered: true,
        scrollable: true,
        ariaLabelledBy: 'story-form-title',
        backdrop: 'static',
        beforeDismiss: () => !this.submittingStory,
      });
      this.modal = dialog;
      dialog.hidden.subscribe(() => {
        if (this.modal === dialog) {
          this.modal = undefined;
          this.submittingStory = false;
        }
      });
    };
    const panel = this.mobileMenu?.nativeElement;
    if (panel?.classList.contains('show')) {
      panel.addEventListener('hidden.bs.offcanvas', open, { once: true });
      this.closeOffcanvas();
    } else open();
  }

  closeOffcanvas(): void {
    const panel = this.mobileMenu?.nativeElement;
    if (panel)
      (window as any).bootstrap.Offcanvas.getOrCreateInstance(panel).hide();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.modal?.dismiss();
  }
}
