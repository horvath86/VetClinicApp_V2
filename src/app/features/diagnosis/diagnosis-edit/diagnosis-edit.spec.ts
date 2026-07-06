import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosisEdit } from './diagnosis-edit';

describe('DiagnosisEdit', () => {
  let component: DiagnosisEdit;
  let fixture: ComponentFixture<DiagnosisEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosisEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(DiagnosisEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
