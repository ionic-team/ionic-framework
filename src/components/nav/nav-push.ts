import { AfterViewInit, Directive, Host, HostBinding, HostListener, Input, Optional, OnChanges } from '@angular/core';

import { DeepLinker } from '../../navigation/deep-linker';
import { NavController } from '../../navigation/nav-controller';

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
 * @demo /docs/v2/demos/src/navigation/
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


  constructor(@Optional() public _nav: NavController) {
    if (!_nav) {
      console.error('navPush must be within a NavController');
    }
  }

/**
 * @private
 */
  @HostListener('click')
  onClick(): boolean {
    if (this._nav) {
      this._nav.push(this.navPush, this.navParams, null);
      return false;
    }
    return true;
  }

}

/**
 * @private
 */
@Directive({
  selector: 'a[navPush]'
})
export class NavPushAnchor implements OnChanges, AfterViewInit {

  constructor(
    @Host() public host: NavPush,
    @Optional() public linker: DeepLinker) {}

  @HostBinding() href: string;

  updateHref() {
    if (this.host && this.linker) {
      this.href = this.linker.createUrl(this.host._nav, this.host.navPush, this.host.navParams) || '#';

    } else {
      this.href = '#';
    }
  }

  ngOnChanges() {
    this.updateHref();
  }

  ngAfterViewInit() {
    this.updateHref();
  }

}
