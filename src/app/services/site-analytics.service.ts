import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { firebaseConfig } from "../../constants/firebaseConfigConstants";
@Injectable({ providedIn: "root" })
export class SiteAnalyticsService {
  private ready?: Promise<{
    analytics: import("firebase/analytics").Analytics;
    logEvent: typeof import("firebase/analytics").logEvent;
  } | null>;
  private previous = "";
  track(path: string, title: string): void {
    if (!environment.production || this.previous === path) return;
    this.previous = path;
    this.ready ??= Promise.all([
      import("firebase/app"),
      import("firebase/analytics"),
    ])
      .then(async ([app, analytics]) => {
        if (!(await analytics.isSupported())) return null;
        const instance = app.getApps().length
          ? app.getApp()
          : app.initializeApp(firebaseConfig);
        return {
          analytics: analytics.initializeAnalytics(instance, {
            config: { send_page_view: false },
          }),
          logEvent: analytics.logEvent,
        };
      })
      .catch(() => null);
    // Public paths only; omit query parameters and all form contents.
    void this.ready
      .then((client) => {
        if (client)
          client.logEvent(client.analytics, "page_view", {
            page_title: title,
            page_location: location.origin + "/#" + path,
            page_path: path,
          });
      })
      .catch(() => {});
  }
}
