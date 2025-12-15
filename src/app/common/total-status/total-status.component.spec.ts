import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalStatusComponent } from './total-status.component';

describe('TotalStatusComponent', () => {
  let component: TotalStatusComponent;
  let fixture: ComponentFixture<TotalStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
