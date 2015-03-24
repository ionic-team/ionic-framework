import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';
import {View} from 'ionic/components/view/view';
import {Content} from 'ionic/components/view/content';
import {Tabs} from 'ionic/components/tabs/tabs';
import {Tab} from 'ionic/components/tabs/tab';

@Component({ selector: '[ion-app]' })
@Template({
  url: 'main.html',
  directives: [Tabs, Tab, View, Content]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
