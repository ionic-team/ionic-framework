import {App, ActionSheet} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {

  constructor(actionSheet: ActionSheet) {
    this.actionSheet = actionSheet;
  }

  openActionSheet() {

    this.actionSheet.open({
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

    }).then(actionSheetRef => {
      this.actionSheetRef = actionSheetRef;
    });

  }

}
