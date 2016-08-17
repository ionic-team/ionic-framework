import { ComponentRef, ComponentFactoryResolver, ElementRef, EventEmitter, NgZone, ReflectiveInjector, Renderer, ViewContainerRef } from '@angular/core';

import { AnimationOptions } from '../animations/animation';
import { App } from '../components/app/app';
import { Config } from '../config/config';
import { convertToViews, NavOptions, DIRECTION_BACK, DIRECTION_FORWARD, INIT_ZINDEX, PORTAL_ZINDEX } from './nav-util';
import { TransitionResolveFn, TransitionRejectFn, TransitionInstruction, TestResult, ViewState } from './nav-util';
import { setZIndex } from './nav-util';
import { DeepLinker } from './deep-linker';
import { GestureController } from '../gestures/gesture-controller';
import { isBlank, isPresent, isString, noop, pascalCaseToDashCase } from '../util/util';
import { Ion } from '../components/ion';
import { Keyboard } from '../util/keyboard';
import { NavController } from './nav-controller';
import { NavParams } from './nav-params';
import { SwipeBackGesture } from './swipe-back';
import { Transition } from '../transitions/transition';
import { TransitionController } from '../transitions/transition-controller';
import { ViewController } from './view-controller';


/**
 * @private
 * This class is for internal use only. It is not exported publicly.
 */
export class NavControllerBase extends Ion implements NavController {
  _init = false;
  _isPortal: boolean;
  _sbGesture: SwipeBackGesture;
  _sbThreshold: number;
  _viewport: ViewContainerRef;
  _children: any[] = [];
  _sbEnabled: boolean;
  _ids: number = -1;
  _trnsDelay: any;
  _views: ViewController[] = [];
  _queue: TransitionInstruction[] = [];
  _transId: number = null;
  _transTm: number = 0;

  viewDidLoad: EventEmitter<any>;
  viewWillEnter: EventEmitter<any>;
  viewDidEnter: EventEmitter<any>;
  viewWillLeave: EventEmitter<any>;
  viewDidLeave: EventEmitter<any>;
  viewWillUnload: EventEmitter<any>;

  id: string;
  parent: any;
  config: Config;

  constructor(
    parent: any,
    public _app: App,
    config: Config,
    public _keyboard: Keyboard,
    elementRef: ElementRef,
    public _zone: NgZone,
    public _renderer: Renderer,
    public _cfr: ComponentFactoryResolver,
    public _gestureCtrl: GestureController,
    public _transCtrl: TransitionController,
    public _linker: DeepLinker
  ) {
    super(elementRef);

    this.parent = parent;
    this.config = config;

    this._trnsDelay = config.get('pageTransitionDelay');

    this._sbEnabled = config.getBoolean('swipeBackEnabled');
    this._sbThreshold = config.getNumber('swipeBackThreshold', 40);

    this.id = 'n' + (++ctrlIds);

    this.viewDidLoad = new EventEmitter();
    this.viewWillEnter = new EventEmitter();
    this.viewDidEnter = new EventEmitter();
    this.viewWillLeave = new EventEmitter();
    this.viewDidLeave = new EventEmitter();
    this.viewWillUnload = new EventEmitter();
  }

  push(page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrans({
      insertStart: -1,
      insertViews: convertToViews(this._linker, [{page: page, params: params}]),
      opts: opts,
    }, done);
  }

  insert(insertIndex: number, page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrans({
      insertStart: insertIndex,
      insertViews: convertToViews(this._linker, [{page: page, params: params}]),
      opts: opts,
    }, done);
  }

  insertPages(insertIndex: number, insertPages: Array<{page: any, params?: any}>|ViewController[], opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrans({
      insertStart: insertIndex,
      insertViews: convertToViews(this._linker, insertPages),
      opts: opts,
    }, done);
  }

  pop(opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrans({
      removeStart: -1,
      removeCount: 1,
      opts: opts,
    }, done);
  }

  popToRoot(opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrans({
      removeStart: 1,
      removeCount: -1,
      opts: opts,
    }, done);
  }

  popTo(view: ViewController, opts?: NavOptions, done?: Function): Promise<any> {
    const startIndex = this.indexOf(view);
    const removeCount = this.indexOf(this.getActive()) - startIndex;
    return this._queueTrans({
      removeStart: startIndex + 1,
      removeCount: removeCount,
      opts: opts,
    }, done);
  }

  remove(startIndex: number = -1, removeCount: number = 1, opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrans({
      removeStart: startIndex,
      removeCount: removeCount,
      opts: opts,
    }, done);
  }

  setRoot(pageOrViewCtrl: any, params?: any, opts?: NavOptions, done?: Function): Promise<any> {
    if (pageOrViewCtrl instanceof ViewController) {
      (<ViewController>pageOrViewCtrl).data = params;
      return this.setPages([pageOrViewCtrl], opts, done);
    }

    return this.setPages([{pageOrViewCtrl, params}], opts, done);
  }

  setPages(pages: Array<{pageOrViewCtrl: any, params?: any}> | Array<ViewController>, opts?: NavOptions, done?: Function): Promise<any> {
    // create view controllers out of the pages and insert the new views
    return this._queueTrans({
      insertStart: 0,
      insertViews: convertToViews(this._linker, pages),
      removeStart: 0,
      removeCount: -1,
      opts: opts
    }, done);
  }

  _queueTrans(instruction: TransitionInstruction, done: Function): Promise<any> {
    let promise: Promise<any>;
    let resolve: Function = done;
    let reject: Function = done;

    if (done === undefined) {
      // only create a promise if a done callback wasn't provided
      // done can be a null, which avoids any functions
      promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
    }

    instruction.resolve = (hasCompleted: boolean) => {
      // transition has successfully resolved
      this._transId = null;
      resolve && resolve();

      // let's see if there's another to kick off
      this._nextTrans();
    };

    instruction.reject = (rejectReason: any, trans: Transition) => {
      // rut row raggy, something rejected this transition
      this._transId = null;
      this._queue.length = 0;

      while (trans) {
        if (trans.enteringView && (trans.enteringView._state !== ViewState.LOADED)) {
          // destroy the view and all of its hopes and dreams
          trans.enteringView._destroy(this._renderer);
        }
        if (!trans.parent) break;
      }

      this._transCtrl.destroy(trans.transId);

      reject && reject();
    };

    this._queue.push(instruction);

    // if there isn't a transitoin already happening
    // then this will kick off this transition
    this._nextTrans();

    // promise is undefined if a done callbacks was provided
    return promise;
  }

  _nextTrans() {
    // only one transition is allowed at any given time
    if (this._transId !== null) return;

    // there is no transition happening right now
    // get the next instruction
    const t = this._queue.shift();
    if (!t) return;

    const viewsLength = this._views.length;
    const activeView = this.getActive();
    const destroyQueue: ViewController[] = [];

    let enteringView: ViewController;
    let leavingView: ViewController = activeView;

    const opts = t.opts || {};
    const resolve = t.resolve;
    const reject = t.reject;
    const insertViews = t.insertViews;
    t.resolve = t.reject = t.opts = t.insertViews = null;

    if (isPresent(t.removeStart)) {
      if (t.removeStart < 0) {
        t.removeStart = (viewsLength - 1);
      }
      if (t.removeCount < 0) {
        t.removeCount = (viewsLength - t.removeStart);
      }

      for (var i = t.removeStart; i < t.removeCount; i++) {
        destroyQueue.push(this._views[i]);
      }

      if (leavingView) {
        enteringView = this.getPrevious(leavingView);
      }

      // default the direction to "back"
      opts.direction = opts.direction || DIRECTION_BACK;
    }

    if (isPresent(t.insertStart) && insertViews && insertViews.length) {
      // allow -1 to be passed in to auto push it on the end
      // and clean up the index if it's larger then the size of the stack
      if (t.insertStart < 0 || t.insertStart > viewsLength) {
        t.insertStart = viewsLength;
      }

      // grab the very last view of the views to be inserted
      // and initialize it as the new entering view
      enteringView = insertViews[insertViews.length - 1];

      // manually set the new view's id if an id was passed in the options
      if (isPresent(opts.id)) {
        enteringView.id = opts.id;
      }

      // add the views to the
      for (var i = 0; i < insertViews.length; i++) {
        var view = insertViews[i];
        // create the new entering view
        view._setNav(this);

        // give this inserted view an ID
        view.id = this.id + '-' + (++this._ids);

        // insert the entering view into the correct index in the stack
        this._views.splice(t.insertStart + i, 0, view);
      }

      // default to forward if not already set
      opts.direction = opts.direction || DIRECTION_FORWARD;
    }

    // if the views to be removed are in the beginning or middle
    // and there is not a view that needs to visually transition out
    // then just destroy them and don't transition anything
    for (var i = 0; i < destroyQueue.length - 1; i++) {
      // batch all of lifecycles together
      var view = destroyQueue[i];
      if (view && view !== enteringView && view !== leavingView) {
        view._willLeave();
        this.viewWillLeave.emit(view);
        this._app.viewWillLeave.emit(view);

        view._didLeave();
        this.viewDidLeave.emit(view);
        this._app.viewDidLeave.emit(view);

        view._willUnload();
        this.viewWillUnload.emit(view);
        this._app.viewWillUnload.emit(view);
      }
    }
    for (var i = 0; i < destroyQueue.length - 1; i++) {
      // batch all of the destroys together
      var view = destroyQueue[i];
      if (view && view !== enteringView && view !== leavingView) {
        view._destroy(this._renderer);
      }
    }
    destroyQueue.length = 0;

    if (enteringView || leavingView) {
      // set which animation it should use if it wasn't set yet
      if (!opts.animation) {
        if (isPresent(t.removeStart)) {
          opts.animation = (leavingView || enteringView).getTransitionName(opts.direction);
        } else {
          opts.animation = (enteringView || leavingView).getTransitionName(opts.direction);
        }
      }

      // huzzah! let us transition these views
      this._transition(enteringView, leavingView, opts, resolve, reject);

    } else {
      // they're inserting/removing the views somewhere in the middle or
      // beginning, so visually nothing needs to animate/transition
      // resolve immediately because there's no animation that's happening
      return resolve(true);
    }
  }

  _transition(enteringView: ViewController, leavingView: ViewController, opts: NavOptions, resolve: TransitionResolveFn, reject: TransitionRejectFn): void {
    // figure out if this transition is the root one or a
    // child of a parent nav that has the root transition
    this._transId = this._transCtrl.getRootTransId(this);
    if (this._transId === null) {
      // this is the root transition, meaning all child navs and their views
      // should be added as a child transition to this one
      this._transId = this._transCtrl.nextId();
    }

    // create the transition animation from the TransitionController
    // this will either create the root transition, or add it as a child transition
    const trans = this._transCtrl.get(this._transId, enteringView, leavingView, opts);

    if (trans.parent) {
      // this is important for later to know if there
      // are any more child tests to check for
      trans.parent.hasChildTrans = true;
    }

    trans.registerStart(() => {
      this._transStart(trans, enteringView, leavingView, opts, resolve);
      if (trans.parent) {
        trans.parent.start();
      }
    });

    if (enteringView && isBlank(enteringView._state)) {
      // render the entering view, and all child navs and views
      // ******** DOM WRITE ****************
      this._viewInit(trans, enteringView, leavingView, opts);
    }

    // views have been initialized, now let's test
    // to see if the transition is even allowed or not
    const shouldContinue = this._viewTest(trans, enteringView, leavingView, opts, resolve, reject);
    if (shouldContinue) {
      // synchronous and all tests passed! let's continue
      this._postViewInit(trans, enteringView, leavingView, opts, resolve);
    }
  }

  /**
   * DOM WRITE
   */
  _viewInit(trans: Transition, enteringView: ViewController, leavingView: ViewController, opts: NavOptions) {
    // entering view has not been initialized yet
    const componentProviders = ReflectiveInjector.resolve([
      { provide: NavController, useValue: this },
      { provide: ViewController, useValue: enteringView },
      { provide: NavParams, useValue: enteringView.getNavParams() }
    ]);
    const componentFactory = this._cfr.resolveComponentFactory(enteringView.componentType);
    const childInjector = ReflectiveInjector.fromResolvedProviders(componentProviders, this._viewport.parentInjector);

    // create ComponentRef and set it to the entering view
    enteringView.init(componentFactory.create(childInjector, []));
    enteringView._state = ViewState.INITIALIZED;
  }

  _viewTest(trans: Transition, enteringView: ViewController, leavingView: ViewController, opts: NavOptions, resolve: TransitionResolveFn, reject: TransitionRejectFn): boolean {
    const promises: Promise<any>[] = [];

    if (leavingView) {
      const leavingTestResult = leavingView._lifecycleTest('Leave');

      if (isPresent(leavingTestResult) && leavingTestResult !== true) {
        if (leavingTestResult instanceof Promise) {
          // async promise
          promises.push(leavingTestResult);

        } else {
          // synchronous reject
          reject((leavingTestResult !== false ? leavingTestResult :  `ionViewCanLeave rejected`), trans);
          return false;
        }
      }
    }

    if (enteringView) {
      const enteringTestResult = enteringView._lifecycleTest('Enter');

      if (isPresent(enteringTestResult) && enteringTestResult !== true) {
        if (enteringTestResult instanceof Promise) {
          // async promise
          promises.push(enteringTestResult);

        } else {
          // synchronous reject
          reject((enteringTestResult !== false ? enteringTestResult :  `ionViewCanEnter rejected`), trans);
          return false;
        }
      }
    }

    if (promises.length) {
      // darn, async promises, gotta wait for them to resolve
      Promise.all(promises).then(() => {
        // all promises resolved! let's continue
        this._postViewInit(trans, enteringView, leavingView, opts, resolve);

      }, (rejectReason: any) => {
        // darn, one of the promises was rejected!!
        reject(rejectReason, trans);

      }).catch((rejectReason) => {
        // idk, who knows
        reject(rejectReason, trans);
      });

      return false;
    }

    // synchronous and all tests passed! let's move on already
    return true;
  }

  _postViewInit(trans: Transition, enteringView: ViewController, leavingView: ViewController, opts: NavOptions, done: TransitionResolveFn): void {
    // passed both the enter and leave tests
    if (enteringView && enteringView._state === ViewState.INITIALIZED) {
      // render the entering component in the DOM
      // this would also render new child navs/views
      // which may have their very own async canEnter/Leave tests
      // ******** DOM WRITE ****************
      this._viewInsert(enteringView, enteringView._cmp, this._viewport);
    }

    if (!trans.hasChildTrans) {
      // lowest level transition, so kick it off and let it bubble up to start all of them
      trans.start();
    }
  }

  _viewInsert(view: ViewController, componentRef: ComponentRef<any>, viewport: ViewContainerRef) {
    // successfully finished loading the entering view
    // fire off the "loaded" lifecycle events
    view._didLoad();
    this.viewDidLoad.emit(view);
    this._app.viewDidLoad.emit(view);

    // render the component ref instance to the DOM
    // ******** DOM WRITE ****************
    viewport.insert(componentRef.hostView, viewport.length);
    view._state = ViewState.PRE_RENDERED;

    // the ElementRef of the actual ion-page created
    const pageElement = componentRef.location.nativeElement;

    // ******** DOM WRITE ****************
    this._renderer.setElementClass(pageElement, 'ion-page', true);

    // auto-add page css className created from component JS class name
    // ******** DOM WRITE ****************
    const cssClassName = pascalCaseToDashCase(view.componentType.name);
    this._renderer.setElementClass(pageElement, cssClassName, true);

    componentRef.changeDetectorRef.detectChanges();
  }

  _transStart(trans: Transition, enteringView: ViewController, leavingView: ViewController, opts: NavOptions, done: TransitionResolveFn) {
    this._transId = null;

    // set the correct zIndex for the entering and leaving views
    // ******** DOM WRITE ****************
    setZIndex(this, enteringView, leavingView, opts.direction, this._renderer);

    // always ensure the entering view is viewable
    // ******** DOM WRITE ****************
    enteringView && enteringView._domShow(true, this._renderer);

    if (leavingView) {
      // always ensure the leaving view is viewable
      // ******** DOM WRITE ****************
      leavingView._domShow(true, this._renderer);
    }

    // create the transition options
    const animationOpts: AnimationOptions = {
      animation: opts.animation,
      direction: opts.direction,
      duration: (opts.animate === false ? 0 : opts.duration),
      easing: opts.easing,
      renderDelay: opts.transitionDelay || this._trnsDelay,
      isRTL: this.config.platform.isRTL(),
      ev: opts.ev,
    };

    // initialize the transition
    trans.init();

    if ((!this._init && this._views.length === 1 && !this._isPortal) || this.config.get('animate') === false) {
      // the initial load shouldn't animate, unless it's a portal
      opts.animate = false;
    }
    if (opts.animate === false) {
      // if it was somehow set to not animation, then make the duration zero
      trans.duration(0);
    }

    // create a callback that needs to run within zone
    // that will fire off the willEnter/Leave lifecycle events at the right time
    trans.beforeAddRead(() => {
      this._zone.run(this._viewsWillLifecycles.bind(this, enteringView, leavingView));
    });

    // create a callback for when the animation is done
    trans.onFinish(() => {
      // transition animation has ended
      this._zone.run(this._transFinish.bind(this, trans, opts, done));
    });

    // get the set duration of this transition
    const duration = trans.getDuration();

    if (duration > DISABLE_APP_MINIMUM_DURATION) {
      // if this transition has a duration greater than XX
      // then set that this nav is actively transitioning
      this.setTransitioning(true, duration);
    }

    if (!trans.parent) {
      // this is the top most, or only active transition, so disable the app
      // add XXms to the duration the app is disabled when the keyboard is open

      if (duration > DISABLE_APP_MINIMUM_DURATION) {
        // if this transition has a duration and this is the root transition
        // then set that the app is actively disabled
        this._app.setEnabled(false, duration);
      }

      // cool, let's do this, start the transition
      if (opts.progressAnimation) {
        // this is a swipe to go back, just get the transition progress ready
        // kick off the swipe animation start
        trans.progressStart();

      } else {
        // only the top level transition should actually start "play"
        // kick it off and let it play through
        // ******** DOM WRITE ****************
        trans.play();
      }
    }
  }

  _viewsWillLifecycles(enteringView: ViewController, leavingView: ViewController) {
    // call each view's lifecycle events
    if (enteringView) {
      enteringView._willEnter();
      this.viewWillEnter.emit(enteringView);
      this._app.viewWillEnter.emit(enteringView);
    }

    if (leavingView) {
      leavingView._willLeave();
      this.viewWillLeave.emit(leavingView);
      this._app.viewWillLeave.emit(leavingView);
    }
  }

  _transFinish(trans: Transition, opts: NavOptions, resolve: TransitionResolveFn) {
    const hasCompleted = trans.hasCompleted;

    if (hasCompleted) {
      // transition has completed (went from 0 to 1)
      if (trans.enteringView) {
        trans.enteringView._didEnter();
        this.viewDidEnter.emit(trans.enteringView);
        this._app.viewDidEnter.emit(trans.enteringView);
      }

      if (trans.leavingView) {
        trans.leavingView._didLeave();
        this.viewDidLeave.emit(trans.leavingView);
        this._app.viewDidLeave.emit(trans.leavingView);
      }

      this._cleanup(trans.enteringView);
    }

    // update that this nav is no longer actively transitioning
    this.setTransitioning(false);

    if (!trans.parent) {
      // this is the root transition
      // it's save to destroy this transition
      this._transCtrl.destroy(trans.transId);

      // it's safe to enable the app again
      this._app.setEnabled(true);

      if (opts.updateUrl !== false) {
        // notify deep linker of the nav change
        // if a direction was provided and should update url
        this._linker.navChange(opts.direction);
      }

      if (opts.keyboardClose !== false && this._keyboard.isOpen()) {
        // the keyboard is still open!
        // no problem, let's just close for them
        this._keyboard.close();
      }
    }

    // congrats, we did it!
    resolve(hasCompleted);
  }

  /**
   * DOM WRITE
   */
  _cleanup(activeView: ViewController) {
    // ok, cleanup time!! Destroy all of the views that are
    // INACTIVE and come after the active view
    const activeViewIndex = this.indexOf(activeView);

    let reorderZIndexes = false;
    for (var i = this._views.length - 1; i >= 0; i--) {
      var view = this._views[i];
      if (i > activeViewIndex) {
        // this view comes after the active view
        // let's unload it
        view._willUnload();
        this.viewWillUnload.emit(view);
        this._app.viewWillUnload.emit(view);
        view._destroy(this._renderer)

      } else if (i < activeViewIndex) {
        // this view comes before the active view
        // ensure it is hidden
        view._domShow(false, this._renderer);
      }
      if (view._zIndex <= 0) {
        reorderZIndexes = true;
      }
    }

    if (!this._isPortal) {
      if (reorderZIndexes) {
        this._views.forEach(view => {
          // ******** DOM WRITE ****************
          view._setZIndex(view._zIndex + INIT_ZINDEX + 1, this._renderer);
        });
      }
    }
  }

  getActiveChildNav(): any {
    return this._children[this._children.length - 1];
  }

  registerChildNav(nav: any) {
    this._children.push(nav);
  }

  unregisterChildNav(nav: any) {
    const index = this._children.indexOf(nav);
    if (index > -1) {
      this._children.splice(index, 1);
    }
  }

  destroy() {
    for (var i = this._views.length - 1; i >= 0; i--) {
      this._views[i]._willUnload();
      this._views[i]._destroy(this._renderer);
    }
    this._views.length = 0;

    if (this.parent && this.parent.unregisterChildNav) {
      this.parent.unregisterChildNav(this);
    }
  }

  swipeBackStart() {
    // // default the direction to "back";;
    // const opts: NavOptions = {
    //   direction: DIRECTION_BACK,
    //   progressAnimation: true
    // };

    // // figure out the states of each view in the stack
    // const leavingView = this._remove(this._views.length - 1, 1);

    // if (leavingView) {
    //   opts.animation = leavingView.getTransitionName(opts.direction);

    //   // get the view thats ready to enter
    //   const enteringView = this.getByState(ViewState.INIT_ENTER);

    //   // start the transition, fire callback when done...
    //   this._transition(enteringView, leavingView, opts, (transitionResult: TransitionResult) => {
    //     // swipe back has finished!!
    //     console.debug('swipeBack, hasCompleted', transitionResult.hasCompleted);
    //   });
    // }
  }

  swipeBackProgress(stepValue: number) {
    // if (this._trans && this._sbGesture) {
    //   // continue to disable the app while actively dragging
    //   this._app.setEnabled(false, 4000);
    //   this.setTransitioning(true, 4000);

    //   // set the transition animation's progress
    //   this._trans.progressStep(stepValue);
    // }
  }

  swipeBackEnd(shouldComplete: boolean, currentStepValue: number) {
    // if (this._trans && this._sbGesture) {
    //   // the swipe back gesture has ended
    //   this._trans.progressEnd(shouldComplete, currentStepValue);
    // }
  }

  _sbCheck() {
    if (this._sbEnabled) {
      // this nav controller can have swipe to go back

      if (!this._sbGesture) {
        // create the swipe back gesture if we haven't already
        const opts = {
          edge: 'left',
          threshold: this._sbThreshold
        };
        this._sbGesture = new SwipeBackGesture(this.getNativeElement(), opts, this, this._gestureCtrl);
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

  canSwipeBack(): boolean {
    return (this._sbEnabled && !this.isTransitioning() && this._app.isEnabled() && this.canGoBack());
  }

  canGoBack(): boolean {
    const activeView = this.getActive();
    return (activeView && activeView.enableBack()) || false;
  }

  isTransitioning(): boolean {
    let transitionEndTime = this._transTm;
    let parent = this.parent;
    while (parent) {
      if (parent.trnsTime > transitionEndTime) {
        transitionEndTime = parent.trnsTime;
      }
      parent = parent.parent;
    }

    return (transitionEndTime > Date.now());
  }

  setTransitioning(isTransitioning: boolean, fallback: number = 700) {
    this._transTm = (isTransitioning ? Date.now() + fallback : 0);
  }

  getActive() {
    return this._views[this._views.length - 1];
  }

  isActive(view: ViewController) {
    return (view === this.getActive());
  }

  getByIndex(index: number): ViewController {
    return this._views[index];
  }

  getPrevious(view?: ViewController): ViewController {
    // returns the view controller which is before the given view controller.
    if (!view) {
      view = this.getActive();
    }
    return this._views[this.indexOf(view) - 1];
  }

  first(): ViewController {
    // returns the first view controller in this nav controller's stack.
    return this._views[0];
  }

  last(): ViewController {
    // returns the last page in this nav controller's stack.
    return this._views[this._views.length - 1];
  }

  indexOf(view: ViewController): number {
    // returns the index number of the given view controller.
    return this._views.indexOf(view);
  }

  length(): number {
    return this._views.length;
  }

  isSwipeBackEnabled(): boolean {
    return this._sbEnabled;
  }

  dismissPageChangeViews() {
    this._views.forEach(view => {
      if (view.data && view.data.dismissOnPageChange) {
        view.dismiss();
      }
    });
  }

  setViewport(val: ViewContainerRef) {
    this._viewport = val;
  }


  /**
   * @private
   * DEPRECATED: Please use app.getRootNav() instead
   */
  private get rootNav(): NavController {
    // deprecated 07-14-2016 beta.11
    console.warn('nav.rootNav() has been deprecated, please use app.getRootNav() instead');
    return this._app.getRootNav();
  }

  /**
   * @private
   * DEPRECATED: Please use inject the overlays controller and use the present method on the instance instead.
   */
  private present(): Promise<any> {
    // deprecated warning: added beta.11 2016-06-27
    console.warn('nav.present() has been deprecated.\n' +
                 'Please inject the overlay\'s controller and use the present method on the instance instead.');
    return Promise.resolve();
  }

}

let ctrlIds = -1;

const DISABLE_APP_MINIMUM_DURATION = 64;
