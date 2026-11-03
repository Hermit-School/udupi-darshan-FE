import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SearchEntry, SharedService } from 'src/app/services/shared.service';

@Component({ standalone: false,
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  toggleSearch: boolean = false;
  searchText: string = '';
  results: SearchEntry[] = [];
  showDropdown = false;
  private subscription?: Subscription;
  @ViewChild('input') input?: ElementRef<HTMLInputElement>;

  constructor(
    readonly sharedService: SharedService,
    private router: Router
  ) { }

  openSearch() {
    this.toggleSearch = true;
    requestAnimationFrame(() => { if (this.toggleSearch) this.input?.nativeElement.focus(); });
  }

  searchClose() {
    this.toggleSearch = false;
    this.searchText = '';
    this.sharedService.setSearchText('');
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.search-container')) {
      this.showDropdown = false;
    }
  }

  search(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value;
    const query = this.searchText.trim();
    this.sharedService.setSearchText(query);
    this.showDropdown = !!query;
    if (query) this.sharedService.loadIndex().subscribe();
  }

  openFirst(event: Event): void {
    if (!this.showDropdown || !this.results.length) return;
    event.preventDefault();
    const item = this.results[0];
    this.searchClose();
    void this.router.navigate(['/details', item.category.toLowerCase(), item.id]);
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

  ngOnInit(): void {
    this.subscription = this.sharedService.getSearchResults().subscribe(data => { this.results = data.slice(0, 12); });
  }

  ngOnDestroy(): void { this.subscription?.unsubscribe(); }
}
