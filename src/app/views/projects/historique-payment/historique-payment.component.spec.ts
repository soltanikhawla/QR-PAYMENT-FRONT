import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriquePaymentComponent } from './historique-payment.component';

describe('HistoriquePaymentComponent', () => {
  let component: HistoriquePaymentComponent;
  let fixture: ComponentFixture<HistoriquePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriquePaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriquePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
