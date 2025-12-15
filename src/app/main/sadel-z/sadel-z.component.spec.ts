import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadelZComponent } from './sadel-z.component';

describe('SadelZComponent', () => {
  let component: SadelZComponent;
  let fixture: ComponentFixture<SadelZComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SadelZComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadelZComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
