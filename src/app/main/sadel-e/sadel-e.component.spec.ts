import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadelEComponent } from './sadel-e.component';

describe('SadelEComponent', () => {
  let component: SadelEComponent;
  let fixture: ComponentFixture<SadelEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SadelEComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadelEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
