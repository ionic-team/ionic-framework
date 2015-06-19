import {NgFor} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import { bind } from 'angular2/di';
import { PipeRegistry } from 'angular2/change_detection';

import {FormBuilder, Validators, formDirectives, Control, ControlGroup} from 'angular2/forms';

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
  directives: [formDirectives].concat([Content, List, Item, SearchBar, NgFor])
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

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
