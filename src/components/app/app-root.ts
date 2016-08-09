import { Component, ComponentFactoryResolver, ElementRef, HostBinding, Inject, OnInit, OpaqueToken, Renderer, ViewChild, ViewContainerRef } from '@angular/core';

import { App } from './app';
import { Config } from '../../config/config';
import { FeatureDetect } from '../../util/feature-detect';
import { Platform } from '../../platform/platform';

export const UserRoot = new OpaqueToken('USERROOT');

/**
 * @private
 */
@Component({
  selector: 'ion-app',
  template:
    '<div #anchor nav-portal></div>' +
    '<click-block></click-block>'
})
export class IonicApp implements OnInit {

  /**
   * @internal
   */
  @ViewChild('anchor', {read: ViewContainerRef}) _viewport: ViewContainerRef;

  constructor(
    @Inject(UserRoot) private _userCmp: any,
    private _cfr: ComponentFactoryResolver,
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    private _config: Config,
    private _platform: Platform,
    private _featureDetect: FeatureDetect,
    app: App
  ) {
    // register with App that this is Ionic's appRoot component
    app.appRoot = this;
  }

  ngOnInit() {
    // load the user root component
    // into Ionic's root component
    const factory = this._cfr.resolveComponentFactory(this._userCmp);
    const componentRef = this._viewport.createComponent(factory);
    this._renderer.setElementClass(componentRef.location.nativeElement, 'app-root', true);
    componentRef.changeDetectorRef.detectChanges();


    // set the mode class name
    // ios/md/wp
    this._addClass(this._config.get('mode'));

    const versions = this._platform.versions();
    this._platform.platforms().forEach(platformName => {
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
    if (this._config.getBoolean('hoverCSS', true)) {
      this._addClass('enable-hover');
    }

    this._featureDetect.test(this);
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
