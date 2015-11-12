import {Component} from 'angular2/angular2';


/**
 * Creates a list-item that can easily be swiped,
 * deleted, reordered, edited, and more.
 *
 * There are three common ways to use an item: 
 * - Use `<ion-item>` for something that is only non-clickable text.
 * - Use `<button ion-item>` for something that can be clicked/tapped. Typically this element will also have a `(click)` handler.
 * - Use `<a ion-item>` for when the item needs to contain a `href`.
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item *ng-for="#item of items" (click)="itemTapped($event, item)">
 *     {{item.title}}
 *     <ion-note item-right>
 *       {{item.note}}
 *     </ion-note>
 *   </ion-item>
 * </ion-list>
 *  ```
 * 
 */
@Component({
  selector: 'ion-item,[ion-item]',
  template:
    '<ng-content select="[item-left]"></ng-content>' +
    '<div class="item-inner">' +
      '<ng-content select="[item-right]"></ng-content>' +
      '<ion-item-content>' +
        '<ng-content></ng-content>'+
      '</ion-item-content>' +
    '</div>',
  host: {
    '[class.item]': 'isItem'
  }
})
export class Item {
  constructor() {
    this.isItem = true;
  }
}
