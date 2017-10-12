import { EventEmitter, Injectable, Optional } from '@angular/core';
import { DOCUMENT, Title } from '@angular/platform-browser';

import { IonicApp } from './app-root';
import * as Constants from './app-constants';
import { ClickBlock } from './click-block';
import { assert, runInDev } from '../../util/util';
import { Config } from '../../config/config';
import { DIRECTION_BACK, DIRECTION_FORWARD, NavOptions, isTabs } from '../../navigation/nav-util';
import { MenuController } from './menu-controller';
import { NavigationContainer } from '../../navigation/navigation-container';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { Platform } from '../../platform/platform';
import { ViewController } from '../../navigation/view-controller';
import { IOSTransition } from '../../transitions/transition-ios';
import { MDTransition } from '../../transitions/transition-md';
import { WPTransition } from '../../transitions/transition-wp';


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
  private _titleSrv: Title = new Title(DOCUMENT);
  private _rootNavs = new Map<string, NavigationContainer>();
  private _disableScrollAssist: boolean;
  private _didScroll = false;

  /**
   * @hidden
   */
  _clickBlock: ClickBlock;

  /**
   * @hidden
   */
  _appRoot: IonicApp;

  /**
   * Observable that emits whenever a view loads in the app.
   * @returns {Observable} Returns an observable
   */
  viewDidLoad: EventEmitter<ViewController> = new EventEmitter();

  /**
   * Observable that emits before any view is entered in the app.
   * @returns {Observable} Returns an observable
   */
  viewWillEnter: EventEmitter<ViewController> = new EventEmitter();

  /**
   * Observable that emits after any view is entered in the app.
   * @returns {Observable} Returns an observable
   */
  viewDidEnter: EventEmitter<ViewController> = new EventEmitter();

  /**
   * Observable that emits before any view is exited in the app.
   * @returns {Observable} Returns an observable
   */
  viewWillLeave: EventEmitter<ViewController> = new EventEmitter();

  /**
   * Observable that emits after any view is exited in the app.
   * @returns {Observable} Returns an observable
   */
  viewDidLeave: EventEmitter<ViewController> = new EventEmitter();

  /**
   * Observable that emits before any view unloads in the app.
   * @returns {Observable} Returns an observable
   */
  viewWillUnload: EventEmitter<ViewController> = new EventEmitter();

  constructor(
    private _config: Config,
    private _plt: Platform,
    @Optional() private _menuCtrl?: MenuController
  ) {
    // listen for hardware back button events
    // register this back button action with a default priority
    _plt.registerBackButtonAction(this.goBack.bind(this));
    this._disableScrollAssist = _config.getBoolean('disableScrollAssist', false);

    const blurring = _config.getBoolean('inputBlurring', false);
    if (blurring) {
      this._enableInputBlurring();
    }

    runInDev(() => {
      // During developement, navPop can be triggered by calling
      const win = <any>_plt.win();
      if (!win['HWBackButton']) {
        win['HWBackButton'] = () => {
          let p = this.goBack();
          p && p.catch(() => console.debug('hardware go back cancelled'));
          return p;
        };
      }
    });

    _config.setTransition('ios-transition', IOSTransition);
    _config.setTransition('md-transition', MDTransition);
    _config.setTransition('wp-transition', WPTransition);
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
   * @hidden
   */
  setElementClass(className: string, isAdd: boolean) {
    this._appRoot.setElementClass(className, isAdd);
  }

  /**
   * @hidden
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
  setEnabled(isEnabled: boolean, duration: number = 700, minDuration: number = 0) {
    this._disTime = (isEnabled ? 0 : Date.now() + duration);

    if (this._clickBlock) {
      if (isEnabled) {
        // disable the click block if it's enabled, or the duration is tiny
        this._clickBlock.activate(false,  CLICK_BLOCK_BUFFER_IN_MILLIS, minDuration);

      } else {
        // show the click block for duration + some number
        this._clickBlock.activate(true, duration + CLICK_BLOCK_BUFFER_IN_MILLIS, minDuration);
      }
    }
  }

  /**
   * @hidden
   * Toggles whether an application can be scrolled
   * @param {boolean} disableScroll when set to `false`, the application's
   * scrolling is enabled. When set to `true`, scrolling is disabled.
   */
  _setDisableScroll(disableScroll: boolean) {
    if (this._disableScrollAssist) {
      this._appRoot._disableScroll(disableScroll);
    }
  }

  /**
   * @hidden
   * Boolean if the app is actively enabled or not.
   * @return {boolean}
   */
  isEnabled(): boolean {
    const disTime = this._disTime;
    if (disTime === 0) {
      return true;
    }
    return (disTime < Date.now());
  }

  /**
   * @hidden
   */
  setScrolling() {
    this._scrollTime = Date.now() + ACTIVE_SCROLLING_TIME;
    this._didScroll = true;
  }

  /**
   * Boolean if the app is actively scrolling or not.
   * @return {boolean} returns true or false
   */
  isScrolling(): boolean {
    const scrollTime = this._scrollTime;
    if (scrollTime === 0) {
      return false;
    }
    if (scrollTime < Date.now()) {
      this._scrollTime = 0;
      return false;
    }
    return true;
  }

  /**
   * @return {NavController} Returns the first Active Nav Controller from the list. This method is deprecated
   */
  getActiveNav(): NavControllerBase {
    console.warn('(getActiveNav) is deprecated and will be removed in the next major release. Use getActiveNavs instead.');
    const navs = this.getActiveNavs();
    if (navs && navs.length) {
      return navs[0];
    }
    return null;
  }

  /**
   * @return {NavController[]} Returns the active NavControllers. Using this method is preferred when we need access to the top-level navigation controller while on the outside views and handlers like `registerBackButtonAction()`
   */
  getActiveNavs(rootNavId?: string): NavControllerBase[] {
    const portal = this._appRoot._getPortal(Constants.PORTAL_MODAL);
    if (portal.length() > 0) {
      return <NavControllerBase[]> findTopNavs(portal);
    }
    if (!this._rootNavs || !this._rootNavs.size) {
      return [];
    }
    if (this._rootNavs.size === 1) {
      return <NavControllerBase[]> findTopNavs(this._rootNavs.values().next().value);
    }
    if (rootNavId) {
      return <NavControllerBase[]> findTopNavs(this._rootNavs.get(rootNavId));
    }
    // fallback to just using all root names
    let activeNavs: NavigationContainer[] = [];
    this._rootNavs.forEach(nav => {
      const topNavs = findTopNavs(nav);
      activeNavs = activeNavs.concat(topNavs);
    });
    return <NavControllerBase[]> activeNavs;
  }

  getRootNav(): any {
    console.warn('(getRootNav) is deprecated and will be removed in the next major release. Use getRootNavById instead.');
    const rootNavs = this.getRootNavs();
    if (rootNavs.length === 0) {
      return null;
    } else if (rootNavs.length > 1) {
      console.warn('(getRootNav) there are multiple root navs, use getRootNavs instead');
    }
    return rootNavs[0];
  }

  getRootNavs(): any[] {
    const navs: NavigationContainer[] = [];
    this._rootNavs.forEach(nav => navs.push(nav));
    return navs;
  }

  /**
   * @return {NavController} Returns the root NavController
   */
  getRootNavById(navId: string): NavigationContainer {
    return this._rootNavs.get(navId);
  }

  /**
   * @hidden
   */
  registerRootNav(nav: NavigationContainer) {
    this._rootNavs.set(nav.id, nav);
  }

  /**
   * @hidden
   */
  unregisterRootNav(nav: NavigationContainer) {
    this._rootNavs.delete(nav.id);
  }


  getActiveNavContainers(): NavigationContainer[] {
    // for each root nav container, get it's active nav
    let list: NavigationContainer[] = [];
    this._rootNavs.forEach((container: NavigationContainer) => {
      list = list.concat(findTopNavs(container));
    });
    return list;
  }

  /**
   * @hidden
   */
  present(enteringView: ViewController, opts: NavOptions, appPortal?: number): Promise<any> {
    assert(enteringView.isOverlay, 'presented view controller needs to be an overlay');

    const portal = this._appRoot._getPortal(appPortal);

    // Set Nav must be set here in order to dimiss() work synchnously.
    // TODO: move _setNav() to the earlier stages of NavController. _queueTrns()
    enteringView._setNav(portal);

    opts.direction = DIRECTION_FORWARD;

    if (!opts.animation) {
      opts.animation = enteringView.getTransitionName(DIRECTION_FORWARD);
    }

    enteringView.setLeavingOpts({
      keyboardClose: opts.keyboardClose,
      direction: DIRECTION_BACK,
      animation: enteringView.getTransitionName(DIRECTION_BACK),
      ev: opts.ev
    });

    return portal.insertPages(-1, [enteringView], opts);
  }

  /**
   * @hidden
   */
  goBack(): Promise<any> {
    if (this._menuCtrl && this._menuCtrl.isOpen()) {
      return this._menuCtrl.close();
    }

    const navPromise = this.navPop();
    if (!navPromise) {
      // no views to go back to
      // let's exit the app
      if (this._config.getBoolean('navExitApp', true)) {
        console.debug('app, goBack exitApp');
        this._plt.exitApp();
      }
    }
    return navPromise;
  }

  /**
   * @hidden
   */
  navPop(): Promise<any> {
    if (!this._rootNavs || this._rootNavs.size === 0 || !this.isEnabled()) {
      return Promise.resolve();
    }

    // If there are any alert/actionsheet open, let's do nothing
    const portal = this._appRoot._getPortal(Constants.PORTAL_DEFAULT);
    if (portal.length() > 0) {
      return Promise.resolve();
    }

    let navToPop: NavControllerBase = null;
    let mostRecentVC: ViewController = null;
    this._rootNavs.forEach((navContainer: NavigationContainer) => {
      const activeNavs = this.getActiveNavs(navContainer.id);
      const poppableNavs = activeNavs.map(activeNav => getPoppableNav(activeNav)).filter(nav => !!nav);
      poppableNavs.forEach(poppable => {
        const topViewController = poppable.last();
        if (poppable._isPortal || (topViewController && poppable.length() > 1 && (!mostRecentVC || topViewController._ts >=  mostRecentVC._ts))) {
          mostRecentVC = topViewController;
          navToPop = poppable;
        }
      });
    });
    if (navToPop) {
      return navToPop.pop();
    }
  }

  /**
   * @hidden
   */
  _enableInputBlurring() {
    console.debug('App: _enableInputBlurring');
    let focused = true;
    const self = this;
    const platform = this._plt;

    platform.registerListener(platform.doc(), 'focusin', onFocusin, { capture: true, zone: false, passive: true });
    platform.registerListener(platform.doc(), 'touchend', onTouchend, { capture: false, zone: false, passive: true });

    function onFocusin() {
      focused = true;
    }

    function onTouchend(ev: any) {
      // if app did scroll return early
      if (self._didScroll) {
        self._didScroll = false;
        return;
      }
      const active = <HTMLElement> self._plt.getActiveElement();
      if (!active) {
        return;
      }
      // only blur if the active element is a text-input or a textarea
      if (SKIP_BLURRING.indexOf(active.tagName) === -1) {
        return;
      }

      // if the selected target is the active element, do not blur
      const tapped = ev.target;
      if (tapped === active) {
        return;
      }
      if (SKIP_BLURRING.indexOf(tapped.tagName) >= 0) {
        return;
      }

      // skip if div is a cover
      if (tapped.classList.contains('input-cover')) {
        return;
      }

      focused = false;
      // TODO: find a better way, why 50ms?
      platform.timeout(() => {
        if (!focused) {
          active.blur();
        }
      }, 50);
    }
  }

  getNavByIdOrName(id: string) {
    const navs = Array.from(this._rootNavs.values());
    for (const navContainer of navs) {
      const match = getNavByIdOrName(navContainer, id);
      if (match) {
        return match;
      }
    }
    return null;
  }

}

export function getNavByIdOrName(nav: NavigationContainer, id: string): NavigationContainer {
  if (nav.id === id || nav.name === id) {
    return nav;
  }
  for (const child of nav.getAllChildNavs()) {
    const tmp = getNavByIdOrName(child, id);
    if (tmp) {
      return tmp;
    }
  }
  return null;
}

function getPoppableNav(nav: NavControllerBase): NavControllerBase {
  if (!nav) {
    return null;
  }

  if (isTabs(nav)) {
    // tabs aren't a nav, so just call this function again immediately on the parent on tabs
    return getPoppableNav(nav.parent);
  }
  const len = nav.length();
  if (len > 1 || (nav._isPortal && len > 0)) {
    // this nav controller has more than one view
    // use this nav!
    return nav;
  }
  // try again using the parent nav (if there is one)
  return getPoppableNav(nav.parent);
}

export function findTopNavs(nav: NavigationContainer): NavigationContainer[] {
  let containers: NavigationContainer[] = [];
  const childNavs = nav.getActiveChildNavs();
  if (!childNavs || !childNavs.length) {
    containers.push(nav);
  } else {
    childNavs.forEach(childNav => {
      const topNavs = findTopNavs(childNav);
      containers = containers.concat(topNavs);
    });
  }
  return containers;
}


const SKIP_BLURRING = ['INPUT', 'TEXTAREA', 'ION-INPUT', 'ION-TEXTAREA'];
const ACTIVE_SCROLLING_TIME = 100;
const CLICK_BLOCK_BUFFER_IN_MILLIS = 64;
