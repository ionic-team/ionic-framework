import { AfterViewInit, Directive, HostBinding, HostListener, OnChanges, Optional } from '@angular/core';

import { DeepLinker } from '../../navigation/deep-linker';
import { NavController } from '../../navigation/nav-controller';
import { ViewController } from '../../navigation/view-controller';


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
 * @demo /docs/v2/demos/src/navigation/
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

/**
 * @private
 */
  @HostListener('click')
  onClick(): boolean {
    // If no target, or if target is _self, prevent default browser behavior
    if (this._nav) {
      this._nav.pop(null, null);
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
export class NavPopAnchor implements OnChanges, AfterViewInit {

  constructor(
    @Optional() public host: NavPop,
    public linker: DeepLinker,
    @Optional() public viewCtrl: ViewController) {}

  @HostBinding() href: string;

  updateHref() {
    if (this.host && this.viewCtrl) {
      const previousView = this.host._nav.getPrevious(this.viewCtrl);
      this.href = (previousView && this.linker.createUrl(this.host._nav, this.viewCtrl.component, this.viewCtrl.data)) || '#';

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
