import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VariablesTabsComponent } from './variables-tabs.component';

describe('VariablesTabsComponent', () => {
  let component: VariablesTabsComponent;
  let fixture: ComponentFixture<VariablesTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VariablesTabsComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariablesTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
