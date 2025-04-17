import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BASE_URLS, CATEGORIES, PLACEHOLDER_MAP } from 'src/constants/routes';

@Component({
  selector: 'app-new-entry',
  templateUrl: './new-entry.component.html',
  styleUrls: ['./new-entry.component.scss']
})
export class NewEntryComponent {
  @ViewChild('linkInput') linkInputRef!: ElementRef;

  entryForm!: FormGroup;
  categories = CATEGORIES;
  placeholderMap = PLACEHOLDER_MAP;

  constructor(private fb: FormBuilder) { }

  selectedBaseUrl: string = '';
  fullLink: string = '';
  currentPlaceholder: string = 'e.g. malpe beach';

  ngOnInit(): void {
    this.initializeForm();
    this.selectedBaseUrl = BASE_URLS['nature'];
    this.fullLink = this.selectedBaseUrl;

    this.entryForm.get('category')?.valueChanges.subscribe((selectedCategory: string) => {
      if (selectedCategory.startsWith('nature-')) {
        this.selectedBaseUrl = BASE_URLS['nature'];
      } else if (selectedCategory.startsWith('culture-')) {
        this.selectedBaseUrl = BASE_URLS['culture'];
      } else if (selectedCategory.startsWith('food-')) {
        this.selectedBaseUrl = BASE_URLS['food'];
      } else {
        this.selectedBaseUrl = BASE_URLS['nature'];
      }

      this.currentPlaceholder = this.placeholderMap[selectedCategory] || 'e.g. malpe beach';

      const userInput = this.entryForm.get('link')?.value || '';
      this.fullLink = this.selectedBaseUrl + userInput;
    });

    this.entryForm.get('link')?.valueChanges.subscribe((userInput: string) => {
      this.fullLink = this.selectedBaseUrl + (userInput || '');
    });
  }

  private initializeForm(): void {
    this.entryForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z ]+$')]],
      label: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      location: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s,]+$/)]], // Allows alphabets, spaces, and commas
      descr: ['', Validators.required],
      key_points: this.fb.array([], Validators.required), // Ensure arrays are initialized
      discover: this.fb.array([]),
      imp_info: this.fb.array([]),
      how_to_visit: this.fb.group({
        byBike: ['', Validators.required],
        byCar: ['', Validators.required],
        byPublic: ['', Validators.required]
      }),
      timings: [''],
      category: ['', Validators.required],
      dont_miss_these: this.fb.array([]),
      images: this.fb.array([]),
      link: ['']
    });
  }

  get keyPoints(): FormArray {
    return this.entryForm.get('key_points') as FormArray;
  }
  get discover(): FormArray {
    return this.entryForm.get('discover') as FormArray;
  }
  get impInfo(): FormArray {
    return this.entryForm.get('imp_info') as FormArray;
  }
  get dontMissThese(): FormArray {
    return this.entryForm.get('dont_miss_these') as FormArray;
  }
  get images(): FormArray {
    return this.entryForm.get('images') as FormArray;
  }

  addKeyPoint(): void {
    this.keyPoints.push(this.fb.control('', Validators.required));
  }
  removeKeyPoint(index: number): void {
    this.keyPoints.removeAt(index);
  }

  addDiscover(): void {
    this.discover.push(this.fb.control('', Validators.required));
  }
  removeDiscover(index: number): void {
    this.discover.removeAt(index);
  }

  addImpInfo(): void {
    this.impInfo.push(this.fb.control('', Validators.required));
  }
  removeImpInfo(index: number): void {
    this.impInfo.removeAt(index);
  }

  addDontMiss(): void {
    this.dontMissThese.push(this.fb.control('', Validators.required));
  }
  removeDontMiss(index: number): void {
    this.dontMissThese.removeAt(index);
  }

  addImage() {
    if (this.images.length < 3) {
      this.images.push(new FormControl(null, Validators.required));
    }
  }

  removeImage(index: number) {
    this.images.removeAt(index);
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.images.at(index).setValue(file);
      this.images.at(index).markAsTouched();
    }
  }

  onSubmit(): void {
    if (this.entryForm.valid) {
      console.log('Form Submitted', this.entryForm.value);
      // Send form data to API here
    } else {
      console.log('Form is invalid');
    }
  }
}
