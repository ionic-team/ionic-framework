import {bootstrap} from 'angular2/angular2'
import {Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {ActionMenu} from 'ionic/components/action-menu/action-menu';


@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }

  openMenu() {
    console.log('Opening ActionMenu')
    ActionMenu.open({
      title: 'Do you really want to?'
    })
  }
}

export function main() {
  bootstrap(IonicApp);
}
