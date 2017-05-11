import { Component, ElementRef, HostListener } from '@angular/core';

import { findReorderItem } from './item-reorder-util';

/**
 * @hidden
 */
@Component({
  selector: 'ion-reorder',
  template: `<ion-icon name="reorder"></ion-icon>`
})
export class Reorder {
  constructor(
    private elementRef: ElementRef) {
    elementRef.nativeElement['$ionComponent'] = this;
  }

  getReorderNode(): HTMLElement {
    return findReorderItem(this.elementRef.nativeElement, null);
  }

  @HostListener('click', ['$event'])
  onClick(ev: UIEvent) {
    // Stop propagation if click event reaches ion-reorder
    ev.preventDefault();
    ev.stopPropagation();
  }
}
