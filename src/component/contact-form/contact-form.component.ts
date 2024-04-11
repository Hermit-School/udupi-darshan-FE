import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent {
  submitted = false;
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  submitForm() {
    // Handle form submission logic here
    console.log('Form submitted:', this.formData);
  }
}
