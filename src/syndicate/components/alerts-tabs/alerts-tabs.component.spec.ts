import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertsTabsComponent } from './alerts-tabs.component';

describe('AlertsTabsComponent', () => {
  let component: AlertsTabsComponent;
  let fixture: ComponentFixture<AlertsTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlertsTabsComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
