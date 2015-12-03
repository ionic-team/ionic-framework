import {Directive, Attribute, NgZone} from 'angular2/angular2'

import {Platform} from '../../platform/platform';


class DisplayWhen {

  constructor(conditions, platform, ngZone) {
    this.isMatch = false;
    this.platform = platform;

    if (!conditions) return;

    this.conditions = conditions.split(',');

    // check if its one of the matching platforms first
    // a platform does not change during the life of an app
    for (let i = 0; i < this.conditions.length; i++) {
      if (this.conditions[i] && platform.is(this.conditions[i])) {
        this.isMatch = true;
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
    for (let i = 0; i < this.conditions.length; i++) {

      if (this.conditions[i] == 'portrait') {
        this.isMatch = this.platform.isPortrait();
        return true;
      }

      if (this.conditions[i] == 'landscape') {
        this.isMatch = this.platform.isLandscape();
        return true;
      }
    }
  }

}

/**
 *
 * The `show-when` attribute takes a value or expression, and only shows the element it has been added to when
 * the value or expression is true. Complements the [hide-when attribute](../HideWhen).
 * @usage
 * ```html
 * <div show-when="false">I am hidden!</div>
 * ```
 */
@Directive({
  selector: '[show-when]',
  host: {
    '[hidden]': 'hidden'
  }
})
export class ShowWhen extends DisplayWhen {

  constructor(
    @Attribute('show-when') showWhen: string,
    platform: Platform,
    ngZone: NgZone
  ) {
    super(showWhen, platform, ngZone);
  }

  /**
   * @private
   */
  get hidden() {
    return !this.isMatch;
  }

}

/**
 *
 * The `hide-when` attribute takes a value or expression, and hides the element it has been added to when
 * the value or expression is true. Complements the [show-when attribute](../ShowWhen).
 * @usage
 * ```html
 * <div hide-when="true">I am hidden!</div>
 * ```
 */
@Directive({
  selector: '[hide-when]',
  host: {
    '[hidden]': 'hidden'
  }
})
export class HideWhen extends DisplayWhen {

  constructor(
    @Attribute('hide-when') hideWhen: string,
    platform: Platform,
    ngZone: NgZone
  ) {
    super(hideWhen, platform, ngZone);
  }

  /**
   * @private
   */
  get hidden() {
    return this.isMatch;
  }

}
