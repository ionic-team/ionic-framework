import { Directive } from '@angular/core';

/**
 * @hidden
 */
@Directive({
  selector: 'ion-item,[ion-item]',
  host: {
    'class': 'item-block'
  }
})
export class ItemContent { }
