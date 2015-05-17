import {bootstrap, For} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import { bind } from 'angular2/di';
import { PipeRegistry } from 'angular2/change_detection';

import {FormBuilder, Validators, FormDirectives, Control, ControlGroup} from 'angular2/forms';

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
  directives: [FormDirectives].concat([Content, List, Item, SearchBar, For])
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')

    var fb = new FormBuilder();
    this.form = fb.group({
      searchQuery: ['', Validators.required]
    });


    this.query = 'HELLO';

    this.items = []
    for(let i = 0; i < 100; i++) {
      this.items.push({
        title: randomTitle()
      })
    }
  }
  getItems() {
    var q = this.form.controls.searchQuery.value;
    if(q.trim() == '') {
      return this.items;
    }
    return this.items.filter((v) => {
      if(v.title.toLowerCase().indexOf(q.toLowerCase()) >= 0) {
        return true;
      }
      return false;
    })
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
