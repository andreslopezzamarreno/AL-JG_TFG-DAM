import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleshootComponent } from './bubbleshoot.component';

describe('BubbleshootComponent', () => {
  let component: BubbleshootComponent;
  let fixture: ComponentFixture<BubbleshootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BubbleshootComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BubbleshootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
