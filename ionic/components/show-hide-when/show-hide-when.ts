import {Directive, Attribute, NgZone} from 'angular2/angular2'

import {IonicPlatform} from '../../platform/platform';


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
 * TODO
 */
@Directive({
  selector: '[show-when]',
  host: {
    '[hidden]': 'hidden'
  }
})
export class ShowWhen extends DisplayWhen {
  /**
   * TODO
   * @param {string} showWhen  The value of the element's 'show-when' attribute
   * @param {NgZone} ngZone  TODO
   */
  constructor(
    @Attribute('show-when') showWhen: string,
    platform: IonicPlatform,
    ngZone: NgZone
  ) {
    super(showWhen, platform, ngZone);
  }

  get hidden() {
    return !this.isMatch;
  }

}

/**
 * TODO
 */
@Directive({
  selector: '[hide-when]',
  host: {
    '[hidden]': 'hidden'
  }
})
export class HideWhen extends DisplayWhen {
  /**
   * TODO
   * @param {string} showWhen  The value of the element's 'hide-when' attribute
   * @param {NgZone} ngZone  TODO
   */
  constructor(
    @Attribute('hide-when') hideWhen: string,
    platform: IonicPlatform,
    ngZone: NgZone
  ) {
    super(hideWhen, platform, ngZone);
  }

  get hidden() {
    return this.isMatch;
  }

}
