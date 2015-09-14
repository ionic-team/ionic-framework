import {AppViewManager, ElementRef, Directive} from 'angular2/angular2';

import {IonicApp} from './app';

/**
 * IdRef is an easy way to identify unique components in an app and access them
 * no matter where in the UI heirarchy you are. For example, this makes toggling
 * a global side menu feasible from any place in the application.
 */
@Directive({
  selector: '[id]',
  properties: ['id']
})
export class IdRef {

  constructor(private app: IonicApp, private elementRef: ElementRef, private appViewManager: AppViewManager) {
    // Grab the component this directive is attached to
    this.component = appViewManager.getComponent(elementRef);
  }

  onInit() {
    this.app.register(this.id, this.component);
  }

  onDestroy() {
    this.app.unregister(this.id);
  }
}
