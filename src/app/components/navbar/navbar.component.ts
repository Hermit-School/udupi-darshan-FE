import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  form: FormGroup;
  photoPreviews: string[] = [];
  selectedFiles: File[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]]

    });
  }

  ngOnInit(): void {
    // JavaScript logic for character count
    const messageInput = document.getElementById("message") as HTMLTextAreaElement;
    const messageHelp = document.getElementById("messageHelp")!;

    messageInput.addEventListener("input", function() {
      const messageLength = messageInput.value.length;
      messageHelp.textContent = messageLength + "/500";

      // Enforce the character limit
      if (messageLength > 500) {
        messageInput.value = messageInput.value.substring(0, 500);
        messageHelp.textContent = "500/500";
      }
    });
  }

  onPhotoChange(event: any) {
    const input = event.target;
    const files = input.files;
  
    // Clear previous previews
    this.photoPreviews = [];
  
    // Check if more than 2 files are selected
    if (files && files.length > 2) {
      // Clear the input
      input.value = '';
      // Set custom error
      this.form.controls['photo'].setErrors({ 'maxPhotos': true });
    } else {
      // Clear any previous errors
      this.form.controls['photo'].setErrors(null);
  
      // Display previews of selected photos
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.photoPreviews.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }
  
  

  onSubmit(): void {
    if (this.form.valid) {
      // Form is valid, perform submission or other actions
      console.log(this.form.value);
    } else {
      // Form is invalid, display error messages or handle accordingly
      console.log("Form is invalid");
    }
  }
}