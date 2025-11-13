import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadelBComponent } from './sadel-b.component';

describe('SadelBComponent', () => {
  let component: SadelBComponent;
  let fixture: ComponentFixture<SadelBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SadelBComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadelBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
