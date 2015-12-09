import {App, IonicApp, Platform, ActionSheet} from 'ionic/ionic';
import {Page, Config, Events} from 'ionic/ionic';
import {PageOne, PageTwo, PageThree} from './menus/menus';
import * as actionSheets from './action-sheets/action-sheets';
import * as helpers from './helpers';


@App({
  templateUrl: 'app.html',
  config: {
    platforms: {
      android: {
        activator: 'ripple'        
      }
    }
  }
})
class DemoApp {

  rootPage: any;
  androidAttribute: any;


  constructor(app: IonicApp, platform: Platform) {
    this.app = app;
    this.platform = platform;
    this.androidAttribute = helpers.AndroidAttribute;

    this.pages = [
      { title: 'Home', component: PageOne },
      { title: 'Friends', component: PageTwo },
      { title: 'Events', component: PageThree }
    ];

    this.platform.ready().then(() => {

      window.addEventListener('message', (e) => {

        zone.run(() => {
          if (e.data) {
            var data = JSON.parse(e.data);
            if (data.hash) {
              this.nextPage = helpers.getPageFor(data.hash.replace('#', ''));
              if (data.hash !== 'menus') {
                this.app.getComponent('leftMenu').enable(false);
              }
            } else {
              this.nextPage = actionSheets.BasicPage;
            }
            let nav = this.app.getComponent('nav');
            helpers.debounce(nav.setRoot(this.nextPage), 60, false);
          }
        });
      });
      window.parent.postMessage(this.platform.is('ios') ? "ios" : "android", "*");
      if (helpers.hasScrollbar() === true) {
        setTimeout(function() {
          var body = document.getElementsByTagName('body')[0];
          body.className = body.className + ' has-scrollbar';
        }, 500);
      }
    });

  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    // debugger;
    this.app.getComponent('leftMenu').close();

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }

}
