import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDescriptionComponent } from './profile-description.component';

describe('ProfileDescriptionComponent', () => {
  let component: ProfileDescriptionComponent;
  let fixture: ComponentFixture<ProfileDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileDescriptionComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
