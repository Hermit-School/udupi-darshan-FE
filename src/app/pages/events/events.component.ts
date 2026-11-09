import { EventBadgeComponent } from '../../components/event-badge/event-badge.component';
import { ChoukhatEventsComponent } from '../../components/choukhat-events/choukhat-events.component';
import { Component, DestroyRef, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Observable, switchMap, catchError, of } from "rxjs";
import {
  CommunityEvent,
  EventsService,
  eventEnded,
  eventImage,
  eventName,
} from "../../services/events.service";
import { VisitorMotionDirective } from "../../directives/visitor-motion.directive";
@Component({
  standalone: true,
  imports: [EventBadgeComponent, CommonModule, RouterLink, VisitorMotionDirective, ChoukhatEventsComponent],
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.scss"],
})
export class EventsComponent {
  private service = inject(EventsService);
  private route = inject(ActivatedRoute);
  private destroy = inject(DestroyRef);
  items: CommunityEvent[] = [];
  selected: CommunityEvent | null = null;
  showChoukhat=true;
  loading = true;
  error = false;
  name = eventName;
  image = eventImage;
  ended = eventEnded;
  trending(event: CommunityEvent){return event.details.featured === true && !eventEnded(event); }
  constructor() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.loading = true;
          this.error = false;
          const id = params.get("id");
          this.showChoukhat=!id;
          const request: Observable<CommunityEvent | CommunityEvent[]> = id
            ? this.service.get(Number(id))
            : this.service.list();
          return request.pipe(
            catchError(() => {
              this.error = true;
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroy),
      )
      .subscribe({
        next: (value) => {
          this.loading = false;
          if (!value) {
            this.selected = null;
            this.items = [];
            return;
          }
          if (Array.isArray(value)) {
            this.items = value;
            this.selected = null;
          } else this.selected = value;
        },
        error: () => {
          this.loading = false;
          this.error = true;
        },
      });
  }
  get informationUrl(): string | null {
    try {
      const url = new URL(this.selected?.details.article?.link || "");
      return ["https:", "http:"].includes(url.protocol) &&
        !url.username &&
        !url.password &&
        ![
          "udupi-darshan.web.app",
          "udupi-darshan.firebaseapp.com",
          location.hostname,
        ].includes(url.hostname)
        ? url.href
        : null;
    } catch {
      return null;
    }
  }
  get upcoming() {
    return this.items
      .filter((e) => !eventEnded(e))
      .sort((a, b) =>
        (a.details.startsOn || "9999").localeCompare(
          b.details.startsOn || "9999",
        ),
      );
  }
  get completed() {
    return this.items
      .filter(eventEnded)
      .sort((a, b) =>
        (b.details.endsOn || b.details.startsOn || "").localeCompare(
          a.details.endsOn || a.details.startsOn || "",
        ),
      );
  }
  retry() {
    location.reload();
  }
}
