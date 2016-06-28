import { Component, ComponentResolver, EventEmitter, Injectable, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ClickBlock } from '../../util/click-block';
import { Config } from '../../config/config';
import { NavController } from '../nav/nav-controller';
import { NavOptions } from '../nav/nav-options';
import { NavPortal } from '../nav/nav-portal';
import { Platform } from '../../platform/platform';

/**
 * @private
 */
export abstract class UserComponent {}


/**
 * Ionic App utility service.
 */
@Injectable()
export class App {
  private _disTime: number = 0;
  private _scrollTime: number = 0;
  private _title: string = '';
  private _titleSrv: Title = new Title();
  private _rootNav: NavController = null;
  private _portal: NavPortal;

  /**
   * @private
   */
  clickBlock: ClickBlock;

  viewDidLoad: EventEmitter<any> = new EventEmitter();
  viewWillEnter: EventEmitter<any> = new EventEmitter();
  viewDidEnter: EventEmitter<any> = new EventEmitter();
  viewWillLeave: EventEmitter<any> = new EventEmitter();
  viewDidLeave: EventEmitter<any> = new EventEmitter();
  viewWillUnload: EventEmitter<any> = new EventEmitter();
  viewDidUnload: EventEmitter<any> = new EventEmitter();

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
   * Sets if the app is currently enabled or not, meaning if it's
   * available to accept new user commands. For example, this is set to `false`
   * while views transition, a modal slides up, an action-sheet
   * slides up, etc. After the transition completes it is set back to `true`.
   * @param {boolean} isEnabled
   * @param {number} duration  When `isEnabled` is set to `false`, this argument
   * is used to set the maximum number of milliseconds that app will wait until
   * it will automatically enable the app again. It's basically a fallback incase
   * something goes wrong during a transition and the app wasn't re-enabled correctly.
   */
  setEnabled(isEnabled: boolean, duration: number = 700) {
    this._disTime = (isEnabled ? 0 : Date.now() + duration);

    if (this.clickBlock) {
      if (isEnabled || duration <= 32) {
        // disable the click block if it's enabled, or the duration is tiny
        this.clickBlock.activate(false, 0);

      } else {
        // show the click block for duration + some number
        this.clickBlock.activate(true, duration + CLICK_BLOCK_BUFFER_IN_MILLIS);
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
   * @private
   */
  getRootNav(): NavController {
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
  setPortal(portal: NavPortal) {
    this._portal = portal;
  }

  /**
   * @private
   */
  present(enteringView: any, opts: NavOptions = {}): Promise<any> {
    enteringView.setNav(this._portal);

    opts.keyboardClose = false;
    opts.direction = 'forward';

    if (!opts.animation) {
      opts.animation = enteringView.getTransitionName('forward');
    }

    enteringView.setLeavingOpts({
      keyboardClose: false,
      direction: 'back',
      animation: enteringView.getTransitionName('back'),
      ev: opts.ev
    });

    return this._portal.insertViews(-1, [enteringView], opts);
  }

  /**
   * @private
   */
  navPop(): Promise<any> {
    // function used to climb up all parent nav controllers
    function navPop(nav: any): Promise<any> {
      if (nav) {
        if (nav.length && nav.length() > 1) {
          // this nav controller has more than one view
          // pop the current view on this nav and we're done here
          console.debug('app, goBack pop nav');
          return nav.pop();

        } else if (nav.previousTab) {
          // FYI, using "nav instanceof Tabs" throws a Promise runtime error for whatever reason, idk
          // this is a Tabs container
          // see if there is a valid previous tab to go to
          let prevTab = nav.previousTab(true);
          if (prevTab) {
            console.debug('app, goBack previous tab');
            nav.select(prevTab);
            return Promise.resolve();
          }
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

      // first check if the root navigation has any overlays
      // opened in it's portal, like alert/actionsheet/popup
      if (this._portal && this._portal.length() > 0) {
        // there is an overlay view in the portal
        // let's pop this one off to go back
        console.debug('app, goBack pop overlay');
        return this._portal.pop();
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

      } else {
        return navPromise;
      }
    }

    return Promise.resolve();
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
   * Get an instance of the global app injector that contains references to all of the instantiated providers
   * @returns {Injector}
   */
  getAppInjector(): any {
    // deprecated warning: added 2016-06-27, beta10
    console.warn('Recent Angular2 versions should no longer require App.getAppInjector()');
  }
}


/**
 * @private
 */
@Component({
  selector: 'ion-app',
  template: `
    <div #anchor nav-portal></div>
    <click-block></click-block>
  `,
  directives: [NavPortal, ClickBlock]
})
export class AppRoot {

  @ViewChild('anchor', {read: ViewContainerRef}) private _viewport: ViewContainerRef;

  constructor(
      private _cmp: UserComponent,
      private _cr: ComponentResolver,
      private _renderer: Renderer) {}

  ngAfterViewInit() {
    // load the user app's root component
    this._cr.resolveComponent(<any>this._cmp).then(componentFactory => {
      let appEle: HTMLElement = this._renderer.createElement(null, componentFactory.selector || 'div', null);
      appEle.setAttribute('class', 'app-root');

      let componentRef = componentFactory.create(this._viewport.injector, null, appEle);
      this._viewport.insert(componentRef.hostView, 0);
    });
  }

}

const CLICK_BLOCK_BUFFER_IN_MILLIS = 64;
