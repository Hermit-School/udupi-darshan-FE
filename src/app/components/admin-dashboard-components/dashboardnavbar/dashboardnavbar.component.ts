import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BASE_URLS, CATEGORIES, PLACEHOLDER_MAP } from 'src/constants/routes';
import { natureServiceService } from 'src/app/services/nature.service';
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
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  @ViewChild('linkInput') linkInputRef!: ElementRef;

  entryForm!: FormGroup;
  categories = CATEGORIES;
  placeholderMap = PLACEHOLDER_MAP;

  constructor(private natureService: natureServiceService, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.initializeForm();
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
      createdAt: [''],
      category: ['', Validators.required],
      dont_miss_these: this.fb.array([
        this.createDontMissItem()
      ], Validators.required),
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
    this.dontMissThese.push(this.createDontMissItem());
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

  private createDontMissItem(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      link: ['', Validators.required]
    });
  }
  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        this.images.at(index).setValue(base64String);
        this.images.at(index).markAsTouched();
      };
      reader.readAsDataURL(file);
    }
  }
  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.entryModal.nativeElement);
  }
  onSubmit(): void {
    if (this.entryForm.valid) {
      const formData = new FormData();
      const fullLinkValue = this.selectedBaseUrl + (this.entryForm.value.link || '');
      formData.append('link', fullLinkValue);

      Object.keys(this.entryForm.value).forEach(key => {
        if (key === 'images') {
          this.images.controls.forEach((control) => {
            if (control.value) {
              formData.append('images', control.value);
            }
          });
        } else if (key === 'key_points' || key === 'discover' || key === 'imp_info') {
          this.entryForm.value[key].forEach((item: string) => {
            formData.append(key, item);
          });
        } else if (key === 'how_to_visit') {
          formData.append('byBike', this.entryForm.value.how_to_visit.byBike);
          formData.append('byCar', this.entryForm.value.how_to_visit.byCar);
          formData.append('byPublic', this.entryForm.value.how_to_visit.byPublic);
        } else if (key === 'dont_miss_these') {
          this.entryForm.value.dont_miss_these.forEach((item: any, idx: number) => {
            formData.append(`dont_miss_these[${idx}].title`, item.title);
            formData.append(`dont_miss_these[${idx}].description`, item.description);
            formData.append(`dont_miss_these[${idx}].imageUrl`, item.imageUrl);
            formData.append(`dont_miss_these[${idx}].link`, item.link);
          });
        } else if (key !== 'link') {
          formData.append(key, this.entryForm.value[key]);
        }
        else {
          formData.append(key, this.entryForm.value[key]);
        }
      });

      this.natureService.addEntry(formData).subscribe({
        next: (response) => {
          console.log(' Entry submitted successfully:', response);
          if (this.modalInstance) {
            this.modalInstance.hide();
          }

          this.entryForm.reset();
        },
        error: (error) => {
          console.error(' Error submitting entry:', error);
        }
      });

    } else {
      console.log('Form is invalid');
    }
  }
}
