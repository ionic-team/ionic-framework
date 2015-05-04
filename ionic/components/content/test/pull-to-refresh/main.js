import {Descendent, NgElement, Component, View, bootstrap} from 'angular2/angular2';
import {Content} from 'ionic/components/content/content';
import {Icon} from 'ionic/components/icon/icon';
import {Checkbox} from 'ionic/components/checkbox/checkbox';
import {List} from 'ionic/components/list/list';
import {Refresher} from 'ionic/components/scroll/pull-to-refresh';

@Component({ selector: '[ion-app]' })
@View({
  templateUrl: 'main.html',
  directives: [Content, Icon, Checkbox, List, Refresher]
})
class IonicApp {
  constructor(
    @NgElement() element:NgElement
  ) {
    console.log('IonicApp Start')
  }

  doRefresh() {
    console.log('DOREFRESH')
  }
}

bootstrap(IonicApp)
