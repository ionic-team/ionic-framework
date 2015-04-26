import {Descendent, NgElement, Component, View as NgView, bootstrap} from 'angular2/angular2';
import {View} from 'ionic/components/view/view';
import {Content} from 'ionic/components/content/content';
import {Icon} from 'ionic/components/icon/icon';
import {Checkbox} from 'ionic/components/checkbox/checkbox';
import {List} from 'ionic/components/list/list';
import {Refresher} from 'ionic/components/scroll/pull-to-refresh';

@Component({ selector: '[ion-app]' })
@NgView({
  templateUrl: 'main.html',
  directives: [View, Content, Icon, Checkbox, List, Refresher]
})
class IonicApp {
  constructor(
    @NgElement() element:NgElement
  ) {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
