import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingFileComponent } from './mapping-file.component';

describe('MappingFileComponent', () => {
  let component: MappingFileComponent;
  let fixture: ComponentFixture<MappingFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MappingFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
