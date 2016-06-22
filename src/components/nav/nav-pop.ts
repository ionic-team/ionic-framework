import { Directive, Optional } from '@angular/core';

import { NavController } from './nav-controller';

/**
 * @name NavPop
 * @description
 * Directive for declaratively pop the current page off from the navigation stack.
 *
 * @usage
 * ```html
 * <ion-content>
 *  <div block button nav-pop>go back</div>
 * </ion-content>
 * ```
 * This will go back one page in the navigation stack
 *
 * Similar to {@link /docs/v2/api/components/nav/NavPush/ `NavPush` }
 * @demo /docs/v2/demos/navigation/
 * @see {@link /docs/v2/components#navigation Navigation Component Docs}
 * @see {@link ../NavPush NavPush API Docs}
 */
@Directive({
  selector: '[nav-pop]',
  host: {
    '(click)': 'onClick()',
    'role': 'link'
  }
})
export class NavPop {

  constructor(@Optional() private _nav: NavController) {
    if (!_nav) {
      console.error('nav-pop must be within a NavController');
    }
  }
  /**
   * @private
   */
  onClick() {
    this._nav && this._nav.pop();
  }
}
