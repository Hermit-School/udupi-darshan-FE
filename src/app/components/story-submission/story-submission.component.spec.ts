import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { StorySubmissionComponent } from './story-submission.component';
import { API_BASE_URL } from 'src/constants/routes';

describe('Story submission validation', () => {
  let fixture: ComponentFixture<StorySubmissionComponent>;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StorySubmissionComponent, HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(StorySubmissionComponent);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => {
    http.verify();
    fixture.destroy();
  });
  function valid() {
    fixture.componentInstance.form.setValue({
      title: 'A day in Udupi',
      name: 'A visitor',
      email: 'visitor@example.com',
      message: 'A walk along the coast.',
    });
  }
  it('shows field errors on submit, focuses the first invalid input and sends no request', () => {
    expect(fixture.nativeElement.querySelector('.field-error')).toBeNull();
    fixture.componentInstance.submit();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.field-error').length).toBe(
      4,
    );
    expect(
      fixture.nativeElement
        .querySelector('#story-title')
        .getAttribute('aria-invalid'),
    ).toBe('true');
    expect(document.activeElement).toBe(
      fixture.nativeElement.querySelector('#story-title'),
    );
    http.expectNone(API_BASE_URL + '/v1/blogs/submissions');
  });
  it.each(['title', 'name', 'message'] as const)(
    'rejects a whitespace-only %s before making an API request',
    (field) => {
      valid();
      fixture.componentInstance.form.controls[field].setValue('  \n  ');
      fixture.componentInstance.submit();
      fixture.detectChanges();
      expect(fixture.componentInstance.validationMessage(field)).toMatch(
        /^Enter your/,
      );
      http.expectNone(API_BASE_URL + '/v1/blogs/submissions');
    },
  );
  it.each([
    'visitor',
    'visitor@example',
    'a..b@example.com',
    '@example.com',
    'visitor@exa mple.com',
  ])('rejects invalid email %s', (value) => {
    valid();
    fixture.componentInstance.form.controls.email.setValue(value);
    fixture.componentInstance.submit();
    expect(fixture.componentInstance.validationMessage('email')).toContain(
      'valid email',
    );
    http.expectNone(API_BASE_URL + '/v1/blogs/submissions');
  });
  it.each([
    ['title', 200],
    ['name', 100],
    ['email', 255],
    ['message', 5000],
  ] as const)('enforces the %s length limit', (field, max) => {
    valid();
    fixture.componentInstance.form.controls[field].setValue(
      'x'.repeat(max + 1),
    );
    fixture.componentInstance.submit();
    expect(fixture.componentInstance.validationMessage(field)).toBe(
      `Use ${max} characters or fewer.`,
    );
    http.expectNone(API_BASE_URL + '/v1/blogs/submissions');
  });
  it('shows errors after blur and clears them when corrected', () => {
    const control = fixture.componentInstance.form.controls.title;
    control.markAsTouched();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('#story-title-error'),
    ).not.toBeNull();
    control.setValue('ಉಡುಪಿಯ ಕಥೆ');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('#story-title-error'),
    ).toBeNull();
  });
  it('blocks submission while a photo error needs correction', () => {
    valid();
    fixture.componentInstance.photoError = 'Choose readable photos.';
    fixture.componentInstance.submit();
    http.expectNone(API_BASE_URL + '/v1/blogs/submissions');
    fixture.componentInstance.clearPhotoError();
    fixture.componentInstance.submit();
    http.expectOne(API_BASE_URL + '/v1/blogs/submissions').flush({ id: 42 });
    expect(fixture.componentInstance.submitted).toBe(true);
  });
  it('accepts boundary lengths, preserves Unicode, and trims the submitted email', () => {
    const component = fixture.componentInstance;
    component.form.setValue({
      title: 'ಕ'.repeat(200),
      name: 'A'.repeat(100),
      email: ' visitor@example.com ',
      message: 'A'.repeat(5000),
    });
    component.submit();
    const request = http.expectOne(API_BASE_URL + '/v1/blogs/submissions');
    expect(request.request.body.get('email')).toBe('visitor@example.com');
    expect(request.request.body.get('title')).toHaveLength(200);
    request.flush({ id: 42 });
    expect(component.submitted).toBe(true);
  });
  it.each([429, 503])('retains the draft and retry key after HTTP %s', (status) => {
    valid();
    const component = fixture.componentInstance;
    const draft = component.form.getRawValue();
    component.submit();
    const first = http.expectOne(API_BASE_URL + '/v1/blogs/submissions');
    const key = first.request.body.get('submissionKey');
    first.flush({}, { status, statusText: 'Unavailable' });
    fixture.detectChanges();
    expect(component.form.getRawValue()).toEqual(draft);
    expect(fixture.nativeElement.textContent).toContain('Your draft is still here');
    component.submit();
    const retry = http.expectOne(API_BASE_URL + '/v1/blogs/submissions');
    expect(retry.request.body.get('submissionKey')).toBe(key);
    retry.flush({ id: 42 });
    expect(component.submitted).toBe(true);
  });

});
