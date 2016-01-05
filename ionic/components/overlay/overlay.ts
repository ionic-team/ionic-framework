import {Directive} from 'angular2/core';

/**
 * @private
 */
@Directive({
  selector: 'ion-overlay'
})
export class OverlayNav {

  constructor() {
    // deprecated warning
    console.warn('<ion-overlay> is no longer needed and can be safely removed.');
    console.warn('https://github.com/driftyco/ionic2/blob/master/CHANGELOG.md#overlay-refactor');
    console.warn('See the v2 docs for an update on how overlays work.');
  }

}
