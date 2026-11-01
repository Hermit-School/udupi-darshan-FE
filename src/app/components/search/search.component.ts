import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Details } from 'src/app/models/card';
import { SharedService } from 'src/app/services/shared.service';

@Component({ standalone: false,
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  toggleSearch: boolean = false;
  searchText: string = '';
  results: Details[] = [];
  showDropdown: boolean = false;

  constructor(
    private sharedService: SharedService,
    private router: Router
  ) { }

  openSearch() {
    this.toggleSearch = true;
  }
  isFoodSearchText(text: string): boolean {
    const foodSearchTerms = ['hotel', 'snack', 'restaurant'];
    return foodSearchTerms.includes(text.toLowerCase());
  }
  isNatureSearchText(text: string): boolean {
    const natureSearchTerms = ['wildlife', 'beach', 'activity'];
    return natureSearchTerms.includes(text.toLowerCase());
  }
  isCultureSearchText(text: string): boolean {
    const cultureSearchTerms = ['matha', 'festival'];
    return cultureSearchTerms.includes(text.toLowerCase());
  }

  searchClose() {
    this.toggleSearch = false;
    this.searchText = '';
    this.results = [];
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.search-container')) {
      this.showDropdown = false;
    }
  }

  search(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    const query = target.value.trim();
    if (event.key === 'Enter' && query) {
      this.sharedService.setSearchText(query);
      this.showDropdown = true;
    } else {
      this.showDropdown = false;
    }
  }

  getHighlightedText(field: string | undefined, query: string): string {
    const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    if (!field || !query) return escape(field || '');
    const normalized = field.toLowerCase();
    const needle = query.toLowerCase();
    let result = '', start = 0, index: number;
    while ((index = normalized.indexOf(needle, start)) !== -1) {
      result += escape(field.slice(start, index)) + '<b>' + escape(field.slice(index, index + query.length)) + '</b>';
      start = index + query.length;
    }
    return result + escape(field.slice(start));
  }

  selectResult(result: Details): void {
    this.searchClose();
    this.router.navigate(['/details', result.category.toLowerCase().split('-')[0], result.id]).then(() => {
      this.searchClose();
    });
  }
  ngOnInit(): void {
    this.sharedService.getSearchResults();
    this.sharedService.getSearchResults().subscribe((data) => {
      this.results = data;
    });
  }
}
