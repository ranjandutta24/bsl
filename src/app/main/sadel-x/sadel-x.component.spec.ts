import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadelXComponent } from './sadel-x.component';

describe('SadelXComponent', () => {
  let component: SadelXComponent;
  let fixture: ComponentFixture<SadelXComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SadelXComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadelXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
