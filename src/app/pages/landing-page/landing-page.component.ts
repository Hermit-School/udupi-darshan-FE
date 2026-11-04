import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  CommunityEvent,
  EventsService,
  eventEnded,
  eventName,
} from "../../services/events.service";
@Component({
  standalone: false,
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
})
export class LandingPageComponent {
  featured: CommunityEvent[] = [];
  name = eventName;
  constructor() {
    inject(EventsService)
      .list()
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe({
        next: (events) => {
          this.featured = events
            .filter((e) => !eventEnded(e) || e.details.featured)
            .sort(
              (a, b) =>
                Number(eventEnded(a)) - Number(eventEnded(b)) ||
                (a.details.startsOn || "9999").localeCompare(
                  b.details.startsOn || "9999",
                ),
            )
            .slice(0, 5);
        },
        error: () => {},
      });
  }
}
