import {bootstrap, QueryList, ElementRef, NgFor, NgIf} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {Descendant} from 'angular2/src/core/annotations_impl/visibility';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Query} from 'angular2/src/core/annotations_impl/di';

console.log(Query, QueryList);

import {Ionic, Nav, Toolbar, ViewContainer, Aside, List, Item, Content, Button} from 'ionic/ionic';

import {ButtonPage} from './pages/button'
import {ActionMenuPage} from './pages/action-menu'

@Component({
  selector: 'ion-app',
  properties: [
    'aside: aside'
  ]
})
@View({
  templateUrl: 'main.html',
  directives: [Nav, NgFor, NgIf, Aside, List, ViewContainer, Toolbar, Item, Content, Button]
})
export class IonicApp {
  constructor(elementRef: ElementRef) {//, @Query(Aside) nav: QueryList) {//, @Descendant() aside: Aside) {
    Ionic.setRootElementRef(elementRef);

    this.components = [
      { title: 'Buttons', component: ButtonPage },
      { title: 'Action Menu', component: ActionMenuPage }
    ];

    this.firstPage = ButtonPage
  }

  openPage(aside, component) {
    console.log('Opening', aside, component);
    aside.close();
    window.nav.clear().then(() => {
      console.log('Cleared!');
      window.nav.push(component.component, {}, {
        animate: false
      });
    })
  }
}

export function main() {
  bootstrap(IonicApp).then((appRef) => {
    Ionic.setAppRef(appRef);
  })
}
