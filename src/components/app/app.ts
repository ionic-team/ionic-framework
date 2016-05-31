import {Injectable, Injector} from '@angular/core';
import {Title} from '@angular/platform-browser';

import {Config} from '../../config/config';
import {ClickBlock} from '../../util/click-block';
import {Platform} from '../../platform/platform';


/**
 * Ionic App utility service.
 */
@Injectable()
export class App {
  private _disTime: number = 0;
  private _scrollTime: number = 0;
  private _title: string = '';
  private _titleSrv: Title = new Title();
  private _rootNav: any = null;
  private _appInjector: Injector;

  constructor(
    private _config: Config,
    private _clickBlock: ClickBlock,
    platform: Platform
  ) {
    platform.backButton.subscribe(() => {
      let activeNav = this.getActiveNav();
      if (activeNav) {
        if (activeNav.length() === 1) {
          platform.exitApp();
        } else {
          activeNav.pop();
        }
      }
    });
  }

  /**
   * Sets the document title.
   * @param {string} val  Value to set the document title to.
   */
  setTitle(val: string) {
    if (val !== this._title) {
      this._title = val;
      this._titleSrv.setTitle(val);
    }
  }

  /**
   * @private
   * Sets if the app is currently enabled or not, meaning if it's
   * available to accept new user commands. For example, this is set to `false`
   * while views transition, a modal slides up, an action-sheet
   * slides up, etc. After the transition completes it is set back to `true`.
   * @param {boolean} isEnabled
   * @param {boolean} fallback  When `isEnabled` is set to `false`, this argument
   * is used to set the maximum number of milliseconds that app will wait until
   * it will automatically enable the app again. It's basically a fallback incase
   * something goes wrong during a transition and the app wasn't re-enabled correctly.
   */
  setEnabled(isEnabled: boolean, duration: number = 700) {
    this._disTime = (isEnabled ? 0 : Date.now() + duration);

    if (this._clickBlock) {
      if (duration > 32) {
        // only do a click block if the duration is longer than XXms
        this._clickBlock.show(true, duration + 64);

      } else {
        this._clickBlock.show(false, 0);
      }
    }
  }

  /**
   * @private
   * Boolean if the app is actively enabled or not.
   * @return {boolean}
   */
  isEnabled(): boolean {
    return (this._disTime < Date.now());
  }

  /**
   * @private
   */
  setScrolling() {
    this._scrollTime = Date.now();
  }

  /**
   * Boolean if the app is actively scrolling or not.
   * @return {boolean}
   */
  isScrolling(): boolean {
    return (this._scrollTime + 64 > Date.now());
  }

  /**
   * @private
   */
  getActiveNav(): any {
    var nav = this._rootNav || null;
    var activeChildNav: any;

    while (nav) {
      activeChildNav = nav.getActiveChildNav();
      if (!activeChildNav) {
        break;
      }
      nav = activeChildNav;
    }

    return nav;
  }

  /**
   * @private
   */
  getRootNav(): any {
    return this._rootNav;
  }

  /**
   * @private
   */
  setRootNav(nav: any) {
    this._rootNav = nav;
  }

  /**
   * @private
   */
  getRegisteredComponent(cls: any): any {
    // deprecated warning: added 2016-04-28, beta7
    console.warn('Using app.getRegisteredComponent() to query components has been deprecated. ' +
                 'Please use Angular\'s ViewChild annotation instead:\n\nhttp://learnangular2.com/viewChild/');
  }

  /**
   * @private
   */
  getComponent(id: string): any {
    // deprecated warning: added 2016-04-28, beta7
    console.warn('Using app.getComponent() to query components has been deprecated. ' +
                 'Please use Angular\'s ViewChild annotation instead:\n\nhttp://learnangular2.com/viewChild/');
  }

  /**
   * Set the global app injector that contains references to all of the instantiated providers
   * @param injector
   */
  setAppInjector(injector: Injector) {
    this._appInjector = injector;
  }

  /**
   * Get an instance of the global app injector that contains references to all of the instantiated providers
   * @returns {Injector}
   */
  getAppInjector(): Injector {
    return this._appInjector;
  }
}
