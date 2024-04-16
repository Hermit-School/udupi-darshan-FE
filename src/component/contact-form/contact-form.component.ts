import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class MyFormComponent implements OnInit {
  myForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myForm = new FormGroup({});
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9._]*@([a-zA-Z]+\.com)$')]],
      city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]{6,7}$')]],
      
    });
  }
  onSubmit() {
    if (this.myForm.valid) {
      // Handle form submission here
      console.log(this.myForm.value);
    } else {
      // Mark all form fields as touched to display validation errors
      this.markFormGroupTouched(this.myForm);
    }
  }

  // Helper function to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}