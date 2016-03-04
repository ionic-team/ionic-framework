import {AppViewManager, ElementRef, Directive, Renderer, Input} from 'angular2/core';

import {IonicApp} from './app';

/**
 * @name Id
 * @description
 * The `id` attribute is an easy way to identify unique components in an app and access them
 * no matter where in the UI hierarchy you are. For example, this makes toggling
 * a global side menu possible from any place in the application.
 *
 * @usage
 * To give any component an ID, simply set its `id` property:
 * ```html
 * <ion-checkbox id="myCheckbox"></ion-checkbox>
 * ```
 *
 * To get a reference to the registered component, inject the [IonicApp](../IonicApp/)
 * service:
 * ```ts
 * constructor(app: IonicApp) {
 *   this.app = app
 * }
 *
 * ngAfterViewInit() {
 *   var checkbox = this.app.getComponent("myCheckbox");
 *   if (checkbox.checked) {
 *     console.log('checkbox is checked');
 *   }
 * }
 * ```
 *
 * *NOTE:* It is not recommended to use ID's across Pages, as there is often no
 * guarantee that the registered component has not been destroyed if its Page
 * has been navigated away from.
 *
 * @demo /docs/v2/demos/id/
 */
@Directive({
  selector: '[id]'
})
export class IdRef {
  private _component: any;

  /**
   * @private
   */
  @Input() id: string;

  constructor(private _app: IonicApp, elementRef: ElementRef, appViewManager: AppViewManager) {
    // Grab the component this directive is attached to
    this._component = appViewManager.getComponent(elementRef);
  }

  /**
   * @private
   */
  ngOnInit() {
    this._app.register(this.id, this._component);
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._app.unregister(this.id);
  }
}


/**
 * @private
 */
@Directive({
  selector: '[attr]'
})

export class Attr {
  @Input() attr: string;
  constructor(private _renderer: Renderer, private _elementRef: ElementRef) {}

/**
 * @private
 */
  ngOnInit() {
    this._renderer.setElementAttribute(this._elementRef.nativeElement, this.attr, '');
  }
}
