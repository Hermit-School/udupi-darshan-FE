import { Injectable, inject } from "@angular/core";
import { BACKGROUND_REQUEST } from "./background-request";
import { HttpContext, HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { Details } from "../models/card";
import { API_BASE_URL } from "src/constants/routes";
export interface CommunityEvent {
  id: number;
  details: {
    article: Partial<Details> | null;
    startsOn: string | null;
    endsOn: string | null;
    featured: boolean | null;
  };
}
export const eventName = (event: CommunityEvent) =>
  event.details.article?.name || "Community event";
export const eventEnded = (event: CommunityEvent) =>
  !!(event.details.endsOn || event.details.startsOn) &&
  (event.details.endsOn || event.details.startsOn)! <
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
export function eventImage(url: string): string {
  return url.startsWith("/v1/events/photos/") ? API_BASE_URL + url : url;
}
@Injectable({ providedIn: "root" })
export class EventsService {
  private http = inject(HttpClient);
  list() {
    return this.http.get<CommunityEvent[]>(API_BASE_URL + "/v1/events", {
      context: new HttpContext().set(BACKGROUND_REQUEST, true),
    });
  }
  get(id: number) {
    return this.http.get<CommunityEvent>(API_BASE_URL + "/v1/events/" + id);
  }
}
