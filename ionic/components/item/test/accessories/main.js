import {Component, View, For, bootstrap} from 'angular2/angular2'
import {Item, List} from 'ionic/ionic'

import {ItemPrimarySwipeButtons} from 'ionic/components/item/item-swipe-buttons'

@Component({
  selector: '[ion-app]'
})
@View({
  templateUrl: 'main.html',
  directives: [Item, List, For, ItemPrimarySwipeButtons]
})
class App{
  constructor() {
    this.items = [1, 2, 3, 4, 5]
  }
}

bootstrap(App)
