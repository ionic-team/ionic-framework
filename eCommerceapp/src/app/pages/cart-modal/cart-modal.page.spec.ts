import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartModalPage } from './cart-modal.page';

describe('CartModalPage', () => {
  let component: CartModalPage;
  let fixture: ComponentFixture<CartModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CartModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
