import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadelIComponent } from './sadel-i.component';

describe('SadelIComponent', () => {
  let component: SadelIComponent;
  let fixture: ComponentFixture<SadelIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SadelIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadelIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
