import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit, OnDestroy, Renderer2, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DetailsComponent } from 'src/app/pages/details/details.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() detailsComponent!: DetailsComponent;

  form: FormGroup;
  photoPreviews: string[] = [];
  selectedFiles: File[] = [];
  files: { name: string, url: string }[] = [];
  maxFiles: number = 2;
  wordCount: number = 0;
  maxWordCount: number = 500;
  isSmallScreen: boolean = false;
  @ViewChild('writeToUsModal') writeToUsModal!: ElementRef;
  @ViewChild('successToast') successToast!: ElementRef;
  @ViewChild('errorToast') errorToast!: ElementRef;
  isSuccess: boolean | undefined;
  hideNavbar = false;


  constructor(private fb: FormBuilder, private router: Router, private renderer: Renderer2) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      message: ['', Validators.required]
    });
    this.router.events.subscribe(() => {
      this.hideNavbar = this.router.url === '/new-entry';
    });

  }

  isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 992;
  }

  ngOnInit(): void {
    this.form.get('message')?.valueChanges.subscribe(value => {
      this.wordCount = this.countWords(value);
      this.checkScreenSize();
    });
  }

  ngAfterViewInit(): void {
    this.writeToUsModal.nativeElement.addEventListener('hidden.bs.modal', this.resetModal.bind(this));
  }

  ngOnDestroy(): void {
    this.writeToUsModal.nativeElement.removeEventListener('hidden.bs.modal', this.resetModal.bind(this));
  }

  countWords(text: string | null | undefined): number {
    if (!text) {
      return 0;
    }
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  updateWordCount(value: string): void {
    this.wordCount = this.countWords(value);
    if (this.wordCount > this.maxWordCount) {
      const words = value.split(/\s+/).slice(0, this.maxWordCount);
      this.form.patchValue({ message: words.join(' ') });
    }
  }

  onFileSelected(event: any): void {
    const selectedFiles = event.target.files;
    const maxSize = 6291456;

    if (this.files.length + selectedFiles.length > this.maxFiles) {
      alert(`You can only upload a maximum of ${this.maxFiles} photos.`);
      return;
    }

    for (let file of selectedFiles) {
      if (file.size > maxSize) {
        alert(`The file "${file.name}" exceeds the maximum size of 1 MB.`);
        continue;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileUrl = e.target.result;
        this.files.push({ name: file.name, url: fileUrl });
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile(file: { name: string, url: string }): void {
    this.files = this.files.filter(f => f !== file);
  }

  openFile(url: string): void {
    window.open(url, '_blank');
  }
  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value);
      this.showToast('successToast');
      this.isSuccess = false;
      this.resetForm();
    } else {
      console.log('Form is invalid');
      this.isSuccess = false;
      this.showToast('errorToast');
    }
  }
  showToast(toastId: 'successToast' | 'errorToast'): void {
    const toastElement = this[toastId].nativeElement as HTMLElement;
    if (toastElement) {
      const toast = (window as any).bootstrap.Toast.getOrCreateInstance(toastElement);
      toast.show();
    }
  }
  resetForm(): void {
    this.form.reset();
    this.files = [];
    this.wordCount = 0;
    this.form.controls['message'].enable();
  }
  resetModal(): void {
    this.resetForm();
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  closeOffcanvas() {
    const offcanvas = document.getElementById('offcanvasNavbar');
    if (offcanvas) {
      this.renderer.removeClass(offcanvas, 'show');
      const backdrop = document.querySelector('.offcanvas-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
      document.body.classList.remove('offcanvas-backdrop');
      this.renderer.setStyle(document.body, 'overflow', 'auto');
      this.renderer.removeClass(document.body, 'offcanvas-open');
    }
  }
  removePadding() {
    document.body.style.paddingRight = '0px';
    document.body.style.overflow = 'auto';
  }
}