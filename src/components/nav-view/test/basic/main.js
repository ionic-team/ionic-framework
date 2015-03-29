import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';
import {NavView} from 'ionic2/components/nav-view/nav-view';

@Component({ selector: '[ion-app]' })
@Template({
  directives: [NavView],
  url: 'main.html'
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
