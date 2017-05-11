import { Directive, HostListener, Optional } from '@angular/core';

import { NavController } from '../../navigation/nav-controller';


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
 * Similar to {@link /docs/api/components/nav/NavPush/ `NavPush` }
 * @demo /docs/demos/src/navigation/
 * @see {@link /docs/components#navigation Navigation Component Docs}
 * @see {@link ../NavPush NavPush API Docs}
 */
@Directive({
  selector: '[navPop]'
})
export class NavPop {

  constructor(@Optional() public _nav: NavController) {
    if (!_nav) {
      console.error('navPop must be within a NavController');
    }
  }

/**
 * @hidden
 */
  @HostListener('click')
  onClick(): boolean {
    // If no target, or if target is _self, prevent default browser behavior
    if (this._nav) {
      this._nav.pop().catch(() => {
        console.debug('navPop was rejected');
      });
      return false;
    }

    return true;
  }

}
