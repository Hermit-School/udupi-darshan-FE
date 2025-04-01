import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit, AfterViewChecked {
  loginForm!: FormGroup;
  changetype: boolean = true;
  showPasswordTimeout: any;

  @ViewChild('passwordTooltip', { static: false }) passwordTooltipElement!: ElementRef;
  tooltipInitialized: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator]]
    });

    this.loginForm.statusChanges.subscribe(() => {
      this.toggleSubmitButton();
    });
  }

  ngAfterViewInit(): void {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new (window as any).bootstrap.Tooltip(tooltipTriggerEl, {
        boundary: 'viewport', // Ensure it stays within view
        customClass: 'custom-tooltip',
        html: true,
        placement: 'bottom',
      });
    });
  }


  ngAfterViewChecked(): void {
    this.initializeDynamicTooltip();
  }

  initializeTooltips() {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  initializeDynamicTooltip() {
    if (this.passwordTooltipElement && !this.tooltipInitialized) {
      setTimeout(() => {
        new bootstrap.Tooltip(this.passwordTooltipElement.nativeElement);
        this.tooltipInitialized = true;
      }, 0);
    }
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return { required: true };

    const minLength = 8;
    const maxLength = 30;
    const startsWithLetter = /^[a-zA-Z]/.test(value);
    const containsLowercase = /[a-z]/.test(value);
    const containsUppercase = /[A-Z]/.test(value);
    const containsDigit = /[0-9]/.test(value);
    const containsSpecialChar = /[-_@]/.test(value);
    const validPattern = /^[a-zA-Z0-9-_@]*$/.test(value);
    const isPassphrase = /^[a-z]+(-[a-z]+)+$/i.test(value) && value.split('-').length >= 3;
    const isSecurePassword = containsLowercase && containsUppercase && containsDigit && containsSpecialChar;

    if (
      value.length < minLength ||
      value.length > maxLength ||
      !startsWithLetter ||
      !validPattern ||
      (!isSecurePassword && !isPassphrase)
    ) {
      return { invalidPassword: true };
    }

    return null;
  }


  toggleSubmitButton(): void {
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = !this.loginForm.valid;
    }
  }
  togglePasswordVisibility(): void {
    this.changetype = !this.changetype;
    if (!this.changetype) {
      this.showPasswordTimeout = setTimeout(() => {
        this.changetype = true;
      }, 1000);
    } else {
      clearTimeout(this.showPasswordTimeout);
    }
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.router.navigate(['/admindashboard']);
    } else {
      console.log('Form is not valid');
    }
  }

  forgotPassword(): void {
    console.log('forgotPassword');
    this.router.navigate(['/forgotpassword']);
  }
}

