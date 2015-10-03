import {Component, Control, ControlGroup} from 'angular2/angular2';

import {IonicApp, App, Http} from 'ionic/ionic';
import {Translate, TranslatePipe} from 'ionic/ionic';


@App({
  templateUrl: 'main.html',
  pipes: [TranslatePipe]
})
class MyApp {
  constructor(app: IonicApp, trans: Translate) {
    this.app = app;
    this.trans = trans;

    this.trans.translations('de', {
      'Location': 'lage'
    });

    console.log(this.trans.translate('Location'));
    console.log(this.trans.translate('Location', 'de'));
    //this.trans.setLanguage('de');
    console.log(this.trans.translate('Location'));

  }
}
