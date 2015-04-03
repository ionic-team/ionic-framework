import {bootstrap} from 'angular2/core'
import {Component, Template, For} from 'angular2/angular2'
import {Item, View, List} from 'ionic2/components'

import {ItemPrimarySwipeButtons} from 'ionic2/components/item/item-swipe-buttons'

@Component({
  selector: '[ion-app]'
})
@Template({
  url: 'main.html',
  directives: [Item, View, List, For, ItemPrimarySwipeButtons]
})
class App{
  constructor() {
    this.items = [1, 2, 3, 4, 5]
  }
}

bootstrap(App)

