import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterListActionsComponent } from './inter-list-actions.component';

describe('InterListActionsComponent', () => {
  let component: InterListActionsComponent;
  let fixture: ComponentFixture<InterListActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterListActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterListActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
