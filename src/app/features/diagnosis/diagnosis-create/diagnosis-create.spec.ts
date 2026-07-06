import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosisCreate } from './diagnosis-create';

describe('DiagnosisCreate', () => {
  let component: DiagnosisCreate;
  let fixture: ComponentFixture<DiagnosisCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosisCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(DiagnosisCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
