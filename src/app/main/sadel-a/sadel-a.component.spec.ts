import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadelAComponent } from './sadel-a.component';

describe('SadelAComponent', () => {
  let component: SadelAComponent;
  let fixture: ComponentFixture<SadelAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SadelAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadelAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
