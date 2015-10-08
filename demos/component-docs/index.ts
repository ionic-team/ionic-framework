import {App, IonicApp, IonicPlatform, ActionSheet} from 'ionic/ionic';
import {IonicView, IonicConfig, Events} from 'ionic/ionic';
import {ActionSheetPage} from 'actionSheet/actionSheet';
import * as helpers from 'helpers';


@App({
  template: '<ion-nav id="nav" [root]="rootPage"></ion-nav>'
})
class DemoApp {

  constructor(app: IonicApp) {
    this.app = app;
    this.rootPage = ActionSheetPage;

    // if (params.data.location) { this.nextPage = helpers.getPageFor(params.data.location); }
    // else if (window.location.hash) { this.nextPage = helpers.getPageFor(window.location.hash); }
    // else { this.nextPage = helpers.getPageFor('action-sheet'); }

    window.addEventListener('message', (e) => {
      zone.run(() => {
        if (e.data) {
          var data = JSON.parse(e.data);
          this.nextPage = helpers.getPageFor(data.hash);
          this.title = helpers.toTitleCase(data.hash.replace(/-/g, ' '));
          let nav = this.app.getComponent('nav');
          nav.setRoot(this.nextPage);
        }
      });
    });

  }
}
