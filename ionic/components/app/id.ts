import {AppViewManager, ElementRef, Directive, Renderer} from 'angular2/angular2';

import {IonicApp} from './app';

/**
 * IdRef is an easy way to identify unique components in an app and access them
 * no matter where in the UI heirarchy you are. For example, this makes toggling
 * a global side menu feasible from any place in the application.
 *
 * See the [Menu section](http://localhost:4000/docs/v2/components/#menus) of
 * the Component docs for an example of how Menus rely on ID's.
 *
 * To give any component an ID, simply set its `id` property:
 * ```html
 * <ion-checkbox id="myCheckbox"></ion-checkbox>
 * ```
 *
 * To get a reference to the registered component, inject the [IonicApp](../app/IonicApp/)
 * service:
 * ```ts
 * constructor(app: IonicApp) {
 *   var checkbox = app.getComponent("myCheckbox");
 *   if (checkbox.checked) console.log('checkbox is checked');
 * }
 * ```
 *
 * *NOTE:* It is not recommended to use ID's across Pages, as there is often no
 * guarantee that the registered component has not been destroyed if its Page
 * has been navigated away from.
 */
@Directive({
  selector: '[id]',
  inputs: ['id']
})
export class IdRef {

  constructor(private app: IonicApp, private elementRef: ElementRef, private appViewManager: AppViewManager) {
    // Grab the component this directive is attached to
    this.component = appViewManager.getComponent(elementRef);
  }

  /**
   * @private
   */
  onInit() {
    this.app.register(this.id, this.component);
  }

  /**
   * @private
   */
  onDestroy() {
    this.app.unregister(this.id);
  }
}


@Directive({
  selector: '[attr]',
  inputs: ['attr']
})
export class Attr {
  constructor(private renderer: Renderer, private elementRef: ElementRef) {}

  /**
   * @private
   */
  onInit() {
    this.renderer.setElementAttribute(this.elementRef, this.attr, '');
  }
}
