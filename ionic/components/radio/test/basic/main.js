import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';
import {View} from 'ionic2/components/view/view';
import {Content} from 'ionic2/components/content/content';
import {Icon} from 'ionic2/components/icon/icon';
import {RadioGroup} from 'ionic2/components/radio/radio-group';
import {RadioButton} from 'ionic2/components/radio/radio-button';


@Component({ selector: '[ion-app]' })
@Template({
  url: 'main.html',
  directives: [View, Content, RadioGroup, RadioButton]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
