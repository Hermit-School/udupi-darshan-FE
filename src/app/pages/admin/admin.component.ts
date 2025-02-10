import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {
  loginForm!: FormGroup;
  changetype: boolean = true;
  showPasswordTimeout: any;
  passwordTooltip: string = `
    Password must be 5-10 characters long.
    Start with a letter.
    Contain at least one lowercase letter.
    Contain at least one uppercase letter.
    Contain at least one digit.
    Contain at least one special character (-, _, @).
  `;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator]]
    });
    this.loginForm.statusChanges.subscribe(status => {
      this.toggleSubmitButton();
    });
    const popoverTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.forEach(popoverTriggerEl => {
      new (window as any).bootstrap.Popover(popoverTriggerEl);
    });
  }

  ngAfterViewInit(): void {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new (window as any).bootstrap.Tooltip(tooltipTriggerEl, {
        customClass: 'custom-tooltip'
      });
    });
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
      // Simulate a successful login and navigate to admin dashboard
      this.router.navigate(['/admindashboard']);
    } else {
      console.log('Form is not valid');
    }
  }

  forgotPassword(): void {
    console.log('forgotPassword');
    this.router.navigate(['/forgotpassword']);
  }
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return { required: true };
    }
    const minLength = 5;
    const maxLength = 10;
    const startsWithLetter = /^[a-zA-Z]/.test(value);
    const containsLowercase = /[a-z]/.test(value);
    const containsUppercase = /[A-Z]/.test(value);
    const containsDigit = /[0-9]/.test(value);
    const containsSpecialChar = /[-_@]/.test(value);

    if (
      value.length < minLength ||
      value.length > maxLength ||
      !startsWithLetter ||
      !containsLowercase ||
      !containsUppercase ||
      !containsDigit ||
      !containsSpecialChar
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
}


