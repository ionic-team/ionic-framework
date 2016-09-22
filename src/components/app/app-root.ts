import { Component, ComponentFactoryResolver, ElementRef, Inject, OnInit, OpaqueToken, Renderer, ViewChild, ViewContainerRef } from '@angular/core';

import { App } from './app';
import { Config } from '../../config/config';
import { Ion } from '../ion';
import { OverlayPortal } from '../nav/overlay-portal';
import { Platform } from '../../platform/platform';

export const AppRootToken = new OpaqueToken('USERROOT');

/**
 * @private
 */
@Component({
  selector: 'ion-app',
  template:
    '<div #viewport app-viewport></div>' +
    '<div #overlayPortal overlay-portal></div>' +
    '<div #loadingPortal class="loading-portal" overlay-portal></div>' +
    '<div #toastPortal class="toast-portal" overlay-portal></div>' +
    '<div class="click-block"></div>'
})
export class IonicApp extends Ion implements OnInit {

  @ViewChild('viewport', {read: ViewContainerRef}) _viewport: ViewContainerRef;

  @ViewChild('overlayPortal', { read: OverlayPortal }) _overlayPortal: OverlayPortal;

  @ViewChild('loadingPortal', { read: OverlayPortal }) _loadingPortal: OverlayPortal;

  @ViewChild('toastPortal', { read: OverlayPortal }) _toastPortal: OverlayPortal;

  constructor(
    @Inject(AppRootToken) private _userCmp: any,
    private _cfr: ComponentFactoryResolver,
    elementRef: ElementRef,
    renderer: Renderer,
    config: Config,
    private _platform: Platform,
    app: App
  ) {
    super(config, elementRef, renderer);
    // register with App that this is Ionic's appRoot component. tada!
    app._appRoot = this;
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
    this.setElementClass(this._config.get('mode'), true);

    const versions = this._platform.versions();
    this._platform.platforms().forEach(platformName => {
      // platform-ios
      let platformClass = 'platform-' + platformName;
      this.setElementClass(platformClass, true);

      let platformVersion = versions[platformName];
      if (platformVersion) {
        // platform-ios9
        platformClass += platformVersion.major;
        this.setElementClass(platformClass, true);

        // platform-ios9_3
        this.setElementClass(platformClass + '_' + platformVersion.minor, true);
      }
    });

    // touch devices should not use :hover CSS pseudo
    // enable :hover CSS when the "hoverCSS" setting is not false
    if (this._config.getBoolean('hoverCSS', true)) {
      this.setElementClass('enable-hover', true);
    }

    // sweet, the app root has loaded!
    // which means angular and ionic has fully loaded!
    // fire off the platform prepare ready, which could
    // have been switched out by any of the platform engines
    this._platform.prepareReady();
  }

  /**
   * @private
   */
  _getPortal(portal?: AppPortal): OverlayPortal {
    if (portal === AppPortal.LOADING) {
      return this._loadingPortal;
    }
    if (portal === AppPortal.TOAST) {
      return this._toastPortal;
    }
    return this._overlayPortal;
  }

  /**
   * @private
   */
  _disableScroll(shouldDisableScroll: boolean) {
    this.setElementClass('disable-scroll', shouldDisableScroll);
  }

}

export enum AppPortal {
  DEFAULT,
  LOADING,
  TOAST
};
