import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadelFComponent } from './sadel-f.component';

describe('SadelFComponent', () => {
  let component: SadelFComponent;
  let fixture: ComponentFixture<SadelFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SadelFComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadelFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
