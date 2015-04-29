import {
  Decorator,
  View as NgView,
  For,
  NgElement,
  Parent,
  Ancestor
} from 'angular2/angular2';
import {Optional} from 'angular2/di'
import {Nav} from 'ionic/ionic';

@Decorator({
  selector: '[push-to]'
})
export class PushToNav {
  constructor(
    element: NgElement,
    @Ancestor() viewportNav: Nav
  ) {
    console.log('PUSH TO NAV', element.domElement, viewportNav);

    this.navTag = element.domElement.getAttribute('push-to');
    console.log('PUSH TO NAV', this.navTag);
  }
}

@Decorator({
  selector: '[href]'
})
export class HrefNav {
  constructor(element: NgElement) {
  }
}
