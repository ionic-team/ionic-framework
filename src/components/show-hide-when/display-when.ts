import { Input, NgZone } from '@angular/core';

import { Config } from '../../config/config';
import { Platform } from '../../platform/platform';

const QUERY: { [key: string]: string }  = {
  xs: '(min-width: 0px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)'
};

/**
 * @hidden
 */
export class DisplayWhen {
  private _resizeObs: any;
  private _query: string;
  private _rmListener: any;

  isMatch: boolean = false;
  conditions: string[];

  @Input()
  set when(query: string) {
    if (typeof query === 'boolean') {
      this.isMatch = this._query = query;
    } else {
      query = this._query = query.toLowerCase();
      this.checkConditions(query);
    }
  }

  get when(): string {
    return this._query;
  }

  constructor(conditions: string, public _config: Config, public _plt: Platform, public zone: NgZone) {
    // this.checkConditions(conditions);
  }

  checkConditions(conditions: string): void {
    if (!conditions) return;

    // Split the conditions on commas, unless the comma is inside of parantheses
    // because this means it is inside of a media query
    this.conditions = conditions.replace(/\s/g, '').split(/\,(?![^\(]*\))/g);
    console.log('conditions', this.conditions);

    // check if its one of the matching platforms first
    // a platform does not change during the life of an app
    for (let i = 0; i < this.conditions.length; i++) {
      console.log('condition', this.conditions[i]);

      // media: xs, media: (min-width: 44px), media: print and (min-width: 450px)
      if (this.conditions[i] && this.conditions[i].indexOf('media') > -1) {
        this.compareMedia(this.conditions[i]);
      }

      // mode: ios, mode: wp, mode: md
      if (this.conditions[i] && this.conditions[i].indexOf('mode') > -1) {
        this.compareMode(this.conditions[i]);
      }

      // platform: ios, platform: android, platform: iphone
      // The expression after the OR statement is for backwards-compatibility
      if (this.conditions[i] && (this.conditions[i].indexOf('platform') > -1) || (this._plt.is(this.conditions[i]))) {
        this.comparePlatform(this.conditions[i]);
      }
    }

    // orientation: portrait, orientation: landscape
    if (this.orientation()) {
      // add window resize listener
      this._resizeObs = this._plt.resize.subscribe(this.orientation.bind(this));
    }
  }

  compareMedia(condition: string): void {
    condition = condition.replace('media:', '');

    let query = QUERY[condition];
    query = (query) ? query : condition;

    if (query.indexOf(',') > -1 || query.indexOf('and') > -1) {
      console.log('remove outside parens');
      // query = query.substring(1, query.length - 1);
    }

    if (query && query.length > 0) {
      // Listen
      const callback = (query: MediaQueryList) => this.isMatch = query.matches;
      const mediaList = this._plt.win().matchMedia(query);

      console.log('mediaList', mediaList);

      mediaList.addListener(callback);
      this.isMatch = mediaList.matches;
      this._rmListener = function () {
        mediaList.removeListener(callback);
      };
    }
  }

  compareMode(condition: string): void {
    condition = condition.replace('mode:', '');
    if (condition === this._config.get('mode')) {
      this.isMatch = true;
      return;
    }
  }

  comparePlatform(condition: string): void {
    condition = condition.replace('platform:', '');
    if (this._plt.is(condition)) {
      this.isMatch = true;
      return;
    }
  }

  orientation(): boolean {
    for (let i = 0; i < this.conditions.length; i++) {
      let condition = this.conditions[i].replace('orientation:', '');

      if (condition === 'portrait') {
        this.isMatch = this._plt.isPortrait();
        return true;
      }

      if (condition === 'landscape') {
        this.isMatch = this._plt.isLandscape();
        return true;
      }
    }
    return false;
  }

  ngOnDestroy() {
    this._resizeObs && this._resizeObs.unsubscribe();
    this._resizeObs = null;
  }
}
