import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadelCComponent } from './sadel-c.component';

describe('SadelCComponent', () => {
  let component: SadelCComponent;
  let fixture: ComponentFixture<SadelCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SadelCComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadelCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
