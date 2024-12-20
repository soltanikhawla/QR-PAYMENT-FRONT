import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FigurecardComponent } from './figurecard.component';

describe('FigurecardComponent', () => {
  let component: FigurecardComponent;
  let fixture: ComponentFixture<FigurecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FigurecardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FigurecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
