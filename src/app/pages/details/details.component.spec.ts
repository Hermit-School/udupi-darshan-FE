import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AppModule } from 'src/app/app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsComponent } from './details.component';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule, RouterTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('renders saved emphasis while Angular removes executable markup', () => {
    component.card={id:1,name:'Restaurant',category:'Food',label:'Local food',images:[],descr:'A <b>bold</b> and <i>italic</i> overview.',keyPoints:['<strong>Signature dish</strong>'],discover:['<em>Discover</em>'],impInfo:['<script>window.bad=true</script><b onclick="window.bad=true">Price</b>'],howToVisit:{byCar:'<b>Road</b>',byBike:'',byPublic:''},dontMissThese:[],link:'',timings:'',createdAt:'',location:''};
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.long-copy b').textContent).toBe('bold');
    expect(fixture.nativeElement.querySelector('.long-copy i').textContent).toBe('italic');
    expect(fixture.nativeElement.querySelector('li strong').textContent).toBe('Signature dish');
    expect(fixture.nativeElement.querySelector('script')).toBeNull();expect(fixture.nativeElement.querySelector('[onclick]')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('<b>');
  });

});
