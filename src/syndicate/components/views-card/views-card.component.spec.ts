import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsCardComponent } from './views-card.component';

describe('ViewsCardComponent', () => {
  let component: ViewsCardComponent;
  let fixture: ComponentFixture<ViewsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewsCardComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
