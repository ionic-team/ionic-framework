import {App, ActionMenu} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class IonicApp {

  constructor(actionMenu: ActionMenu) {
    this.actionMenu = actionMenu;
  }

  openMenu() {

    this.actionMenu.open({
      buttons: [
        { text: 'Share This' },
        { text: 'Move' }
      ],
      destructiveText: 'Delete',
      titleText: 'Modify your album',
      cancelText: 'Cancel',
      cancel: function() {
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

    }).then(actionMenuRef => {
      this.actionMenuRef = actionMenuRef;
    });

  }

}
