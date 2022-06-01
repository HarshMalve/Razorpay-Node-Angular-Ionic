import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RazorpayComponentComponent } from './razorpay-component.component';

describe('RazorpayComponentComponent', () => {
  let component: RazorpayComponentComponent;
  let fixture: ComponentFixture<RazorpayComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RazorpayComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RazorpayComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
