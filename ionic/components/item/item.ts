import {Component} from 'angular2/angular2';


/**
 * Creates a list-item that can easily be swiped, deleted, reordered, edited, and more.
 *
 * There are three common ways to use an item:
 * - Use `<ion-item>` for something that is only non-clickable text.
 * - Use `<button ion-item>` for something that can be clicked/tapped. Typically this element will also have a `(click)` handler.
 * - Use `<a ion-item>` for when the item needs to contain a `href`.
 *
 * By default, `<button ion-item>` and `<a ion-item>` will receive a right arrow icon on iOS to signal that tapping the item will reveal more information.
 * To hide this icon, add the `detail-none` attribute to the item (eg: `<button ion-item detail-none>`). To add the icon when it is not displayed by default,
 * add the `detail-push` attribute (eg: `<ion-item detail-push>`).
 *
 * To break an item up into multiple columns, add multiple `<ion-item-content>` components inside of the item. By default,
 * this component will automatically be added inside of an `<ion-item>`, giving it a single column.
 *
 *
 * @usage
 * ```html
 *
 * <ion-list>
 *
 *   // default item
 *   <ion-item>
 *     {{item.title}}
 *   </ion-item>
 *
 *   // multiple item-content containers
 *   <ion-item>
 *     <ion-item-content>First Column</ion-item-content>
 *     <ion-item-content>Second Column</ion-item-content>
 *     <ion-item-content>Third Column</ion-item-content>
 *   </ion-item>
 *
 * </ion-list>
 *
 *  ```
 */
@Component({
  selector: 'ion-item,[ion-item]',
  template:
    '<ng-content select="[item-left]"></ng-content>' +
    '<div class="item-inner">' +
      '<ng-content select="ion-item-content"></ng-content>' +
      '<ion-item-content cnt>' +
        '<ng-content></ng-content>'+
      '</ion-item-content>' +
      '<ng-content select="[item-right]"></ng-content>' +
    '</div>',
  host: {
    'class': 'item'
  }
})
export class Item {}
