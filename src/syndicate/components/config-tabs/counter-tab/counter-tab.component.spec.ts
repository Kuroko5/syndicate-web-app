import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterTabComponent } from './counter-tab.component';

describe('CounterTabComponent', () => {
  let component: CounterTabComponent;
  let fixture: ComponentFixture<CounterTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CounterTabComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
