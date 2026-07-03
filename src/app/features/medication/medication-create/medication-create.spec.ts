import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationCreate } from './medication-create';

describe('MedicationCreate', () => {
  let component: MedicationCreate;
  let fixture: ComponentFixture<MedicationCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicationCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
