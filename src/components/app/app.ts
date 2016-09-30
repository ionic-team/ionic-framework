import { EventEmitter, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AppPortal, IonicApp } from './app-root';
import { ClickBlock } from '../../util/click-block';
import { Config } from '../../config/config';
import { isNav, isTabs, NavOptions, DIRECTION_FORWARD, DIRECTION_BACK } from '../../navigation/nav-util';
import { NavController } from '../../navigation/nav-controller';
import { Platform } from '../../platform/platform';
import { ViewController } from '../../navigation/view-controller';


/**
 * @name App
 * @description
 * App is a utility class used in Ionic to get information about various aspects of an app
 */
@Injectable()
export class App {
  private _disTime: number = 0;
  private _scrollTime: number = 0;
  private _title: string = '';
  private _titleSrv: Title = new Title();
  private _rootNav: NavController = null;

  /**
   * @private
   */
  _clickBlock: ClickBlock;

  /**
   * @private
   */
  _appRoot: IonicApp;

  /**
   * @private
   */
  viewDidLoad: EventEmitter<any> = new EventEmitter();

  /**
   * @private
   */
  viewWillEnter: EventEmitter<any> = new EventEmitter();

  /**
   * @private
   */
  viewDidEnter: EventEmitter<any> = new EventEmitter();

  /**
   * @private
   */
  viewWillLeave: EventEmitter<any> = new EventEmitter();

  /**
   * @private
   */
  viewDidLeave: EventEmitter<any> = new EventEmitter();

  /**
   * @private
   */
  viewWillUnload: EventEmitter<any> = new EventEmitter();

  constructor(
    private _config: Config,
    private _platform: Platform
  ) {
    // listen for hardware back button events
    // register this back button action with a default priority
    _platform.registerBackButtonAction(this.navPop.bind(this));
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
   */
  setElementClass(className: string, isAdd: boolean) {
    this._appRoot.setElementClass(className, isAdd);
  }

  /**
   * Sets if the app is currently enabled or not, meaning if it's
   * available to accept new user commands. For example, this is set to `false`
   * while views transition, a modal slides up, an action-sheet
   * slides up, etc. After the transition completes it is set back to `true`.
   * @param {boolean} isEnabled `true` for enabled, `false` for disabled
   * @param {number} duration  When `isEnabled` is set to `false`, this argument
   * is used to set the maximum number of milliseconds that app will wait until
   * it will automatically enable the app again. It's basically a fallback incase
   * something goes wrong during a transition and the app wasn't re-enabled correctly.
   */
  setEnabled(isEnabled: boolean, duration: number = 700) {
    this._disTime = (isEnabled ? 0 : Date.now() + duration);

    if (this._clickBlock) {
      if (isEnabled || duration <= 32) {
        // disable the click block if it's enabled, or the duration is tiny
        this._clickBlock.activate(false, 0);

      } else {
        // show the click block for duration + some number
        this._clickBlock.activate(true, duration + CLICK_BLOCK_BUFFER_IN_MILLIS);
      }
    }
  }

  /**
   * Toggles whether an application can be scrolled
   * @param {boolean} disableScroll when set to `false`, the application's
   * scrolling is enabled. When set to `true`, scrolling is disabled.
   */
  setScrollDisabled(disableScroll: boolean) {
    if (this._config.get('canDisableScroll', true)) {
      this._appRoot._disableScroll(disableScroll);
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
    return (this._scrollTime + 48 > Date.now());
  }

  /**
   * @private
   */
  getActiveNav(): NavController {
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
   * retuns the root NavController
   */
  getRootNav(): NavController {
    return this._rootNav;
  }

  /**
   * @private
   */
  _setRootNav(nav: any) {
    this._rootNav = nav;
  }

  /**
   * @private
   */
  present(enteringView: ViewController, opts: NavOptions, appPortal?: AppPortal): Promise<any> {
    const portal = this._appRoot._getPortal(appPortal);

    enteringView._setNav(portal);

    opts.keyboardClose = false;
    opts.direction = DIRECTION_FORWARD;

    if (!opts.animation) {
      opts.animation = enteringView.getTransitionName(DIRECTION_FORWARD);
    }

    enteringView.setLeavingOpts({
      keyboardClose: false,
      direction: DIRECTION_BACK,
      animation: enteringView.getTransitionName(DIRECTION_BACK),
      ev: opts.ev
    });

    return portal.insertPages(-1, [enteringView], opts);
  }

  /**
   * @private
   */
  navPop(): Promise<any> {
    // function used to climb up all parent nav controllers
    function navPop(nav: any): Promise<any> {
      if (nav) {
        if (isTabs(nav)) {
          // FYI, using "nav instanceof Tabs" throws a Promise runtime error for whatever reason, idk
          // this is a Tabs container
          // see if there is a valid previous tab to go to
          let prevTab = nav.previousTab(true);
          if (prevTab) {
            console.debug('app, goBack previous tab');
            nav.select(prevTab);
            return Promise.resolve();
          }

        } else if (isNav(nav) && nav.length() > 1) {
          // this nav controller has more than one view
          // pop the current view on this nav and we're done here
          console.debug('app, goBack pop nav');
          return nav.pop();
        }

        // try again using the parent nav (if there is one)
        return navPop(nav.parent);
      }

      // nerp, never found nav that could pop off a view
      return null;
    }

    // app must be enabled and there must be a
    // root nav controller for go back to work
    if (this._rootNav && this.isEnabled()) {
      const portal = this._appRoot._getPortal();

      // first check if the root navigation has any overlays
      // opened in it's portal, like alert/actionsheet/popup
      if (portal.length() > 0) {
        // there is an overlay view in the portal
        // let's pop this one off to go back
        console.debug('app, goBack pop overlay');
        return portal.pop();
      }

      // next get the active nav, check itself and climb up all
      // of its parent navs until it finds a nav that can pop
      let navPromise = navPop(this.getActiveNav());
      if (navPromise === null) {
        // no views to go back to
        // let's exit the app
        if (this._config.getBoolean('navExitApp', true)) {
          console.debug('app, goBack exitApp');
          this._platform.exitApp();
        }
      }

      return navPromise;
    }

    return Promise.resolve();
  }

}

const CLICK_BLOCK_BUFFER_IN_MILLIS = 64;
