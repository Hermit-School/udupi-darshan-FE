import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BASE_URLS, CATEGORIES, PLACEHOLDER_MAP } from 'src/constants/routes';
import { HttpClient } from '@angular/common/http';
import { natureServiceService } from 'src/app/services/nature.service'

declare var bootstrap: any;

@Component({
  selector: 'app-dashboardnavbar',
  templateUrl: './dashboardnavbar.component.html',
  styleUrls: ['./dashboardnavbar.component.scss']
})
export class DashboardnavbarComponent implements OnInit, AfterViewInit {
  @ViewChild('entryModal') entryModal!: ElementRef;
  modalInstance: any;

  activeForm: 'nature' | 'culture' | 'food' | null = null;
  natureEntries: any[] = [];
  cultureEntries: any[] = [];
  foodEntries: any[] = [];

  deleteForm(section: string) {
    this.activeForm = null;
  }

  currentCategory: string = '';
  subcategoryOptions: string[] = [];
  selectedBaseUrl: string = '';
  currentPlaceholder: string = '';
  openModal(category: string) {
    this.currentCategory = category;
    switch (category) {
      case 'nature':
        this.subcategoryOptions = CATEGORIES.filter(cat => cat.startsWith('nature-'));
        this.selectedBaseUrl = BASE_URLS['nature'];
        break;
      case 'culture':
        this.subcategoryOptions = CATEGORIES.filter(cat => cat.startsWith('culture-'));
        this.selectedBaseUrl = BASE_URLS['culture'];
        break;
      case 'food':
        this.subcategoryOptions = CATEGORIES.filter(cat => cat.startsWith('food-'));
        this.selectedBaseUrl = BASE_URLS['food'];
        break;
      default:
        this.subcategoryOptions = [];
        this.selectedBaseUrl = '';
    }
  }

  @ViewChild('linkInput') linkInputRef!: ElementRef;

  entryForm!: FormGroup;
  categories = CATEGORIES;
  placeholderMap = PLACEHOLDER_MAP;

  constructor(private fb: FormBuilder, private natureService: natureServiceService, private http: HttpClient) { }

  fullLink: string = '';

  ngOnInit(): void {
    this.initializeForm();

    this.addKeyPoint();
    this.addDiscover();
    this.addImpInfo();
    this.addDontMiss();
    this.addImage();
    this.selectedBaseUrl = BASE_URLS['nature'];
    this.fullLink = this.selectedBaseUrl;
    this.entryForm.get('category')?.valueChanges.subscribe(selectedCategory => {
      this.currentPlaceholder = PLACEHOLDER_MAP[selectedCategory] || 'e.g. malpe-beach';
      this.updateFullLink();
    });

    this.entryForm.get('link')?.valueChanges.subscribe(() => {
      this.updateFullLink();
    });
  }
  toggleDetails(entry: any) {
    entry.showDetails = !entry.showDetails;
  }

  deleteAllEntries(category: string): void {
    if (confirm(`Are you sure you want to delete all ${category} entries?`)) {
      switch (category) {
        case 'nature':
          this.natureEntries = [];
          break;
        case 'culture':
          this.cultureEntries = [];
          break;
        case 'food':
          this.foodEntries = [];
          break;
      }
    }
  }
  selectedImages: File[] = [];
  onSubmit() {
    if (this.entryForm.invalid) return;
    const formData = new FormData();
    formData.append('name', this.entryForm.get('name')?.value);
    formData.append('label', this.entryForm.get('label')?.value);
    formData.append('location', this.entryForm.get('location')?.value);
    formData.append('descr', this.entryForm.get('descr')?.value);
    formData.append('timings', this.entryForm.get('timings')?.value);
    formData.append('category', this.entryForm.get('category')?.value);
    formData.append('link', this.entryForm.get('link')?.value);

    // arrays
    this.entryForm.get('key_points')?.value.forEach((kp: string) => {
      formData.append('key_points', kp);
    });
    this.entryForm.get('discover')?.value.forEach((d: string) => {
      formData.append('discover', d);
    });
    this.entryForm.get('imp_info')?.value.forEach((info: string) => {
      formData.append('imp_info', info);
    });
    this.entryForm.get('dont_miss_these')?.value.forEach((dm: string) => {
      formData.append('dont_miss_these', dm);
    });

    // ✅ nested object: how_to_visit
    const howToVisit = this.entryForm.get('how_to_visit')?.value;
    if (howToVisit) {
      formData.append('byBike', howToVisit.byBike);
      formData.append('byCar', howToVisit.byCar);
      formData.append('byPublic', howToVisit.byPublic);
    }

    // append files
    this.selectedImages.forEach(file => {
      formData.append('images', file);
    });

    this.natureService.addNature(formData).subscribe({
      next: () => {
        alert('Entry saved successfully');
        this.entryForm.reset();
      },
      error: (err: any) => {
        console.error('Error submitting entry:', err);
        alert('Failed to save entry');
      }
    });
  }
  updateFullLink() {
    const link = this.entryForm.get('link')?.value || '';
    this.fullLink = this.selectedBaseUrl + link;
  }
  private initializeForm(): void {
    this.entryForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z ]+$')]],
      label: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      location: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s,]+$/)]],
      descr: ['', Validators.required],
      key_points: this.fb.array([], Validators.required),
      discover: this.fb.array([]),
      imp_info: this.fb.array([]),
      how_to_visit: this.fb.group({
        byBike: ['', Validators.required],
        byCar: ['', Validators.required],
        byPublic: ['', Validators.required]
      }),
      timings: [''],
      category: ['', Validators.required],
      dont_miss_these: this.fb.array([], Validators.required),
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
  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.entryModal.nativeElement);
  }


}
