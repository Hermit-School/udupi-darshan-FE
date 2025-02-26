// import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-admin',
//   templateUrl: './admin.component.html',
//   styleUrls: ['./admin.component.scss']
// })
// export class AdminComponent implements OnInit, AfterViewInit {
//   loginForm!: FormGroup;
//   changetype: boolean = true;
//   showPasswordTimeout: any;
//   passwordTooltip: string = `
//   Password must follow one of these rules:
//   - Secure password (5-10 characters):  
//     • Starts with a letter  
//     • Contains at least one uppercase letter  
//     • Contains at least one lowercase letter  
//     • Contains at least one digit  
//     • Contains at least one special character (-, _, @)  
//   - Passphrase (5-30 characters):  
//     • Starts with a letter  
//     • Contains at least three words separated by hyphens (-)  
// `;
//   @ViewChild('passwordTooltip', { static: false }) passwordTooltipElement!: ElementRef;


//   constructor(private fb: FormBuilder, private router: Router) { }

//   ngOnInit(): void {
//     this.loginForm = this.fb.group({
//       username: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, this.passwordValidator]]
//     });
//     this.loginForm.statusChanges.subscribe(status => {
//       this.toggleSubmitButton();
//     });
//     const popoverTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="popover"]'));
//     popoverTriggerList.forEach(popoverTriggerEl => {
//       new (window as any).bootstrap.Popover(popoverTriggerEl);
//     });
//   }

//   ngAfterViewInit(): void {
//     const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
//     tooltipTriggerList.forEach((tooltipTriggerEl) => {
//       new (window as any).bootstrap.Tooltip(tooltipTriggerEl, {
//         trigger: 'hover focus', // Ensures it works on hover and focus
//         customClass: 'custom-tooltip',
//         boundary: 'window'
//       });
//     });
//   }

//   togglePasswordVisibility(): void {
//     this.changetype = !this.changetype;
//     if (!this.changetype) {
//       this.showPasswordTimeout = setTimeout(() => {
//         this.changetype = true;
//       }, 1000);
//     } else {
//       clearTimeout(this.showPasswordTimeout);
//     }
//   }

//   onSubmit(): void {
//     if (this.loginForm.valid) {
//       // Simulate a successful login and navigate to admin dashboard
//       this.router.navigate(['/admindashboard']);
//     } else {
//       console.log('Form is not valid');
//     }
//   }

//   forgotPassword(): void {
//     console.log('forgotPassword');
//     this.router.navigate(['/forgotpassword']);
//   }
//   passwordValidator(control: AbstractControl): ValidationErrors | null {
//     const value = control.value;
//     if (!value) {
//       return { required: true };
//     }

//     const minLength = 5;
//     const maxLength = 30; // Increase max length for passphrases
//     const startsWithLetter = /^[a-zA-Z]/.test(value);
//     const containsLowercase = /[a-z]/.test(value);
//     const containsUppercase = /[A-Z]/.test(value);
//     const containsDigit = /[0-9]/.test(value);
//     const containsSpecialChar = /[-_@]/.test(value);
//     const validPattern = /^[a-zA-Z0-9-_@]*$/.test(value); // Allows letters, digits, -, _, and @

//     // **Passphrase Check**: Should contain at least three words separated by hyphens
//     const isPassphrase = /^[a-z]+(-[a-z]+)+$/i.test(value) && value.split('-').length >= 3;

//     // **Secure Password Check**: Requires uppercase, lowercase, digit, and special character
//     const isSecurePassword = containsLowercase && containsUppercase && containsDigit && containsSpecialChar;

//     if (
//       value.length < minLength ||
//       value.length > maxLength ||
//       !startsWithLetter ||
//       !validPattern ||
//       (!isSecurePassword && !isPassphrase) // At least one of the conditions must be met
//     ) {
//       return { invalidPassword: true };
//     }

//     return null;
//   }

//   toggleSubmitButton(): void {
//     const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
//     if (submitButton) {
//       submitButton.disabled = !this.loginForm.valid;
//     }
//   }
// }

import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { placements } from '@popperjs/core';

declare var bootstrap: any; // Ensure Bootstrap is available

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit, AfterViewChecked {
  loginForm!: FormGroup;
  changetype: boolean = true;
  showPasswordTimeout: any;
  // passwordTooltip: string = `
  //   Password must follow one of these rules:
  //   - Secure password (5-10 characters):  
  //     • Starts with a letter  
  //     • Contains at least one uppercase letter  
  //     • Contains at least one lowercase letter  
  //     • Contains at least one digit  
  //     • Contains at least one special character (-, _, @)  
  //   - Passphrase (5-30 characters):  
  //     • Starts with a letter  
  //     • Contains at least three words separated by hyphens (-)  
  // `;
  @ViewChild('passwordTooltip', { static: false }) passwordTooltipElement!: ElementRef;
  tooltipInitialized: boolean = false; // Track tooltip initialization

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
    this.initializeDynamicTooltip(); // Initialize tooltips for dynamically created elements
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
        this.tooltipInitialized = true; // Prevent reinitialization
      }, 0);
    }
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return { required: true };

    //   const minLength = 8;
    //   const startsWithLetter = /^[a-zA-Z]/.test(value);
    //   const containsLowercase = /[a-z]/.test(value);
    //   const containsUppercase = /[A-Z]/.test(value);
    //   const containsDigit = /[0-9]/.test(value);
    //   const containsSpecialChar = /[-_@]/.test(value);
    //   const isSecurePassword = containsLowercase && containsUppercase && containsDigit && containsSpecialChar;

    //   if (value.length < minLength || !startsWithLetter || !isSecurePassword) {
    //     return { invalidPassword: true };
    //   }
    //   return null;
    // }

    const minLength = 8;
    const maxLength = 30; // Increase max length for passphrases
    const startsWithLetter = /^[a-zA-Z]/.test(value);
    const containsLowercase = /[a-z]/.test(value);
    const containsUppercase = /[A-Z]/.test(value);
    const containsDigit = /[0-9]/.test(value);
    const containsSpecialChar = /[-_@]/.test(value);
    const validPattern = /^[a-zA-Z0-9-_@]*$/.test(value); // Allows letters, digits, -, _, and @

    // **Passphrase Check**: Should contain at least three words separated by hyphens
    const isPassphrase = /^[a-z]+(-[a-z]+)+$/i.test(value) && value.split('-').length >= 3;

    // **Secure Password Check**: Requires uppercase, lowercase, digit, and special character
    const isSecurePassword = containsLowercase && containsUppercase && containsDigit && containsSpecialChar;

    if (
      value.length < minLength ||
      value.length > maxLength ||
      !startsWithLetter ||
      !validPattern ||
      (!isSecurePassword && !isPassphrase) // At least one of the conditions must be met
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
}

