import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoryFormService {
  private readonly requests = new Subject<void>();
  readonly requested = this.requests.asObservable();

  open(): void {
    this.requests.next();
  }
}
