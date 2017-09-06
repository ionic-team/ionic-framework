import { ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
  * @name Note
  * @module ionic
  * @description
  * A note is detailed item in an ion-item. It creates greyed out element that can be on the left or right side of an item.
  * @usage
  *
  * ```html
  * <ion-content>
  *   <ion-list>
  *     <ion-item>
  *       <ion-note item-start>
  *         Left Note
  *       </ion-note>
  *       My Item
  *       <ion-note item-end>
  *         Right Note
  *       </ion-note>
  *     </ion-item>
  *   </ion-list>
  * </ion-content>
  *```
 * {@link /docs/api/components/api/components/item/item ion-item}
  */
export declare class Note extends Ion {
    constructor(config: Config, elementRef: ElementRef, renderer: Renderer);
}
