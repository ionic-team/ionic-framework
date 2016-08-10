import { AfterViewInit, Directive, Host, HostBinding, HostListener, Input, OnChanges, Optional } from '@angular/core';

import { DeepLinker } from '../../navigation/deep-linker';
import { NavController } from '../../navigation/nav-controller';
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
 *  <button navPop>Go Back</button>
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

  constructor(@Optional() public _nav: NavController) {
    if (!_nav) {
      console.error('navPop must be within a NavController');
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

/**
 * @private
 */
@Directive({
  selector: 'a[navPop]'
})
export class NavPushAnchor implements OnChanges, AfterViewInit {

  constructor(
    @Host() public host: NavPop,
    @Optional() public linker: DeepLinker) {}

  @HostBinding() href: string = '';

  updateHref() {
    if (this.host && this.linker) {
      //this.href = this.linker.createUrl(this.host._nav, this.host.navPush, this.host.navParams);
    }
  }

  ngOnChanges() {
    this.updateHref();
  }

  ngAfterViewInit() {
    this.updateHref();
  }

}
