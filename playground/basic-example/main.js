import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';
import {SideMenu, SideMenuParent} from 'ionic/components';

// import 'ionic/components/tabbar/mixins/android/android-tabbar';

@Component({ selector: '[playground-main]' })
@Template({
  url: 'main.html',
  directives: [SideMenu, SideMenuParent]
})
class PlaygroundMain {
  constructor() {
    console.log('Playground Start')
  }
}

bootstrap(PlaygroundMain)
