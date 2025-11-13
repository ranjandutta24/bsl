import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadelHComponent } from './sadel-h.component';

describe('SadelHComponent', () => {
  let component: SadelHComponent;
  let fixture: ComponentFixture<SadelHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SadelHComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadelHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
