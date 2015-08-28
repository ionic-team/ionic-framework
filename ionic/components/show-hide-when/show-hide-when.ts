import {Directive, Attribute, NgZone} from 'angular2/angular2'

import {Platform} from '../../platform/platform';


class DisplayWhen {

  constructor(conditions, ngZone) {
    this.isMatch = false;

    if (!conditions) return;

    this.conditions = conditions.split(',');

    // check if its one of the matching platforms first
    // a platform does not change during the life of an app
    for (let i = 0; i < this.conditions.length; i++) {
      if (this.conditions[i] && Platform.is(this.conditions[i])) {
        this.isMatch = true;
        return;
      }
    }

    if ( this.orientation() ) {
      // add window resize listener
      Platform.onResize(() => {
        ngZone.run(() => {
          this.orientation();
        });
      });
      return;
    }

  }

  orientation() {
    for (let i = 0; i < this.conditions.length; i++) {
      var condition = this.conditions[i];

      if (condition == 'portrait') {
        this.isMatch = Platform.isPortrait();
        return true;
      }

      if (condition == 'landscape') {
        this.isMatch = Platform.isLandscape();
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
    ngZone: NgZone
  ) {
    super(showWhen, ngZone);
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
    ngZone: NgZone
  ) {
    super(hideWhen, ngZone);
  }

  get hidden() {
    return this.isMatch;
  }

}
