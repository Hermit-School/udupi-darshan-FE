import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { API_BASE_URL } from 'src/constants/routes';
import { FoodService } from '../services/food.service';
import { CultureService } from '../services/culture.service';
import { natureServiceService } from '../services/nature.service';
import { StoryService } from '../services/story.service';
import { SearchEntry, SharedService } from '../services/shared.service';
import { Details } from '../models/card';
import { Story } from '../models/story';
import { DetailsComponent } from '../pages/details/details.component';
import { StoryComponent } from '../pages/story/story.component';
import { SearchComponent } from '../components/search/search.component';
import { ListFilterPipe } from '../util/list-filter';
import { AppModule } from '../app.module';
import { AppComponent } from '../app.component';
import { NavbarComponent } from '../components/navbar/navbar.component';

describe('Deployed content API contract', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  for (const [kind, suffix, serviceType] of [
    ['food', 'Food', FoodService], ['culture', 'Culture', CultureService], ['nature', 'Nature', natureServiceService]
  ] as const) {
    it(`uses the real backend routes for ${kind} reads and changes`, () => {
      const service: any = TestBed.inject(serviceType as any);
      const base = `${API_BASE_URL}/v1/${kind}`;
      const requests: [string, string, () => any][] = [
        ['GET', `${base}/get${suffix}`, () => service[`getAll${suffix === 'Nature' ? 'Natures' : suffix + 's'}`]()],
        ['GET', `${base}/42`, () => service[`get${suffix}ById`](42)],
        ['POST', `${base}/post${suffix}`, () => service[`add${suffix}`]({name:'Fixture'})],
        ['PUT', `${base}/update${suffix}/42`, () => service[`update${suffix}`](42,{name:'Fixture'})],
        ['DELETE', `${base}/delete${suffix}/42`, () => service[`delete${suffix}`](42)]
      ];
      for (const [method, url, invoke] of requests) {
        invoke().subscribe(); const request=http.expectOne(url);
        expect(request.request.method).toBe(method); request.flush(method === 'GET' && url.endsWith(suffix) ? [] : {});
      }
    });
  }
  it('uses the real backend story routes', () => {
    const service=TestBed.inject(StoryService); const base=`${API_BASE_URL}/v1/blogs`;
    service.getStoryById(42).subscribe(); const request=http.expectOne(`${base}/getBlogs/42`); expect(request.request.method).toBe('GET'); request.flush({id:42});
    service.addStory({title:'Fixture'} as Story).subscribe();
    const create=http.expectOne(`${base}/postBlogs`); expect(create.request.method).toBe('POST'); create.flush({});
    service.updateStory(42,{title:'Fixture'} as Story).subscribe();
    const update=http.expectOne(`${base}/updateBlogs/42`); expect(update.request.method).toBe('PUT'); update.flush({});
    service.deleteStory(42).subscribe();
    const remove=http.expectOne(`${base}/deleteBlogs/42`); expect(remove.request.method).toBe('DELETE'); remove.flush({});
  });
});

describe('Public content rendering regressions', () => {
  afterEach(() => vi.useRealTimers());
  beforeEach(() => TestBed.configureTestingModule({ imports: [AppModule, HttpClientTestingModule, RouterTestingModule] }));
  it('loads a direct destination by ID and renders missing travel directions safely', async () => {
    vi.useFakeTimers();
    const fixture=TestBed.createComponent(DetailsComponent); fixture.detectChanges();
    fixture.componentInstance.fetchData('Nature',42);
    const http=TestBed.inject(HttpTestingController);
    http.expectOne(`${API_BASE_URL}/v1/nature/42`).flush({id:42,name:'Fixture Lake',images:[],keyPoints:[],discover:[],impInfo:[],howToVisit:null,dontMissThese:[]});
    await vi.advanceTimersByTimeAsync(250);
    fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('Fixture Lake');
    expect(fixture.componentInstance.error).toBe(''); http.verify(); fixture.destroy();
  });
  it('shows an error when a destination cannot be loaded', () => {
    const fixture=TestBed.createComponent(DetailsComponent); fixture.detectChanges(); fixture.componentInstance.fetchData('food',42);
    const http=TestBed.inject(HttpTestingController);
    http.expectOne(`${API_BASE_URL}/v1/food/42`).flush('',{status:404,statusText:'Not Found'});
    fixture.detectChanges(); expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Unable to load');
    http.verify(); fixture.destroy();
  });
  it('renders returned stories instead of replacing the response with an empty array', () => {
    const story={id:42,title:'Fixture story',content:'A real story',submittedBy:'Fixture',images:[],createdAt:''} as unknown as Story;
    vi.spyOn(TestBed.inject(StoryService),'getAllStories').mockReturnValue(of([story]));
    const modal=vi.spyOn(TestBed.inject(NgbModal),'open');
    const fixture=TestBed.createComponent(StoryComponent); fixture.detectChanges();
    expect(fixture.componentInstance.chunkedStories[0][0]).toBe(story);
    expect(fixture.nativeElement.textContent).toContain('Fixture story'); expect(modal).not.toHaveBeenCalled(); fixture.destroy();
  });
  it('opens mobile navigation and closes it through Bootstrap cleanup', async () => {
    vi.useFakeTimers();
    const fixture=TestBed.createComponent(NavbarComponent); fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    const opener=fixture.nativeElement.querySelector('[aria-label="Open navigation"]') as HTMLButtonElement;
    expect(opener.getAttribute('data-bs-target')).toBe('#offcanvasNavbar');
    const panel=fixture.nativeElement.querySelector('#offcanvasNavbar') as HTMLElement;
    const Offcanvas=(window as any).bootstrap.Offcanvas;
    const instance=Offcanvas.getOrCreateInstance(panel); instance.show();
    await vi.advanceTimersByTimeAsync(500); expect(panel.classList.contains('show')).toBe(true);
    fixture.componentInstance.closeOffcanvas(); await vi.advanceTimersByTimeAsync(500);
    expect(panel.classList.contains('show')).toBe(false);
    expect(document.querySelector('.offcanvas-backdrop')).toBeNull();
    instance.dispose(); fixture.destroy(); fixture.nativeElement.remove();
  });
  it('builds an email draft only after the story form is complete', () => {
    const fixture=TestBed.createComponent(NavbarComponent); fixture.detectChanges();
    expect(fixture.componentInstance.storyDraft).toBeNull();
    fixture.componentInstance.form.setValue({name:'Fixture',email:'fixture@example.invalid',message:'Fixture story'});
    expect(decodeURIComponent(fixture.componentInstance.storyDraft!)).toContain('Fixture story');
    expect(fixture.componentInstance.storyDraft).toMatch(/^mailto:udupidarshan@gmail.com\?/);
    fixture.destroy();
  });
  it('refreshes a pending search when public data finishes loading', () => {
    const shared=new SharedService(); let results: SearchEntry[]=[];
    shared.getSearchResults().subscribe(data => results=data);
    shared.setSearchText('Lake'); expect(results).toEqual([]);
    shared.setDetailsData([{id:42,name:'Preview Lake',category:'Nature'} as Details]);
    expect(results.map(item => item.id)).toEqual([42]);
  });
  it('treats search punctuation literally and escapes content before highlighting', () => {
    const search=new SearchComponent(new SharedService(),{} as Router);
    expect(search.getHighlightedText('Cliff [view]','[')).toBe('Cliff <b>[</b>view]');
    expect(search.getHighlightedText('<img src=x>', 'missing')).toBe('&lt;img src=x&gt;');
    expect(new ListFilterPipe().transform([{name:'Cliff [view]'},{name:'Lake'}],'[')).toEqual([{name:'Cliff [view]'}]);
  });
});
