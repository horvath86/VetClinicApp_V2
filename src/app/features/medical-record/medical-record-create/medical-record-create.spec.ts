import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRecordCreate } from './medical-record-create';

describe('MedicalRecordCreate', () => {
  let component: MedicalRecordCreate;
  let fixture: ComponentFixture<MedicalRecordCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalRecordCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalRecordCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
