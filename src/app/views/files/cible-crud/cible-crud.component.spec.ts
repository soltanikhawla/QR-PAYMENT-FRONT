import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibleCRUDComponent } from './cible-crud.component';

describe('CibleCRUDComponent', () => {
  let component: CibleCRUDComponent;
  let fixture: ComponentFixture<CibleCRUDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CibleCRUDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CibleCRUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
