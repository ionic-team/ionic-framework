import {bootstrap} from 'angular2/angular2'
import {Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Ionic, Button, Content} from 'ionic/ionic';
import {ActionMenu} from 'ionic/components/action-menu/action-menu';


@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Button, Content]
})
class IonicApp extends Ionic {
  constructor() {
    super();
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
  bootstrap(IonicApp).then((appRef) => {
    appRef.hostComponent.setAppRef(appRef);
  })
}
