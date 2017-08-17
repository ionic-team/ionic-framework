import { ElementRef, EventEmitter, NgZone, QueryList, Renderer } from '@angular/core';
import { Item } from './item';
import { List } from '../list/list';
import { Platform } from '../../platform/platform';
import { ItemOptions } from './item-options';
/**
 * @name ItemSliding
 * @description
 * A sliding item is a list item that can be swiped to reveal buttons. It requires
 * an [Item](../Item) component as a child and a [List](../../list/List) component as
 * a parent. All buttons to reveal can be placed in the `<ion-item-options>` element.
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item-sliding #item>
 *     <ion-item>
 *       Item
 *     </ion-item>
 *     <ion-item-options side="left">
 *       <button ion-button (click)="favorite(item)">Favorite</button>
 *       <button ion-button color="danger" (click)="share(item)">Share</button>
 *     </ion-item-options>
 *
 *     <ion-item-options side="right">
 *       <button ion-button (click)="unread(item)">Unread</button>
 *     </ion-item-options>
 *   </ion-item-sliding>
 * </ion-list>
 * ```
 *
 * ### Swipe Direction
 * By default, the buttons are revealed when the sliding item is swiped from right to left,
 * so the buttons are placed in the right side. But it's also possible to reveal them
 * in the right side (sliding from left to right) by setting the `side` attribute
 * on the `ion-item-options` element. Up to 2 `ion-item-options` can used at the same time
 * in order to reveal two different sets of buttons depending the swipping direction.
 *
 * ```html
 * <ion-item-options side="right">
 *   <button ion-button (click)="archive(item)">
 *     <ion-icon name="archive"></ion-icon>
 *     Archive
 *   </button>
 * </ion-item-options>
 *
 * <ion-item-options side="left">
 *   <button ion-button (click)="archive(item)">
 *     <ion-icon name="archive"></ion-icon>
 *     Archive
 *   </button>
 * </ion-item-options>
 * ```
 *
 * ### Listening for events (ionDrag) and (ionSwipe)
 * It's possible to know the current relative position of the sliding item by subscribing
 * to the (ionDrag)` event.
 *
 * ```html
 * <ion-item-sliding (ionDrag)="logDrag($event)">
 *   <ion-item>Item</ion-item>
 *   <ion-item-options>
 *     <button ion-button>Favorite</button>
 *   </ion-item-options>
 * </ion-item-sliding>
 * ```
 *
 * ### Button Layout
 * If an icon is placed with text in the option button, by default it will
 * display the icon on top of the text. This can be changed to display the icon
 * to the left of the text by setting `icon-start` as an attribute on the
 * `<ion-item-options>` element.
 *
 * ```html
 * <ion-item-options icon-start>
 *    <button ion-button (click)="archive(item)">
 *      <ion-icon name="archive"></ion-icon>
 *      Archive
 *    </button>
 *  </ion-item-options>
 *
 * ```
 *
 * ### Expandable Options
 *
 * Options can be expanded to take up the full width of the item if you swipe past
 * a certain point. This can be combined with the `ionSwipe` event to call methods
 * on the class.
 *
 * ```html
 *
 * <ion-item-sliding (ionSwipe)="delete(item)">
 *   <ion-item>Item</ion-item>
 *   <ion-item-options>
 *     <button ion-button expandable (click)="delete(item)">Delete</button>
 *   </ion-item-options>
 * </ion-item-sliding>
 * ```
 *
 * We can call `delete` by either clicking the button, or by doing a full swipe on the item.
 *
 * @demo /docs/demos/src/item-sliding/
 * @see {@link /docs/components#lists List Component Docs}
 * @see {@link ../Item Item API Docs}
 * @see {@link ../../list/List List API Docs}
 */
export declare class ItemSliding {
    private _plt;
    private _renderer;
    private _elementRef;
    private _zone;
    private _openAmount;
    private _startX;
    private _optsWidthRightSide;
    private _optsWidthLeftSide;
    private _sides;
    private _tmr;
    private _leftOptions;
    private _rightOptions;
    private _optsDirty;
    private _state;
    /**
     * @hidden
     */
    item: Item;
    /**
     * @output {event} Emitted when the sliding position changes.
     * It reports the relative position.
     *
     * ```ts
     * ondrag(item) {
     *   let percent = item.getSlidingPercent();
     *   if (percent > 0) {
     *     // positive
     *     console.log('right side');
     *   } else {
     *     // negative
     *     console.log('left side');
     *   }
     *   if (Math.abs(percent) > 1) {
     *     console.log('overscroll');
     *   }
     * }
     * ```
     *
     */
    ionDrag: EventEmitter<ItemSliding>;
    constructor(list: List, _plt: Platform, _renderer: Renderer, _elementRef: ElementRef, _zone: NgZone);
    _itemOptions: QueryList<ItemOptions>;
    /**
     * @hidden
     */
    getOpenAmount(): number;
    /**
     * @hidden
     */
    getSlidingPercent(): number;
    /**
     * @hidden
     */
    startSliding(startX: number): void;
    /**
     * @hidden
     */
    moveSliding(x: number): number;
    /**
     * @hidden
     */
    endSliding(velocity: number): number;
    /**
     * @hidden
     */
    private fireSwipeEvent();
    /**
     * @hidden
     */
    private calculateOptsWidth();
    private _setOpenAmount(openAmount, isFinal);
    private _setState(state);
    /**
     * Close the sliding item. Items can also be closed from the [List](../../list/List).
     *
     * The sliding item can be closed by grabbing a reference to `ItemSliding`. In the
     * below example, the template reference variable `slidingItem` is placed on the element
     * and passed to the `share` method.
     *
     * ```html
     * <ion-list>
     *   <ion-item-sliding #slidingItem>
     *     <ion-item>
     *       Item
     *     </ion-item>
     *     <ion-item-options>
     *       <button ion-button (click)="share(slidingItem)">Share</button>
     *     </ion-item-options>
     *   </ion-item-sliding>
     * </ion-list>
     * ```
     *
     * ```ts
     * import { Component } from '@angular/core';
     * import { ItemSliding } from 'ionic-angular';
     *
     * @Component({...})
     * export class MyClass {
     *   constructor() { }
     *
     *   share(slidingItem: ItemSliding) {
     *     slidingItem.close();
     *   }
     * }
     * ```
     */
    close(): void;
    /**
     * @hidden
     */
    setElementClass(cssClass: string, shouldAdd: boolean): void;
}
