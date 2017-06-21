import { AfterContentInit, Directive, Host, Optional } from '@angular/core';

import { DeepLinker } from '../../navigation/deep-linker';

import { NavPush } from './nav-push';

/**
 * @hidden
 */
@Directive({
  selector: 'a[navPush]',
  host: {
    '[attr.href]': '_href'
  }
})
export class NavPushAnchor implements AfterContentInit {

  _href: string;

  constructor(
    @Host() public host: NavPush,
    @Optional() public linker: DeepLinker) {}

  updateHref() {
    if (this.host && this.linker) {
      this._href = this.linker.createUrl(this.host._nav, this.host.navPush, this.host.navParams) || '#';

    } else {
      this._href = '#';
    }
  }

  ngAfterContentInit() {
    this.updateHref();
  }
}
