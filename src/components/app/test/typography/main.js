import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';

@Component({ selector: '[ion-app]' })
@Template({
  url: 'main.html'
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
