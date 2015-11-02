import {Component} from 'angular2/angular2';


/**
 * Creates a list-item that can easily be swiped,
 * deleted, reordered, edited, and more.
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
 */
@Component({
  selector: 'ion-item,[ion-item]',
  template:
    '<ng-content select="[item-left]"></ng-content>' +
    '<ng-content select="[item-right]"></ng-content>' +
    '<ion-item-content>' +
      '<ng-content></ng-content>'+
    '</ion-item-content>',
  host: {
    '[class.item]': 'isItem'
  }
})
export class Item {
  constructor() {
    this.isItem = true;
  }
}
