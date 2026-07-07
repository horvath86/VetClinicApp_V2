import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedureCreate } from './procedure-create';

describe('ProcedureCreate', () => {
  let component: ProcedureCreate;
  let fixture: ComponentFixture<ProcedureCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcedureCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcedureCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
