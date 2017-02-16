import { Component, ComponentFactoryResolver, ElementRef, Inject, OnInit, OpaqueToken, Renderer, ViewChild, ViewContainerRef } from '@angular/core';

import { App } from './app';
import { assert } from '../../util/util';
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
    '<div #modalPortal overlay-portal></div>' +
    '<div #overlayPortal overlay-portal></div>' +
    '<div #loadingPortal class="loading-portal" overlay-portal></div>' +
    '<div #toastPortal class="toast-portal" [overlay-portal]="10000"></div>' +
    '<div class="click-block"></div>'
})
export class IonicApp extends Ion implements OnInit {
  private _stopScrollPlugin: any;
  private _tmr: number;

  @ViewChild('viewport', {read: ViewContainerRef}) _viewport: ViewContainerRef;
  @ViewChild('modalPortal', { read: OverlayPortal }) _modalPortal: OverlayPortal;
  @ViewChild('overlayPortal', { read: OverlayPortal }) _overlayPortal: OverlayPortal;
  @ViewChild('loadingPortal', { read: OverlayPortal }) _loadingPortal: OverlayPortal;
  @ViewChild('toastPortal', { read: OverlayPortal }) _toastPortal: OverlayPortal;

  constructor(
    @Inject(AppRootToken) private _userCmp: any,
    private _cfr: ComponentFactoryResolver,
    elementRef: ElementRef,
    renderer: Renderer,
    config: Config,
    private _plt: Platform,
    app: App
  ) {
    super(config, elementRef, renderer);
    // register with App that this is Ionic's appRoot component. tada!
    app._appRoot = this;
    this._stopScrollPlugin = (<any>window)['IonicStopScroll'];
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

    const versions = this._plt.versions();
    this._plt.platforms().forEach(platformName => {
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
    this._plt.prepareReady();
  }

  _getPortal(portal?: AppPortal): OverlayPortal {
    if (portal === AppPortal.LOADING) {
      return this._loadingPortal;
    }
    if (portal === AppPortal.TOAST) {
      return this._toastPortal;
    }
    // Modals need their own overlay becuase we don't want an ActionSheet
    // or Alert to trigger lifecycle events inside a modal
    if (portal === AppPortal.MODAL) {
      return this._modalPortal;
    }
    return this._overlayPortal;
  }

  _getActivePortal(): OverlayPortal {
    const defaultPortal = this._overlayPortal;
    const modalPortal = this._modalPortal;
    const hasModal = modalPortal.length() > 0;
    const hasDefault = defaultPortal.length() > 0;

    if (!hasModal && !hasDefault) {
      return null;

    } else if (hasModal && hasDefault) {
      var defaultIndex = defaultPortal.getActive().getZIndex();
      var modalIndex = modalPortal.getActive().getZIndex();

      if (defaultIndex > modalIndex) {
        return defaultPortal;
      } else {
        assert(modalIndex > defaultIndex, 'modal and default zIndex can not be equal');
        return modalPortal;
      }

    } if (hasModal) {
      return modalPortal;

    } else if (hasDefault) {
      return defaultPortal;
    }
  }

  _disableScroll(shouldDisableScroll: boolean) {
    if (shouldDisableScroll) {
      this.stopScroll().then(() => {
        this._tmr = this._plt.timeout(() => {
          console.debug('App Root: adding .disable-scroll');
          this.setElementClass('disable-scroll', true);
        }, 32);
      });
    } else {
      let plugin = this._stopScrollPlugin;
      if (plugin && plugin.cancel) {
        plugin.cancel();
      }
      clearTimeout(this._tmr);
      console.debug('App Root: removing .disable-scroll');
      this.setElementClass('disable-scroll', false);
    }
  }

  stopScroll(): Promise<boolean> {
    if (this._stopScrollPlugin) {
      return new Promise((resolve, reject) => {
        this._stopScrollPlugin.stop(() => resolve(true));
      });
    } else {
      return Promise.resolve(false);
    }
  }

}

export const enum AppPortal {
  DEFAULT,
  MODAL,
  LOADING,
  TOAST
};
