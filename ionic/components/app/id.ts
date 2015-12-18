import {AppViewManager, ElementRef, Directive, Renderer} from 'angular2/core';

import {IonicApp} from './app';

/**
 * @name Id
 * @description
 * IdRef is an easy way to identify unique components in an app and access them
 * no matter where in the UI heirarchy you are. For example, this makes toggling
 * a global side menu feasible from any place in the application.
 *
 * See the [Menu section](http://ionicframework.com/docs/v2/components/#menus) of
 * the Component docs for an example of how Menus rely on ID's.
 *
 * @usage
 * To give any component an ID, simply set its `id` property:
 * ```html
 * <ion-checkbox id="myCheckbox"></ion-checkbox>
 * ```
 *
 * To get a reference to the registered component, inject the [IonicApp](../app/IonicApp/)
 * service:
 * ```ts
 * constructor(app: IonicApp) {
 *    this.app = app
 * }
 * ngAfterViewInit{
 *  var checkbox = this.app.getComponent("myCheckbox");
 *  if (checkbox.checked) {
 *    console.log('checkbox is checked');
 *  }
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

  constructor(private _app: IonicApp, private _elementRef: ElementRef, private _appViewManager: AppViewManager) {
    // Grab the component this directive is attached to
    this.component = _appViewManager.getComponent(_elementRef);
  }

  /**
   * @private
   */
  ngOnInit() {
    this._app.register(this.id, this.component);
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._app.unregister(this.id);
  }
}


/**
 * @name Attr
 * @description
 * Attr allows you to dynamically add or remove an attribute based on the value of an expression or variable.
 * @usage
 * ```html
 * // toggle the no-lines attributes based on whether isAndroid is true or false
 * <ion-list [attr.no-lines]="isAndroid ? '' : null">
 * ```
 * @demo /docs/v2/demos/attr/
 */
@Directive({
  selector: '[attr]',
  inputs: ['attr']
})

export class Attr {
  constructor(private _renderer: Renderer, private _elementRef: ElementRef) {}

/**
 * @private
 */
  ngOnInit() {
    this._renderer.setElementAttribute(this._elementRef, this.attr, '');
  }
}
