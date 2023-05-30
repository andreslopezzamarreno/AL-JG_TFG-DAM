import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisestadisticasComponent } from './misestadisticas.component';

describe('MisestadisticasComponent', () => {
  let component: MisestadisticasComponent;
  let fixture: ComponentFixture<MisestadisticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MisestadisticasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MisestadisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
