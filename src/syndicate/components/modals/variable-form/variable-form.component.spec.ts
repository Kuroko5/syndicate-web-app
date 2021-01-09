import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VariableFormComponent } from './variable-form.component';

describe('VariableFormComponent', () => {
  let component: VariableFormComponent;
  let fixture: ComponentFixture<VariableFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VariableFormComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
