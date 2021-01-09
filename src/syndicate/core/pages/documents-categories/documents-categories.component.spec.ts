import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsCategoriesComponent } from './documents-categories.component';

describe('DocumentsCategoriesComponent', () => {
  let component: DocumentsCategoriesComponent;
  let fixture: ComponentFixture<DocumentsCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentsCategoriesComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
