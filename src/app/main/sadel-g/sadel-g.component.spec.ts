import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadelGComponent } from './sadel-g.component';

describe('SadelGComponent', () => {
  let component: SadelGComponent;
  let fixture: ComponentFixture<SadelGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SadelGComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadelGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
