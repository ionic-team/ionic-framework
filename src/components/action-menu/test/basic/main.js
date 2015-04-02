import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';
import {ActionMenu} from 'ionic2/components/action-menu/action-menu';


@Component({ selector: '[ion-app]' })
@Template({
  url: 'main.html',
  directives: [ActionMenu]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
