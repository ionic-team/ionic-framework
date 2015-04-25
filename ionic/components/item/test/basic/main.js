import {Component, View as NgView, For, bootstrap} from 'angular2/angular2'
import {Item, View, List} from 'ionic/ionic'

import {ItemPrimarySwipeButtons} from 'ionic/components/item/item-swipe-buttons'

@Component({
  selector: '[ion-app]'
})
@NgView({
  templateUrl: 'main.html',
  directives: [Item, View, List, For, ItemPrimarySwipeButtons]
})
class App{
  constructor() {
    this.items = [1, 2, 3, 4, 5]
  }
}

bootstrap(App)
