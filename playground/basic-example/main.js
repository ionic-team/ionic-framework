import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';
import {Tabbar} from 'ionic/components/tabbar/tabbar';
import {Modal} from 'ionic/components/modal/modal';
// import {Hammer} from 'hammerjs';

import 'ionic/components/tabbar/mixins/android/android-tabbar';

@Component({ selector: '[playground-main]' })
@Template({
  url: 'main.html',
  directives: [Tabbar, Modal]
})
class PlaygroundMain {
  constructor() {
    console.log('Playground Start')
  }
}

bootstrap(PlaygroundMain)
