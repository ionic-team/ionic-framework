import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';
import {Aside, AsideParent} from 'ionic/components';

// import 'ionic/components/tabbar/mixins/android/android-tabbar';

@Component({ selector: '[playground-main]' })
@Template({
  url: 'main.html',
  directives: [Aside, AsideParent]
})
class PlaygroundMain {
  constructor() {
    console.log('Playground Start')
  }
}

bootstrap(PlaygroundMain)
