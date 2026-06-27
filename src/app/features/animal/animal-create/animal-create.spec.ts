import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalCreate } from './animal-create';

describe('AnimalCreate', () => {
  let component: AnimalCreate;
  let fixture: ComponentFixture<AnimalCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
