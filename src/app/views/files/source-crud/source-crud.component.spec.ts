import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceCRUDComponent } from './source-crud.component';

describe('SourceCRUDComponent', () => {
  let component: SourceCRUDComponent;
  let fixture: ComponentFixture<SourceCRUDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceCRUDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceCRUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
