import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadelDComponent } from './sadel-d.component';

describe('SadelDComponent', () => {
  let component: SadelDComponent;
  let fixture: ComponentFixture<SadelDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SadelDComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadelDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
