import { Directive } from '@angular/core';

/**
  * @name Avatar
  * @module ionic
  * @description
  * The Avatar component creates a circular image. Avatar's must be nested inside `ion-item`, and
  * can be positioned on the left or right side of an item with the `item-left` or `item-right` directive.
  *
  * @usage
  * ```
  * <ion-item>
  *   <ion-avatar item-left>
  *     <img src="img/avatar-cher.png">
  *   </ion-avatar>
  * </ion-item>
  * ```
  *
  * @demo /docs/v2/demos/src/avatar/basic
  * @see {@link /docs/v2/components/#avatar-list Avatar Component Docs}
  * @see {@link ../item/Item Item API Docs}
 */
@Directive({
  selector: 'ion-avatar'
})
export class Avatar {

}
