import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Details } from '../models/card';

@Injectable({
    providedIn: 'root',
})
export class SharedService {
    private searchTextSource = new BehaviorSubject<string>('');
    searchText$ = this.searchTextSource.asObservable();
    private detailsData: Details[] = [];
    private searchResults = new BehaviorSubject<Details[]>([]);

    constructor() { }

    setSearchText(text: string): void {
        this.searchTextSource.next(text);
        this.search(text);
    }

    setDetailsData(data: Details[]): void {
        this.detailsData = [...data];
    }

    private search(query: string): void {
        const lowerQuery = query.toLowerCase();
        const filtered = this.detailsData.filter((item) =>
            item.name.toLowerCase().includes(lowerQuery) ||
            (item.descr && item.descr.toLowerCase().includes(lowerQuery)) ||
            (item.category && item.category.toLowerCase().includes(lowerQuery))
        );
        this.searchResults.next(filtered);
    }

    getSearchResults(): Observable<Details[]> {
        return this.searchResults.asObservable();
    }

    searchNature(query: string): void {
        const lowerQuery = query.toLowerCase();
        const filtered = this.detailsData.filter((item) =>
            item.name.toLowerCase().includes(lowerQuery) &&
            item.category?.toLowerCase() === 'nature'
        );
        this.searchResults.next(filtered);
    }
}
