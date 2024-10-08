import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDetailComponent } from './page-detail.component';

describe('PageDetailComponent', () => {
  let component: PageDetailComponent;
  let fixture: ComponentFixture<PageDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
