import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-entry',
  templateUrl: './new-entry.component.html',
  styleUrls: ['./new-entry.component.scss']
})
export class NewEntryComponent {
  // entryForm: FormGroup;
  //   mainSections = ['Nature', 'Culture', 'Food', 'Story', 'Ads'];
  //   subsectionsMap: { [key: string]: string[] } = {
  //     'Nature': ['Beaches', 'Forests', 'Waterfalls'],
  //     'Culture': ['Temples', 'Festivals', 'Local Art'],
  //     'Food': ['Street Food', 'Traditional Meals', 'Desserts'],
  //     'Story': ['Legends', 'Travel Experiences', 'History'],
  //     'Ads': ['Promotions', 'Offers', 'Events']
  //   };
  //   filteredSubsections: string[] = [];
  //   uploadedImages: File[] = [];
  //   previewImages: string[] = [];

  //   constructor(private fb: FormBuilder) {
  //     this.entryForm = this.fb.group({
  //       mainSection: ['', Validators.required],
  //       subSection: [''],
  //       title: ['', Validators.required],
  //       content: ['', Validators.required]
  //     });
  //   }

  //   // Update the available subsections based on the selected main section
  //   updateSubsections() {
  //     const selectedSection = this.entryForm.value.mainSection;
  //     this.filteredSubsections = this.subsectionsMap[selectedSection] || [];
  //   }

  //   // Handle image uploads (limit to 3)
  //   onFileChange(event: any) {
  //     const files = event.target.files;
  //     if (files.length + this.uploadedImages.length > 3) {
  //       alert('You can only upload up to 3 images.');
  //       return;
  //     }
  //     for (let file of files) {
  //       if (this.uploadedImages.length < 3) {
  //         this.uploadedImages.push(file);

  //         // Preview Image
  //         const reader = new FileReader();
  //         reader.onload = (e: any) => this.previewImages.push(e.target.result);
  //         reader.readAsDataURL(file);
  //       }
  //     }
  //   }

  //   // Handle Form Submission
  //   onSubmit() {
  //     console.log('New Entry:', this.entryForm.value);
  //     console.log('Uploaded Images:', this.uploadedImages);
  //     alert('Entry Submitted Successfully!');
  //   }
  // }
  @ViewChild('linkInput') linkInputRef!: ElementRef;

  entryForm!: FormGroup;
  categories: string[] = [
    "nature-park",
    "nature-waterfalls",
    "nature-bridge",
    "nature-activity",
    "nature-island",
    "nature-camp",
    "nature-viewpoint",
    "culture-temple",
    "food-hotel",
    "food-restaurant",
    "food-cafe"

  ];
  placeholderMap: { [key: string]: string } = {
    "nature-park": "e.g. puttige",
    "nature-waterfalls": "e.g. arbi-falls",
    "nature-bridge": "e.g. hanging-bridge",
    "nature-activity": "e.g. hiking-spot",
    "nature-island": "e.g. st-marys",
    "nature-camp": "e.g. jungle-camp",
    "nature-viewpoint": "e.g. sunset-point",
    "culture-temple": "e.g. anantheshwara",
    "food-hotel": "e.g. woodlands",
    "food-restaurant": "e.g. fishland",
    "food-cafe": "e.g. cafe-coffee-day"
  };

  // currentPlaceholder: string = "Enter location name";

  constructor(private fb: FormBuilder) {
  }

  selectedBaseUrl: string = '';
  fullLink: string = '';
  currentPlaceholder: string = 'e.g. malpe beach';

  ngOnInit(): void {
    this.initializeForm();
    this.selectedBaseUrl = 'https://udupi-darshan.web.app/#/nature/';
    this.fullLink = this.selectedBaseUrl;

    // Handle category changes
    this.entryForm.get('category')?.valueChanges.subscribe((selectedCategory: string) => {

      // Update the base URL
      if (selectedCategory.startsWith('nature-')) {
        this.selectedBaseUrl = 'https://udupi-darshan.web.app/#/nature/';
      } else if (selectedCategory.startsWith('culture-')) {
        this.selectedBaseUrl = 'https://udupi-darshan.web.app/#/culture/';
      } else if (selectedCategory.startsWith('food-')) {
        this.selectedBaseUrl = 'https://udupi-darshan.web.app/#/food/';
      } else {
        this.selectedBaseUrl = 'https://udupi-darshan.web.app/#/nature/';
        // this.fullLink = this.selectedBaseUrl;

      }

      // Update placeholder dynamically
      this.currentPlaceholder = this.placeholderMap[selectedCategory] || 'e.g. malpe beach';

      // Update full link
      const userInput = this.entryForm.get('link')?.value || '';
      this.fullLink = this.selectedBaseUrl + userInput;
    });

    // Handle link text input changes
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
        byBike: [''],
        byCar: [''],
        byPublic: ['']
      }),
      timings: [''],
      category: ['', Validators.required],
      dont_miss_these: this.fb.array([]),
      images: this.fb.array([]),
      link: ['']
    });
  }

  // **Getter methods with safe type assertion to prevent null errors**
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

  addImage(): void {
    this.images.push(this.fb.control('', Validators.required));
  }
  removeImage(index: number): void {
    this.images.removeAt(index);
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
