import {App, ActionSheet} from 'ionic/ionic';

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

@App({
  templateUrl: 'main.html'
})
class DemoApp {

  constructor(actionSheet: ActionSheet) {
    this.actionSheet = actionSheet;
    this.component = {
      title: 'Action Sheet',
    }
    window.onmessage = (e) => {
        this.component.title = toTitleCase(e.data.replace('-', ' '));
    };
  }

  openMenu() {
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