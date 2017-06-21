import { NgZone } from '@angular/core';

import { Platform } from '../../platform/platform';


/**
 * @hidden
 */
export class DisplayWhen {
  isMatch: boolean = false;
  conditions: string[];
  resizeObs: any;

  constructor(conditions: string, public _plt: Platform, public zone: NgZone) {
    if (!conditions) return;

    this.conditions = conditions.replace(/\s/g, '').split(',');

    // check if its one of the matching platforms first
    // a platform does not change during the life of an app
    for (let i = 0; i < this.conditions.length; i++) {
      if (this.conditions[i] && _plt.is(this.conditions[i])) {
        this.isMatch = true;
        return;
      }
    }

    if (this.orientation()) {
      // add window resize listener
      this.resizeObs = _plt.resize.subscribe(this.orientation.bind(this));
    }

  }

  orientation(): boolean {
    for (let i = 0; i < this.conditions.length; i++) {

      if (this.conditions[i] === 'portrait') {
        this.isMatch = this._plt.isPortrait();
        return true;
      }

      if (this.conditions[i] === 'landscape') {
        this.isMatch = this._plt.isLandscape();
        return true;
      }
    }
    return false;
  }

  ngOnDestroy() {
    this.resizeObs && this.resizeObs.unsubscribe();
    this.resizeObs = null;
  }
}
