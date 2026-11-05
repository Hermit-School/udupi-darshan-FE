import { Component, DestroyRef, inject } from "@angular/core";
import {
  NavigationCancel,
  NavigationError,
  Router,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
} from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { LoadingUtils } from "../../util/loading-util";
@Component({
  standalone: false,
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"],
})
export class LoadingComponent {
  private readonly pendingRoutes = new Set<object>();
  private clearRoutes() {
    for (const route of this.pendingRoutes)
      LoadingUtils.decrementActiveRequests();
    this.pendingRoutes.clear();
    LoadingUtils.hideLoader();
  }
  constructor() {
    const destroy = inject(DestroyRef);
    destroy.onDestroy(() => this.clearRoutes());
    inject(Router)
      .events.pipe(takeUntilDestroyed(destroy))
      .subscribe((event) => {
        if (
          event instanceof RouteConfigLoadStart &&
          !this.pendingRoutes.has(event.route)
        ) {
          this.pendingRoutes.add(event.route);
          if (LoadingUtils.activeRequests === 0) LoadingUtils.showLoader();
          LoadingUtils.incrementActiveRequests();
        } else if (
          event instanceof RouteConfigLoadEnd &&
          this.pendingRoutes.delete(event.route)
        ) {
          LoadingUtils.decrementActiveRequests();
          LoadingUtils.hideLoader();
        } else if (
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        )
          this.clearRoutes();
      });
  }
}
