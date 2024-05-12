import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedFormDeathComponent } from './med-form-death.component';

describe('MedFormDeathComponent', () => {
  let component: MedFormDeathComponent;
  let fixture: ComponentFixture<MedFormDeathComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedFormDeathComponent]
    });
    fixture = TestBed.createComponent(MedFormDeathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
