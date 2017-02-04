import { Directive } from '@angular/core';

/**
 * @private
 */
@Directive({
  selector: 'ion-item,[ion-item]',
  host: {
    'class': 'item-block'
  }
})
export class ItemContent { }
