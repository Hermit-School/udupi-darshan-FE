import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { API_BASE_URL } from 'src/constants/routes';
import { BACKGROUND_REQUEST } from './background-request';

export type ReviewStatus = 'Submitted' | 'Published' | 'Rejected';
export interface StorySummary {
  id: number;
  title: string;
  excerpt: string;
  submittedBy: string;
  status: ReviewStatus;
  createdAt: string;
  photoCount: number;
}
export interface StoryReview {
  id: number;
  title: string;
  content: string;
  submittedBy: string;
  email: string;
  status: ReviewStatus;
  createdAt: string;
  photos: string[];
}
export interface StoryQueue {
  items: StorySummary[];
  total: number;
  page: number;
  totalPages: number;
}
@Injectable({ providedIn: 'root' })
export class StorySubmissionsService {
  private readonly base = API_BASE_URL + '/v1/blogs';
  private readonly options = {
    context: new HttpContext().set(BACKGROUND_REQUEST, true),
  };
  constructor(private http: HttpClient) {}
  submit(form: FormData) {
    return this.http.post<{ id: number; message: string }>(
      this.base + '/submissions',
      form,
      this.options,
    );
  }
  list(status: ReviewStatus, page: number) {
    return this.http.get<StoryQueue>(this.base + '/admin/submissions', {
      ...this.options,
      params: { status, page, size: 20 },
    });
  }
  review(id: number) {
    return this.http.get<StoryReview>(
      this.base + '/admin/submissions/' + id,
      this.options,
    );
  }
  decide(id: number, decision: 'publish' | 'reject') {
    return this.http.patch(
      this.base + '/admin/submissions/' + id + '/' + decision,
      {},
      this.options,
    );
  }
  addPhotos(id: number, files: readonly File[], uploadKey: string) {
    const body = new FormData();
    body.set('uploadKey', uploadKey);
    for (const file of files) body.append('photos', file);
    return this.http.post<StoryReview>(
      this.base + '/admin/submissions/' + id + '/photos',
      body,
      this.options,
    );
  }
  photo(path: string) {
    const id = path.substring('/v1/blogs/photos/'.length);
    return this.http.get(
      this.base + '/admin/photos/' + encodeURIComponent(id),
      { ...this.options, responseType: 'blob' },
    );
  }
}
