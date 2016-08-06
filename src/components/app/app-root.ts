import { Component, ElementRef, HostBinding, Renderer, ViewChild, ViewContainerRef } from '@angular/core';

import { App } from './app';
import { Config } from '../../config/config';
import { FeatureDetect } from '../../util/feature-detect';
import { Platform } from '../../platform/platform';


/**
 * @private
 */
@Component({
  selector: 'ion-app',
  template:
    '<ng-content></ng-content>' +
    '<div #anchor nav-portal></div>' +
    '<click-block></click-block>'
})
export class IonicApp {

  /**
   * @internal
   */
  @ViewChild('anchor', {read: ViewContainerRef}) _viewport: ViewContainerRef;

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    app: App,
    config: Config,
    platform: Platform,
    featureDetect: FeatureDetect
  ) {
    // register with App that this is Ionic's appRoot component
    app.appRoot = this;

    // set the mode class name
    // ios/md/wp
    this._addClass(config.get('mode'));

    const versions = platform.versions();
    platform.platforms().forEach(platformName => {
      // platform-ios
      let platformClass = 'platform-' + platformName;
      this._addClass(platformClass);

      let platformVersion = versions[platformName];
      if (platformVersion) {
        // platform-ios9
        platformClass += platformVersion.major;
        this._addClass(platformClass);

        // platform-ios9_3
        this._addClass(platformClass + '_' + platformVersion.minor);
      }
    });

    // touch devices should not use :hover CSS pseudo
    // enable :hover CSS when the "hoverCSS" setting is not false
    if (config.getBoolean('hoverCSS', true)) {
      this._addClass('enable-hover');
    }

    featureDetect.test(this);
  }

  /**
   * @internal
   */
  _addClass(className: string) {
    this._renderer.setElementClass(this._elementRef.nativeElement, className, true);
  }

  /**
   * @internal
   */
  _disableScroll(shouldDisableScroll: boolean) {
    this._renderer.setElementClass(this._elementRef.nativeElement, 'disable-scroll', shouldDisableScroll);
  }

}
