import { Component, DestroyRef, inject } from "@angular/core";
import { BACKGROUND_REQUEST } from "../../services/background-request";
import { HttpContext, HttpClient } from "@angular/common/http";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { API_BASE_URL } from "src/constants/routes";
import { environment } from "../../../environments/environment";
@Component({
  standalone: false,
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent {
  visits: number | null = null;
  constructor() {
    const http = inject(HttpClient),
      destroy = inject(DestroyRef);
    let session = "";
    try {
      session =
        sessionStorage.getItem("ud-visit-session") || crypto.randomUUID();
      sessionStorage.setItem("ud-visit-session", session);
    } catch {}
    const options = {
      context: new HttpContext().set(BACKGROUND_REQUEST, true),
    };
    const request =
      environment.production && session
        ? http.post<{ visits: number | null }>(
            API_BASE_URL + "/v1/site-stats/visits",
            { session },
            options,
          )
        : http.get<{ visits: number | null }>(
            API_BASE_URL + "/v1/site-stats",
            options,
          );
    request
      .pipe(takeUntilDestroyed(destroy))
      .subscribe({
        next: (value) => (this.visits = value.visits),
        error: () => {},
      });
  }
}
