import {Component} from 'angular2/angular2';
import {Control, ControlGroup} from 'angular2/forms';

import {IonicApp, App, Http} from 'ionic/ionic';

import {Translate} from 'ionic/ionic';

@App({
  templateUrl: 'main.html'
})
class MyApp {
  constructor(app: IonicApp, trans: Translate) {
    this.app = app;
    this.trans = trans;

    this.trans.translations('de', {
      'Location': 'lage'
    });

    console.log(this.trans.translate('Location'));
    console.log(this.trans.translate('de', 'Location'));
    this.trans.setLanguage('de');
    console.log(this.trans.translate('Location'));

  }
}
