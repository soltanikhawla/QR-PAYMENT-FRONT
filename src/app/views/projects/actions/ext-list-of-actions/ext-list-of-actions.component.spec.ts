import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtListOfActionsComponent } from './ext-list-of-actions.component';

describe('ExtListOfActionsComponent', () => {
  let component: ExtListOfActionsComponent;
  let fixture: ComponentFixture<ExtListOfActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtListOfActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtListOfActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
