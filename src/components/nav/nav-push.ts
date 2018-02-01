import { Directive, HostListener, Input, Optional } from '@angular/core';

import { NavController } from '../../navigation/nav-controller';
import { Page } from '../../navigation/nav-util';

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
 *   pushPage: any;
 *   params: Object;
 *   constructor(){
 *     this.pushPage = LoginPage;
 *     this.params = { id: 42 };
 *   }
 * }
 * ```
 *
 * @demo /docs/demos/src/navigation/
 * @see {@link /docs/components#navigation Navigation Component Docs}
 * @see {@link ../NavPop NavPop API Docs}
 *
 */
@Directive({
  selector: '[navPush]'
})
export class NavPush {

  /**
   * @input {Page | string} The component class or deeplink name you want to push onto the navigation stack.
   */
  @Input() navPush: Page | string;

  /**
   * @input {any} Any NavParams you want to pass along to the next view.
   */
  @Input() navParams: {[k: string]: any};


  constructor(@Optional() public _nav: NavController) {
    if (!_nav) {
      console.error('navPush must be within a NavController');
    }
  }

/**
 * @hidden
 */
  @HostListener('click')
  onClick(): boolean {
    if (this._nav && this.navPush) {
      this._nav.push(this.navPush, this.navParams);
      return false;
    }
    return true;
  }
}
