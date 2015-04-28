import {For, Ancestor, Descendent, Parent, NgElement, Component, View as NgView, bootstrap} from 'angular2/angular2';
import {View, Content, Nav, NavPane, List, Item} from 'ionic/ionic';

import {HackerNews} from 'hn'

@Component({ selector: 'top-stories' })
@NgView({
  templateUrl: 'pages/top.html',
  directives: [View, Content, For, List, Item]
})
export class HNSinglePost {
  constructor(@Parent() viewport: Nav) {//, @Ancestor() app: HNApp) {
    console.log('SINGLE');
  }
}
