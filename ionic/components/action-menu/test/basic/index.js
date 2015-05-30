import {bootstrap, ElementRef} from 'angular2/angular2'
import {Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Ionic, Button, Content} from 'ionic/ionic';
import {ActionMenu} from 'ionic/components/action-menu/action-menu';


@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Button, Content]
})
class IonicApp {
  constructor(elementRef: ElementRef) {
    console.log('IonicApp Start')
    Ionic.setRootElementRef(elementRef);
  }

  openMenu() {
    console.log('Opening ActionMenu')

    ActionMenu.open({
      buttons: [
        { text: '<b>Share</b> This' },
        { text: 'Move' }
      ],
      destructiveText: 'Delete',
      titleText: 'Modify your album',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
        console.log('Canceled');
      },
      buttonClicked: function(index) {
        console.log('Button clicked', index);
        return true;
      }
    }).then(actionMenu => {
      this.actionMenu = actionMenu;
    })
  }
}

export function main() {
  bootstrap(IonicApp).then((appRef) => {
    Ionic.setAppRef(appRef);
  })
}
