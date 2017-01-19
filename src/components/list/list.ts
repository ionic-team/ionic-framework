import { Directive, ElementRef, Input, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { DomController } from '../../platform/dom-controller';
import { GestureController } from '../../gestures/gesture-controller';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';
import { ItemSlidingGesture } from '../item/item-sliding-gesture';
import { Platform } from '../../platform/platform';

/**
 * The List is a widely used interface element in almost any mobile app,
 * and can include content ranging from basic text all the way to
 * buttons, toggles, icons, and thumbnails.
 *
 * Both the list, which contains items, and the list items themselves
 * can be any HTML element.
 *
 * Using the List and Item components make it easy to support various
 * interaction modes such as swipe to edit, drag to reorder, and
 * removing items.
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item *ngFor="let contact of contacts">
 *     {% raw %}{{contact.firstName}} {{contact.lastName}}{% endraw %}
 *   </ion-item>
 * </ion-list>
 * ```
 *
 * ## Common Usage Patterns
 *
 * ### Inset List
 * 
 * Lists don’t have an outside margin by default.  To add one, add the `inset` 
 * attribute to the `ion-list` component.
 * 
 * ```html
 * <ion-list inset>
 *   <button ion-item *ngFor="let item of items"">
 *     {% raw %}{{ item }}{% endraw %}
 *   </button> 
 * </ion-list>
 * ```
 * 
 * ### List Dividers
 * 
 * To divide groups of items, use `<ion-item-group>` instead of `<ion-list>`, then 
 * use `<ion-item-divider>` components to divide the group in to multiple sections:
 * 
 * ```html
 * <ion-item-group>
 *   <ion-item-divider color="light">A</ion-item-divider>
 *   <ion-item>Angola</ion-item>
 *   <ion-item>Argentina</ion-item>
 * </ion-item-group>
 * ```
 * 
 * ### List Headers
 * 
 * Each list can include a header at the top of the list by including
 * `<ion-list-header>`:
 * 
 * ```html
 * <ion-list>
 *   <ion-list-header>
 *     Action
 *   </ion-list-header>
 *   <ion-item>Terminator II</ion-item>
 *   <ion-item>The Empire Strikes Back</ion-item>
 *   <ion-item>Blade Runner</ion-item>
 * </ion-list>
 * ```
 * 
 * ### Icon List
 * 
 * Adding icons to list items is a great way to hint about the contents of each item. 
 * The position of the icon can be set using the `item-left` and `item-right` attributes. 
 * The size of the icon defaults to `small`, and can be made larger with the `large` attribute.
 * 
 * ```html
 * <ion-list>
 *   <ion-item>
 *     <ion-icon name="leaf" item-left></ion-icon>
 *       Herbology
 *     <ion-icon name="rose" item-right></ion-icon>
 *   </ion-item>
 * </ion-list>
 * ```
 * 
 * 
 * ### Avatar List
 * 
 * Item avatars showcase an image larger than an icon, but smaller than a thumbnail. 
 * To use an avatar, add an `<ion-avatar>` component inside of an item. The position 
 * of the avatar can be set using the `item-left` and `item-right` attributes:
 * 
 * ```html
 * <ion-list>
 *   <ion-item>
 *     <ion-avatar item-left>
 *       <img src="img/avatar-cher.png">
 *     </ion-avatar>
 *     <h2>Cher</h2>
 *     <p>Ugh. As if.</p>
 *   </ion-item>
 * </ion-list>
 * ```
 * 
 * ### Multi-line List
 * 
 * Multi-line lists are identical to regular lists, except items have multiple lines 
 * of text. When an `<ion-item`> component contains multiple header or paragraph elements, 
 * it will automatically expand it’s height to fit the new lines of text. Below is an 
 * example with three lines of text:
 * 
 * ```html
 * <ion-list>
 *   <ion-item>
 *     <ion-avatar item-left>
 *       <img src="img/avatar-finn.png">
 *     </ion-avatar>
 *     <h2>Finn</h2>
 *     <h3>Don't Know What To Do!</h3>
 *     <p>I've had a pretty messed up day. If we just...</p>
 *   </ion-item>
 * </ion-list>
 * ```
 * 
 * ### Sliding List
 * 
 * Sliding items can be swiped to the left or right to reveal a hidden set of buttons.  To 
 * use a sliding item, add an `ion-item-sliding` component inside of an `ion-list` component. 
 * Next, add an `<ion-item-options>` component inside of the sliding item to contain the 
 * buttons.
 * 
 * For more information, Check out the [API docs](../../item/ItemSliding).
 * 
 * ```html
 * <ion-list>
 *   <ion-item-sliding>
 *     <ion-item>
 *       <ion-avatar item-left>
 *         <img src="img/slimer.png">
 *       </ion-avatar>
 *       <h2>Slimer</h2>
 *     </ion-item>
 *     <ion-item-options side="left">
 *       <button ion-button color="primary">
 *         <ion-icon name="text"></ion-icon>
 *         Text
 *       </button>
 *       <button ion-button color="secondary">
 *         <ion-icon name="call"></ion-icon>
 *         Call
 *       </button>
 *     </ion-item-options>
 *     <ion-item-options side="right">
 *       <button ion-button color="primary">
 *         <ion-icon name="mail"></ion-icon>
 *         Email
 *       </button>
 *     </ion-item-options>
 *   </ion-item-sliding>
 * </ion-list>
 * ```
 * 
 * ### Thumbnail List
 * 
 * Item thumbnails showcase an image that takes up the entire height of an item. To use 
 * a thumbnail, add an `<ion-thumbnail>` component inside of an item. The position of 
 * the thumbnail can be set using the `item-left` and `item-right` attributes:
 * 
 * ```html
 * <ion-list>
 *   <ion-item>
 *     <ion-thumbnail item-left>
 *       <img src="img/thumbnail-totoro.png">
 *     </ion-thumbnail>
 *     <h2>My Neighbor Totoro</h2>
 *     <p>Hayao Miyazaki • 1988</p>
 *     <button ion-button clear item-right>View</button>
 *   </ion-item>
 * </ion-list>
 * ```
 *
 * @property [no-lines] - Removes the dividing line between items in the list.
 *
 * @demo /docs/v2/demos/src/list/basic
 * @additionalDemo inset-list: /docs/v2/demos/src/list/inset/
 * @additionalDemo list-headers: /docs/v2/demos/src/list/headers/
 * @additionalDemo list-dividers: /docs/v2/demos/src/list/dividers/
 * @additionalDemo icon-list: /docs/v2/demos/src/list/icon/
 * @additionalDemo avatar-list: /docs/v2/demos/src/list/avatar/
 * @additionalDemo multi-line-list: /docs/v2/demos/src/list/multiline/
 * @additionalDemo sliding-list: /docs/v2/demos/src/list/sliding/
 * @additionalDemo thumbnail-list: /docs/v2/demos/src/list/thumbnail/
 * @see {@link /docs/v2/components#lists List Component Docs}
 * @see {@link ../../item/Item Item API Docs}
 * @see {@link ../../item/ItemSliding ItemSliding API Docs}
 *
 */
@Directive({
  selector: 'ion-list',
})
export class List extends Ion {
  private _enableSliding: boolean = true;
  private _containsSlidingItems: boolean = false;
  private _slidingGesture: ItemSlidingGesture;

  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    private _plt: Platform,
    private _gestureCtrl: GestureController,
    private _domCtrl: DomController,
  ) {
    super(config, elementRef, renderer, 'list');
  }

  /**
   * @input {string} The platform mode to apply to this component. Mode can be `ios`, `wp`, or `md`.   
   */
  @Input()
  set mode(val: string) {
    this._setMode(val);
  }

  /**
   * @input {boolean} Sets whether item sliding is enabled
   */
  @Input()
  get sliding(): boolean {
    return this._enableSliding;
  }
  set sliding(val: boolean) {
    this._enableSliding = isTrueProperty(val);
    this._updateSlidingState();
  }

  /**
   * @private
   */
  containsSlidingItem(contains: boolean) {
    this._containsSlidingItems = contains;
    this._updateSlidingState();
  }


  private _updateSlidingState() {
    let shouldSlide = this._enableSliding && this._containsSlidingItems;
    if (!shouldSlide) {
      this._slidingGesture && this._slidingGesture.destroy();
      this._slidingGesture = null;

    } else if (!this._slidingGesture) {
      console.debug('enableSlidingItems');
      this._slidingGesture = new ItemSlidingGesture(this._plt, this, this._gestureCtrl, this._domCtrl);
      this._slidingGesture.listen();
    }
  }

  /**
   * Closes any sliding items that are open.
   */
  closeSlidingItems() {
    this._slidingGesture && this._slidingGesture.closeOpened();
  }

  /**
   * @private
   */
  destroy() {
    this._slidingGesture && this._slidingGesture.destroy();
  }
}
