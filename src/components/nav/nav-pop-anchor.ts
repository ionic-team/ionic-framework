import { AfterContentInit, Directive, Optional } from '@angular/core';

import { DeepLinker } from '../../navigation/deep-linker';
import { ViewController } from '../../navigation/view-controller';

import { NavPop } from './nav-pop';

/**
 * @hidden
 */
@Directive({
  selector: 'a[navPop]',
  host: {
    '[attr.href]': '_href'
  }
})
export class NavPopAnchor implements AfterContentInit {

  _href: string;

  constructor(
    @Optional() public host: NavPop,
    public linker: DeepLinker,
    @Optional() public viewCtrl: ViewController) {}

  updateHref() {
    if (this.host && this.viewCtrl) {
      const previousView = this.host._nav.getPrevious(this.viewCtrl);
      this._href = (previousView && this.linker.createUrl(this.host._nav, this.viewCtrl.component, this.viewCtrl.data)) || '#';

    } else {
      this._href = '#';
    }
  }

  ngAfterContentInit() {
    this.updateHref();
  }
}
