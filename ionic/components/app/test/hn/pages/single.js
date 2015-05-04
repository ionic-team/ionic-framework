import {For, Ancestor, Descendent, Parent, NgElement, Component, View, bootstrap} from 'angular2/angular2';
import {Content, Nav, NavPane, List, Item} from 'ionic/ionic';

import {HackerNews} from 'hn'

@Component({ selector: 'top-stories' })
@View({
  templateUrl: 'pages/top.html',
  directives: [Content, For, List, Item]
})
export class HNSinglePost {
  constructor(@Parent() viewport: Nav) {//, @Ancestor() app: HNApp) {
    console.log('SINGLE');
  }
}
