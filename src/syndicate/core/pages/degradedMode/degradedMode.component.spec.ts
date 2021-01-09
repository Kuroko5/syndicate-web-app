import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DegradedModeComponent } from './degradedMode.component';

describe('DegradedModeComponent', () => {
  let component: DegradedModeComponent;
  let fixture: ComponentFixture<DegradedModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DegradedModeComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DegradedModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
