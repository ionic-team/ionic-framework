import { Directive, Input } from '@angular/core';

import { AppRoot } from '../app/app';
import { isTrueProperty } from '../../util/util';

const DISABLE_SCROLL = 'disable-scroll';

/**
 * @private
 */
@Directive({
  selector: 'ion-backdrop',
  host: {
    'role': 'presentation',
    'tappable': '',
    'disable-activated': ''
  },
})
export class Backdrop {
  private static nuBackDrops: number = 0;

  private static push(appRoot: AppRoot) {
    if (this.nuBackDrops === 0) {
      appRoot.disableScroll = true;
    }
    this.nuBackDrops++;
  }

  private static pop(appRoot: AppRoot) {
    if (this.nuBackDrops > 0) {
      this.nuBackDrops--;

      if (this.nuBackDrops === 0) {
        appRoot.disableScroll = false;
      }
    }
  }

  private pushed: boolean = false;
  @Input() disableScroll = true;

  constructor(private _appRoot: AppRoot) {}

  ngOnInit() {
    if (isTrueProperty(this.disableScroll)) {
      Backdrop.push(this._appRoot);
      this.pushed = true;
    }
  }

  ngOnDestroy() {
    if (this.pushed) {
      Backdrop.pop(this._appRoot);
      this.pushed = false;
    }
  }

}
