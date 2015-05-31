import {NgFor} from 'angular2/angular2';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {ActionMenu, NavbarTemplate, Navbar, NavController, Button, Content} from 'ionic/ionic';

@Component({
  selector: 'ion-view'
})
@View({
  template: `
  <ion-navbar *navbar><ion-title>Aciton Menu</ion-title></ion-navbar>

  <ion-content class="padding">
    <button primary (click)="openMenu()">Open Menu</button>
  </ion-content>
  `,
  directives: [NavbarTemplate, Navbar, Content, Button]
})
export class ActionMenuPage {
  constructor(nav: NavController) {
    this.nav = nav;
    window.nav = nav;
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
