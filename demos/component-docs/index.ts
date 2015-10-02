import {App, IonicApp, ActionSheet, Animation, NavController, NavParams} from 'ionic/ionic';
import {IonicView, IonicConfig, Events} from 'ionic/ionic';
import {NgZone} from 'angular2/angular2';
import {NavigationDetailsPage} from 'navigation';
import * as helpers from 'helpers';


@IonicView({
  templateUrl: 'main.html'
})
class MainPage {

  constructor(app: IonicApp, nav: NavController, actionSheet: ActionSheet, zone: NgZone, params: NavParams, events: Events) {
    this.params = params;
    this.nav = nav;
    this.actionSheet = actionSheet;

    this.navDetailsPage = NavigationDetailsPage;
    this.component = { title: 'Tabs' };

    this.setupAnimations();

    window.addEventListener('message', (e) => {
      zone.run(() => {
        if (e.data) {
          var data = JSON.parse(e.data);
          this.component.title = helpers.toTitleCase(data.hash.replace('-', ' '));
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

  // **************************
  // Navigation
  // **************************
  openNavDetailsPage(item) {
    this.nav.push(NavigationDetailsPage, {name: item});
  }

  // **************************
  // Animations
  // **************************
  setupAnimations() {
    this.animation = new Animation();
    this.animation
      .duration(2000)

    var ionitronSpin = new Animation(document.querySelector('#ionitron'));
    ionitronSpin
      .from('transform', 'rotate(0deg)')
      .to('transform', 'rotate(360deg)')

    this.animation.add(ionitronSpin);
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }

}

@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>'  
})
class DemoApp {

  constructor() {
    this.rootPage = MainPage;
  }

}