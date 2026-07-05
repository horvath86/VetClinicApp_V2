import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationEdit } from './medication-edit';

describe('MedicationEdit', () => {
  let component: MedicationEdit;
  let fixture: ComponentFixture<MedicationEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicationEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
