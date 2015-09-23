import {Directive, View, ElementRef, Host, Optional, forwardRef, Injector, NgZone} from 'angular2/angular2';

import {IonicComponent} from '../../config/decorators';
import {NavController} from './nav-controller';

/**
 * TODO
 */
@IonicComponent({
  selector: 'ion-nav',
  properties: [
    'root'
  ],
  defaultProperties: {
    'swipeBackEnabled': true
  }
})
@View({
  template: '<template pane-anchor></template>',
  directives: [forwardRef(() => NavPaneAnchor)]
})
export class Nav extends NavController {

  /**
   * TODO
   * @param {NavController} hostnavCtrl  TODO
   * @param {Injector} injector  TODO
   * @param {ElementRef} elementRef  TODO
   * @param {NgZone} zone  TODO
   */
  constructor(
    @Optional() hostnavCtrl: NavController,
    injector: Injector,
    elementRef: ElementRef,
    zone: NgZone
  ) {
    super(hostnavCtrl, injector, elementRef, zone);
  }

  /**
   * TODO
   */
  onInit() {
    super.onInit();

    if (this.root) {
      if (typeof this.root !== 'function') {
        throw 'The [root] property in <ion-nav> must be given a reference to a component class from within the constructor.';
      }
      this.push(this.root);
    }

    // default the swipe back to be enabled
    let isSwipeBackEnabled = (this.swipeBackEnabled || '').toString() !== 'false';
    this.isSwipeBackEnabled( isSwipeBackEnabled );
  }

}


@Directive({selector: 'template[pane-anchor]'})
class NavPaneAnchor {
  constructor(@Host() nav: Nav, elementRef: ElementRef) {
    nav.anchorElementRef(elementRef);
  }
}
