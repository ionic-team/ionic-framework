import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';
import {View} from 'ionic2/components/view/view';
import {Tabs} from 'ionic2/components/tabs/tabs';


@Component({ selector: '[ion-app]' })
@Template({
  url: 'main.html',
  directives: [View, Tabs]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
