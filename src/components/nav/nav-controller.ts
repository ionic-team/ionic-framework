import { ComponentResolver, ElementRef, EventEmitter, NgZone, provide, ReflectiveInjector, Renderer, ViewContainerRef } from '@angular/core';

import { addSelector } from '../../config/bootstrap';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { Ion } from '../ion';
import { isBlank, pascalCaseToDashCase } from '../../util/util';
import { Keyboard } from '../../util/keyboard';
import { MenuController } from '../menu/menu-controller';
import { NavParams } from './nav-params';
import { NavOptions } from './nav-options';
import { SwipeBackGesture } from './swipe-back';
import { Transition } from '../../transitions/transition';
import { ViewController } from './view-controller';


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
 * ### Injecting NavController
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
 *    constructor(private nav: NavController) {
 *
 *    }
 *  }
 * ```
 *
 *
 * ## Page creation
 * Pages are created when they are added to the navigation stack.  For methods
 * like [push()](#push), the NavController takes any component class that is
 * decorated with `@Component` as its first argument.  The NavController then
 * compiles that component, adds it to the app and animates it into view.
 *
 * By default, pages are cached and left in the DOM if they are navigated away
 * from but still in the navigation stack (the exiting page on a `push()` for
 * example).  They are destroyed when removed from the navigation stack (on
 * [pop()](#pop) or [setRoot()](#setRoot)).
 *
 *
 * ## Lifecycle events
 * Lifecycle events are fired during various stages of navigation.  They can be
 * defined in any component type which is pushed/popped from a `NavController`.
 *
 * ```ts
 * import {Component } from '@angular/core';
 *
 * @Component({
 *   template: 'Hello World'
 * })
 * class HelloWorld {
 *   ionViewLoaded() {
 *     console.log("I'm alive!");
 *   }
 *   ionViewWillLeave() {
 *     console.log("Looks like I'm about to leave :(");
 *   }
 * }
 * ```
 *
 *  | Page Event         | Description                                                                                                                                                                                                                                                                       |
 *  |--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 *  | `ionViewLoaded`     | Runs when the page has loaded. This event only happens once per page being created and added to the DOM. If a page leaves but is cached, then this event will not fire again on a subsequent viewing. The `ionViewLoaded` event is good place to put your setup code for the page. |
 *  | `ionViewWillEnter`  | Runs when the page is about to enter and become the active page.                                                                                                                                                                                                                  |
 *  | `ionViewDidEnter`   | Runs when the page has fully entered and is now the active page. This event will fire, whether it was the first load or a cached page.                                                                                                                                            |
 *  | `ionViewWillLeave`  | Runs when the page is about to leave and no longer be the active page.                                                                                                                                                                                                            |
 *  | `ionViewDidLeave`   | Runs when the page has finished leaving and is no longer the active page.                                                                                                                                                                                                         |
 *  | `ionViewWillUnload` | Runs when the page is about to be destroyed and have its elements removed.                                                                                                                                                                                                        |
 *  | `ionViewDidUnload`  | Runs after the page has been destroyed and its elements have been removed.
 *
 *
 * ## Nav Transition Promises
 *
 * Navigation transitions are asynchronous, meaning they take a few moments to finish, and
 * the duration of a transition could be any number. In most cases the async nature of a
 * transition doesn't cause any problems and the nav controller is pretty good about handling
 * which transition was the most recent when multiple transitions have been kicked off.
 * However, when an app begins firing off many transitions, on the same stack at
 * *roughly* the same time, the nav controller can start to get lost as to which transition
 * should be finishing, and which transitions should not be animated.
 *
 * In cases where an app's navigation can be altered by other async tasks, which may or
 * may not take a long time, it's best to rely on each nav transition's returned
 * promise. So instead of firing and forgetting multiple `push` or `pop` nav transitions,
 * it's better to fire the next nav transition when the previous one has finished.
 *
 * In the example below, after the async operation has completed, we then want to transition
 * to another page. Where the potential problem comes in, is that if the async operation
 * completed 100ms after the first transition started, then kicking off another transition
 * halfway through the first transition ends up with a janky animation. Instead, it's best
 * to always ensure the first transition has already finished before starting the next.
 *
 * ```ts
 * // begin the first transition
 * let navTransition = this.nav.push(SomePage);
 *
 * // start an async call, we're not sure how long it'll take
 * someAsyncOperation().then(() => {
 *   // incase the async operation completed faster than the time
 *   // it took to finish the first transition, this logic should
 *   // always ensure that the previous transition has resolved
 *   // first before kicking off the next transition
 *   navTransition.then(() => {
 *     this.nav.push(AnotherPage);
 *   });
 * });
 * ```
 *
 * ## NavOptions
 *
 * Some methods on `NavController` allow for customizing the current transition.
 * To do this, we can pass an object with the modified properites.
 *
 * | Property  | Value     | Description                                                                                                |
 * |-----------|-----------|------------------------------------------------------------------------------------------------------------|
 * | animate   | `boolean` | Whether or not the transition should animate.                                                              |
 * | animation | `string`  | What kind of animation should be used.                                                                     |
 * | direction | `string`  | The conceptual direction the user is navigating. For example, is the user navigating `forward`, or `back`? |
 * | duration  | `number`  | The length in milliseconds the animation should take.                                                      |
 * | easing    | `string`  | The easing for the animation.                                                                              |
 *
 * The property 'animation' understands the following values: `md-transition`, `ios-transition` and `wp-transition`.
 *
 * @see {@link /docs/v2/components#navigation Navigation Component Docs}
 */
export class NavController extends Ion {
  private _transIds = 0;
  private _init = false;
  private _trans: Transition;
  private _sbGesture: SwipeBackGesture;
  private _sbThreshold: number;
  private _viewport: ViewContainerRef;
  private _children: any[] = [];

  protected _sbEnabled: boolean;
  protected _ids: number = -1;
  protected _trnsDelay: any;
  protected _views: ViewController[] = [];

  viewDidLoad: EventEmitter<any>;
  viewWillEnter: EventEmitter<any>;
  viewDidEnter: EventEmitter<any>;
  viewWillLeave: EventEmitter<any>;
  viewDidLeave: EventEmitter<any>;
  viewWillUnload: EventEmitter<any>;
  viewDidUnload: EventEmitter<any>;

  /**
   * @private
   */
  id: string;

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

  /**
   * @private
   */
  _trnsTime: number = 0;

  constructor(
    parent: any,
    protected _app: App,
    config: Config,
    protected _keyboard: Keyboard,
    elementRef: ElementRef,
    protected _zone: NgZone,
    protected _renderer: Renderer,
    protected _compiler: ComponentResolver
  ) {
    super(elementRef);

    this.parent = parent;
    this.config = config;

    this._trnsDelay = config.get('pageTransitionDelay');

    this._sbEnabled = config.getBoolean('swipeBackEnabled');
    this._sbThreshold = config.getNumber('swipeBackThreshold', 40);

    this.id = (++ctrlIds).toString();

    this.viewDidLoad = new EventEmitter();
    this.viewWillEnter = new EventEmitter();
    this.viewDidEnter = new EventEmitter();
    this.viewWillLeave = new EventEmitter();
    this.viewDidLeave = new EventEmitter();
    this.viewWillUnload = new EventEmitter();
    this.viewDidUnload = new EventEmitter();
  }

  /**
   * @private
   */
  setViewport(val: ViewContainerRef) {
    this._viewport = val;
  }

  /**
   * Set the root for the current navigation stack.
   * @param {Page} page  The name of the component you want to push on the navigation stack.
   * @param {object} [params={}] Any nav-params you want to pass along to the next view.
   * @param {object} [opts={}] Any options you want to use pass to transtion.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  setRoot(page: any, params?: any, opts?: NavOptions): Promise<any> {
    return this.setPages([{page, params}], opts);
  }

  /**
   * You can set the views of the current navigation stack and navigate to the
   * last view.
   *
   *
   *```ts
   * import {NavController } from 'ionic-angular'
   * import {Detail } from '../detail/detail'
   * import {Info } from '../info/info'
   *
   *  export class Home {
   *    constructor(private nav: NavController) {
   *
   *    }
   *    setPages() {
   *      this.nav.setPages([ {page: List}, {page: Detail}, {page:Info} ]);
   *    }
   *  }
   *```
   *
   *
   * In this example, we're giving the current nav stack an array of pages.
   * Then the navigation stack will navigate to the last page in the array
   * and remove the previously active page.
   *
   * By default animations are disabled, but they can be enabled by passing
   * options to the navigation controller.
   *
   *
   * ```ts
   * import {NavController } from 'ionic-angular'
   * import {Detail } from '../detail/detail'
   *
   *  export class Home {
   *    constructor(private nav: NavController) {
   *
   *    }
   *    setPages() {
   *      this.nav.setPages([ {page: List}, {page: Detail} ], {
   *        animate: true
   *      });
   *    }
   *  }
   * ```
   *
   * You can also pass any navigation params to the individual pages in
   * the array.
   *
   *
   * ```ts
   * import {NavController } from 'ionic-angular';
   * import {Info } from '../info/info';
   * import {List } from '../list/list';
   * import {Detail } from '../detail/detail';
   *
   *  export class Home {
   *    constructor(private nav: NavController) {
   *
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
   * @param {array<Page>} pages  An arry of page components and their params to load in the stack.
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  setPages(pages: Array<{page: any, params?: any}>, opts?: NavOptions): Promise<any> {
    if (!pages || !pages.length) {
      return Promise.resolve(false);
    }

    if (isBlank(opts)) {
      opts = {};
    }

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

    let resolve: any;
    let promise = new Promise(res => { resolve = res; });

    // start the transition, fire resolve when done...
    this._transition(enteringView, leavingView, opts, (hasCompleted: boolean) => {
      // transition has completed!!
      resolve(hasCompleted);
    });

    return promise;
  }

  /**
   * Push is how we can pass components and navigate to them. We push the component
   * we want to navigate to on to the navigation stack.
   *
   * ```ts
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
   * We can also pass along parameters to the next view, such as data that we have
   * on the current view. This is a similar concept to to V1 apps with `$stateParams`.
   *
   * ```ts
   * class MyClass{
   *    constructor(nav:NavController){
   *      this.nav = nav;
   *    }
   *
   *    pushPage(user){
   *       // user is an object we have in our view
   *       // typically this comes from an ngFor or some array
   *       // here we can create an object with a property of
   *       // paramUser, and set its value to the user object we passed in
   *      this.nav.push(SecondView, { paramUser: user });
   *    }
   * }
   * ```
   *
   * We'll look at how we can access that data in the `SecondView` in the
   * navParam docs.
   *
   * We can also pass any options to the transtion from that same method.
   *
   * ```ts
   * class MyClass{
   *    constructor(private nav: NavController){
   *
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
   * @param {Page} page  The page component class you want to push on to the navigation stack
   * @param {object} [params={}] Any nav-params you want to pass along to the next view
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  push(page: any, params?: any, opts?: NavOptions) {
    return this.insertPages(-1, [{page: page, params: params}], opts);
  }

  /**
   * @private
   * DEPRECATED: Please use inject the overlays controller and use the present method on the instance instead.
   */
  private present(enteringView: ViewController, opts?: NavOptions): Promise<any> {
    // deprecated warning: added beta.11 2016-06-27
    console.warn('nav.present() has been deprecated.\n' +
                 'Please inject the overlay\'s controller and use the present method on the instance instead.');
    return Promise.resolve();
  }

  /**
   * Inserts a view into the nav stack at the specified index. This is useful if
   * you need to add a view at any point in your navigation stack.
   *
   * ```ts
   * export class Detail {
   *    constructor(private nav: NavController) {
   *
   *    }
   *    insertPage(){
   *      this.nav.insert(1, Info);
   *    }
   *  }
   * ```
   *
   * This will insert the `Info` page into the second slot of our navigation stack.
   *
   * @param {number} insertIndex  The index where to insert the page.
   * @param {Page} page  The component you want to insert into the nav stack.
   * @param {object} [params={}] Any nav-params you want to pass along to the next page.
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  insert(insertIndex: number, page: any, params?: any, opts?: NavOptions): Promise<any> {
    return this.insertPages(insertIndex, [{page: page, params: params}], opts);
  }

  /**
   * Inserts multiple pages into the nav stack at the specified index.
   *
   * ```ts
   * export class Detail {
   *    constructor(private nav: NavController) {
   *
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
   * @param {number} insertIndex  The index where you want to insert the page.
   * @param {array<{page: Page, params=: any}>} insertPages  An array of objects, each with a `page` and optionally `params` property.
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  insertPages(insertIndex: number, insertPages: Array<{page: any, params?: any}>, opts?: NavOptions): Promise<any> {
    let views = insertPages.map(p => new ViewController(p.page, p.params));
    return this.insertViews(insertIndex, views, opts);
  }

  /**
   * @private
   */
  insertViews(insertIndex: number, insertViews: ViewController[], opts?: NavOptions): Promise<any> {
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

    let resolve: any;
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
   * If you wanted to navigate back from a current view, you can use the
   * back-button or programatically call `pop()`. Similar to `push()`, you
   * can also pass navigation options.
   *
   * ```ts
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
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
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
   * Similar to `pop()`, this method let's you navigate back to the root of
   * the stack, no matter how many pages back that is.
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  popToRoot(opts?: NavOptions): Promise<any> {
    return this.popTo(this.first(), opts);
  }

  /**
   * Pop to a specific view in the history stack.
   * @param {ViewController} view  to pop to
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  popTo(view: ViewController, opts?: NavOptions): Promise<any> {
    let startIndex = this.indexOf(view);
    if (startIndex < 0) {
      return Promise.reject('View not found to pop to');
    }

    let activeView = this.getByState(STATE_TRANS_ENTER) ||
                     this.getByState(STATE_INIT_ENTER) ||
                     this.getActive();
    let removeCount = this.indexOf(activeView) - startIndex;

    return this.remove(startIndex + 1, removeCount, opts);
  }

  /**
   * Removes a page from the nav stack at the specified index.
   *
   * ```ts
   * export class Detail {
   *    constructor(private nav: NavController) {
   *
   *    }
   *    removePage(){
   *      this.nav.remove(1);
   *    }
   *  }
   * ```
   *
   * @param {number} [startIndex]  The starting index to remove pages from the stack. Default is the index of the last page.
   * @param {number} [removeCount]  The number of pages to remove, defaults to remove `1`.
   * @param {object} [opts={}] Any options you want to use pass to transtion.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
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
              leavingView.fireWillLeave();
              this.viewWillLeave.emit(leavingView);
              this._app.viewWillLeave.emit(leavingView);

              return parentNav.pop(opts).then((rtnVal: boolean) => {
                leavingView.fireDidLeave();
                this.viewDidLeave.emit(leavingView);
                this._app.viewDidLeave.emit(leavingView);
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

      let resolve: any;
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
      view.fireWillUnload();
      this.viewWillUnload.emit(view);
      this._app.viewWillUnload.emit(view);

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
      view.fireWillLeave();
      view.fireDidLeave();
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
      enteringView.fireLoaded();
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
      done(hasCompleted);
    });
  }

  /**
   * @private
   */
  private _setAnimate(opts: NavOptions) {
    if ((this._views.length === 1 && !this._init && !this.isPortal) || this.config.get('animate') === false) {
      opts.animate = false;
    }
  }

  /**
   * @private
   */
  private _render(transId: number, enteringView: ViewController, leavingView: ViewController, opts: NavOptions, done: Function) {
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

      this.loadPage(enteringView, this._viewport, opts, () => {
        enteringView.fireLoaded();
        this.viewDidLoad.emit(enteringView);
        this._app.viewDidLoad.emit(enteringView);

        this._postRender(transId, enteringView, leavingView, isAlreadyTransitioning, opts, done);
      });
    }
  }

  /**
   * @private
   */
  private _postRender(transId: number, enteringView: ViewController, leavingView: ViewController, isAlreadyTransitioning: boolean, opts: NavOptions, done: Function) {
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
        enteringView.fireWillEnter();
        this.viewWillEnter.emit(enteringView);
        this._app.viewWillEnter.emit(enteringView);
      }

      if (enteringView.fireOtherLifecycles) {
        // only fire leaving lifecycle if the entering
        // view hasn't explicitly set not to
        leavingView.fireWillLeave();
        this.viewWillLeave.emit(leavingView);
        this._app.viewWillLeave.emit(leavingView);
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
        isRTL: this.config.platform.isRTL(),
        ev: opts.ev,
      };

      let transAnimation = this._createTrans(enteringView, leavingView, transitionOpts);

      this._trans && this._trans.destroy();
      this._trans = transAnimation;

      if (opts.animate === false) {
        // force it to not animate the elements, just apply the "to" styles
        transAnimation.duration(0);
      }

      // check if a parent is transitioning and get the time that it ends
      let parentTransitionEndTime = this._getLongestTrans(Date.now());
      if (parentTransitionEndTime > 0) {
        // the parent is already transitioning and has disabled the app
        // so just update the local transitioning information
        let duration = parentTransitionEndTime - Date.now();
        this.setTransitioning(true, duration);
      } else {
        // this is the only active transition (for now), so disable the app
        let keyboardDurationPadding = 0;
        if (this._keyboard.isOpen()) {
          // add XXms to the duration the app is disabled when the keyboard is open
          keyboardDurationPadding = 600;
        }
        let duration = transAnimation.getDuration() + keyboardDurationPadding;
        let enableApp = (duration < 64);
        this._app.setEnabled(enableApp, duration);
        this.setTransitioning(!enableApp, duration);
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
          enteringView.fireDidEnter();
          this.viewDidEnter.emit(enteringView);
          this._app.viewDidEnter.emit(enteringView);
        }

        if (enteringView.fireOtherLifecycles) {
          // only fire leaving lifecycle if the entering
          // view hasn't explicitly set not to
          leavingView.fireDidLeave();
          this.viewDidLeave.emit(leavingView);
          this._app.viewDidLeave.emit(leavingView);
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

      // check if there is a parent actively transitioning
      let transitionEndTime = this._getLongestTrans(Date.now());
      // if transitionEndTime is greater than 0, there is a parent transition occurring
      // so delegate enabling the app to the parent.  If it <= 0, go ahead and enable the app
      if (transitionEndTime <= 0) {
        this._app && this._app.setEnabled(true);
      }

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

  /**
   *@private
   * This method is just a wrapper to the Transition function of same name
   * to make it easy/possible to mock the method call by overriding the function.
   * In testing we don't want to actually do the animation, we want to return a stub instead
   */
  private _createTrans(enteringView: ViewController, leavingView: ViewController, transitionOpts: any) {
    return Transition.createTransition(enteringView, leavingView, transitionOpts);
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
      this.viewDidUnload.emit(view);
      this._app.viewDidUnload.emit(view);
    });

    // if any z-index goes under 0, then reset them all
    let shouldResetZIndex = this._views.some(v => v.zIndex < 0);
    if (shouldResetZIndex) {
      this._views.forEach(view => {
        view.setZIndex(view.zIndex + INIT_ZINDEX + 1, this._renderer);
      });
    }
  }

  /**
   * @private
   */
  getActiveChildNav(): any {
    return this._children[this._children.length - 1];
  }

  /**
   * @private
   */
  registerChildNav(nav: any) {
    this._children.push(nav);
  }

  /**
   * @private
   */
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

    if (this.parent && this.parent.unregisterChildNav) {
      this.parent.unregisterChildNav(this);
    }
  }

  /**
   * @private
   */
  loadPage(view: ViewController, viewport: ViewContainerRef, opts: NavOptions, done: Function) {
    if (!viewport || !view.componentType) {
      return;
    }

    // TEMPORARY: automatically set selector w/ dah reflector
    // TODO: use componentFactory.create once fixed
    addSelector(view.componentType, 'ion-page');

    this._compiler.resolveComponent(view.componentType).then(componentFactory => {

      // add more providers to just this page
      let componentProviders = ReflectiveInjector.resolve([
        provide(NavController, {useValue: this}),
        provide(ViewController, {useValue: view}),
        provide(NavParams, {useValue: view.getNavParams()})
      ]);

      let childInjector = ReflectiveInjector.fromResolvedProviders(componentProviders, this._viewport.parentInjector);

      let componentRef = componentFactory.create(childInjector, null, null);

      viewport.insert(componentRef.hostView, viewport.length);

      // a new ComponentRef has been created
      // set the ComponentRef's instance to its ViewController
      view.setInstance(componentRef.instance);

      // the component has been loaded, so call the view controller's loaded method to load any dependencies into the dom
      view.loaded(() => {

        // the ElementRef of the actual ion-page created
        let pageElementRef = componentRef.location;

        // remember the ChangeDetectorRef for this ViewController
        view.setChangeDetector(componentRef.changeDetectorRef);

        // remember the ElementRef to the ion-page elementRef that was just created
        view.setPageRef(pageElementRef);

        // auto-add page css className created from component JS class name
        let cssClassName = pascalCaseToDashCase(view.componentType.name);
        this._renderer.setElementClass(pageElementRef.nativeElement, cssClassName, true);

        view.onDestroy(() => {
          // ensure the element is cleaned up for when the view pool reuses this element
          this._renderer.setElementAttribute(pageElementRef.nativeElement, 'class', null);
          this._renderer.setElementAttribute(pageElementRef.nativeElement, 'style', null);
          componentRef.destroy();
        });

        // our job is done here
        done(view);
      });
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
        let menuCtrl = this._app.getAppInjector().get(MenuController);
        this._sbGesture = new SwipeBackGesture(this.getNativeElement(), opts, this, menuCtrl);
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
   * to go back, or swipe back is not enabled, then this will return `false`.
   * If it is possible to go back, and swipe back is enabled, then this
   * will return `true`.
   * @returns {boolean}
   */
  canSwipeBack(): boolean {
    return (this._sbEnabled && !this.isTransitioning() && this._app.isEnabled() && this.canGoBack());
  }

  /**
   * Returns `true` if there's a valid previous page that we can pop
   * back to. Otherwise returns `false`.
   * @returns {boolean}
   */
  canGoBack(): boolean {
    let activeView = this.getActive();
    if (activeView) {
      return activeView.enableBack();
    }
    return false;
  }

  /**
   * Returns if the nav controller is actively transitioning or not.
   * @return {boolean}
   */
  isTransitioning(): boolean {
    return (this._trnsTime > Date.now());
  }

  /**
   * @private
   */
  setTransitioning(isTransitioning: boolean, fallback: number = 700) {
    this._trnsTime = (isTransitioning ? Date.now() + fallback : 0);
  }

  /**
   * @private
   * This method traverses the tree of parents upwards
   * and looks at the time the transition ends (if it's transitioning)
   * and returns the value that is the furthest into the future
   * thus giving us the longest transition duration
   */
   private _getLongestTrans(now: number) {
     let parentNav: NavController = <NavController> this.parent;
     let transitionEndTime: number = -1;
     while (parentNav) {
       if (parentNav._trnsTime > transitionEndTime) {
         transitionEndTime = parentNav._trnsTime;
       }
       parentNav = <NavController> parentNav.parent;
     }
     // only check if the transitionTime is greater than the current time once
     return transitionEndTime > 0 && transitionEndTime > now ? transitionEndTime : 0;
   }

  /**
   * @private
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
   * @param {number} index  The index of the page to get.
   * @returns {ViewController} Returns the view controller that matches the given index.
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
   * Returns the view controller which is before the given view controller.
   * @param {ViewController} view
   * @returns {viewController}
   */
  getPrevious(view: ViewController): ViewController {
    return this.getByIndex(this.indexOf(view) - 1);
  }

  /**
   * Returns the first view controller in this nav controller's stack.
   * @returns {ViewController}
   */
  first(): ViewController {
    return (this._views.length ? this._views[0] : null);
  }

  /**
   * Returns the last page in this nav controller's stack.
   * @returns {ViewController}
   */
  last(): ViewController {
    return (this._views.length ? this._views[this._views.length - 1] : null);
  }

  /**
   * Returns the index number of the given view controller.
   * @param {ViewController} view
   * @returns {number}
   */
  indexOf(view: ViewController): number {
    return this._views.indexOf(view);
  }

  /**
   * Returns the number of views in this nav controller.
   * @returns {number} The number of views in this stack, including the current view.
   */
  length(): number {
    return this._views.length;
  }

  /**
   * @private
   */
  isSwipeBackEnabled(): boolean {
    return this._sbEnabled;
  }

  /**
   * Returns the root `NavController`.
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
  dismissPageChangeViews() {
    this._views.forEach(view => {
      if (view.data && view.data.dismissOnPageChange) {
        view.dismiss();
      }
    });
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
  private _setZIndex(enteringView: ViewController, leavingView: ViewController, direction: string) {
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
