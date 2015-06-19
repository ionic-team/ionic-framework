import {bootstrap, QueryList, ElementRef, NgFor, NgIf} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {Descendant} from 'angular2/src/core/annotations_impl/visibility';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Query} from 'angular2/src/core/annotations_impl/di';

console.log(Query, QueryList);

import {Ionic, Nav, ViewContainer, Aside, List, Item, Content} from 'ionic/ionic';

import {ButtonPage} from './pages/button'
import {NavPage} from './pages/nav'
import {ListPage} from './pages/list'
import {CardPage} from './pages/card'
import {FormPage} from './pages/form'
import {SegmentPage} from './pages/segment'
import {SearchBarPage} from './pages/search-bar'
import {TableSearchPage} from './pages/table-search'
import {IconsPage} from './pages/ionicons'
import {TabsPage} from './pages/tabs'
import {AsidePage} from './pages/aside'
import {SlidePage} from './pages/slides'
import {ActionMenuPage} from './pages/action-menu'
import {ModalPage} from './pages/modal'

console.log('Loaded', Nav, NgFor, NgIf, Aside, List, ViewContainer, Item, Content);

@Component({
  selector: 'ion-view',
})
@View({
  templateUrl: 'main.html',
  directives: [Nav, NgFor, NgIf, Aside, List, ViewContainer, Item, Content]
})
export default class IonicApp {
  constructor(elementRef: ElementRef) {//, @Query(Aside) nav: QueryList) {//, @Descendant() aside: Aside) {
    Ionic.setRootElementRef(elementRef);

    this.components = [
      { title: 'Navigation', component: NavPage },
      { title: 'Buttons', component: ButtonPage },
      { title: 'Lists', component: ListPage },
      { title: 'Cards', component: CardPage },
      { title: 'Forms', component: FormPage },
      { title: 'Segments', component: SegmentPage },
      { title: 'Search Bar', component: SearchBarPage },
      { title: 'Table Search', component: TableSearchPage },
      { title: 'Icons', component: IconsPage },
      { title: 'Tabs', component: TabsPage },
      { title: 'Aside', component: AsidePage },
      { title: 'Slides', component: SlidePage},
      { title: 'Action Menu', component: ActionMenuPage },
      { title: 'Modal', component: ModalPage }
    ];

    this.firstPage = ButtonPage
  }

  openPage(aside, component) {
    aside.close();
    window.nav.clear().then(() => {
      window.nav.push(component.component, {}, {
        animate: false
      });
    })
  }
}
