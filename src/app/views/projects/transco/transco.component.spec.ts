import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscoComponent } from './transco.component';

describe('TranscoComponent', () => {
  let component: TranscoComponent;
  let fixture: ComponentFixture<TranscoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranscoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranscoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
