import {Platform, Page, ActionSheet} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'action-sheets/basic/basic.html',
  directives: [forwardRef(() => AndroidAttribute)]

})
export class BasicPage {

  constructor(actionSheet: ActionSheet, platform: Platform) {
    this.actionSheet = actionSheet;
    this.platform = platform;
  }

  openMenu() {
    if (this.platform.is('android')) {
      var androidSheet = {

        buttons: [
          { text: 'Share', icon: 'share' },
          { text: 'Play', icon: 'arrow-dropright-circle'},
          { text: 'Favorite', icon: 'ion-md-heart-outline'}
        ],
        destructiveText: 'Delete',
        titleText: 'Albums',
        cancelText: 'Cancel',
        cancel: function() {
          console.log('Canceled');
        },
        destructiveButtonClicked: () => {
          console.log('Destructive clicked');
        },
        buttonClicked: function(index) {
          console.log('Button clicked', index);
          if (index == 1) { return false; }
          return true;
        }
      };
    }

    this.actionSheet.open(androidSheet || {
      buttons: [
        { text: 'Share'},
        { text: 'Play'},
        { text: 'Favorite'}
      ],
      destructiveText: 'Delete',
      titleText: 'Albums',
      cancelText: 'Cancel',
      cancel: function() {
        console.log('Canceled');
      },
      destructiveButtonClicked: () => {
        console.log('Destructive clicked');
      },
      buttonClicked: function(index) {
        console.log('Button clicked', index);
        if (index == 1) { return false; }
        return true;
      }

    }).then(actionSheetRef => {
      console.log(actionSheetRef);
      this.actionSheetRef = actionSheetRef;
    });
  }

  onPageWillLeave() {
    let actionSheet = this.actionSheet.get();
    if (actionSheet) {
      actionSheet.close();
    }
  }

}
