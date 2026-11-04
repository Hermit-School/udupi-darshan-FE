import { Injectable, signal } from "@angular/core";
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from "@angular/common/http";
import { API_BASE_URL } from "src/constants/routes";
import { BACKGROUND_REQUEST } from "./background-request";
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  forkJoin,
  map,
  of,
  shareReplay,
  tap,
  throwError,
} from "rxjs";
import { Details } from "../models/card";

export type SearchEntry = Pick<Details, "id" | "name" | "category"> &
  Partial<Pick<Details, "label" | "location" | "link">> & {
    summary?: string | null;
    image?: string | null;
  };

@Injectable({
  providedIn: "root",
})
export class SharedService {
  private searchTextSource = new BehaviorSubject<string>("");
  searchText$ = this.searchTextSource.asObservable();
  private detailsData: SearchEntry[] = [];
  private updatedAt = 0;
  private searchResults = new BehaviorSubject<SearchEntry[]>([]);

  readonly indexLoading = signal(false);
  readonly indexError = signal(false);
  private pending?: Observable<SearchEntry[]>;

  constructor(private http?: HttpClient) {}

  loadIndex(): Observable<SearchEntry[]> {
    if (this.pending) return this.pending;
    if (!this.http || (this.updatedAt && Date.now() - this.updatedAt < 60_000))
      return of(this.detailsData);
    const http = this.http;
    const context = new HttpContext().set(BACKGROUND_REQUEST, true);
    this.indexLoading.set(true);
    this.indexError.set(false);
    this.pending = http
      .get<SearchEntry[]>(API_BASE_URL + "/v1/destination-search", { context })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Older backend deployments have no index route. Fetch only when needed during rollout.
          if (error.status !== 401 && error.status !== 404)
            return throwError(() => error);
          return forkJoin(
            ["Nature", "Culture", "Food"].map((category) =>
              http.get<Details[]>(
                API_BASE_URL +
                  "/v1/" +
                  category.toLowerCase() +
                  "/get" +
                  category,
                { context },
              ),
            ),
          ).pipe(
            map((groups) =>
              groups
                .flat()
                .map(
                  ({
                    id,
                    name,
                    category,
                    label,
                    location,
                    link,
                    descr,
                    images,
                  }) => ({
                    id,
                    name,
                    category,
                    label,
                    location,
                    link,
                    summary: descr?.slice(0, 180),
                    image: images?.[0],
                  }),
                ),
            ),
          );
        }),
        tap((items) => this.setDetailsData(items)),
        catchError(() => {
          this.indexError.set(true);
          return of(this.detailsData);
        }),
        finalize(() => {
          this.pending = undefined;
          this.indexLoading.set(false);
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    return this.pending;
  }

  isSiteUrl(url: URL): boolean {
    return [
      "udupi-darshan.web.app",
      "udupi-darshan.firebaseapp.com",
      "udupidarshan.com",
      "www.udupidarshan.com",
      location.hostname,
    ].includes(url.hostname);
  }

  resolveRelatedLinks(items: { link?: string }[] | undefined): void {
    if (items?.length) {
      this.loadIndex().subscribe();
    }
  }

  mappedRelated(
    items:
      | { name: string; description: string; imageUrl: string; link?: string }[]
      | undefined,
  ) {
    return (items || []).flatMap((item) => {
      const route = this.relatedLink(item.link);
      if (!Array.isArray(route) || route[0] !== "/details") return [];
      const article = this.detailsData.find(
        (value) =>
          value.category.toLowerCase() === route[1] &&
          String(value.id) === String(route[2]),
      );
      if (!article) return [];
      return [
        {
          name: article.name,
          description: article.summary || item.description,
          imageUrl:
            article.image ||
            (!/\/ads\d/i.test(item.imageUrl) ? item.imageUrl : ""),
          link: route.join("/").replace("//", "/"),
        },
      ];
    });
  }
  invalidateIndex() {
    this.updatedAt = 0;
  }

  setSearchText(text: string): void {
    this.searchTextSource.next(text);
    this.search(text);
  }

  setDetailsData(data: SearchEntry[]): void {
    this.detailsData = [...data];
    this.updatedAt = Date.now();
    if (this.searchTextSource.value) this.search(this.searchTextSource.value);
  }

  private search(query: string): void {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    this.searchResults.next(
      words.length
        ? this.detailsData.filter((item) => {
            const text = [
              item.name,
              item.summary,
              item.category,
              item.label,
              item.location,
            ]
              .join(" ")
              .toLowerCase();
            return words.every((word) => text.includes(word));
          })
        : [],
    );
  }

  relatedRoute(slug: string): string[] | null {
    const matches = this.detailsData.filter((item) =>
      matchesDestinationSlug(item, slug),
    );
    return matches.length === 1
      ? ["/details", matches[0].category.toLowerCase(), String(matches[0].id)]
      : null;
  }

  relatedLink(link?: string): string | string[] | null {
    if (!link || link.startsWith("//") || link.includes("\\")) return null;
    try {
      const site = "https://udupi-darshan.web.app";
      const url = new URL(link, site);
      if (
        !["http:", "https:"].includes(url.protocol) ||
        url.username ||
        url.password
      )
        return null;
      if (!this.isSiteUrl(url)) return url.href;
      const segments = (
        url.hash.startsWith("#/") ? url.hash.slice(2) : url.pathname.slice(1)
      )
        .split("?")[0]
        .split("/")
        .filter(Boolean)
        .map(decodeURIComponent);
      if (
        segments.length === 3 &&
        segments[0] === "details" &&
        /^(nature|culture|food)$/i.test(segments[1]) &&
        /^[1-9]\d*$/.test(segments[2])
      ) {
        return ["/details", segments[1].toLowerCase(), segments[2]];
      }
      if (segments.length === 2 && /^(nature|culture|food)$/i.test(segments[0]))
        return ["/" + segments[0].toLowerCase(), segments[1]];
      if (
        segments.length === 1 &&
        /^(home|nature|culture|food|story|advertisements)$/.test(segments[0])
      )
        return ["/" + segments[0]];
      return segments.length === 1 ? this.relatedRoute(segments[0]) : null;
    } catch {
      return null;
    }
  }

  getSearchResults(): Observable<SearchEntry[]> {
    return this.searchResults.asObservable();
  }
}

export function matchesDestinationSlug(
  item: SearchEntry,
  slug: string,
): boolean {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  if (!normalize(slug)) return false;
  const tail = item.link?.split(/[/?#]/).filter(Boolean).at(-1);
  return (
    normalize(item.name) === normalize(slug) ||
    (!!tail && normalize(tail) === normalize(slug))
  );
}
