import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';
import {NavView} from 'ionic2/components/nav-view/nav-view';
import {View} from 'ionic2/components/view/view';

@Component({ selector: '[ion-app]' })
@Template({
  directives: [NavView, View],
  url: 'main.html'
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
