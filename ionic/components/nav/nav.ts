import {Directive, View, ElementRef, Host, Optional, forwardRef, Injector, NgZone} from 'angular2/angular2';

import {IonicComponent} from '../../config/annotations';
import {ViewController} from '../view/view-controller';


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
export class Nav extends ViewController {

  constructor(
    @Optional() hostViewCtrl: ViewController,
    injector: Injector,
    elementRef: ElementRef,
    zone: NgZone
  ) {
    super(hostViewCtrl, injector, elementRef, zone);
  }

  onIonInit() {

    if (this.root) {
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
