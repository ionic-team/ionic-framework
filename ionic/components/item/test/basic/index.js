import {NgFor} from 'angular2/angular2';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Item, List} from 'ionic/ionic'
import {ItemPrimarySwipeButtons} from 'ionic/components/item/item-swipe-buttons'


@Component({
  selector: 'ion-view'
})
@View({
  templateUrl: 'main.html',
  directives: [Item, List, NgFor, ItemPrimarySwipeButtons]
})
class IonicApp {
  constructor() {
    this.items = [1, 2, 3, 4, 5]
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
