import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VariablesGraphComponent } from './variables-graph.component';

describe('VariablesGraphComponent', () => {
  let component: VariablesGraphComponent;
  let fixture: ComponentFixture<VariablesGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VariablesGraphComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariablesGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
