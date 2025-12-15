import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoilInfoComponent } from './coil-info.component';

describe('CoilInfoComponent', () => {
  let component: CoilInfoComponent;
  let fixture: ComponentFixture<CoilInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoilInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoilInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
