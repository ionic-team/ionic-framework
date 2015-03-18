import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';
import {Tabbar} from 'ionic/components/tabbar/tabbar';
import {Modal} from 'ionic/components/modal/modal';
import {SideMenu, SideMenuParent} from 'ionic/components/sidemenu/sidemenu';
import {Switch} from 'ionic/components/switch/switch';

import 'ionic/components/tabbar/mixins/android/android-tabbar';

@Component({ selector: '[playground-main]' })
@Template({
  url: 'main.html',
  directives: [Tabbar, Modal, SideMenu, SideMenuParent, Switch]
})
class PlaygroundMain {
  constructor() {
    console.log('Playground Start')
  }

  showModal() {
    Modal.show()
  }
}

bootstrap(PlaygroundMain)
