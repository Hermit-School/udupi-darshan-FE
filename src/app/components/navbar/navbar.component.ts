import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  form: FormGroup;
  files: { name: string, url: string }[] = [];
  maxFiles: number = 2;
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]]
    });
  }

  ngOnInit(): void {
    const messageInput = document.getElementById("message") as HTMLTextAreaElement;
    const messageHelp = document.getElementById("messageHelp")!;

    messageInput.addEventListener("input", function() {
      const messageLength = messageInput.value.length;
      messageHelp.textContent = messageLength + "/500";

      if (messageLength > 500) {
        messageInput.value = messageInput.value.substring(0, 500);
        messageHelp.textContent = "500/500";
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      console.log("Form is invalid");
    }
  }

  onFileSelected(event: any) {
    const selectedFiles = event.target.files;
    const uploadedPhotosContainer = document.querySelector('.uploaded-photos');
    if (!uploadedPhotosContainer) {
      return;
    }

    if (this.files.length + selectedFiles.length > this.maxFiles) {
      alert(`You can only upload a maximum of ${this.maxFiles} photos.`);
      return;
    }

    for (let file of selectedFiles) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileUrl = e.target.result;
        this.files.push({ name: file.name, url: fileUrl });
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile(file: { name: string, url: string }) {
    this.files = this.files.filter(f => f !== file);
  }

  openFile(url: string): void {
    window.open(url, '_blank');
  }
}
