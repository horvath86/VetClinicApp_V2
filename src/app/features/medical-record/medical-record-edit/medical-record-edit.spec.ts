import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRecordEdit } from './medical-record-edit';

describe('MedicalRecordEdit', () => {
  let component: MedicalRecordEdit;
  let fixture: ComponentFixture<MedicalRecordEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalRecordEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalRecordEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
