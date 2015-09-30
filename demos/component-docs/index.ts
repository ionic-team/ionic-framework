import {App, ActionSheet} from 'ionic/ionic';
import {NgZone} from 'angular2/angular2';

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

@App({
  templateUrl: 'main.html'
})
class DemoApp {

  component: any;
  actionSheet: any;

  constructor(actionSheet: ActionSheet, zone: NgZone) {
    this.actionSheet = actionSheet;
    this.component = {
        title: 'Action Sheets',
    };
    window.onmessage = (e) => {
      zone.run(() => {
        if (e.data) {
          var data = JSON.parse(e.data);
          this.component.title = toTitleCase(data.hash.replace('-', ' '));
        }
      });
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