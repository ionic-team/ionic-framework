import {bootstrap, For} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import { bind } from 'angular2/di';
import { PipeRegistry } from 'angular2/change_detection';

import {Content} from 'ionic/components/content/content';
import {List} from 'ionic/components/list/list';
import {Item} from 'ionic/components/item/item';
import {SearchBar} from 'ionic/components/search-bar/search-bar';
import {SearchPipe} from 'ionic/components/search-bar/search-bar';

function randomTitle() {
  var items = ['Pizza', 'Pumpkin', 'Apple', 'Bologna'];
  return items[Math.floor(Math.random() * items.length)];
}

@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Content, List, Item, SearchBar, For]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')

    this.query = '';

    this.items = []
    for(let i = 0; i < 100; i++) {
      this.items.push({
        title: randomTitle()
      })
    }
  }
}

import { defaultPipes } from 'angular2/change_detection';
export var pipes = Object.assign({}, defaultPipes, {
  'search': [
    new SearchPipe()
  ]
});

export function main() {
  bootstrap(IonicApp, [
    bind(PipeRegistry).toValue(new PipeRegistry(pipes))
  ]);
}
