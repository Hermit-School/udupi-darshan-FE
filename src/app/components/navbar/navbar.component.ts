import {
  Component,
  ElementRef,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Component({
  standalone: false,
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnDestroy {
  @ViewChild("storyForm") storyForm!: TemplateRef<unknown>;
  @ViewChild("mobileMenu") mobileMenu?: ElementRef<HTMLElement>;
  private modal?: NgbModalRef;
  private destroyed = false;
  readonly form = this.fb.nonNullable.group({
    name: ["", [Validators.required, Validators.maxLength(100)]],
    email: [
      "",
      [Validators.required, Validators.email, Validators.maxLength(255)],
    ],
    message: ["", [Validators.required, Validators.maxLength(1500)]],
  });
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialogs: NgbModal,
  ) {}

  get isHome(): boolean {
    return ["/", "/home"].includes(this.router.url.split("?")[0]);
  }

  isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  skipToContent(): void {
    document.getElementById("main-content")?.focus();
  }

  openStoryForm(): void {
    const open = () => {
      if (this.destroyed || this.modal) return;
      const dialog = this.dialogs.open(this.storyForm, {
        centered: true,
        scrollable: true,
        ariaLabelledBy: "story-form-title",
      });
      this.modal = dialog;
      dialog.hidden.subscribe(() => {
        if (this.modal === dialog) this.modal = undefined;
      });
    };
    const panel = this.mobileMenu?.nativeElement;
    if (panel?.classList.contains("show")) {
      panel.addEventListener("hidden.bs.offcanvas", open, { once: true });
      this.closeOffcanvas();
    } else open();
  }

  closeOffcanvas(): void {
    const panel = this.mobileMenu?.nativeElement;
    if (panel)
      (window as any).bootstrap.Offcanvas.getOrCreateInstance(panel).hide();
  }

  get storyDraft(): string | null {
    const { name, email, message } = this.form.getRawValue();
    if (this.form.invalid || !name.trim() || !message.trim()) return null;
    const body = `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`;
    return (
      "mailto:udupidarshan@gmail.com?subject=Udupi%20Darshan%20story&body=" +
      encodeURIComponent(body)
    );
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.modal?.dismiss();
  }
}
