import {Directive, Attribute, NgZone} from 'angular2/core'

import {Platform} from '../../platform/platform';


/**
 * @private
 */
export class DisplayWhen {
  protected _isMatch: boolean = false;
  private _platform: Platform;
  private _conditions: string[];

  constructor(conditions: string, platform: Platform, ngZone: NgZone) {
    this._platform = platform;

    if (!conditions) return;

    this._conditions = conditions.split(',');

    // check if its one of the matching platforms first
    // a platform does not change during the life of an app
    for (let i = 0; i < this._conditions.length; i++) {
      if (this._conditions[i] && platform.is(this._conditions[i])) {
        this._isMatch = true;
        return;
      }
    }

    if ( this.orientation() ) {
      // add window resize listener
      platform.onResize(() => {
        ngZone.run(() => {
          this.orientation();
        });
      });
      return;
    }

  }

  orientation() {
    for (let i = 0; i < this._conditions.length; i++) {

      if (this._conditions[i] == 'portrait') {
        this._isMatch = this._platform.isPortrait();
        return true;
      }

      if (this._conditions[i] == 'landscape') {
        this._isMatch = this._platform.isLandscape();
        return true;
      }
    }
  }

}

/**
 *
 * The `showWhen` attribute takes a string that represents a plaform or screen orientation.
 * The element the attribute is added to will only be shown when that platform or screen orientation is active.
 * Complements the [hideWhen attribute](../HideWhen).
 * @usage
 * ```html
 * <div showWhen="ios">I am only visible on iOS!</div>
 * ```
 * @demo /docs/v2/demos/show-when/
 * @see {@link ../HideWhen HideWhen API Docs}
 */
@Directive({
  selector: '[showWhen]',
  host: {
    '[hidden]': 'hidden'
  }
})
export class ShowWhen extends DisplayWhen {

  constructor(
    @Attribute('showWhen') showWhen: string,
    platform: Platform,
    ngZone: NgZone
  ) {
    super(showWhen, platform, ngZone);
  }

  /**
   * @private
   */
  get hidden() {
    return !this._isMatch;
  }

}

/**
 *
 * The `hideWhen` attribute takes a string that represents a plaform or screen orientation.
 * The element the attribute is added to will only be hidden when that platform or screen orientation is active.
 * Complements the [showWhen attribute](../ShowWhen).
 * @usage
 * ```html
 * <div hideWhen="android">I am hidden on Android!</div>
 * ```
 * @demo /docs/v2/demos/hide-when/
 * @see {@link ../ShowWhen ShowWhen API Docs}
 */
@Directive({
  selector: '[hideWhen]',
  host: {
    '[hidden]': 'hidden'
  }
})
export class HideWhen extends DisplayWhen {

  constructor(
    @Attribute('hideWhen') hideWhen: string,
    platform: Platform,
    ngZone: NgZone
  ) {
    super(hideWhen, platform, ngZone);
  }

  /**
   * @private
   */
  get hidden() {
    return this._isMatch;
  }

}
