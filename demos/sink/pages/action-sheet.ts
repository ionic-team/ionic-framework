import {IonicApp, IonicView, NavController, ActionSheet} from 'ionic/ionic';

import {SinkPage} from '../sink-page';


@IonicView({
  template: `
  <ion-navbar *navbar><ion-nav-items primary><button icon (click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Action Sheet</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Action Sheet</h2>
    <p>
      The Action Sheet, similar to Action Sheet's on iOS, is a slide-up prompt
      that displays several options for the user to choose from before an action is performed.
    </p>
    <p>
      Action Sheet's are great for prompting for dangerous actions (like deleting a photo album),
      or showing a "context menu" with multiple actions the user can perform on something.
    </p>
    <button (click)="openMenu()">Open Menu</button>
  </ion-content>
  `
})
export class ActionSheetPage extends SinkPage {
  constructor(app: IonicApp, nav: NavController, actionSheet: ActionSheet) {
    super(app);

    this.nav = nav;
    this.actionSheet = actionSheet;
  }

  openMenu() {
    console.log('Opening ActionSheet')

    this.actionSheet.open({
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
    }).then(actionSheetRef => {
      this.actionSheetRef = actionSheetRef;
    })
  }

}
