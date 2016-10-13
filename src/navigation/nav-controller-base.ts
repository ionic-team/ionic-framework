import { ComponentRef, ComponentFactoryResolver, ElementRef, EventEmitter, NgZone, ReflectiveInjector, Renderer, ViewContainerRef } from '@angular/core';

import { AnimationOptions } from '../animations/animation';
import { App } from '../components/app/app';
import { Config } from '../config/config';
import { convertToView, convertToViews, NavOptions, DIRECTION_BACK, DIRECTION_FORWARD, INIT_ZINDEX,
         TransitionResolveFn, TransitionInstruction, ViewState } from './nav-util';
import { setZIndex } from './nav-util';
import { DeepLinker } from './deep-linker';
import { GestureController } from '../gestures/gesture-controller';
import { isBlank, isNumber, isPresent } from '../util/util';
import { isViewController, ViewController } from './view-controller';
import { Ion } from '../components/ion';
import { Keyboard } from '../util/keyboard';
import { NavController } from './nav-controller';
import { NavParams } from './nav-params';
import { SwipeBackGesture } from './swipe-back';
import { Transition } from '../transitions/transition';
import { TransitionController } from '../transitions/transition-controller';


/**
 * @private
 * This class is for internal use only. It is not exported publicly.
 */
export class NavControllerBase extends Ion implements NavController {
  _children: any[] = [];
  _ids: number = -1;
  _init = false;
  _isPortal: boolean;
  _queue: TransitionInstruction[] = [];
  _sbEnabled: boolean;
  _sbGesture: SwipeBackGesture;
  _sbThreshold: number;
  _sbTrns: Transition;
  _trnsId: number = null;
  _trnsTm: number = 0;
  _viewport: ViewContainerRef;
  _views: ViewController[] = [];

  viewDidLoad: EventEmitter<any> = new EventEmitter();
  viewWillEnter: EventEmitter<any> = new EventEmitter();
  viewDidEnter: EventEmitter<any> = new EventEmitter();
  viewWillLeave: EventEmitter<any> = new EventEmitter();
  viewDidLeave: EventEmitter<any> = new EventEmitter();
  viewWillUnload: EventEmitter<any> = new EventEmitter();

  id: string;

  constructor(
    public parent: any,
    public _app: App,
    public config: Config,
    public _keyboard: Keyboard,
    elementRef: ElementRef,
    public _zone: NgZone,
    renderer: Renderer,
    public _cfr: ComponentFactoryResolver,
    public _gestureCtrl: GestureController,
    public _trnsCtrl: TransitionController,
    public _linker: DeepLinker
  ) {
    super(config, elementRef, renderer);

    this._sbEnabled = config.getBoolean('swipeBackEnabled');
    this._sbThreshold = config.getNumber('swipeBackThreshold', 40);

    this.id = 'n' + (++ctrlIds);
  }

  push(page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrns({
      insertStart: -1,
      insertViews: [convertToView(this._linker, page, params)],
      opts: opts,
    }, done);
  }

  insert(insertIndex: number, page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrns({
      insertStart: insertIndex,
      insertViews: [convertToView(this._linker, page, params)],
      opts: opts,
    }, done);
  }

  insertPages(insertIndex: number, insertPages: any[], opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrns({
      insertStart: insertIndex,
      insertViews: convertToViews(this._linker, insertPages),
      opts: opts,
    }, done);
  }

  pop(opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrns({
      removeStart: -1,
      removeCount: 1,
      opts: opts,
    }, done);
  }

  popTo(indexOrViewCtrl: any, opts?: NavOptions, done?: Function): Promise<any> {
    const startIndex = isViewController(indexOrViewCtrl) ? this.indexOf(indexOrViewCtrl) : isNumber(indexOrViewCtrl) ? indexOrViewCtrl : -1;
    return this._queueTrns({
      removeStart: startIndex + 1,
      removeCount: -1,
      opts: opts,
    }, done);
  }

  popToRoot(opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrns({
      removeStart: 1,
      removeCount: -1,
      opts: opts,
    }, done);
  }

  popAll() {
    let promises: any[] = [];
    for (var i = this._views.length - 1; i >= 0; i--) {
      promises.push(this.pop(null));
    }
    return Promise.all(promises);
  }

  remove(startIndex: number, removeCount: number = 1, opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrns({
      removeStart: startIndex,
      removeCount: removeCount,
      opts: opts,
    }, done);
  }

  setRoot(pageOrViewCtrl: any, params?: any, opts?: NavOptions, done?: Function): Promise<any> {
    let viewControllers = [convertToView(this._linker, pageOrViewCtrl, params)];
    return this._setPages(viewControllers, opts, done);
  }

  setPages(pages: any[], opts?: NavOptions, done?: Function): Promise<any> {
    let viewControllers = convertToViews(this._linker, pages);
    return this._setPages(viewControllers, opts, done);
  }

  _setPages(viewControllers: ViewController[], opts?: NavOptions, done?: Function): Promise<any> {
    if (isBlank(opts)) {
      opts = {};
    }
    // if animation wasn't set to true then default it to NOT animate
    if (opts.animate !== true) {
      opts.animate = false;
    }
    return this._queueTrns({
      insertStart: 0,
      insertViews: viewControllers,
      removeStart: 0,
      removeCount: -1,
      opts: opts
    }, done);
  }

  _queueTrns(ti: TransitionInstruction, done: Function): Promise<any> {
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

    ti.resolve = (hasCompleted: boolean, isAsync: boolean, enteringName: string, leavingName: string, direction: string) => {
      this.setTransitioning(false);

      // transition has successfully resolved
      this._trnsId = null;
      resolve && resolve(hasCompleted, isAsync, enteringName, leavingName, direction);
      this._sbCheck();

      // let's see if there's another to kick off
      this._nextTrns();
    };

    ti.reject = (rejectReason: any, trns: Transition) => {
      this.setTransitioning(false);

      // rut row raggy, something rejected this transition
      this._trnsId = null;
      this._queue.length = 0;

      while (trns) {
        if (trns.enteringView && (trns.enteringView._state !== ViewState.LOADED)) {
          // destroy the entering views and all of their hopes and dreams
          trns.enteringView._destroy(this._renderer);
        }
        if (!trns.parent) break;
      }

      if (trns) {
        this._trnsCtrl.destroy(trns.trnsId);
      }

      this._sbCheck();

      reject && reject(false, false, rejectReason);

      this._nextTrns();
    };

    if (ti.insertViews) {
      // ensure we've got good views to insert
      ti.insertViews = ti.insertViews.filter(v => v !== null);
      if (!ti.insertViews.length) {
        ti.reject('invalid views to insert');
        return;
      }

    } else if (isPresent(ti.removeStart) && !this._views.length && !this._isPortal) {
      ti.reject('no views in the stack to be removed');
      return;
    }

    this._queue.push(ti);

    // if there isn't a transition already happening
    // then this will kick off this transition
    this._nextTrns();

    // promise is undefined if a done callbacks was provided
    return promise;
  }

  _nextTrns(): boolean {
    // this is the framework's bread 'n butta function
    // only one transition is allowed at any given time
    if (this.isTransitioning()) {
      return false;
    }

    // there is no transition happening right now
    // get the next instruction
    const ti = this._nextTI();
    if (!ti) {
      return false;
    }

    // Get entering and leaving views
    const leavingView = this.getActive();
    const enteringView = this._getEnteringView(ti, leavingView);

    // Initialize enteringView
    if (enteringView && isBlank(enteringView._state)) {
      // render the entering view, and all child navs and views
      // ******** DOM WRITE ****************
      this._viewInit(enteringView);
    }

    // Only test canLeave/canEnter if there is transition
    let requiresTransition = (ti.enteringRequiresTransition || ti.leavingRequiresTransition) && enteringView !== leavingView;
    if (requiresTransition) {
      // views have been initialized, now let's test
      // to see if the transition is even allowed or not
      return this._viewTest(enteringView, leavingView, ti);

    } else {
      this._postViewInit(enteringView, leavingView, ti, ti.resolve);
      return true;
    }
  }

  _nextTI(): TransitionInstruction {
    const ti = this._queue.shift();
    if (!ti) {
      return null;
    }
    const viewsLength = this._views.length;

    if (isPresent(ti.removeStart)) {
      if (ti.removeStart < 0) {
        ti.removeStart = (viewsLength - 1);
      }
      if (ti.removeCount < 0) {
        ti.removeCount = (viewsLength - ti.removeStart);
      }
      ti.leavingRequiresTransition = ((ti.removeStart + ti.removeCount) === viewsLength);
    }

    if (ti.insertViews) {
      // allow -1 to be passed in to auto push it on the end
      // and clean up the index if it's larger then the size of the stack
      if (ti.insertStart < 0 || ti.insertStart > viewsLength) {
        ti.insertStart = viewsLength;
      }
      ti.enteringRequiresTransition = (ti.insertStart === viewsLength);
    }
    return ti;
  }

  _getEnteringView(ti: TransitionInstruction, leavingView: ViewController): ViewController {
    const insertViews = ti.insertViews;
    if (insertViews) {
      // grab the very last view of the views to be inserted
      // and initialize it as the new entering view
      return insertViews[insertViews.length - 1];
    }

    const removeStart = ti.removeStart;
    if (isPresent(removeStart)) {
      let views = this._views;
      const removeEnd = removeStart + ti.removeCount;
      for (var i = views.length - 1; i >= 0; i--) {
        var view = views[i];
        if ((i < removeStart || i >= removeEnd) && view !== leavingView) {
          return view;
        }
      }
    }
    return null;
  }

  _postViewInit(enteringView: ViewController, leavingView: ViewController, ti: TransitionInstruction, resolve: TransitionResolveFn) {
    const opts = ti.opts || {};

    const insertViews = ti.insertViews;
    const removeStart = ti.removeStart;

    let destroyQueue: ViewController[] = [];

    if (isPresent(removeStart)) {
      for (var i = 0; i < ti.removeCount; i++) {
        destroyQueue.push(this._views[i + removeStart]);
      }
      // default the direction to "back"
      opts.direction = opts.direction || DIRECTION_BACK;
    }

    if (insertViews) {
      // manually set the new view's id if an id was passed in the options
      if (isPresent(opts.id)) {
        enteringView.id = opts.id;
      }

      // add the views to the
      for (var i = 0; i < insertViews.length; i++) {
        var view = insertViews[i];

        var existingIndex = this._views.indexOf(view);
        if (existingIndex > -1) {
          // this view is already in the stack!!
          // move it to its new location
          this._views.splice(ti.insertStart + i, 0, this._views.splice(existingIndex, 1)[0]);

        } else {
          // this is a new view to add to the stack
          // create the new entering view
          view._setNav(this);

          // give this inserted view an ID
          view.id = this.id + '-' + (++this._ids);

          // insert the entering view into the correct index in the stack
          this._views.splice(ti.insertStart + i, 0, view);
        }
      }

      if (ti.enteringRequiresTransition) {
        // default to forward if not already set
        opts.direction = opts.direction || DIRECTION_FORWARD;
      }
    }

    // if the views to be removed are in the beginning or middle
    // and there is not a view that needs to visually transition out
    // then just destroy them and don't transition anything
    for (var i = 0; i < destroyQueue.length; i++) {
      // batch all of lifecycles together
      var view = destroyQueue[i];
      if (view && view !== enteringView && view !== leavingView) {
        this._willLeave(view);
        this._didLeave(view);
        this._willUnload(view);
      }
    }
    for (var i = 0; i < destroyQueue.length; i++) {
      // batch all of the destroys together
      var view = destroyQueue[i];
      if (view && view !== enteringView && view !== leavingView) {
        view._destroy(this._renderer);
      }
    }
    destroyQueue.length = 0;

    if (ti.enteringRequiresTransition || ti.leavingRequiresTransition && enteringView !== leavingView) {
      // set which animation it should use if it wasn't set yet
      if (!opts.animation) {
        if (isPresent(ti.removeStart)) {
          opts.animation = (leavingView || enteringView).getTransitionName(opts.direction);
        } else {
          opts.animation = (enteringView || leavingView).getTransitionName(opts.direction);
        }
      }

      // huzzah! let us transition these views
      this._transition(enteringView, leavingView, opts, resolve);

    } else {
      // they're inserting/removing the views somewhere in the middle or
      // beginning, so visually nothing needs to animate/transition
      // resolve immediately because there's no animation that's happening
      resolve(true, false);
    }
  }

  /**
   * DOM WRITE
   */
  _viewInit(enteringView: ViewController) {
    // entering view has not been initialized yet
    const componentProviders = ReflectiveInjector.resolve([
      { provide: NavController, useValue: this },
      { provide: ViewController, useValue: enteringView },
      { provide: NavParams, useValue: enteringView.getNavParams() }
    ]);
    const componentFactory = this._cfr.resolveComponentFactory(enteringView.component);
    const childInjector = ReflectiveInjector.fromResolvedProviders(componentProviders, this._viewport.parentInjector);

    // create ComponentRef and set it to the entering view
    enteringView.init(componentFactory.create(childInjector, []));
    enteringView._state = ViewState.INITIALIZED;
    this._willLoad(enteringView);
  }

  _viewTest(enteringView: ViewController, leavingView: ViewController, ti: TransitionInstruction) {
    const promises: Promise<any>[] = [];
    const reject = ti.reject;
    const resolve = ti.resolve;

    if (leavingView) {
      const leavingTestResult = leavingView._lifecycleTest('Leave');

      if (isPresent(leavingTestResult) && leavingTestResult !== true) {
        if (leavingTestResult instanceof Promise) {
          // async promise
          promises.push(leavingTestResult);

        } else {
          // synchronous reject
          reject((leavingTestResult !== false ? leavingTestResult :  `ionViewCanLeave rejected`));
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
          reject((enteringTestResult !== false ? enteringTestResult :  `ionViewCanEnter rejected`));
          return false;
        }
      }
    }

    if (promises.length) {
      // darn, async promises, gotta wait for them to resolve
      Promise.all(promises).then(() => {
        // all promises resolved! let's continue
        this._postViewInit(enteringView, leavingView, ti, resolve);

      }).catch(reject);
      return true;
    }

    // synchronous and all tests passed! let's move on already
    this._postViewInit(enteringView, leavingView, ti, resolve);
    return true;
  }

  _transition(enteringView: ViewController, leavingView: ViewController, opts: NavOptions, resolve: TransitionResolveFn) {
    // figure out if this transition is the root one or a
    // child of a parent nav that has the root transition
    this._trnsId = this._trnsCtrl.getRootTrnsId(this);
    if (this._trnsId === null) {
      // this is the root transition, meaning all child navs and their views
      // should be added as a child transition to this one
      this._trnsId = this._trnsCtrl.nextId();
    }

    // create the transition options
    const animationOpts: AnimationOptions = {
      animation: opts.animation,
      direction: opts.direction,
      duration: (opts.animate === false ? 0 : opts.duration),
      easing: opts.easing,
      isRTL: this.config.platform.isRTL(),
      ev: opts.ev,
    };

    // create the transition animation from the TransitionController
    // this will either create the root transition, or add it as a child transition
    const trns = this._trnsCtrl.get(this._trnsId, enteringView, leavingView, animationOpts);

    // ensure any swipeback transitions are cleared out
    this._sbTrns && this._sbTrns.destroy();

    if (trns.parent) {
      // this is important for later to know if there
      // are any more child tests to check for
      trns.parent.hasChildTrns = true;

    } else {
      // this is the root transition
      if (opts.progressAnimation) {
        this._sbTrns = trns;
      }
    }

    trns.registerStart(() => {
      this._trnsStart(trns, enteringView, leavingView, opts, resolve);
      if (trns.parent) {
        trns.parent.start();
      }
    });

    if (enteringView && enteringView._state === ViewState.INITIALIZED) {
      // render the entering component in the DOM
      // this would also render new child navs/views
      // which may have their very own async canEnter/Leave tests
      // ******** DOM WRITE ****************
      this._viewInsert(enteringView, enteringView._cmp, this._viewport);
    }

    if (!trns.hasChildTrns) {
      // lowest level transition, so kick it off and let it bubble up to start all of them
      trns.start();
    }
  }

  _viewInsert(view: ViewController, componentRef: ComponentRef<any>, viewport: ViewContainerRef) {
    // successfully finished loading the entering view
    // fire off the "didLoad" lifecycle events
    this._didLoad(view);

    // render the component ref instance to the DOM
    // ******** DOM WRITE ****************
    viewport.insert(componentRef.hostView, viewport.length);
    view._state = ViewState.PRE_RENDERED;

    if (view._cssClass) {
      // the ElementRef of the actual ion-page created
      var pageElement = componentRef.location.nativeElement;

      // ******** DOM WRITE ****************
      this._renderer.setElementClass(pageElement, view._cssClass, true);
    }

    componentRef.changeDetectorRef.detectChanges();
  }

  _trnsStart(trns: Transition, enteringView: ViewController, leavingView: ViewController, opts: NavOptions, resolve: TransitionResolveFn) {
    this._trnsId = null;

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

    // initialize the transition
    trns.init();

    if ((!this._init && this._views.length === 1 && !this._isPortal) || this.config.get('animate') === false) {
      // the initial load shouldn't animate, unless it's a portal
      opts.animate = false;
    }
    if (opts.animate === false) {
      // if it was somehow set to not animation, then make the duration zero
      trns.duration(0);
    }

    // create a callback that needs to run within zone
    // that will fire off the willEnter/Leave lifecycle events at the right time
    trns.beforeAddRead(() => {
      this._zone.run(this._viewsWillLifecycles.bind(this, enteringView, leavingView));
    });

    // create a callback for when the animation is done
    trns.onFinish(() => {
      // transition animation has ended
      this._zone.run(this._trnsFinish.bind(this, trns, opts, resolve));
    });

    // get the set duration of this transition
    const duration = trns.getDuration();

    // set that this nav is actively transitioning
    this.setTransitioning(true, duration);

    if (!trns.parent) {
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
        trns.progressStart();

      } else {
        // only the top level transition should actually start "play"
        // kick it off and let it play through
        // ******** DOM WRITE ****************
        trns.play();
      }
    }
  }

  _viewsWillLifecycles(enteringView: ViewController, leavingView: ViewController) {
    // call each view's lifecycle events
    enteringView && this._willEnter(enteringView);
    leavingView && this._willLeave(leavingView);
  }

  _trnsFinish(trns: Transition, opts: NavOptions, resolve: TransitionResolveFn) {
    const hasCompleted = trns.hasCompleted;

    // mainly for testing
    let enteringName: string;
    let leavingName: string;

    if (hasCompleted) {
      // transition has completed (went from 0 to 1)
      if (trns.enteringView) {
        enteringName = trns.enteringView.name;
        this._didEnter(trns.enteringView);
      }

      if (trns.leavingView) {
        leavingName = trns.leavingView.name;
        this._didLeave(trns.leavingView);
      }

      this._cleanup(trns.enteringView);
    }

    if (!trns.parent) {
      // this is the root transition
      // it's save to destroy this transition
      this._trnsCtrl.destroy(trns.trnsId);

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
    resolve(hasCompleted, true, enteringName, leavingName, opts.direction);
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
        this._willUnload(view);
        view._destroy(this._renderer);

      } else if (i < activeViewIndex && !this._isPortal) {
        // this view comes before the active view
        // and it is not a portal then ensure it is hidden
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

  _willLoad(view: ViewController) {
    view._willLoad();
  }

  _didLoad(view: ViewController) {
    view._didLoad();
    this.viewDidLoad.emit(view);
    this._app.viewDidLoad.emit(view);
  }

  _willEnter(view: ViewController) {
    view._willEnter();
    this.viewWillEnter.emit(view);
    this._app.viewWillEnter.emit(view);
  }

  _didEnter(view: ViewController) {
    view._didEnter();
    this.viewDidEnter.emit(view);
    this._app.viewDidEnter.emit(view);
  }

  _willLeave(view: ViewController) {
    view._willLeave();
    this.viewWillLeave.emit(view);
    this._app.viewWillLeave.emit(view);
  }

  _didLeave(view: ViewController) {
    view._didLeave();
    this.viewDidLeave.emit(view);
    this._app.viewDidLeave.emit(view);
  }

  _willUnload(view: ViewController) {
    view._willUnload();
    this.viewWillUnload.emit(view);
    this._app.viewWillUnload.emit(view);
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

    this._sbGesture && this._sbGesture.destroy();
    this._sbTrns && this._sbTrns.destroy();
    this._sbGesture = this._sbTrns = null;

    if (this.parent && this.parent.unregisterChildNav) {
      this.parent.unregisterChildNav(this);
    }
  }

  swipeBackStart() {
    if (this.isTransitioning() || this._queue.length > 0) return;

    // default the direction to "back";
    const opts: NavOptions = {
      direction: DIRECTION_BACK,
      progressAnimation: true
    };

    this._queueTrns({
      removeStart: -1,
      removeCount: 1,
      opts: opts,
    }, null);

  }

  swipeBackProgress(stepValue: number) {
    if (this._sbTrns && this._sbGesture) {
      // continue to disable the app while actively dragging
      this._app.setEnabled(false, ACTIVE_TRANSITION_MAX_TIME);
      this.setTransitioning(true, ACTIVE_TRANSITION_MAX_TIME);

      // set the transition animation's progress
      this._sbTrns.progressStep(stepValue);
    }
  }

  swipeBackEnd(shouldComplete: boolean, currentStepValue: number) {
    if (this._sbTrns && this._sbGesture) {
      // the swipe back gesture has ended
      this._sbTrns.progressEnd(shouldComplete, currentStepValue);
    }
  }

  _sbCheck() {
    if (this._sbEnabled && !this._isPortal) {
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
    return (this._sbEnabled &&
           !this._children.length &&
           !this.isTransitioning() &&
            this._app.isEnabled() &&
            this.canGoBack());
  }

  canGoBack(): boolean {
    const activeView = this.getActive();
    return !!(activeView && activeView.enableBack()) || false;
  }

  isTransitioning(): boolean {
    if (this._trnsTm === 0) {
      return false;
    }
    // using a timestamp instead of boolean incase something goes wrong
    return (this._trnsTm > Date.now());
  }

  setTransitioning(isTransitioning: boolean, durationPadding: number = 2000) {
    this._trnsTm = (isTransitioning ? (Date.now() + durationPadding + ACTIVE_TRANSITION_OFFSET) : 0);
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

  /**
   * Return the stack of views in this NavController.
   */
  getViews(): Array<ViewController> {
    return this._views;
  }

  isSwipeBackEnabled(): boolean {
    return this._sbEnabled;
  }

  dismissPageChangeViews() {
    for (var i = 0; i < this._views.length; i++) {
      var view = this._views[i];
      if (view.data && view.data.dismissOnPageChange) {
        view.dismiss();
      }
    }
  }

  setViewport(val: ViewContainerRef) {
    this._viewport = val;
  }

}

let ctrlIds = -1;

const DISABLE_APP_MINIMUM_DURATION = 64;
const ACTIVE_TRANSITION_MAX_TIME = 5000;
const ACTIVE_TRANSITION_OFFSET = 2000;
