import { Directive, HostListener, Input, Optional } from '@angular/core';

import { NavController } from './nav-controller';
import { noop } from '../../util/util';

/**
 * @name NavPush
 * @description
 * Directive to declaratively push a new page to the current nav
 * stack.
 *
 * @usage
 * ```html
 * <button ion-button [navPush]="pushPage"></button>
 * ```
 *
 * To specify parameters you can use array syntax or the `navParams`
 * property:
 *
 * ```html
 * <button ion-button [navPush]="pushPage" [navParams]="params">Go</button>
 * ```
 *
 * Where `pushPage` and `params` are specified in your component,
 * and `pushPage` contains a reference to a
 * component you would like to push:
 *
 * ```ts
 * import { LoginPage } from './login';
 *
 * @Component({
 *   template: `<button ion-button [navPush]="pushPage" [navParams]="params">Go</button>`
 * })
 * class MyPage {
 *   constructor(){
 *     this.pushPage = LoginPage;
 *     this.params = { id: 42 };
 *   }
 * }
 * ```
 *
 * @demo /docs/v2/demos/navigation/
 * @see {@link /docs/v2/components#navigation Navigation Component Docs}
 * @see {@link ../NavPop NavPop API Docs}
 *
 */
@Directive({
  selector: '[navPush]'
})
export class NavPush {

  /**
   * @input {Page} The Page to push onto the Nav.
   */
  @Input() navPush: any[]|string;

  /**
   * @input {any} Parameters to pass to the page.
   */
  @Input() navParams: {[k: string]: any};


  constructor(@Optional() private _nav: NavController) {
    if (!_nav) {
      console.error('navPush must be within a NavController');
    }
  }

  @HostListener('click')
  onClick(): boolean {
    // If no target, or if target is _self, prevent default browser behavior
    if (this._nav) {
      this._nav.push(this.navPush, this.navParams, noop);
      return false;
    }

    return true;
  }

}
