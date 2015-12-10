import {ChangeDetectorRef, Compiler, ElementRef, Injector, provide, NgZone, AppViewManager, Renderer} from 'angular2/angular2';
import {wtfLeave, wtfCreateScope, WtfScopeFn, wtfStartTimeRange, wtfEndTimeRange} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {Keyboard} from '../../util/keyboard';
import {ViewController} from './view-controller';
import {Animation} from '../../animations/animation';
import {SwipeBackGesture} from './swipe-back';
import {isBoolean, array, pascalCaseToDashCase} from '../../util/util';
import {raf, rafFrames} from '../../util/dom';

/**
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
 * reference](../../../config/Page/)._
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

  constructor(
    parentnavCtrl: NavController,
    app: IonicApp,
    config: Config,
    keyboard: Keyboard,
    elementRef: ElementRef,
    anchorName: string,
    compiler: Compiler,
    viewManager: AppViewManager,
    zone: NgZone,
    renderer: Renderer,
    cd: ChangeDetectorRef
  ) {
    super(elementRef, config);

    this.parent = parentnavCtrl;
    this.app = app;
    this.config = config;
    this.keyboard = keyboard;
    this._anchorName = anchorName;

    this._compiler = compiler;
    this._viewManager = viewManager;
    this._zone = zone;
    this._renderer = renderer;
    this._cd =  cd;

    this._views = [];
    this._trnsTime = 0;
    this._trnsDelay = config.get('pageTransitionDelay');

    this._sbTrans = null;
    this._sbEnabled = config.get('swipeBackEnabled') || false;
    this._sbThreshold = config.get('swipeBackThreshold') || 40;

    this.initZIndex = 10;
    this.id = ++ctrlIds;
    this._ids = -1;

    // build a new injector for child ViewControllers to use
    this.providers = Injector.resolve([
      provide(NavController, {useValue: this})
    ]);
  }

  /**
   * Boolean if the nav controller is actively transitioning or not.
   * @private
   * @return {bool}
   */
  isTransitioning() {
    return (this._trnsTime > Date.now());
  }

  /**
   * Boolean if the nav controller is actively transitioning or not.
   * @private
   * @return {bool}
   */

  setTransitioning(isTransitioning, fallback=700) {
    this._trnsTime = (isTransitioning ? Date.now() + fallback : 0);
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
   *      },{
   *       // here we can configure things like the animations direction or
   *       // or if the view should animate at all.
   *       direction: back
   *      });
   *    }
   * }
   * ```
   * @param {Any} component The name of the component you want to push on the navigation stack
   * @param {Object} [params={}] Any nav-params you want to pass along to the next view
   * @param {Object} [opts={}] Any options you want to use pass to transtion
   * @returns {Promise} Returns a promise when the transition is completed
   */
  push(componentType, params = {}, opts = {}, callback) {
    if (!componentType) {
      let errMsg = 'invalid componentType to push';
      console.error(errMsg)
      return Promise.reject(errMsg);
    }

    if (typeof componentType !== 'function') {
      throw 'Loading component must be a component class, not "' + componentType.toString() + '"';
    }

    if (this.isTransitioning()) {
      return Promise.reject('nav controller actively transitioning');
    }

    this.setTransitioning(true, 500);

    let promise = null;
    if (!callback) {
      promise = new Promise(res => { callback = res; });
    }

    // do not animate if this is the first in the stack
    if (!this._views.length && !opts.animateFirst) {
      opts.animate = false;
    }

    // default the direction to "forward"
    opts.direction = opts.direction || 'forward';

    // the active view is going to be the leaving one (if one exists)
    let leavingView = this.getActive() || new ViewController();
    leavingView.shouldCache = (isBoolean(opts.cacheLeavingView) ? opts.cacheLeavingView : true);
    leavingView.shouldDestroy = !leavingView.shouldCache;
    if (leavingView.shouldDestroy) {
      leavingView.willUnload();
    }

    // create a new ViewController
    let enteringView = new ViewController(this, componentType, params);
    enteringView.shouldDestroy = false;
    enteringView.shouldCache = false;
    enteringView.pageType = opts.pageType;
    enteringView.handle = opts.handle || null;

    // add the view to the stack
    this._add(enteringView);

    if (this.router) {
      // notify router of the state change
      this.router.stateChange('push', enteringView, params);
    }

    // start the transition
    this._transition(enteringView, leavingView, opts, callback);

    return promise;
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
   * @param {Object} [opts={}] Any options you want to use pass to transtion
   * @returns {Promise} Returns a promise when the transition is completed
   */
  pop(opts = {}) {
    if (!opts.animateFirst && !this.canGoBack()) {
      return Promise.reject('pop cannot go back');
    }

    if (this.isTransitioning()) {
      return Promise.reject('nav controller actively transitioning');
    }

    this.setTransitioning(true, 500);

    let resolve = null;
    let promise = new Promise(res => { resolve = res; });

    // default the direction to "back"
    opts.direction = opts.direction || 'back';

    // get the active view and set that it is staged to be leaving
    // was probably the one popped from the stack
    let leavingView = this.getActive() || new ViewController();
    leavingView.shouldCache = (isBoolean(opts.cacheLeavingView) ? opts.cacheLeavingView : false);
    leavingView.shouldDestroy = !leavingView.shouldCache;
    if (leavingView.shouldDestroy) {
      leavingView.willUnload();
    }

    // the entering view is now the new last view
    // Note: we might not have an entering view if this is the
    // only view on the history stack.
    let enteringView = this.getPrevious(leavingView);
    if (this.router) {
      // notify router of the state change
      this.router.stateChange('pop', enteringView);
    }

    // start the transition
    this._transition(enteringView, leavingView, opts, resolve);

    return promise;
  }

  /**
   * @private
   * Pop to a specific view in the history stack
   * @param view {ViewController} to pop to
   * @param {Object} [opts={}] Any options you want to use pass to transtion
   */
  popTo(viewCtrl, opts = {}) {
    // Get the target index of the view to pop to
    let viewIndex = this._views.indexOf(viewCtrl);
    let targetIndex = viewIndex + 1;

    // Don't pop to the view if it wasn't found, or the target is beyond the view list
    if (viewIndex < 0 || targetIndex > this._views.length - 1) {
      return Promise.resolve();
    }

    // ensure the entering view is shown
    this._cachePage(viewCtrl, true);

    let resolve = null;
    let promise = new Promise(res => { resolve = res; });
    opts.direction = opts.direction || 'back';

    let leavingView = this.getActive() || new ViewController();

    // get the views to auto remove without having to do a transiton for each
    // the last view (the currently active one) will do a normal transition out
    if (this._views.length > 1) {
      let autoRemoveItems = this._views.slice(targetIndex, this._views.length);
      let popView;
      for (let i = 0; i < autoRemoveItems.length; i++) {
        popView = autoRemoveItems[i];
        popView.shouldDestroy = true;
        popView.shouldCache = false;
        popView.willUnload();

        // only the leaving view should be shown, all others hide
        this._cachePage(popView, (popView === leavingView));
      }
    }

    if (this.router) {
      this.router.stateChange('pop', viewCtrl);
    }

    this._transition(viewCtrl, leavingView, opts, resolve);

    return promise;
  }

  /**
   * Similar to `pop()`, this method let's you navigate back to the root of the stack, no matter how many views that is
   * @param {Object} [opts={}] Any options you want to use pass to transtion
   */
  popToRoot(opts = {}) {
    return this.popTo(this.first(), opts);
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
   *    insertView(){
   *      this.nav.insert(1,Info)
   *    }
   *  }
   * ```
   *
   * This will insert the `Info` view into the second slot of our navigation stack
   *
   * @param {Number} index The index where you want to insert the view
   * @param {Any} component The name of the component you want to insert into the nav stack
   * @returns {Promise} Returns a promise when the view has been inserted into the navigation stack
   */
  insert(index, componentType, params = {}, opts = {}) {
    if (!componentType || index < 0) {
      return Promise.reject('invalid insert');
    }

    // push it onto the end
    if (index >= this._views.length) {
      return this.push(componentType, params, opts);
    }

    // create new ViewController, but don't render yet
    let viewCtrl = new ViewController(this, componentType, params);
    viewCtrl.state = CACHED_STATE;
    viewCtrl.shouldDestroy = false;
    viewCtrl.shouldCache = false;

    this._incId(viewCtrl);
    this._views.splice(index, 0, viewCtrl);

    this._cleanup();

    return Promise.resolve();
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
   *      this.nav.remove(1)
   *    }
   *  }
   * ```
   *
   * @param {Number} index Remove the view from the nav stack at that index
   * @param {Object} [opts={}] Any options you want to use pass to transtion
   * @returns {Promise} Returns a promise when the view has been removed
   */
  remove(index, opts = {}) {
    if (index < 0 || index >= this._views.length) {
      return Promise.reject("index out of range");
    }

    let viewToRemove = this._views[index];
    if (this.isActive(viewToRemove)){
      return this.pop(opts);
    }

    viewToRemove.shouldDestroy = true;
    this._cleanup();
    return Promise.resolve();
  }

  /**
   * @private
   */
  setViews(components, opts = {}) {
    console.warn('setViews() deprecated, use setPages() instead');
    return this.setPages(components, opts);
  }

  /**
   * You can set the views of the current navigation stack and navigate to the last view past
   *
   *
   *```typescript
   * import {Page, NavController} from 'ionic/ionic'
   * import {Detail} from '../detail/detail'
   * import {Info} from '../info/info'
   *
   *  export class Home {
   *    constructor(nav: NavController) {
   *      this.nav = nav;
   *    }
   *    setPages() {
   *      this.nav.setPages([List,Detail, Info]);
   *    }
   *  }
   *```
   *
   *
   *In this example, we're giving the current nav stack an array of pages. Then the navigation stack will navigate to the last view in the array and remove the orignal view you came from.
   *
   *By default, animations are disabled, but they can be enabled by passing options to the navigation controller
   *
   *
   *```typescript
   * import {Page, NavController} from 'ionic/ionic'
   * import {Detail} from '../detail/detail'
   * import {Info} from '../info/info'
   *
   *  export class Home {
   *    constructor(nav: NavController) {
   *      this.nav = nav;
   *    }
   *    setPages() {
   *      this.nav.setPages([List,Detail, Info],{
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
   * import {Page, NavController} from 'ionic/ionic'
   * import {Detail} from '../detail/detail'
   * import {Info} from '../info/info'
   *
   *  export class Home {
   *    constructor(nav: NavController) {
   *      this.nav = nav;
   *    }
   *    setPages() {
   *      this.nav.setPages([{
   *        componentType: List,
   *        params: {id: 43}
   *      }, {
   *        componentType: Detail,
   *        params: {id: 45}
   *      },{
   *        componentType: Info,
   *        params: {id: 5}
   *      }]);
   *    }
   *  }
   *```
   *
   * @param {Array} component an arry of components to load in the stack
   * @param {Object} [opts={}] Any options you want to use pass
   * @returns {Promise} Returns a promise when the pages are set
   */
  setPages(components, opts = {}) {
    if (!components || !components.length) {
      return Promise.resolve();
    }

    let leavingView = this.getActive() || new ViewController();

    // if animate has not been set then default to false
    opts.animate = opts.animate || false;

    // ensure leaving views are not cached, and should be destroyed
    opts.cacheLeavingView = false;

    // get the views to auto remove without having to do a transiton for each
    // the last view (the currently active one) will do a normal transition out
    if (this._views.length > 1) {
      let autoRemoveItems = this._views.slice(0, this._views.length - 1);
      let popView;
      for (let i = 0; i < autoRemoveItems.length; i++) {
        popView = autoRemoveItems[i];
        popView.shouldDestroy = true;
        popView.shouldCache = false;
        popView.willUnload();

        if (opts.animate) {
          // only the leaving view should be shown, all others hide
          this._cachePage(popView, (popView === leavingView));
        }
      }
    }

    let componentObj = null;
    let componentType = null;
    let viewCtrl = null;

    // create the ViewControllers that go before the new active ViewController
    // in the stack, but the previous views shouldn't render yet
    if (components.length > 1) {
      let newBeforeItems = components.slice(0, components.length - 1);
      for (let j = 0; j < newBeforeItems.length; j++) {
        componentObj = newBeforeItems[j];

        if (componentObj) {
          // could be an object with a componentType property, or it is a componentType
          componentType = componentObj.componentType || componentObj;

          viewCtrl = new ViewController(this, componentType, componentObj.params);
          viewCtrl.state = CACHED_STATE;
          viewCtrl.shouldDestroy = false;
          viewCtrl.shouldCache = false;

          // add the item to the stack
          this._add(viewCtrl);
        }
      }
    }

    // get the component that will become the active item
    // it'll be the last one in the given components array
    componentObj = components[ components.length - 1 ];
    componentType = componentObj.componentType || componentObj;

    // transition the leaving and entering
    return this.push(componentType, componentObj.params, opts);
  }

  /**
   * Set the root for the current navigation stack
   * @param {Component} The name of the component you want to push on the navigation stack
   * @param {Object} [params={}] Any nav-params you want to pass along to the next view
   * @param {Object} [opts={}] Any options you want to use pass to transtion
   * @returns {Promise} Returns a promise when done
   */
  setRoot(componentType, params = {}, opts = {}) {
    return this.setPages([{
             componentType,
             params
           }], opts);
  }

  /**
   * @private
   */
  _transition(enteringView, leavingView, opts, done) {
    if (enteringView === leavingView) {
      // if the entering view and leaving view are the same thing don't continue
      return done(enteringView);
    }

    if (!opts.animation) {
      opts.animation = this.config.get('pageTransition');
    }
    if (this.config.get('animate') === false) {
      opts.animate = false;
    }

    if (!enteringView) {
      // if no entering view then create a bogus one
      // already consider this bogus one loaded
      enteringView = new ViewController()
      enteringView.loaded();
    }

    var wtfScope = wtfStartTimeRange('ionic.NavController#_transition ' + enteringView.name);

    /* Async steps to complete a transition
      1. _render: compile the view and render it in the DOM. Load page if it hasn't loaded already. When done call postRender
      2. _postRender: Run willEnter/willLeave, then wait a frame (change detection happens), then call beginTransition
      3. _beforeTrans: Create the transition's animation, play the animation, wait for it to end
      4. _afterTrans: Run didEnter/didLeave, call _transComplete()
      5. _transComplete: Cleanup, remove cache views, then call the final callback
    */

    // begin the multiple async process of transitioning to the entering view
    this._render(enteringView, leavingView, opts, () => {
      wtfEndTimeRange(wtfScope);
      done(enteringView);
    });
  }

  /**
   * @private
   */
  _render(enteringView, leavingView, opts, done) {
    // compile/load the view into the DOM

    if (enteringView.shouldDestroy) {
      // about to be destroyed, shouldn't continue
      done();

    } else if (enteringView.isLoaded()) {
      // already compiled this view, do not load again and continue
      this._postRender(enteringView, leavingView, opts, done);

    } else {
      // view has not been compiled/loaded yet
      // continue once the view has finished compiling
      // DOM WRITE
      this.loadPage(enteringView, null, opts, () => {
        if (enteringView.onReady) {
          // this entering view needs to wait for it to be ready
          // this is used by Tabs to wait for the first page of
          // the first selected tab to be loaded
          enteringView.onReady(() => {
            enteringView.loaded();
            this._postRender(enteringView, leavingView, opts, done);
          });

        } else {
          enteringView.loaded();
          this._postRender(enteringView, leavingView, opts, done);
        }
      });
    }
  }

  /**
   * @private
   */
  _postRender(enteringView, leavingView, opts, done) {
    var wtfScope = wtfStartTimeRange('ionic.NavController#_postRender ' + enteringView.name);

    // called after _render has completed and the view is compiled/loaded

    if (enteringView.shouldDestroy) {
      // view already marked as a view that will be destroyed, don't continue
      wtfEndTimeRange(wtfScope);
      done();

    } else if (!opts.preload) {
      // the enteringView will become the active view, and is not being preloaded

      // call each view's lifecycle events
      // POSSIBLE DOM READ THEN DOM WRITE
      enteringView.willEnter();
      leavingView.willLeave();

      // set the correct zIndex for the entering and leaving views
      // DOM WRITE
      this._setZIndex(enteringView, leavingView, opts.direction);

      // make sure the entering and leaving views are showing
      // and all others are hidden, but don't remove the leaving view yet
      // DOM WRITE
      this._cleanup(enteringView, leavingView, true);

      // lifecycle events may have updated some data
      // wait one frame and allow the raf to do a change detection
      // before kicking off the transition and showing the new view
      raf(() => {
        wtfEndTimeRange(wtfScope);
        this._beforeTrans(enteringView, leavingView, opts, done);
      });

    } else {
      // this view is being preloaded, don't call lifecycle events
      // transition does not need to animate
      opts.animate = false;
      wtfEndTimeRange(wtfScope);
      this._beforeTrans(enteringView, leavingView, opts, done);
    }
  }

  /**
   * @private
   */
  _beforeTrans(enteringView, leavingView, opts, done) {
    var wtfScope = wtfStartTimeRange('ionic.NavController#_beforeTrans ' + enteringView.name);

    // called after one raf from postRender()
    // create the transitions animation, play the animation
    // when the transition ends call wait for it to end

    // everything during the transition should runOutsideAngular
    this._zone.runOutsideAngular(() => {

      // ensure the entering view is not destroyed or cached
      enteringView.shouldDestroy = false;
      enteringView.shouldCache = false;

      // set that the new view pushed on the stack is staged to be entering/leaving
      // staged state is important for the transition to find the correct view
      enteringView.state = STAGED_ENTERING_STATE;
      leavingView.state = STAGED_LEAVING_STATE;

      // init the transition animation
      opts.renderDelay = opts.transitionDelay || self._trnsDelay;

      let transAnimation = Animation.createTransition(enteringView,
                                                      leavingView,
                                                      opts);
      if (opts.animate === false) {
        // force it to not animate the elements, just apply the "to" styles
        transAnimation.clearDuration();
        transAnimation.duration(0);
      }

      let duration = transAnimation.duration();
      let enableApp = (duration < 64);
      // block any clicks during the transition and provide a
      // fallback to remove the clickblock if something goes wrong
      this.app.setEnabled(enableApp, duration);
      this.setTransitioning(!enableApp, duration);

      if (opts.pageType) {
        transAnimation.before.addClass(opts.pageType);
      }

      wtfEndTimeRange(wtfScope);

      // start the transition
      transAnimation.play(() => {
        // transition animation has ended

        // dispose the animation and it's element references
        transAnimation.dispose();

        this._afterTrans(enteringView, leavingView, opts, done);
      });
    });
  }

  /**
   * @private
   */
  _afterTrans(enteringView, leavingView, opts, done) {
    var wtfScope = wtfStartTimeRange('ionic.NavController#_afterTrans ' + enteringView.name);

    // transition has completed, update each view's state
    // place back into the zone, run didEnter/didLeave
    // call the final callback when done
    enteringView.state = ACTIVE_STATE;
    leavingView.state = CACHED_STATE;

    // run inside of the zone again
    this._zone.run(() => {

      if (!opts.preload) {
        enteringView.didEnter();
        leavingView.didLeave();
      }

      if (this.keyboard.isOpen()) {
        // the keyboard is still open!
        // no problem, let's just close for them
        this.keyboard.onClose(() => {
          // keyboard has finished closing, transition complete
          this._transComplete();
          wtfEndTimeRange(wtfScope);
          done();
        }, 32);

      } else {
        // all good, transition complete
        this._transComplete();
        wtfEndTimeRange(wtfScope);
        done();
      }
    });
  }

  /**
   * @private
   */
  _transComplete() {
    let wtfScope = wtfCreateScope('ionic.NavController#_transComplete')();

    this._views.forEach(view => {
      if (view) {
        if (view.shouldDestroy) {
          view.didUnload();

        } else if (view.state === CACHED_STATE && view.shouldCache) {
          view.shouldCache = false;
        }
      }
    });

    // allow clicks again, but still set an enable time
    // meaning nothing with this view controller can happen for XXms
    this.app.setEnabled(true);
    this.setTransitioning(false);

    this._sbComplete();

    this._cleanup();

    wtfLeave(wtfScope);
  }

  /**
   * @private
   */
  loadPage(viewCtrl, navbarContainerRef, opts, done) {
    let wtfTimeRangeScope = wtfStartTimeRange('ionic.NavController#loadPage ' + viewCtrl.name);

    // guts of DynamicComponentLoader#loadIntoLocation
    this._compiler.compileInHost(viewCtrl.componentType).then(hostProtoViewRef => {
      let wtfScope = wtfCreateScope('ionic.NavController#loadPage_After_Compile')();

      let providers = this.providers.concat(Injector.resolve([
        provide(ViewController, {useValue: viewCtrl}),
        provide(NavParams, {useValue: viewCtrl.params})
      ]));

      let location = this.elementRef;
      if (this._anchorName) {
        location = this._viewManager.getNamedElementInComponentView(location, this._anchorName);
      }

      let viewContainer = this._viewManager.getViewContainer(location);
      let hostViewRef =
          viewContainer.createHostView(hostProtoViewRef, viewContainer.length, providers);
      let pageElementRef = this._viewManager.getHostElement(hostViewRef);
      let component = this._viewManager.getComponent(pageElementRef);

      // auto-add page css className created from component JS class name
      let cssClassName = pascalCaseToDashCase(viewCtrl.componentType.name);
      this._renderer.setElementClass(pageElementRef, cssClassName, true);

      viewCtrl.addDestroy(() => {
        // ensure the element is cleaned up for when the view pool reuses this element
        this._renderer.setElementAttribute(pageElementRef, 'class', null);
        this._renderer.setElementAttribute(pageElementRef, 'style', null);

        // remove the page from its container
        let index = viewContainer.indexOf(hostViewRef);
        if (index !== -1) {
          viewContainer.remove(index);
        }
      });

      // a new ComponentRef has been created
      // set the ComponentRef's instance to this ViewController
      viewCtrl.setInstance(component);

      // remember the ElementRef to the ion-page elementRef that was just created
      viewCtrl.setPageRef(pageElementRef);

      if (!navbarContainerRef) {
        navbarContainerRef = viewCtrl.getNavbarViewRef();
      }

      let navbarTemplateRef = viewCtrl.getNavbarTemplateRef();
      if (navbarContainerRef && navbarTemplateRef) {
        let navbarView = navbarContainerRef.createEmbeddedView(navbarTemplateRef);

        viewCtrl.addDestroy(() => {
          let index = navbarContainerRef.indexOf(navbarView);
          if (index > -1) {
            navbarContainerRef.remove(index);
          }
        });
      }

      opts.postLoad && opts.postLoad(viewCtrl);

      if (this._views.length === 1) {
        this._zone.runOutsideAngular(() => {
          rafFrames(38, () => {
            this._renderer.setElementClass(this.elementRef, 'has-views', true);
          });
        });
      }

      wtfEndTimeRange(wtfTimeRangeScope);
      wtfLeave(wtfScope);

      done(viewCtrl);
    });
  }

  /**
   * @private
   */
  _setZIndex(enteringView, leavingView, direction) {
    let enteringPageRef = enteringView && enteringView.pageRef();
    if (enteringPageRef) {
      if (!leavingView || !leavingView.isLoaded()) {
        enteringView.zIndex = this.initZIndex;

      } else if (direction === 'back') {
        // moving back
        enteringView.zIndex = leavingView.zIndex - 1;

      } else {
        // moving forward
        enteringView.zIndex = leavingView.zIndex + 1;
      }

      if (enteringView.zIndex !== enteringView._zIndex) {
        this._renderer.setElementStyle(enteringPageRef, 'z-index', enteringView.zIndex);
        enteringView._zIndex = enteringView.zIndex;
      }
    }
  }

  /**
   * @private
   */
  _cachePage(viewCtrl, shouldShow) {
    // using hidden element attribute to display:none and not render views
    // renderAttr of '' means the hidden attribute will be added
    // renderAttr of null means the hidden attribute will be removed
    // doing checks to make sure we only make an update to the element when needed
    if (shouldShow && viewCtrl._hdnAttr === '' ||
       !shouldShow && viewCtrl._hdnAttr !== '') {
      viewCtrl._hdnAttr = (shouldShow ? null : '');

      this._renderer.setElementAttribute(viewCtrl.pageRef(), 'hidden', viewCtrl._hdnAttr);

      let navbarRef = viewCtrl.navbarRef();
      if (navbarRef) {
        this._renderer.setElementAttribute(navbarRef, 'hidden', viewCtrl._hdnAttr);
      }
    }
  }

  /**
   * @private
   */
  _cleanup(activeView, previousView, skipDestroy) {
    // the active page, and the previous page, should be rendered in dom and ready to go
    // all others, like a cached page 2 back, should be display: none and not rendered
    let destroys = [];
    activeView = activeView || this.getActive();
    previousView = previousView || this.getPrevious(activeView);

    this._views.forEach(view => {
      if (view) {
        if (view.shouldDestroy && !skipDestroy) {
          destroys.push(view);

        } else if (view.isLoaded()) {
          let shouldShow = (view === activeView) || (view === previousView);
          this._cachePage(view, shouldShow);
        }
      }
    });

    // all pages being destroyed should be removed from the list of pages
    // and completely removed from the dom
    destroys.forEach(view => {
      this._remove(view);
      view.destroy();
    });
  }

  /**
   * @private
   */
  swipeBackStart() {
    return;
    if (!this.app.isEnabled() || !this.canSwipeBack()) {
      return;
    }

    // disables the app during the transition
    this.app.setEnabled(false);
    this.setTransitioning(true);

    // default the direction to "back"
    let opts = {
      direction: 'back'
    };

    // get the active view and set that it is staged to be leaving
    // was probably the one popped from the stack
    let leavingView = this.getActive() || new ViewController();
    leavingView.shouldDestroy = true;
    leavingView.shouldCache = false;
    leavingView.willLeave();
    leavingView.willUnload();

    // the entering view is now the new last view
    let enteringView = this.getPrevious(leavingView);
    enteringView.shouldDestroy = false;
    enteringView.shouldCache = false;
    enteringView.willEnter();

    // wait for the new view to complete setup
    this._render(enteringView, {}, () => {

      this._zone.runOutsideAngular(() => {
        // set that the new view pushed on the stack is staged to be entering/leaving
        // staged state is important for the transition to find the correct view
        enteringView.state = STAGED_ENTERING_STATE;
        leavingView.state = STAGED_LEAVING_STATE;

        // init the swipe back transition animation
        this._sbTrans = Transition.create(this, opts);
        this._sbTrans.easing('linear').progressStart();

      });
    });

  }

  /**
   * @private
   */
  swipeBackProgress(value) {
    return;
    if (this._sbTrans) {
      // continue to disable the app while actively dragging
      this.app.setEnabled(false, 4000);
      this.setTransitioning(true, 4000);

      // set the transition animation's progress
      this._sbTrans.progress(value);
    }
  }

  /**
   * @private
   */
  swipeBackEnd(completeSwipeBack, rate) {
    return;
    if (!this._sbTrans) return;

    // disables the app during the transition
    this.app.setEnabled(false);
    this.setTransitioning(true);

    this._sbTrans.progressEnd(completeSwipeBack, rate).then(() => {

      this._zone.run(() => {
        // find the views that were entering and leaving
        let enteringView = this._getStagedEntering();
        let leavingView = this._getStagedLeaving();

        if (enteringView && leavingView) {
          // finish up the animation

          if (completeSwipeBack) {
            // swipe back has completed navigating back
            // update each view's state
            enteringView.state = ACTIVE_STATE;
            leavingView.state = CACHED_STATE;

            enteringView.didEnter();
            leavingView.didLeave();

            if (this.router) {
              // notify router of the pop state change
              this.router.stateChange('pop', enteringView);
            }

          } else {
            // cancelled the swipe back, they didn't end up going back
            // return views to their original state
            leavingView.state = ACTIVE_STATE;
            enteringView.state = CACHED_STATE;

            leavingView.willEnter();
            leavingView.didEnter();
            enteringView.didLeave();

            leavingView.shouldDestroy = false;
            enteringView.shouldDestroy = false;
          }
        }

        // empty out and dispose the swipe back transition animation
        this._sbTrans && this._sbTrans.dispose();
        this._sbTrans = null;

        // all done!
        this._transComplete();
      });
    });

  }

  /**
   * @private
   */
  _sbComplete() {
    return;
    if (this.canSwipeBack()) {
      // it is possible to swipe back

      if (this.sbGesture) {
        // this is already an active gesture, don't create another one
        return;
      }

      let opts = {
        edge: 'left',
        threshold: this._sbThreshold
      };
      this.sbGesture = new SwipeBackGesture(this.getNativeElement(), opts, this);
      console.debug('SwipeBackGesture listen');
      this.sbGesture.listen();


    } else if (this.sbGesture) {
      // it is not possible to swipe back and there is an
      // active sbGesture, so unlisten it
      console.debug('SwipeBackGesture unlisten');
      this.sbGesture.unlisten();
      this.sbGesture = null;
    }
  }

  /**
   * Check to see if swipe-to-go-back is enabled
   * @param {boolean=} isSwipeBackEnabled Set whether or not swipe-to-go-back is enabled
   * @returns {boolean} Whether swipe-to-go-back is enabled
   */
  isSwipeBackEnabled(val) {
    if (arguments.length) {
       this._sbEnabled = !!val;
    }
    return this._sbEnabled;
  }

  /**
   * If it's possible to use swipe back or not. If it's not possible
   * to go back, or swipe back is not enable then this will return false.
   * If it is possible to go back, and swipe back is enabled, then this
   * will return true.
   * @returns {boolean} Whether you can swipe to go back
   */
  canSwipeBack() {
    return (this._sbEnabled && this.canGoBack());
  }

  /**
   * Returns `true` if there's a valid previous page that we can pop back to.
   * Otherwise returns false.
   * @returns {boolean} Whether there is a page to go back to
   */
  canGoBack() {
    let activeView = this.getActive();
    if (activeView) {
      return activeView.enableBack();
    }
    return false;
  }

  /**
   * @private
   */
  navbarViewContainer(nbContainer) {
    if (nbContainer) {
      this._nbContainer = nbContainer;
    }
    if (this._nbContainer) {
      return this._nbContainer;
    }
    if (this.parent) {
      return this.parent.navbarViewContainer();
    }
  }

  /**
   * @private
   * @returns {TODO} TODO
   */
  anchorElementRef() {
    if (arguments.length) {
      this._anchorER = arguments[0];
    }
    return this._anchorER;
  }

  /**
   * @private
   */
  _add(viewCtrl) {
    this._incId(viewCtrl);
    this._views.push(viewCtrl);
  }

  /**
   * @private
   */
  _incId(viewCtrl) {
    viewCtrl.id = this.id + '-' + (++this._ids);
  }

  /**
   * @private
   */
  _remove(viewOrIndex) {
    array.remove(this._views, viewOrIndex);
  }

  /**
   * @private
   */
  _getStagedEntering() {
    for (let i = 0, ii = this._views.length; i < ii; i++) {
      if (this._views[i].state === STAGED_ENTERING_STATE) {
        return this._views[i];
      }
    }
    return null;
  }

  /**
   * @private
   */
  _getStagedLeaving() {
    for (let i = 0, ii = this._views.length; i < ii; i++) {
      if (this._views[i].state === STAGED_LEAVING_STATE) {
        return this._views[i];
      }
    }
    return null;
  }

  /**
   * @private
   * @returns {Component} TODO
   */
  getActive() {
    for (let i = this._views.length - 1; i >= 0; i--) {
      if (this._views[i].state === ACTIVE_STATE && !this._views[i].shouldDestroy) {
        return this._views[i];
      }
    }
    return null;
  }

  /**
   * @param {Index} The index of the page you want to get
   * @returns {Component} Returns the component that matches the index given
   */
  getByIndex(index) {
    if (index < this._views.length && index > -1) {
      return this._views[index];
    }
    return null;
  }

  /**
   * @private
   * @param {Handle} The handle of the page you want to get
   * @returns {Component} Returns the component that matches the handle given
   */
  getByHandle(handle) {
    for (let i = 0, ii = this._views.length; i < ii; i++) {
      if (this._views[i].handle === handle) {
        return this._views[i];
      }
    }
    return null;
  }

  /**
   * @private
   * @param {TODO} pageType  TODO
   * @returns {TODO} TODO
   */
  getByType(pageType) {
    for (let i = 0, ii = this._views.length; i < ii; i++) {
      if (this._views[i].pageType === pageType) {
        return this._views[i];
      }
    }
    return null;
  }

  /**
   * @private
   * @param {TODO} view  TODO
   * @returns {TODO} TODO
   */
  getPrevious(viewCtrl) {
    if (viewCtrl) {
      let viewIndex = this._views.indexOf(viewCtrl);

      for (let i = viewIndex - 1; i >= 0; i--) {
        if (!this._views[i].shouldDestroy) {
          return this._views[i];
        }
      }
    }
    return null;
  }

  /**
   * First page in this nav controller's stack. This would not return a page which is about to be destroyed.
   * @returns {Component} Returns the first component page in the current stack
   */
  first() {
    for (let i = 0, l = this._views.length; i < l; i++) {
      if (!this._views[i].shouldDestroy) {
        return this._views[i];
      }
    }
    return null;
  }

  /**
   * Last page in this nav controller's stack. This would not return a page which is about to be destroyed.
   * @returns {Component} Returns the last component page in the current stack
   */
  last() {
    for (let i = this._views.length - 1; i >= 0; i--) {
      if (!this._views[i].shouldDestroy) {
        return this._views[i];
      }
    }
    return null;
  }

  /**
   * @private
   * @param {TODO} view  TODO
   * @returns {TODO} TODO
   */
  indexOf(viewCtrl) {
    return this._views.indexOf(viewCtrl);
  }

  /**
   * Number of sibling views in the nav controller. This does
   * not include views which are about to be destroyed.
   * @returns {Number} The number of views in stack, including the current view
   */
  length() {
    let len = 0;
    for (let i = 0, l = this._views.length; i < l; i++) {
      if (!this._views[i].shouldDestroy) {
        len++;
      }
    }
    return len;
  }

  /**
   * @private
   * @param {TODO} view  TODO
   * @returns {boolean}
   */
  isActive(viewCtrl) {
    return !!(viewCtrl && viewCtrl.state === ACTIVE_STATE);
  }

  /**
   * Returns the root NavController.
   * @returns {NavController}
   */
  get rootNav() {
    let nav = this;
    while (nav.parent) {
      nav = nav.parent;
    }
    return nav;
  }

  /**
   * @private
   * @param {TODO} router  TODO
   */
  registerRouter(router) {
    this.router = router;
  }

}

const ACTIVE_STATE = 1;
const CACHED_STATE = 2;
const STAGED_ENTERING_STATE = 3;
const STAGED_LEAVING_STATE = 4;

let ctrlIds = -1;


/**
 * @name NavParams
 * @description
 * NavParams are an object that exists on a page and can contain data for that particular view.
 * Similar to how data was pass to a view in V1 with `$stateParams`, NavParams offer a much more flexible
 * option with a simple `get` method.
 *
 * @usage
 * ```ts
 * export class MyClass{
 *  constructor(params: NavParams){
 *    this.params = params;
 *    // userParams is an object we have in our nav-parameters
 *    this.params.get('userParams');
 *  }
 * }
 * ```
 * @demo /docs/v2/demos/nav-params/
 * @see {@link /docs/v2/components#navigation Navigation Component Docs}
 * @see {@link ../NavController/ NavController API Docs}
 * @see {@link ../Nav/ Nav API Docs}
 * @see {@link ../NavPush/ NavPush API Docs}
 */
export class NavParams {
  /**
   * @private
   * @param {TODO} data  TODO
   */
  constructor(data) {
    this.data = data || {};
  }

  /**
   * Get the value of a nav-parameter for the current view
   *
   * ```ts
   * export class MyClass{
   *  constructor(params: NavParams){
   *    this.params = params;
   *    // userParams is an object we have in our nav-parameters
   *    this.params.get('userParams');
   *  }
   * }
   * ```
   *
   *
   * @param {string} parameter Which param you want to look up
   */
  get(param) {
    return this.data[param];
  }
}
