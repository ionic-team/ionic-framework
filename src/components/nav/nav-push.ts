import { Directive, Input, Optional } from '@angular/core';

import { NavController } from './nav-controller';

/**
 * @name NavPush
 * @description
 * Directive for declaratively linking to a new page instead of using
 * {@link ../NavController/#push NavController.push}. Similar to ui-router's `ui-sref`.
 *
 * @usage
 * ```html
 * <button [navPush]="pushPage"></button>
 * ```
 * To specify parameters you can use array syntax or the `nav-params` property:
 * ```html
 * <button [navPush]="pushPage" [navParams]="params"></button>
 * ```
 * Where `pushPage` and `params` are specified in your component, and `pushPage`
 * contains a reference to a [@Page component](../../../config/Page/):
 *
 * ```ts
 * import {LoginPage} from 'login';
 * @Component({
 *   template: `<button [navPush]="pushPage" [navParams]="params"></button>`
 * })
 * class MyPage {
 *   constructor(){
 *     this.pushPage = LoginPage;
 *     this.params = { id: 42 };
 *   }
 * }
 * ```
 *
 * ### Alternate syntax
 * You can also use syntax similar to Angular2's router, passing an array to
 * NavPush:
 * ```html
 * <button [navPush]="[pushPage, params]"></button>
 * ```
 * @demo /docs/v2/demos/navigation/
 * @see {@link /docs/v2/components#navigation Navigation Component Docs}
 * @see {@link ../NavPop NavPop API Docs}
 */
@Directive({
  selector: '[navPush]',
  host: {
    '(click)': 'onClick()',
    'role': 'link'
  }
})
export class NavPush {

  /**
  * @input {Page} the page you want to push
  */
  @Input() navPush: any;

  /**
  * @input {any} Any parameters you want to pass along
  */
  @Input() navParams: any;

  constructor(
    @Optional() private _nav: NavController
   ) {
    if (!_nav) {
      console.error('nav-push must be within a NavController');
    }
  }

  /**
   * @private
   */
  onClick() {
    let destination: any, params: any;

    if (this.navPush instanceof Array) {
      if (this.navPush.length > 2) {
        throw 'Too many [navPush] arguments, expects [View, { params }]';
      }
      destination = this.navPush[0];
      params = this.navPush[1] || this.navParams;

    } else {
      destination = this.navPush;
      params = this.navParams;
    }

    this._nav && this._nav.push(destination, params);
  }
}
