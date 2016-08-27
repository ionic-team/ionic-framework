import { Directive, HostListener, Input, Optional } from '@angular/core';
import { NavController } from './nav-controller';
import { noop } from '../../util/util';

/**
 * @name NavPop
 * @description
 * Directive to declaratively pop the current page off from the
 * navigation stack.
 *
 * @usage
 * ```html
 * <ion-content>
 *
 *  <button ion-button navPop>Go Back</button>
 *
 * </ion-content>
 * ```
 *
 * Similar to {@link /docs/v2/api/components/nav/NavPush/ `NavPush` }
 * @demo /docs/v2/demos/navigation/
 * @see {@link /docs/v2/components#navigation Navigation Component Docs}
 * @see {@link ../NavPush NavPush API Docs}
 */
@Directive({
  selector: '[navPop]'
})
export class NavPop {

  constructor(@Optional() private _nav: NavController) {
    if (!_nav) {
      console.error('nav-pop must be within a NavController');
    }
  }

  @HostListener('click')
  onClick(): boolean {
    // If no target, or if target is _self, prevent default browser behavior
    if (this._nav) {
      this._nav.pop(null, noop);
      return false;
    }

    return true;
  }

}
