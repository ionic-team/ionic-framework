import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';
import {List} from 'ionic2/components/list/list';
import {Item} from 'ionic2/components/item/item';

@Component({ selector: '[ion-app]' })
@Template({
  url: 'main.html',
  directives: [List, Item]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
