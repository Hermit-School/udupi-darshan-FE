/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from '../util/sortable.directive';

import { AdminNewEntriesInterface } from '../models/adminnewentrydata';

interface SearchResult {
    adminentrieslist: AdminNewEntriesInterface[];
	total: number;
}

interface State {
	page: number;
	pageSize: number;
	searchTerm: string;
	sortColumn: SortColumn;
	sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

// function sort( column: SortColumn, direction: string): AdminNewEntriesInterface[] {
// 	if (direction === '' || column === '') {
// 		return adminentrieslist;
// 	} else {
// 		return [...adminentrieslist].sort((a, b) => {
// 			const res = compare(a[column], b[column]);
// 			return direction === 'asc' ? res : -res;
// 		});
// 	}
// }

function matches(adminentrylist: AdminNewEntriesInterface, term: string, pipe: PipeTransform) {
	return (
		// country.name.toLowerCase().includes(term.toLowerCase()) ||
		// pipe.transform(country.area).includes(term) ||
		// pipe.transform(country.population).includes(term)
        adminentrylist.Entries[0]
	);
}

@Injectable({ providedIn: 'root' })
export class SearchEntryService {
	private _loading$ = new BehaviorSubject<boolean>(true);
	private _search$ = new Subject<void>();
	private _countries$ = new BehaviorSubject<AdminNewEntriesInterface[]>([]);
	private _total$ = new BehaviorSubject<number>(0);

	private _state: State = {
		page: 1,
		pageSize: 4,
		searchTerm: '',
		sortColumn: '',
		sortDirection: '',
	};

	constructor(private pipe: DecimalPipe) {
		// this._search$
		// 	.pipe(
		// 		tap(() => this._loading$.next(true)),
		// 		debounceTime(200),
		// 		switchMap(() => this._search()),
		// 		delay(200),
		// 		tap(() => this._loading$.next(false)),
		// 	)
		// 	.subscribe((result) => {
		// 		this._countries$.next(result.adminentrieslist);
		// 		this._total$.next(result.total);
		// 	});

		// this._search$.next();
	}

	get countries$() {
		return this._countries$.asObservable();
	}
	get total$() {
		return this._total$.asObservable();
	}
	get loading$() {
		return this._loading$.asObservable();
	}
	get page() {
		return this._state.page;
	}
	get pageSize() {
		return this._state.pageSize;
	}
	get searchTerm() {
		return this._state.searchTerm;
	}

	set page(page: number) {
		this._set({ page });
	}
	set pageSize(pageSize: number) {
		this._set({ pageSize });
	}
	set searchTerm(searchTerm: string) {
		this._set({ searchTerm });
	}
	set sortColumn(sortColumn: SortColumn) {
		this._set({ sortColumn });
	}
	set sortDirection(sortDirection: SortDirection) {
		this._set({ sortDirection });
	}

	private _set(patch: Partial<State>) {
		Object.assign(this._state, patch);
		this._search$.next();
	}

	// private _search(): Observable<SearchResult> {
	// 	const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

	// 	// 1. sort
	// 	let adminentrieslist = sort( sortColumn, sortDirection);

	// 	// 2. filter
	// 	adminentrieslist = adminentrieslist.filter((adminentrylist: AdminNewEntriesInterface) => matches(adminentrylist, searchTerm, this.pipe));
	// 	const total = adminentrieslist.length;

	// 	// 3. paginate
	// 	adminentrieslist = adminentrieslist.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
	// 	return of({ adminentrieslist, total });
	// }
}
