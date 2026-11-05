import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Observable, map } from "rxjs";
import { API_BASE_URL } from "src/constants/routes";
import { withMediaImages } from "../../util/media-image";
@Injectable()
export class MediaImageInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (
      request.method !== "GET" ||
      !request.url.startsWith(API_BASE_URL + "/v1/")
    )
      return next.handle(request);
    return next
      .handle(request)
      .pipe(
        map((event) =>
          event instanceof HttpResponse
            ? event.clone({ body: withMediaImages(event.body) })
            : event,
        ),
      );
  }
}
