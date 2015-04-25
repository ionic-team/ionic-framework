import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';
import {Alert} from 'ionic2/components/alert/alert';


@Component({ selector: '[ion-app]' })
@Template({
  url: 'main.html',
  directives: [Alert]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
