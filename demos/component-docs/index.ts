import {App, IonicApp, ActionSheet, NavController, NavParams} from 'ionic/ionic';
import {Modal, IonicView, IonicConfig, Events, Animation} from 'ionic/ionic';
import {NgZone} from 'angular2/angular2';
import {NavigationDetailsPage} from 'navigation';
import {TabsPage} from 'tabs';
import {DemoModal} from 'modal';

import * as helpers from 'helpers';




@IonicView({
  templateUrl: 'main.html'
})
export class MainPage {

  component: any = { title: 'Action Sheets' };

  constructor(app: IonicApp,
              nav: NavController,
              actionSheet: ActionSheet,
              zone: NgZone,
              params: NavParams,
              modal: Modal,
              events: Events)
  {
    this.params = params;
    this.nav = nav;
    this.modal = modal;
    this.actionSheet = actionSheet;
    this.navDetailsPage = NavigationDetailsPage;
    this.demoModal = DemoModal;

    if (params.data.location) { this.component.title = params.data.location; }
    else if (window.location.hash) { this.component.title = window.location.hash; }

    window.addEventListener('message', (e) => {
      zone.run(() => {
        if (e.data) {
          var data = JSON.parse(e.data);
          this.component.title = helpers.toTitleCase(data.hash.replace('-', ' '));
          if (this.component.title === 'Tabs') {
            this.nav.setRoot(TabsPage);
          }
        }
      });
    });

    events.subscribe('page:locationChange', (data) => {
      this.component.title = data[0].componentName;
    });
  }

  // **************************
  // Action Sheets
  // **************************
  openMenu() {
    this.actionSheet.open({
      buttons: [
        { text: 'Share This' },
        { text: 'Move' }
      ],
      destructiveText: 'Delete',
      titleText: 'You Opened Action Sheet',
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

  // **************************
  // Navigation
  // **************************
  openNavDetailsPage(item) {
    this.nav.push(NavigationDetailsPage, {name: item});
  }


  // **************************
  // Modal
  // **************************
  openModal() {
    this.modal.open(this.demoModal, {
      handle: 'my-awesome-modal',
      enterAnimation: 'my-fade-in',
      leaveAnimation: 'my-fade-out'
    });
  }

}

class FadeIn extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('ease')
      .duration(450)
      .fadeIn();
  }
}

Animation.register('my-fade-in', FadeIn);

class FadeOut extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('ease')
      .duration(250)
      .fadeOut();
  }
}

Animation.register('my-fade-out', FadeOut);


@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>'  
})
class DemoApp {

  constructor() {
    this.rootPage = MainPage;
  }

}
