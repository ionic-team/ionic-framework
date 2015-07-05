import {NgFor, ProtoViewRef, ViewContainerRef} from 'angular2/angular2'
import {Component, Directive, View, Parent} from 'angular2/angular2';

import {Content, List, Item, ItemGroup, ItemGroupTitle} from 'ionic/ionic';

@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Content, List, Item, ItemGroup, ItemGroupTitle, NgFor]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')

    this.groups = [];

    var letters = "abcdefghijklmnopqrstuvwxyz".split('');

    for(let i = 0; i < letters.length; i++) {
      let group = [];
      for(let j = 0; j < 10; j++) {
        group.push({
          title: letters[i] + j
        });
      }
      this.groups.push({
        title: letters[i].toUpperCase(),
        items: group
      });
    }
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
