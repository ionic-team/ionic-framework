import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';
import {View, Content} from 'ionic/components/view/view';


@Component({ selector: '[ion-app]' })
@Template({
  url: 'main.html',
  directives: [View, Content]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start');
    this.attrTitle = 'banana title';
  }
}

bootstrap(IonicApp)
