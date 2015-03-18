import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';
import {Tabbar} from 'ionic/components/tabbar/tabbar';

import 'ionic/components/tabbar/mixins/android/android-tabbar';

@Component({ selector: '[playground-main]' })
@Template({ 
  url: 'main.html',
  directives: [Tabbar]
})
class PlaygroundMain {}

bootstrap(PlaygroundMain)
