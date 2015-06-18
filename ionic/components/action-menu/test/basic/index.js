import {Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Button, Content} from 'ionic/ionic';
import {ActionMenu} from 'ionic/components/action-menu/action-menu';


@Component({ selector: 'ion-view' })
@View({
  templateUrl: 'main.html',
  directives: [Button, Content]
})
export default class IonicApp {

  openMenu() {
    console.log('Opening ActionMenu')

    ActionMenu.open({
      buttons: [
        { text: 'Share This' },
        { text: 'Move' }
      ],
      destructiveText: 'Delete',
      titleText: 'Modify your album',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
        console.log('Canceled');
      },
      destructiveButtonClicked: () => {
        console.log('Destructive clicked');
      },
      buttonClicked: function(index) {
        console.log('Button clicked', index);
        if(index == 1) { return false; }
        return true;
      }
    }).then(actionMenu => {
      this.actionMenu = actionMenu;
    })
  }

}
