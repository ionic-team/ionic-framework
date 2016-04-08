import {Compiler, ElementRef, Injector, provide, NgZone, AppViewManager, Renderer, ResolvedProvider, Type, Input} from 'angular2/core';
import {wtfLeave, wtfCreateScope, WtfScopeFn, wtfStartTimeRange, wtfEndTimeRange} from 'angular2/instrumentation';

import {Config} from '../../config/config';
import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {Keyboard} from '../../util/keyboard';
import {NavParams} from './nav-params';
import {pascalCaseToDashCase, isBlank} from '../../util/util';
import {Portal} from './nav-portal';
import {raf} from '../../util/dom';
import {SwipeBackGesture} from './swipe-back';
import {Transition} from '../../transitions/transition';
import {ViewController} from './view-controller';

/**
 * @name NavController
 * @description
 * _For examples on the basic usage of NavController, check out the
 * [Navigation section](../../../../components/#navigation) of the Component
 * docs._
 *
 * NavController is the base class for navigation controller components like
 * [`Nav`](../Nav/) and [`Tab`](../../Tabs/Tab/). You use navigation controllers
 * to navigate to [pages](#creating_pages) in your app. At a basic level, a
 * navigation controller is an array of pages representing a particular history
 * (of a Tab for example). This array can be manipulated to navigate throughout
 * an app by pushing and popping pages or inserting and removing them at
 * arbitrary locations in history.
 *
 * The current page is the last one in the array, or the top of the stack if we
 * think of it that way.  [Pushing](#push) a new page onto the top of the
 * navigation stack causes the new page to be animated in, while [popping](#pop)
 * the current page will navigate to the previous page in the stack.
 *
 * Unless you are using a directive like [NavPush](../NavPush/), or need a
 * specific NavController, most times you will inject and use a reference to the
 * nearest NavController to manipulate the navigation stack.
 *
 * <h3 id="injecting_nav_controller">Injecting NavController</h3>
 * Injecting NavController will always get you an instance of the nearest
 * NavController, regardless of whether it is a Tab or a Nav.
 *
 * Behind the scenes, when Ionic instantiates a new NavController, it creates an
 * injector with NavController bound to that instance (usually either a Nav or
 * Tab) and adds the injector to its own providers.  For more information on
 * providers and dependency injection, see [Providers and DI]().
 *
 * Instead, you can inject NavController and know that it is the correct
 * navigation controller for most situations (for more advanced situations, see
 * [Menu](../../Menu/Menu/) and [Tab](../../Tab/Tab/)).
 *
 * ```ts
 *  class MyComponent {
 *    constructor(nav: NavController) {
 *      this.nav = nav;
 *    }
 *  }
 * ```
 *
 * <h2 id="creating_pages">Page creation</h2>
 * _For more information on the `@Page` decorator see the [@Page API
 * reference](../../../decorators/Page/)._
 *
 * Pages are created when they are added to the navigation stack.  For methods
 * like [push()](#push), the NavController takes any component class that is
 * decorated with `@Page` as its first argument.  The NavController then
 * compiles that component, adds it to the app and animates it into view.
 *
 * By default, pages are cached and left in the DOM if they are navigated away
 * from but still in the navigation stack (the exiting page on a `push()` for
 * example).  They are destroyed when removed from the navigation stack (on
 * [pop()](#pop) or [setRoot()](#setRoot)).
 *
 *
 * <h2 id="Lifecycle">Lifecycle events</h2>
 * Lifecycle events are fired during various stages of navigation.  They can be
 * defined in any `@Page` decorated component class.
 *
 * ```ts
 * @Page({
 *   template: 'Hello World'
 * })
 * class HelloWorld {
 *   onPageLoaded() {
 *     console.log("I'm alive!");
 *   }
 *   onPageWillLeave() {
 *     console.log("Looks like I'm about to leave :(");
 *   }
 * }
 * ```
 *
 *
 *
 * - `onPageLoaded` - Runs when the page has loaded. This event only happens once per page being created and added to the DOM. If a page leaves but is cached, then this event will not fire again on a subsequent viewing. The `onPageLoaded` event is good place to put your setup code for the page.
 * - `onPageWillEnter` - Runs when the page is about to enter and become the active page.
 * - `onPageDidEnter` - Runs when the page has fully entered and is now the active page. This event will fire, whether it was the first load or a cached page.
 * - `onPageWillLeave` - Runs when the page is about to leave and no longer be the active page.
 * - `onPageDidLeave` - Runs when the page has finished leaving and is no longer the active page.
 * - `onPageWillUnload` - Runs when the page is about to be destroyed and have its elements removed.
 * - `onPageDidUnload` - Runs after the page has been destroyed and its elements have been removed.
 *
 * @see {@link /docs/v2/components#navigation Navigation Component Docs}
 */
export class NavController extends Ion {
  private _transIds = 0;
  private _init = false;
  private _trans: Transition;
  private _sbGesture: SwipeBackGesture;
  private _sbThreshold: number;
  private _portal: Portal;
  private _children: any[] = [];

  protected _sbEnabled: boolean;
  protected _ids: number = -1;
  protected _trnsDelay: any;
  protected _trnsTime: number = 0;
  protected _views: Array<ViewController> = [];

  /**
   * @private
   */
  id: string;

  /**
   * @private
   */
  providers: ResolvedProvider[];

  /**
   * @private
   */
  routers: any[] = [];

  /**
   * @private
   */
  parent: any;

  /**
   * @private
   */
  config: Config;

  /**
   * @private
   */
  isPortal: boolean = false;

  constructor(
    parent: any,
    protected _app: IonicApp,
    config: Config,
    protected _keyboard: Keyboard,
    elementRef: ElementRef,
    protected _anchorName: string,
    protected _compiler: Compiler,
    protected _viewManager: AppViewManager,
    protected _zone: NgZone,
    protected _renderer: Renderer
  ) {
    super(elementRef);

    this.parent = parent;
    this.config = config;

    this._trnsDelay = config.get('pageTransitionDelay');

    this._sbEnabled = config.getBoolean('swipeBackEnabled');
    this._sbThreshold = config.getNumber('swipeBackThreshold', 40);

    this.id = (++ctrlIds).toString();

    // build a new injector for child ViewControllers to use
    this.providers = Injector.resolve([
      provide(NavController, {useValue: this})
    ]);
  }

  setPortal(val: Portal) {
    this._portal = val;
  }

  /**
   * Set the root for the current navigation stack
   * @param {Type} page  The name of the component you want to push on the navigation stack
   * @param {object} [params={}] Any nav-params you want to pass along to the next view
   * @param {object} [opts={}] Any options you want to use pass to transtion
   * @returns {Promise} Returns a promise when done
   */
  setRoot(page: Type, params?: any, opts?: NavOptions): Promise<any> {
    return this.setPages([{page, params}], opts);
  }

  /**
   * You can set the views of the current navigation stack and navigate to the last view past
   *
   *
   *```typescript
   * import {Page, NavController} from 'ionic-angular'
   * import {Detail} from '../detail/detail'
   * import {Info} from '../info/info'
   *
   *  export class Home {
   *    constructor(nav: NavController) {
   *      this.nav = nav;
   *    }
   *    setPages() {
   *      this.nav.setPages([ {page: List}, {page: Detail}, {page:Info} ]);
   *    }
   *  }
   *```
   *
   *
   *In this example, we're giving the current nav stack an array of pages. Then the navigation stack will navigate to the last view in the array and remove the orignal view you came from.
   *
   * By default, animations are disabled, but they can be enabled by passing options to the navigation controller
   *
   *
   *```typescript
   * import {Page, NavController} from 'ionic-angular'
   * import {Detail} from '../detail/detail'
   *
   *  export class Home {
   *    constructor(nav: NavController) {
   *      this.nav = nav;
   *    }
   *    setPages() {
   *      this.nav.setPages([ {page: List}, {page: Detail} ], {
   *        animate: true
   *      });
   *    }
   *  }
   *```
   *
   *
   *You can also pass any navigation params to the individual pages in the array.
   *
   *
   *```typescript
   * import {Page, NavController} from 'ionic-angular';
   * import {Info} from '../info/info';
   * import {List} from '../list/list';
   * import {Detail} from '../detail/detail';
   *
   *  export class Home {
   *    constructor(nav: NavController) {
   *      this.nav = nav;
   *    }
   *    setPages() {
   *      this.nav.setPages([{
   *        page: Info
   *      }, {
   *        page: List,
   *        params: {tags: 'css'}
   *      }, {
   *        page: Detail,
   *        params: {id: 325}
   *      }]);
   *    }
   *  }
   *```
   *
   * @param {array<Type>} pages  An arry of page components and their params to load in the stack
   * @param {object} [opts={}] Any options you want to use pass
   * @returns {Promise} Returns a promise when the pages are set
   */
  setPages(pages: Array<{page: Type, params?: any}>, opts?: NavOptions): Promise<any> {
    if (!pages || !pages.length) {
      return Promise.resolve(false);
    }

    if (isBlank(opts)) {
      opts = {};
    }

    // deprecated warning
    pages.forEach(pg => {
      if (pg['componentType']) {
        pg.page = pg['componentType'];
        console.warn('setPages() now uses "page" instead of "componentType" in the array of pages. ' +
                     'What was: setPages([{componentType: About}, {componentType: Contact}]) is now: setPages([{page: About}, {page: Contact}])');

      } else if (!pg['page']) {
        console.error('setPages() now requires an object containing "page" and optionally "params" in the array of pages. ' +
                     'What was: setPages([About, Contact]) is now: setPages([{page: About}, {page: Contact}])');
      }
    });

    // remove existing views
    let leavingView = this._remove(0, this._views.length);

    // create view controllers out of the pages and insert the new views
    let views = pages.map(p => new ViewController(p.page, p.params));
    let enteringView = this._insert(0, views);

    // if animation wasn't set to true then default it to NOT animate
    if (opts.animate !== true) {
      opts.animate = false;
    }

    // set the nav direction to "back" if it wasn't set
    opts.direction = opts.direction || 'back';

    let resolve;
    let promise = new Promise(res => { resolve = res; });

    // start the transition, fire resolve when done...
    this._transition(enteringView, leavingView, opts, (hasCompleted: boolean) => {
      // transition has completed!!
      resolve(hasCompleted);
    });

    return promise;
  }

  /**
   * @private
   */
  private setViews(components, opts?: NavOptions) {
    console.warn('setViews() deprecated, use setPages() instead');
    return this.setPages(components, opts);
  }

  /**
   * Push is how we can pass components and navigate to them. We push the component we want to navigate to on to the navigation stack.
   *
   * ```typescript
   * class MyClass{
   *    constructor(nav:NavController){
   *      this.nav = nav;
   *    }
   *
   *    pushPage(){
   *      this.nav.push(SecondView);
   *    }
   * }
   * ```
   *
   * We can also pass along parameters to the next view, such as data that we have on the current view. This is a similar concept to to V1 apps with `$stateParams`.
   *
   * ```typescript
   * class MyClass{
   *    constructor(nav:NavController){
   *      this.nav = nav;
   *    }
   *
   *    pushPage(user){
   *      this.nav.push(SecondView,{
   *       // user is an object we have in our view
   *       // typically this comes from an ngFor or some array
   *       // here we can create an object with a property of
   *       // paramUser, and set it's value to the user object we passed in
   *       paramUser: user
   *      });
   *    }
   * }
   * ```
   *
   * We'll look at how we can access that data in the `SecondView` in the navParam docs
   *
   * We can also pass any options to the transtion from that same method
   *
   * ```typescript
   * class MyClass{
   *    constructor(nav: NavController){
   *      this.nav = nav;
   *    }
   *
   *    pushPage(user){
   *      this.nav.push(SecondView,{
   *       // user is an object we have in our view
   *       // typically this comes from an ngFor or some array
   *       // here we can create an object with a property of
   *       // paramUser, and set it's value to the user object we passed in
   *       paramUser: user
   *      },{
   *       // here we can configure things like the animations direction or
   *       // or if the view should animate at all.
   *       direction: 'back'
   *      });
   *    }
   * }
   * ```
   * @param {Type} page  The page component class you want to push on to the navigation stack
   * @param {object} [params={}] Any nav-params you want to pass along to the next view
   * @param {object} [opts={}] Any options you want to use pass to transtion
   * @returns {Promise} Returns a promise, which resolves when the transition has completed
   */
  push(page: Type, params?: any, opts?: NavOptions) {
    return this.insertPages(-1, [{page: page, params: params}], opts);
  }

  /**
   * Present is how we display overlays on top of the content, from within the
   * root level `NavController`. The `present` method is used by overlays, such
   * as `ActionSheet`, `Alert`, and `Modal`. The main difference between `push`
   * and `present`, is that `present` takes a `ViewController` instance, whereas
   * `push` takes a `Page` component class. Additionally, `present` will place
   * the overlay in the root NavController's stack.
   *
   * ```typescript
   * class MyClass{
   *    constructor(nav: NavController) {
   *      this.nav = nav;
   *    }
   *
   *    presentModal() {
   *      let modal = Modal.create(ProfilePage);
   *      this.nav.present(modal);
   *    }
   * }
   * ```
   *
   * @param {ViewController} enteringView The name of the component you want to push on the navigation stack
   * @param {object} [opts={}] Any options you want to use pass to transtion
   * @returns {Promise} Returns a promise, which resolves when the transition has completed
   */
  present(enteringView: ViewController, opts?: NavOptions): Promise<any> {
    let rootNav = this.rootNav;

    if (rootNav['_tabs']) {
      // TODO: must have until this goes in
      // https://github.com/angular/angular/issues/5481
      console.error('A parent <ion-nav> is required for ActionSheet/Alert/Modal/Loading');
      return;
    }

    if (isBlank(opts)) {
      opts = {};
    }

    if (enteringView.usePortal && this._portal) {
      return this._portal.present(enteringView, opts);
    }

    enteringView.setNav(rootNav);

    opts.keyboardClose = false;
    opts.direction = 'forward';

    if (!opts.animation) {
      opts.animation = enteringView.getTransitionName('forward');
    }

    enteringView.setLeavingOpts({
      keyboardClose: false,
      direction: 'back',
      animation: enteringView.getTransitionName('back')
    });

    // start the transition
    return rootNav._insertViews(-1, [enteringView], opts);
  }

  /**
   * Inserts a view into the nav stack at the specified index.
   * This is useful if you need to add a view at any point in your navigation stack
   *
   * ```typescript
   * export class Detail {
   *    constructor(nav: NavController) {
   *      this.nav = nav;
   *    }
   *    insertPage(){
   *      this.nav.insert(1, Info);
   *    }
   *  }
   * ```
   *
   * This will insert the `Info` page into the second slot of our navigation stack
   *
   * @param {number} insertIndex  The index where you want to insert the page
   * @param {Type} page  The name of the component you want to insert into the nav stack
   * @param {object} [params={}] Any nav-params you want to pass along to the next page
   * @param {object} [opts={}] Any options you want to use pass to transtion
   * @returns {Promise} Returns a promise when the page has been inserted into the navigation stack
   */
  insert(insertIndex: number, page: Type, params?: any, opts?: NavOptions): Promise<any> {
    return this.insertPages(insertIndex, [{page: page, params: params}], opts);
  }

  /**
   * Inserts multiple pages into the nav stack at the specified index.
   *
   * ```typescript
   * export class Detail {
   *    constructor(nav: NavController) {
   *      this.nav = nav;
   *    }
   *    insertPages(){
   *      let pages = [
   *        { page: Info },
   *        { page: ProfileList },
   *        { page: ProfileDetail, params: {userId:5} }
   *      ];
   *      this.nav.insertPages(2, pages);
   *    }
   *  }
   * ```
   *
   * This will insert each of the pages in the array, starting at the third slot
   * (second index) of the nav stack. The last page in the array will animate
   * in and become the active page.
   *
   * @param {number} insertIndex  The index where you want to insert the page
   * @param {array<{page: Type, params=: any}>} insertPages  An array of objects, each with a `page` and optionally `params` property
   * @param {object} [opts={}] Any options you want to use pass to transtion
   * @returns {Promise} Returns a promise when the pages have been inserted into the navigation stack
   */
  insertPages(insertIndex: number, insertPages: Array<{page: Type, params?: any}>, opts?: NavOptions): Promise<any> {
    let views = insertPages.map(p => new ViewController(p.page, p.params));
    return this._insertViews(insertIndex, views, opts);
  }

  private _insertViews(insertIndex: number, insertViews: Array<ViewController>, opts?: NavOptions): Promise<any> {
    if (!insertViews || !insertViews.length) {
      return Promise.reject('invalid pages');
    }

    if (isBlank(opts)) {
      opts = {};
    }

    // insert the new page into the stack
    // returns the newly created entering view
    let enteringView = this._insert(insertIndex, insertViews);

    // set the nav direction to "forward" if it wasn't set
    opts.direction = opts.direction || 'forward';

    // set which animation it should use if it wasn't set yet
    if (!opts.animation) {
      opts.animation = enteringView.getTransitionName(opts.direction);
    }

    let resolve;
    let promise = new Promise(res => { resolve = res; });

    // it's possible that the newly added view doesn't need to
    // transition in, but was simply inserted somewhere in the stack
    // go backwards through the stack and find the first active view
    // which could be active or one ready to enter
    for (var i = this._views.length - 1; i >= 0; i--) {
      if (this._views[i].state === STATE_ACTIVE || this._views[i].state === STATE_INIT_ENTER) {
        // found the view at the end of the stack that's either
        // already active or it is about to enter

        if (this._views[i] === enteringView) {
          // cool, so the last valid view is also our entering view!!
          // this means we should animate that bad boy in so it's the active view
          // return a promise and resolve when the transition has completed

          // get the leaving view which the _insert() already set
          let leavingView = this.getByState(STATE_INIT_LEAVE);

          // start the transition, fire resolve when done...
          this._transition(enteringView, leavingView, opts, (hasCompleted: boolean) => {
            // transition has completed!!
            resolve(hasCompleted);
          });

          return promise;
        }
        break;
      }
    }

    // the page was not pushed onto the end of the stack
    // but rather inserted somewhere in the middle or beginning
    // Since there are views after this new one, don't transition in
    // auto resolve cuz there was is no need for an animation
    return Promise.resolve(enteringView);
  }

  /**
   * @private
   */
  private _insert(insertIndex: number, insertViews: Array<ViewController>): ViewController {
    // when this is done, there should only be at most
    // 1 STATE_INIT_ENTER and 1 STATE_INIT_LEAVE
    // there should not be any that are STATE_ACTIVE after this is done

    // allow -1 to be passed in to auto push it on the end
    // and clean up the index if it's larger then the size of the stack
    if (insertIndex < 0 || insertIndex > this._views.length) {
      insertIndex = this._views.length;
    }

    // first see if there's an active view
    let view = this.getActive();
    if (view) {
      // there's an active view, set that it's initialized to leave
      view.state = STATE_INIT_LEAVE;

    } else if (view = this.getByState(STATE_INIT_ENTER)) {
      // oh no, there's already a transition initalized ready to enter!
      // but it actually hasn't entered yet at all so lets
      // just keep it in the array, but not render or animate it in
      view.state = STATE_INACTIVE;
    }

    // insert each of the views in the pages array
    let insertView: ViewController = null;

    insertViews.forEach((view, i) => {
      insertView = view;

      // create the new entering view
      view.setNav(this);
      view.state = STATE_INACTIVE;

      // give this inserted view an ID
      this._incId(view);

      // insert the entering view into the correct index in the stack
      this._views.splice(insertIndex + i, 0, view);
    });

    if (insertView) {
      insertView.state = STATE_INIT_ENTER;
    }

    return insertView;
  }

  /**
   * If you wanted to navigate back from a current view, you can use the back-button or programatically call `pop()`
   * Similar to `push()`, you can pass animation options.
   *
   * ```typescript
   * class SecondView{
   *    constructor(nav:NavController){
   *      this.nav = nav;
   *    }
   *    goBack(){
   *      this.nav.pop();
   *    }
   * }
   * ```
   *
   * @param {object} [opts={}] Any options you want to use pass to transtion
   * @returns {Promise} Returns a promise when the transition is completed
   */
  pop(opts?: NavOptions): Promise<any> {
    // get the index of the active view
    // which will become the view to be leaving
    let activeView = this.getByState(STATE_TRANS_ENTER) ||
                     this.getByState(STATE_INIT_ENTER) ||
                     this.getActive();

    if (isBlank(opts)) {
      opts = {};
    }

    // if not set, by default climb up the nav controllers if
    // there isn't a previous view in this nav controller
    if (isBlank(opts.climbNav)) {
      opts.climbNav = true;
    }
    return this.remove(this.indexOf(activeView), 1, opts);
  }

  /**
   * Similar to `pop()`, this method let's you navigate back to the root of the stack, no matter how many views that is
   * @param {object} [opts={}] Any options you want to use pass to transtion
   */
  popToRoot(opts?: NavOptions): Promise<any> {
    return this.popTo(this.first(), opts);
  }

  /**
   * Pop to a specific view in the history stack
   * @param {ViewController} view  to pop to
   * @param {object} [opts={}]  Any options you want to use pass to transtion
   */
  popTo(view: ViewController, opts?: NavOptions): Promise<any> {
    let startIndex = this.indexOf(view);
    let activeView = this.getByState(STATE_TRANS_ENTER) ||
                     this.getByState(STATE_INIT_ENTER) ||
                     this.getActive();
    let removeCount = this.indexOf(activeView) - startIndex;

    return this.remove(startIndex + 1, removeCount, opts);
  }

  /**
   * Removes a view from the nav stack at the specified index.
   *
   * ```typescript
   * export class Detail {
   *    constructor(nav: NavController) {
   *      this.nav = nav;
   *    }
   *    removeView(){
   *      this.nav.remove(1);
   *    }
   *  }
   * ```
   *
   * @param {number} [startIndex]  The starting index to remove pages from the stack. Default is the index of the last page.
   * @param {number} [removeCount]  The number of pages to remove, defaults to remove `1`.
   * @param {object} [opts={}] Any options you want to use pass to transtion.
   * @returns {Promise} Returns a promise when the page has been removed.
   */
  remove(startIndex: number = -1, removeCount: number = 1, opts?: NavOptions): Promise<any> {
    if (startIndex === -1) {
      startIndex = this._views.length - 1;

    } else if (startIndex < 0 || startIndex >= this._views.length) {
      return Promise.reject('remove index out of range');
    }

    if (isBlank(opts)) {
      opts = {};
    }

    // default the direction to "back"
    opts.direction = opts.direction || 'back';

    // figure out the states of each view in the stack
    let leavingView = this._remove(startIndex, removeCount);

    if (!leavingView) {
      let forcedActive = this.getByState(STATE_FORCE_ACTIVE);
      if (forcedActive) {
        // this scenario happens when a remove is going on
        // during a transition
        if (this._trans) {
          this._trans.stop();
          this._trans.destroy();
          this._trans = null;
          this._cleanup();
        }

        return Promise.resolve(false);
      }
    }

    if (leavingView) {
      // there is a view ready to leave, meaning that a transition needs
      // to happen and the previously active view is going to animate out

      // get the view thats ready to enter
      let enteringView = this.getByState(STATE_INIT_ENTER);

      if (!enteringView && !this.isPortal) {
        // oh nos! no entering view to go to!
        // if there is no previous view that would enter in this nav stack
        // and the option is set to climb up the nav parent looking
        // for the next nav we could transition to instead
        if (opts.climbNav) {
          let parentNav: NavController = this.parent;
          while (parentNav) {
            if (!parentNav['_tabs']) {
              // Tabs can be a parent, but it is not a collection of views
              // only we're looking for an actual NavController w/ stack of views
              leavingView.willLeave();

              return parentNav.pop(opts).then((rtnVal: boolean) => {
                leavingView.didLeave();
                return rtnVal;
              });
            }
            parentNav = parentNav.parent;
          }
        }

        // there's no previous view and there's no valid parent nav
        // to climb to so this shouldn't actually remove the leaving
        // view because there's nothing that would enter, eww
        leavingView.state = STATE_ACTIVE;
        return Promise.resolve(false);
      }

      let resolve;
      let promise = new Promise(res => { resolve = res; });

      if (!opts.animation) {
        opts.animation = leavingView.getTransitionName(opts.direction);
      }

      // start the transition, fire resolve when done...
      this._transition(enteringView, leavingView, opts, (hasCompleted: boolean) => {
        // transition has completed!!
        resolve(hasCompleted);
      });

      return promise;
    }

    // no need to transition when the active view isn't being removed
    // there's still an active view after _remove() figured out states
    // so this means views that were only removed before the active
    // view, so auto-resolve since no transition needs to happen
    return Promise.resolve(false);
  }

  /**
   * @private
   */
  private _remove(startIndex: number, removeCount: number): ViewController {
    // when this is done, there should only be at most
    // 1 STATE_INIT_ENTER and 1 STATE_INIT_LEAVE
    // there should not be any that are STATE_ACTIVE after this is done
    let view: ViewController = null;

    // loop through each view that is set to be removed
    for (var i = startIndex, ii = removeCount + startIndex; i < ii; i++) {
      view = this.getByIndex(i);
      if (!view) break;

      if (view.state === STATE_TRANS_ENTER || view.state === STATE_TRANS_LEAVE) {
        // oh no!!! this view should be removed, but it's
        // actively transitioning in at the moment!!
        // since it's viewable right now, let's just set that
        // it should be removed after the transition
        view.state = STATE_REMOVE_AFTER_TRANS;

      } else {
        // if this view is already leaving then no need to immediately
        // remove it, otherwise set the remove state
        // this is useful if the view being removed isn't going to
        // animate out, but just removed from the stack, no transition
        view.state = STATE_REMOVE;
      }
    }

    if (view = this.getByState(STATE_INIT_LEAVE)) {
      // looks like there's already an active leaving view

      // reassign previous entering view to just be inactive
      let enteringView = this.getByState(STATE_INIT_ENTER);
      if (enteringView) {
        enteringView.state = STATE_INACTIVE;
      }

      // from the index of the leaving view, go backwards and
      // find the first view that is inactive
      for (var i = this.indexOf(view) - 1; i >= 0; i--) {
        if (this._views[i].state === STATE_INACTIVE) {
          this._views[i].state = STATE_INIT_ENTER;
          break;
        }
      }

    } else if (view = this.getByState(STATE_TRANS_LEAVE)) {
      // an active transition is happening, but a new transition
      // still needs to happen force this view to be the active one
      view.state = STATE_FORCE_ACTIVE;

    } else if (view = this.getByState(STATE_REMOVE)) {
      // there is no active transition about to happen
      // find the first view that is supposed to be removed and
      // set that it is the init leaving view
      // the first view to be removed, it should init leave
      view.state = STATE_INIT_LEAVE;
      view.willUnload();

      // from the index of the leaving view, go backwards and
      // find the first view that is inactive so it can be the entering
      for (var i = this.indexOf(view) - 1; i >= 0; i--) {
        if (this._views[i].state === STATE_INACTIVE) {
          this._views[i].state = STATE_INIT_ENTER;
          break;
        }
      }
    }

    // if there is still an active view, then it wasn't one that was
    // set to be removed, so there actually won't be a transition at all
    view = this.getActive();
    if (view) {
      // the active view remains untouched, so all the removes
      // must have happened before it, so really no need for transition
      view = this.getByState(STATE_INIT_ENTER);
      if (view) {
        // if it was going to enter, then just make inactive
        view.state = STATE_INACTIVE;
      }
      view = this.getByState(STATE_INIT_LEAVE);
      if (view) {
        // this was going to leave, so just remove it completely
        view.state = STATE_REMOVE;
      }
    }

    // remove views that have been set to be removed, but not
    // apart of any transitions that will eventually happen
    this._views.filter(v => v.state === STATE_REMOVE).forEach(view => {
      view.willLeave();
      view.didLeave();
      this._views.splice(this.indexOf(view), 1);
      view.destroy();
    });

    return this.getByState(STATE_INIT_LEAVE);
  }

  /**
   * @private
   */
  private _transition(enteringView: ViewController, leavingView: ViewController, opts: NavOptions, done: Function) {
    let transId = ++this._transIds;

    if (enteringView === leavingView) {
      // if the entering view and leaving view are the same thing don't continue
      this._transFinish(transId, enteringView, leavingView, null, false);
      return done(false);
    }

    // lets time this sucker, ready go
    let wtfScope = wtfStartTimeRange('NavController#_transition', (enteringView && enteringView.name));

    if (isBlank(opts)) {
      opts = {};
    }

    this._setAnimate(opts);

    if (!leavingView) {
      // if no leaving view then create a bogus one
      leavingView = new ViewController();
    }

    if (!enteringView) {
      // if no entering view then create a bogus one
      enteringView = new ViewController();
      enteringView.loaded();
    }

    /* Async steps to complete a transition
      1. _render: compile the view and render it in the DOM. Load page if it hasn't loaded already. When done call postRender
      2. _postRender: Run willEnter/willLeave, then wait a frame (change detection happens), then call beginTransition
      3. _beforeTrans: Create the transition's animation, play the animation, wait for it to end
      4. _afterTrans: Run didEnter/didLeave, call _transComplete()
      5. _transComplete: Cleanup, remove cache views, then call the final callback
    */

    // begin the multiple async process of transitioning to the entering view
    this._render(transId, enteringView, leavingView, opts, (hasCompleted: boolean) => {
      this._transFinish(transId, enteringView, leavingView, opts.direction, hasCompleted);
      wtfEndTimeRange(wtfScope);
      done(hasCompleted);
    });
  }

  private _setAnimate(opts: NavOptions) {
    if ((this._views.length === 1 && !this._init && !this.isPortal) || this.config.get('animate') === false) {
      opts.animate = false;
    }
  }

  /**
   * @private
   */
  private _render(transId, enteringView: ViewController, leavingView: ViewController, opts: NavOptions, done: Function) {
    // compile/load the view into the DOM

    if (enteringView.state === STATE_INACTIVE) {
      // this entering view is already set to inactive, so this
      // transition must be canceled, so don't continue
      return done();
    }

    enteringView.state = STATE_INIT_ENTER;
    leavingView.state = STATE_INIT_LEAVE;

    // remember if this nav is already transitioning or not
    let isAlreadyTransitioning = this.isTransitioning();

    if (enteringView.isLoaded()) {
      // already compiled this view, do not load again and continue
      this._postRender(transId, enteringView, leavingView, isAlreadyTransitioning, opts, done);

    } else {
      // view has not been compiled/loaded yet
      // continue once the view has finished compiling
      // DOM WRITE
      this.setTransitioning(true, 500);

      this.loadPage(enteringView, null, opts, () => {
        if (enteringView.onReady) {
          // this entering view needs to wait for it to be ready
          // this is used by Tabs to wait for the first page of
          // the first selected tab to be loaded
          enteringView.onReady(() => {
            enteringView.loaded();
            this._postRender(transId, enteringView, leavingView, isAlreadyTransitioning, opts, done);
          });

        } else {
          enteringView.loaded();
          this._postRender(transId, enteringView, leavingView, isAlreadyTransitioning, opts, done);
        }
      });
    }
  }

  /**
   * @private
   */
  private _postRender(transId, enteringView: ViewController, leavingView: ViewController, isAlreadyTransitioning: boolean, opts: NavOptions, done: Function) {
    // called after _render has completed and the view is compiled/loaded

    if (enteringView.state === STATE_INACTIVE) {
      // this entering view is already set to inactive, so this
      // transition must be canceled, so don't continue
      return done();
    }

    if (!opts.preload) {
      // the enteringView will become the active view, and is not being preloaded

      // set the correct zIndex for the entering and leaving views
      // if there's already another trans_enter happening then
      // the zIndex for the entering view should go off of that one
      // DOM WRITE
      let lastestLeavingView = this.getByState(STATE_TRANS_ENTER) || leavingView;
      this._setZIndex(enteringView, lastestLeavingView, opts.direction);

      // make sure the entering and leaving views are showing
      // DOM WRITE
      if (isAlreadyTransitioning) {
        // the previous transition was still going when this one started
        // so to be safe, only update showing the entering/leaving
        // don't hide the others when they could still be transitioning
        enteringView.domShow(true, this._renderer);
        leavingView.domShow(true, this._renderer);

      } else {
        // there are no other transitions happening but this one
        // only entering/leaving should show, all others hidden
        // also if a view is an overlay or the previous view is an
        // overlay then always show the overlay and the view before it
        var view: ViewController;
        var shouldShow: boolean;

        for (var i = 0, ii = this._views.length; i < ii; i++) {
          view = this._views[i];
          shouldShow = (view === enteringView) ||
                       (view === leavingView) ||
                       view.isOverlay ||
                       (i < ii - 1 ? this._views[i + 1].isOverlay : false);
          view.domShow(shouldShow, this._renderer);
        }
      }

      // call each view's lifecycle events
      if (leavingView.fireOtherLifecycles) {
        // only fire entering lifecycle if the leaving
        // view hasn't explicitly set not to
        enteringView.willEnter();
      }

      if (enteringView.fireOtherLifecycles) {
        // only fire leaving lifecycle if the entering
        // view hasn't explicitly set not to
        leavingView.willLeave();
      }

    } else {
      // this view is being preloaded, don't call lifecycle events
      // transition does not need to animate
      opts.animate = false;
    }

    this._beforeTrans(enteringView, leavingView, opts, done);
  }

  /**
   * @private
   */
  private _beforeTrans(enteringView: ViewController, leavingView: ViewController, opts: NavOptions, done: Function) {
    // called after one raf from postRender()
    // create the transitions animation, play the animation
    // when the transition ends call wait for it to end

    if (enteringView.state === STATE_INACTIVE) {
      // this entering view is already set to inactive, so this
      // transition must be canceled, so don't continue
      return done();
    }

    enteringView.state = STATE_TRANS_ENTER;
    leavingView.state = STATE_TRANS_LEAVE;

    // everything during the transition should runOutsideAngular
    this._zone.runOutsideAngular(() => {

      // init the transition animation
      let transitionOpts = {
        animation: opts.animation,
        direction: opts.direction,
        duration: opts.duration,
        easing: opts.easing,
        renderDelay: opts.transitionDelay || this._trnsDelay,
        isRTL: this.config.platform.isRTL()
      };

      let transAnimation = Transition.createTransition(enteringView,
                                                       leavingView,
                                                       transitionOpts);

      this._trans && this._trans.destroy();
      this._trans = transAnimation;

      if (opts.animate === false) {
        // force it to not animate the elements, just apply the "to" styles
        transAnimation.duration(0);
      }

      let duration = transAnimation.getDuration();
      let enableApp = (duration < 64);
      // block any clicks during the transition and provide a
      // fallback to remove the clickblock if something goes wrong
      this._app.setEnabled(enableApp, duration);
      this.setTransitioning(!enableApp, duration);

      if (enteringView.viewType) {
        transAnimation.before.addClass(enteringView.viewType);
      }

      // create a callback for when the animation is done
      transAnimation.onFinish((trans: Transition) => {
        // transition animation has ended

        // destroy the animation and it's element references
        trans.destroy();

        this._afterTrans(enteringView, leavingView, opts, trans.hasCompleted, done);
      });

      // cool, let's do this, start the transition
      if (opts.progressAnimation) {
        // this is a swipe to go back, just get the transition progress ready
        // kick off the swipe animation start
        transAnimation.progressStart();

      } else {

        // this is a normal animation
        // kick it off and let it play through
        transAnimation.play();
      }
    });
  }

  /**
   * @private
   */
  private _afterTrans(enteringView: ViewController, leavingView: ViewController, opts: NavOptions, hasCompleted: boolean, done: Function) {
    // transition has completed, update each view's state
    // place back into the zone, run didEnter/didLeave
    // call the final callback when done

    // run inside of the zone again
    this._zone.run(() => {

      if (!opts.preload && hasCompleted) {
        if (leavingView.fireOtherLifecycles) {
          // only fire entering lifecycle if the leaving
          // view hasn't explicitly set not to
          enteringView.didEnter();
        }

        if (enteringView.fireOtherLifecycles) {
          // only fire leaving lifecycle if the entering
          // view hasn't explicitly set not to
          leavingView.didLeave();
        }
      }

      if (enteringView.state === STATE_INACTIVE) {
        // this entering view is already set to inactive, so this
        // transition must be canceled, so don't continue
        return done(hasCompleted);
      }

      if (opts.keyboardClose !== false && this._keyboard.isOpen()) {
        // the keyboard is still open!
        // no problem, let's just close for them
        this._keyboard.close();
        this._keyboard.onClose(() => {

          // keyboard has finished closing, transition complete
          done(hasCompleted);
        }, 32);

      } else {
        // all good, transition complete
        done(hasCompleted);
      }
    });
  }

  /**
   * @private
   */
  private _transFinish(transId: number, enteringView: ViewController, leavingView: ViewController, direction: string, hasCompleted: boolean) {
    // a transition has completed, but not sure if it's the last one or not
    // check if this transition is the most recent one or not

    if (transId === this._transIds) {
      // ok, good news, there were no other transitions that kicked
      // off during the time this transition started and ended

      if (hasCompleted) {
        // this transition has completed as normal
        // so the entering one is now the active view
        // and the leaving view is now just inactive
        if (enteringView.state !== STATE_REMOVE_AFTER_TRANS) {
          enteringView.state = STATE_ACTIVE;
        }
        if (leavingView.state !== STATE_REMOVE_AFTER_TRANS) {
          leavingView.state = STATE_INACTIVE;
        }

        // only need to do all this clean up if the transition
        // completed, otherwise nothing actually changed
        // destroy all of the views that come after the active view
        this._cleanup();

        // make sure only this entering view and PREVIOUS view are the
        // only two views that are not display:none
        // do not make any changes to the stack's current visibility
        // if there is an overlay somewhere in the stack
        leavingView = this.getPrevious(enteringView);
        if (this.hasOverlay()) {
          // ensure the entering view is showing
          enteringView.domShow(true, this._renderer);

        } else {
          // only possibly hide a view if there are no overlays in the stack
          this._views.forEach(view => {
            let shouldShow = (view === enteringView) || (view === leavingView);
            view.domShow(shouldShow, this._renderer);
          });
        }

        // this check only needs to happen once, which will add the css
        // class to the nav when it's finished its first transition
        if (!this._init) {
          this._init = true;
          this._renderer.setElementClass(this.elementRef.nativeElement, 'has-views', true);
        }

      } else {
        // this transition has not completed, meaning the
        // entering view did not end up as the active view
        // this would happen when swipe to go back started
        // but the user did not complete the swipe and the
        // what was the active view stayed as the active view
        leavingView.state = STATE_ACTIVE;
        enteringView.state = STATE_INACTIVE;
      }

      // allow clicks and enable the app again
      this._app && this._app.setEnabled(true);
      this.setTransitioning(false);

      if (direction !== null && hasCompleted && !this.isPortal) {
        // notify router of the state change if a direction was provided
        // multiple routers can exist and each should be notified
        this.routers.forEach(router => {
          router.stateChange(direction, enteringView);
        });
      }

      // see if we should add the swipe back gesture listeners or not
      this._sbCheck();

      if (this._portal) {
        this._portal._views.forEach(view => {
          if (view.data && view.data.dismissOnPageChange) {
            view.dismiss();
          }
        });
      }

    } else {
      // darn, so this wasn't the most recent transition
      // so while this one did end, there's another more recent one
      // still going on. Because a new transition is happening,
      // then this entering view isn't actually going to be the active
      // one, so only update the state to active/inactive if the state
      // wasn't already updated somewhere else during its transition
      if (enteringView.state === STATE_TRANS_ENTER) {
        enteringView.state = STATE_INACTIVE;
      }
      if (leavingView.state === STATE_TRANS_LEAVE) {
        leavingView.state = STATE_INACTIVE;
      }
    }
  }

  private _cleanup() {
    // ok, cleanup time!! Destroy all of the views that are
    // INACTIVE and come after the active view
    let activeViewIndex = this.indexOf(this.getActive());
    let destroys = this._views.filter(v => v.state === STATE_REMOVE_AFTER_TRANS);

    for (var i = activeViewIndex + 1; i < this._views.length; i++) {
      if (this._views[i].state === STATE_INACTIVE) {
        destroys.push(this._views[i]);
      }
    }

    // all pages being destroyed should be removed from the list of
    // pages and completely removed from the dom
    destroys.forEach(view => {
      this._views.splice(this.indexOf(view), 1);
      view.destroy();
    });

    // if any z-index goes under 0, then reset them all
    let shouldResetZIndex = this._views.some(v => v.zIndex < 0);
    if (shouldResetZIndex) {
      this._views.forEach(view => {
        view.setZIndex(view.zIndex + INIT_ZINDEX + 1, this._renderer);
      });
    }
  }

  getActiveChildNav(): any {
    return this._children[this._children.length - 1];
  }

  registerChildNav(nav: any) {
    this._children.push(nav);
  }

  unregisterChildNav(nav: any) {
    let index = this._children.indexOf(nav);
    if (index > -1) {
      this._children.splice(index, 1);
    }
  }

  /**
   * @private
   */
  ngOnDestroy() {
    for (var i = this._views.length - 1; i >= 0; i--) {
      this._views[i].destroy();
    }
    this._views.length = 0;

    if (this.parent) {
      this.parent.unregisterChildNav(this);
    }
  }

  /**
   * @private
   */
  loadPage(view: ViewController, navbarContainerRef, opts: NavOptions, done: Function) {
    let wtfTimeRangeScope = wtfStartTimeRange('NavController#loadPage', view.name);

    // guts of DynamicComponentLoader#loadIntoLocation
    this._compiler && this._compiler.compileInHost(view.componentType).then(hostProtoViewRef => {
      let wtfScope = wtfCreateScope('NavController#loadPage_After_Compile')();

      let providers = this.providers.concat(Injector.resolve([
        provide(ViewController, {useValue: view}),
        provide(NavParams, {useValue: view.getNavParams()})
      ]));

      let location = this.elementRef;
      if (this._anchorName) {
        location = this._viewManager.getNamedElementInComponentView(location, this._anchorName);
      }

      let viewContainer = this._viewManager.getViewContainer(location);
      let hostViewRef: any =
          viewContainer.createHostView(hostProtoViewRef, viewContainer.length, providers);
      let pageElementRef = this._viewManager.getHostElement(hostViewRef);
      let component = this._viewManager.getComponent(pageElementRef);

      // auto-add page css className created from component JS class name
      let cssClassName = pascalCaseToDashCase(view.componentType['name']);
      this._renderer.setElementClass(pageElementRef.nativeElement, cssClassName, true);

      view.addDestroy(() => {
        // ensure the element is cleaned up for when the view pool reuses this element
        this._renderer.setElementAttribute(pageElementRef.nativeElement, 'class', null);
        this._renderer.setElementAttribute(pageElementRef.nativeElement, 'style', null);

        // remove the page from its container
        let index = viewContainer.indexOf(hostViewRef);
        if (!hostViewRef.destroyed && index !== -1) {
          viewContainer.remove(index);
        }

        view.setInstance(null);
      });

      // a new ComponentRef has been created
      // set the ComponentRef's instance to this ViewController
      view.setInstance(component);

      // remember the ElementRef to the ion-page elementRef that was just created
      view.setPageRef(pageElementRef);

      if (!navbarContainerRef) {
        navbarContainerRef = view.getNavbarViewRef();
      }

      let navbarTemplateRef = view.getNavbarTemplateRef();
      if (navbarContainerRef && navbarTemplateRef) {
        let navbarViewRef = navbarContainerRef.createEmbeddedView(navbarTemplateRef);

        view.addDestroy(() => {
          let index = navbarContainerRef.indexOf(navbarViewRef);
          if (!navbarViewRef.destroyed && index > -1) {
            navbarContainerRef.remove(index);
          }
        });
      }

      opts.postLoad && opts.postLoad(view);

      wtfEndTimeRange(wtfTimeRangeScope);
      wtfLeave(wtfScope);

      done(view);
    });
  }

  /**
   * @private
   */
  swipeBackStart() {
    // default the direction to "back"
    let opts: NavOptions = {
      direction: 'back',
      progressAnimation: true
    };

    // figure out the states of each view in the stack
    let leavingView = this._remove(this._views.length - 1, 1);

    if (leavingView) {
      opts.animation = leavingView.getTransitionName(opts.direction);

      // get the view thats ready to enter
      let enteringView = this.getByState(STATE_INIT_ENTER);

      // start the transition, fire callback when done...
      this._transition(enteringView, leavingView, opts, (hasCompleted: boolean) => {
        // swipe back has finished!!
        console.debug('swipeBack, hasCompleted', hasCompleted);
      });
    }
  }

  /**
   * @private
   */
  swipeBackProgress(stepValue: number) {
    if (this._trans && this._sbGesture) {
      // continue to disable the app while actively dragging
      this._app.setEnabled(false, 4000);
      this.setTransitioning(true, 4000);

      // set the transition animation's progress
      this._trans.progressStep(stepValue);
    }
  }

  /**
   * @private
   */
  swipeBackEnd(shouldComplete: boolean, currentStepValue: number) {
    if (this._trans && this._sbGesture) {
      // the swipe back gesture has ended
      this._trans.progressEnd(shouldComplete, currentStepValue);
    }
  }

  /**
   * @private
   */
  private _sbCheck() {
    if (this._sbEnabled) {
      // this nav controller can have swipe to go back

      if (!this._sbGesture) {
        // create the swipe back gesture if we haven't already
        let opts = {
          edge: 'left',
          threshold: this._sbThreshold
        };
        this._sbGesture = new SwipeBackGesture(this.getNativeElement(), opts, this);
      }

      if (this.canSwipeBack()) {
        // it is be possible to swipe back
        if (!this._sbGesture.isListening) {
          this._zone.runOutsideAngular(() => {
            // start listening if it's not already
            console.debug('swipeBack gesture, listen');
            this._sbGesture.listen();
          });
        }

      } else if (this._sbGesture.isListening) {
        // it should not be possible to swipe back
        // but the gesture is still listening
        console.debug('swipeBack gesture, unlisten');
        this._sbGesture.unlisten();
      }
    }
  }

  /**
   * If it's possible to use swipe back or not. If it's not possible
   * to go back, or swipe back is not enable then this will return false.
   * If it is possible to go back, and swipe back is enabled, then this
   * will return true.
   * @returns {boolean} Whether you can swipe to go back
   */
  canSwipeBack(): boolean {
    return (this._sbEnabled && !this.isTransitioning() && this._app.isEnabled() && this.canGoBack());
  }

  /**
   * Returns `true` if there's a valid previous page that we can pop back to.
   * Otherwise returns false.
   * @returns {boolean} Whether there is a page to go back to
   */
  canGoBack(): boolean {
    let activeView = this.getActive();
    if (activeView) {
      return activeView.enableBack();
    }
    return false;
  }

  /**
   * Boolean if the nav controller is actively transitioning or not.
   * @private
   * @return {boolean}
   */
  isTransitioning(): boolean {
    return (this._trnsTime > Date.now());
  }

  /**
   * @private
   * @return {boolean}
   */
  setTransitioning(isTransitioning: boolean, fallback: number = 700) {
    this._trnsTime = (isTransitioning ? Date.now() + fallback : 0);
  }

  /**
   * @private
   * @returns {boolean}
   */
  hasOverlay(): boolean {
    for (var i = this._views.length - 1; i >= 0; i--) {
      if (this._views[i].isOverlay) {
        return true;
      }
    }
    return false;
  }

  /**
   * @private
   * @returns {ViewController}
   */
  getByState(state: string): ViewController {
    for (var i = this._views.length - 1; i >= 0; i--) {
      if (this._views[i].state === state) {
        return this._views[i];
      }
    }
    return null;
  }

  /**
   * @param {number} index  The index of the page you want to get
   * @returns {ViewController} Returns the component that matches the index given
   */
  getByIndex(index: number): ViewController {
    return (index < this._views.length && index > -1 ? this._views[index] : null);
  }

  /**
   * @returns {ViewController} Returns the active page's view controller.
   */
  getActive(): ViewController {
    return this.getByState(STATE_ACTIVE);
  }

  /**
   * @param {ViewController} view
   * @returns {boolean}
   */
  isActive(view: ViewController): boolean {
    return !!(view && view.state === STATE_ACTIVE);
  }

  /**
   * @param {ViewController} view  The ViewController to get the previous view to
   * @returns {viewController}
   */
  getPrevious(view: ViewController): ViewController {
    return this.getByIndex(this.indexOf(view) - 1);
  }

  /**
   * First page in this nav controller's stack.
   * @returns {ViewController} Returns the first component page in the current stack
   */
  first(): ViewController {
    return (this._views.length ? this._views[0] : null);
  }

  /**
   * Last page in this nav controller's stack. This would not return a page which is about to be destroyed.
   * @returns {ViewController} Returns the last component page in the current stack
   */
  last(): ViewController {
    return (this._views.length ? this._views[this._views.length - 1] : null);
  }

  /**
   * @param {ViewController} view
   * @returns {number} Returns the index number of the view
   */
  indexOf(view: ViewController): number {
    return this._views.indexOf(view);
  }

  /**
   * Number of sibling views in the nav controller.
   * @returns {number} The number of views in stack, including the current view
   */
  length(): number {
    return this._views.length;
  }

  /**
   * Returns the root NavController.
   * @returns {NavController}
   */
  get rootNav(): NavController {
    let nav = this;
    while (nav.parent) {
      nav = nav.parent;
    }
    return nav;
  }

  /**
   * @private
   */
  registerRouter(router: any) {
    this.routers.push(router);
  }

  /**
   * @private
   */
  private _incId(view: ViewController) {
    view.id = this.id + '-' + (++this._ids);
  }

  /**
   * @private
   */
  private _setZIndex(enteringView: ViewController, leavingView: ViewController, direction) {
    if (enteringView) {
      // get the leaving view, which could be in various states
      if (!leavingView || !leavingView.isLoaded()) {
        // the leavingView is a mocked view, either we're
        // actively transitioning or it's the initial load

        var previousView = this.getPrevious(enteringView);
        if (previousView && previousView.isLoaded()) {
          // we found a better previous view to reference
          // use this one instead
          enteringView.setZIndex(previousView.zIndex + 1, this._renderer);

        } else {
          // this is the initial view
          enteringView.setZIndex(this.isPortal ? PORTAL_ZINDEX : INIT_ZINDEX, this._renderer);
        }

      } else if (direction === 'back') {
        // moving back
        enteringView.setZIndex(leavingView.zIndex - 1, this._renderer);

      } else {
        // moving forward
        enteringView.setZIndex(leavingView.zIndex + 1, this._renderer);
      }
    }
  }

}

export interface NavOptions {
  animate?: boolean;
  animation?: string;
  direction?: string;
  duration?: number;
  easing?: string;
  keyboardClose?: boolean;
  preload?: boolean;
  transitionDelay?: number;
  postLoad?: Function;
  progressAnimation?: boolean;
  climbNav?: boolean;
}

const STATE_ACTIVE = 'active';
const STATE_INACTIVE = 'inactive';
const STATE_INIT_ENTER = 'init_enter';
const STATE_INIT_LEAVE = 'init_leave';
const STATE_TRANS_ENTER = 'trans_enter';
const STATE_TRANS_LEAVE = 'trans_leave';
const STATE_REMOVE = 'remove';
const STATE_REMOVE_AFTER_TRANS = 'remove_after_trans';
const STATE_FORCE_ACTIVE = 'force_active';
const INIT_ZINDEX = 100;
const PORTAL_ZINDEX = 9999;

let ctrlIds = -1;
