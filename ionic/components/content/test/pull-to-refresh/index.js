import {NgFor, ProtoViewRef, ViewContainerRef} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Parent} from 'angular2/src/core/annotations_impl/visibility';

import {Refresher, Content, List, Item} from 'ionic/ionic';


@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Content, List, Item, Refresher]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
  doRefresh() {
    console.log('DOREFRESH')
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
