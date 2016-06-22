import { Component, ElementRef, forwardRef, Inject } from '@angular/core';

import { Item } from './item';

/**
 * @private
 */
@Component({
  selector: 'ion-reorder',
  template: `<ion-icon name="menu"></ion-icon>`
})
export class ItemReorder {
  constructor(
    @Inject(forwardRef(() => Item)) item: Item,
    elementRef: ElementRef) {
    elementRef.nativeElement['$ionComponent'] = item;
  }
}
