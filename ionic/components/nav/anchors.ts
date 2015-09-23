import {Component, View, Directive, Host, ElementRef, forwardRef, Inject} from 'angular2/angular2';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';

import {Pane} from './pane';
import {NavController} from './nav-controller';


@Directive({selector: 'template[pane-anchor]'})
export class PaneAnchor {
  constructor(
    @Host() @Inject(forwardRef(() => Pane)) pane: Pane,
    elementRef: ElementRef
  ) {
    pane.sectionAnchorElementRef = elementRef;
  }
}


@Directive({selector: 'template[content-anchor]'})
export class PaneContentAnchor {
  constructor(
    @Host() @Inject(forwardRef(() => Pane)) pane: Pane,
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
    @Inject(forwardRef(() => NavController)) navCtrl: NavController,
    viewContainerRef: ViewContainerRef
  ) {
    navCtrl.navbarViewContainer(viewContainerRef);
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
