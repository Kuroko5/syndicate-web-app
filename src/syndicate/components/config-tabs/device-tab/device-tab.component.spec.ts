import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTabComponent } from './device-tab.component';

describe('UserTabComponent', () => {
  let component: DeviceTabComponent;
  let fixture: ComponentFixture<DeviceTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceTabComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
