import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedureEdit } from './procedure-edit';

describe('ProcedureEdit', () => {
  let component: ProcedureEdit;
  let fixture: ComponentFixture<ProcedureEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcedureEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcedureEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
