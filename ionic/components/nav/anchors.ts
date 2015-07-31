import {Component, View, Directive, Ancestor, ElementRef, forwardRef, Inject} from 'angular2/angular2';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';

import {Pane} from './pane';
import {ViewController} from '../view/view-controller';


@Directive({selector: 'template[pane-anchor]'})
export class PaneAnchor {
  constructor(
    @Ancestor() @Inject(forwardRef(() => Pane)) pane: Pane,
    elementRef: ElementRef
  ) {
    pane.sectionAnchorElementRef = elementRef;
  }
}


@Directive({selector: 'template[content-anchor]'})
export class PaneContentAnchor {
  constructor(
    @Ancestor() @Inject(forwardRef(() => Pane)) pane: Pane,
    viewContainerRef: ViewContainerRef
  ) {
    pane.contentContainerRef = viewContainerRef;
  }
}


@Directive({
  selector: 'template[navbar-anchor]'
})
class NavBarAnchor {
  constructor(
    @Inject(forwardRef(() => ViewController)) viewCtrl: ViewController,
    viewContainerRef: ViewContainerRef
  ) {
    viewCtrl.navbarViewContainer(viewContainerRef);
  }
}


@Component({
  selector: 'section',
  host: {
    'class': 'navbar-container'
  }
})
@View({
  template: '<template navbar-anchor></template>',
  directives: [NavBarAnchor]
})
export class NavBarContainer {}
