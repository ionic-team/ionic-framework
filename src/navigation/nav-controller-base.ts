import { ComponentRef, ComponentFactoryResolver, ElementRef, EventEmitter, NgZone, ReflectiveInjector, Renderer, ViewContainerRef } from '@angular/core';

import { AnimationOptions } from '../animations/animation';
import { App } from '../components/app/app';
import { Config } from '../config/config';
import { convertToView, convertToViews, NavOptions, DIRECTION_BACK, DIRECTION_FORWARD, INIT_ZINDEX,
         TransitionResolveFn, TransitionInstruction, ViewState } from './nav-util';
import { setZIndex } from './nav-util';
import { DeepLinker } from './deep-linker';
import { GestureController } from '../gestures/gesture-controller';
import { isBlank, isNumber, isPresent, assert } from '../util/util';
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
  _trnsTm: boolean = false;
  _viewport: ViewContainerRef;
  _views: ViewController[] = [];
  _zIndexOffset: number = 0;

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
    this._sbThreshold = config.getNumber('swipeBackThreshold', 0);

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

  popAll(): Promise<any[]> {
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

  removeView(viewController: ViewController, opts?: NavOptions, done?: Function): Promise<any> {
    return this.remove(this.indexOf(viewController), 1, opts, done);
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
      // transition has successfully resolved
      this._trnsId = null;
      this._init = true;
      resolve && resolve(hasCompleted, isAsync, enteringName, leavingName, direction);

      // let's see if there's another to kick off
      this.setTransitioning(false);
      this._sbCheck();
      this._nextTrns();
    };

    ti.reject = (rejectReason: any, trns: Transition) => {
      // rut row raggy, something rejected this transition
      this._trnsId = null;
      this._queue.length = 0;

      while (trns) {
        if (trns.enteringView && (trns.enteringView._state !== ViewState.LOADED)) {
          // destroy the entering views and all of their hopes and dreams
          this._destroyView(trns.enteringView);
        }
        if (!trns.parent) {
          break;
        }
      }

      if (trns) {
        this._trnsCtrl.destroy(trns.trnsId);
      }

      reject && reject(false, false, rejectReason);

      this.setTransitioning(false);
      this._sbCheck();
      this._nextTrns();
    };

    if (ti.insertViews) {
      // ensure we've got good views to insert
      ti.insertViews = ti.insertViews.filter(v => v !== null);
      if (ti.insertViews.length === 0) {
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

    assert(leavingView || enteringView, 'both leavingView and enteringView are null');

    // set that this nav is actively transitioning
    this.setTransitioning(true);

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
    assert(leavingView || enteringView, 'Both leavingView and enteringView are null');
    const opts = ti.opts || {};
    const insertViews = ti.insertViews;
    const removeStart = ti.removeStart;
    let view: ViewController;
    let i: number;
    let destroyQueue: ViewController[];

    // there are views to remove
    if (isPresent(removeStart)) {
      assert(removeStart >= 0, 'removeStart can not be negative');
      assert(ti.removeCount >= 0, 'removeCount can not be negative');
      destroyQueue = [];
      for (i = 0; i < ti.removeCount; i++) {
        view = this._views[i + removeStart];
        if (view && view !== enteringView && view !== leavingView) {
          destroyQueue.push(view);
        }
      }
      // default the direction to "back"
      opts.direction = opts.direction || DIRECTION_BACK;
    }

    const finalBalance = this._views.length + (insertViews ? insertViews.length : 0) - (destroyQueue ? destroyQueue.length : 0);
    assert(finalBalance >= 0, 'final balance can not be negative');
    if (finalBalance === 0 && !this._isPortal) {
      console.warn(`You can't remove all the pages in the navigation stack. nav.pop() is probably called too many times.`,
        this, this.getNativeElement());

      ti.reject && ti.reject('navigation stack needs at least one root page');
      return false;
    }

    // there are views to insert
    if (insertViews) {
      // manually set the new view's id if an id was passed in the options
      if (isPresent(opts.id)) {
        enteringView.id = opts.id;
      }

      // add the views to the
      for (i = 0; i < insertViews.length; i++) {
        view = insertViews[i];
        this._insertViewAt(view, ti.insertStart + i);
      }

      if (ti.enteringRequiresTransition) {
        // default to forward if not already set
        opts.direction = opts.direction || DIRECTION_FORWARD;
      }
    }

    // if the views to be removed are in the beginning or middle
    // and there is not a view that needs to visually transition out
    // then just destroy them and don't transition anything
    // batch all of lifecycles together
    // let's make sure, callbacks are zoned
    if (destroyQueue && destroyQueue.length > 0) {
      this._zone.run(() => {
        for (i = 0; i < destroyQueue.length; i++) {
          view = destroyQueue[i];
          this._willLeave(view);
          this._didLeave(view);
          this._willUnload(view);
        }
      });

      // once all lifecycle events has been delivered, we can safely detroy the views
      for (i = 0; i < destroyQueue.length; i++) {
        this._destroyView(destroyQueue[i]);
      }
    }

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
    this._preLoad(enteringView);
  }

  _viewAttachToDOM(view: ViewController, componentRef: ComponentRef<any>, viewport: ViewContainerRef) {
    assert(view._state === ViewState.INITIALIZED, 'view state must be INITIALIZED');

    // fire willLoad before change detection runs
    this._willLoad(view);

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

    // successfully finished loading the entering view
    // fire off the "didLoad" lifecycle events
    this._zone.run(this._didLoad.bind(this, view));
  }

  _viewTest(enteringView: ViewController, leavingView: ViewController, ti: TransitionInstruction) {
    const promises: Promise<any>[] = [];
    const reject = ti.reject;
    const resolve = ti.resolve;

    if (leavingView) {
      const leavingTestResult = leavingView._lifecycleTest('Leave');

      if (leavingTestResult === false) {
        // synchronous reject
        reject((leavingTestResult !== false ? leavingTestResult : `ionViewCanLeave rejected`));
        return false;
      } else if (leavingTestResult instanceof Promise) {
        // async promise
        promises.push(leavingTestResult);
      }
    }

    if (enteringView) {
      const enteringTestResult = enteringView._lifecycleTest('Enter');

      if (enteringTestResult === false) {
        // synchronous reject
        reject((enteringTestResult !== false ? enteringTestResult : `ionViewCanEnter rejected`));
        return false;
      } else if (enteringTestResult instanceof Promise) {
        // async promise
        promises.push(enteringTestResult);
      }
    }

    if (promises.length) {
      // darn, async promises, gotta wait for them to resolve
      Promise.all(promises)
        .then((values: any[]) => {
          if (values.some(result => result === false)) {
            reject(`ionViewCanEnter rejected`);
          } else {
            this._postViewInit(enteringView, leavingView, ti, resolve);
          }
        }).catch(reject);
    } else {
      // synchronous and all tests passed! let's move on already
      this._postViewInit(enteringView, leavingView, ti, resolve);
    }
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
    const transition = this._trnsCtrl.get(this._trnsId, enteringView, leavingView, animationOpts);

    // ensure any swipeback transitions are cleared out
    this._sbTrns && this._sbTrns.destroy();
    this._sbTrns = null;

    // swipe to go back root transition
    if (transition.isRoot() && opts.progressAnimation) {
      this._sbTrns = transition;
    }

    // transition start has to be registered before attaching the view to the DOM!
    transition.registerStart(() => {
      this._trnsStart(transition, enteringView, leavingView, opts, resolve);
      if (transition.parent) {
        transition.parent.start();
      }
    });

    if (enteringView && enteringView._state === ViewState.INITIALIZED) {
      // render the entering component in the DOM
      // this would also render new child navs/views
      // which may have their very own async canEnter/Leave tests
      // ******** DOM WRITE ****************
      this._viewAttachToDOM(enteringView, enteringView._cmp, this._viewport);
    } else {
      console.debug('enteringView state is not INITIALIZED', enteringView);
    }

    if (!transition.hasChildren) {
      // lowest level transition, so kick it off and let it bubble up to start all of them
      transition.start();
    }
  }

  _trnsStart(transition: Transition, enteringView: ViewController, leavingView: ViewController, opts: NavOptions, resolve: TransitionResolveFn) {
    this._trnsId = null;

    // set the correct zIndex for the entering and leaving views
    // ******** DOM WRITE ****************
    setZIndex(this, enteringView, leavingView, opts.direction, this._renderer);

    // always ensure the entering view is viewable
    // ******** DOM WRITE ****************
    enteringView && enteringView._domShow(true, this._renderer);

    // always ensure the leaving view is viewable
    // ******** DOM WRITE ****************
    leavingView && leavingView._domShow(true, this._renderer);

    // initialize the transition
    transition.init();

    // we should animate (duration > 0) if the pushed page is not the first one (startup)
    // or if it is a portal (modal, actionsheet, etc.)
    let isFirstPage = !this._init && this._views.length === 1;
    let shouldNotAnimate = isFirstPage && !this._isPortal;
    let canNotAnimate = this.config.get('animate') === false;
    if (shouldNotAnimate || canNotAnimate) {
      opts.animate = false;
    }

    if (opts.animate === false) {
      // if it was somehow set to not animation, then make the duration zero
      transition.duration(0);
    }

    // create a callback that needs to run within zone
    // that will fire off the willEnter/Leave lifecycle events at the right time
    transition.beforeAddRead(this._viewsWillLifecycles.bind(this, enteringView, leavingView));

    // create a callback for when the animation is done
    transition.onFinish(() => {
      // transition animation has ended
      this._zone.run(this._trnsFinish.bind(this, transition, opts, resolve));
    });

    // get the set duration of this transition
    const duration = transition.getDuration();

    // set that this nav is actively transitioning
    this.setTransitioning(true);

    if (transition.isRoot()) {
      // this is the top most, or only active transition, so disable the app
      // add XXms to the duration the app is disabled when the keyboard is open

      if (duration > DISABLE_APP_MINIMUM_DURATION) {
        // if this transition has a duration and this is the root transition
        // then set that the app is actively disabled
        this._app.setEnabled(false, duration + ACTIVE_TRANSITION_OFFSET);
      } else {
        console.debug('transition is running but app has not been disabled');
      }

      // cool, let's do this, start the transition
      if (opts.progressAnimation) {
        // this is a swipe to go back, just get the transition progress ready
        // kick off the swipe animation start
        transition.progressStart();

      } else {
        // only the top level transition should actually start "play"
        // kick it off and let it play through
        // ******** DOM WRITE ****************
        transition.play();
      }
    }
  }

  _viewsWillLifecycles(enteringView: ViewController, leavingView: ViewController) {
    if (enteringView || leavingView) {
      this._zone.run(() => {
        // Here, the order is important. WillLeave must called before WillEnter.
        leavingView && this._willLeave(leavingView);
        enteringView && this._willEnter(enteringView);
      });
    }
  }

  _trnsFinish(transition: Transition, opts: NavOptions, resolve: TransitionResolveFn) {
    // mainly for testing
    let enteringName: string;
    let leavingName: string;
    let hasCompleted = transition.hasCompleted;

    if (hasCompleted) {
      // transition has completed (went from 0 to 1)
      if (transition.enteringView) {
        enteringName = transition.enteringView.name;
        this._didEnter(transition.enteringView);
      }

      if (transition.leavingView) {
        leavingName = transition.leavingView.name;
        this._didLeave(transition.leavingView);
      }

      this._cleanup(transition.enteringView);
    } else {
      // If transition does not complete, we have to cleanup anyway, because
      // previous pages in the stack are not hidden probably.
      this._cleanup(transition.leavingView);
    }

    if (transition.isRoot()) {
      // this is the root transition
      // it's save to destroy this transition
      this._trnsCtrl.destroy(transition.trnsId);

      // it's safe to enable the app again
      this._app.setEnabled(true);

      if (opts.updateUrl !== false) {
        // notify deep linker of the nav change
        // if a direction was provided and should update url
        this._linker.navChange(opts.direction);
      }

      if (opts.keyboardClose !== false) {
        // the keyboard is still open!
        // no problem, let's just close for them
        this._keyboard.close();
      }
    }

    // congrats, we did it!
    resolve(hasCompleted, true, enteringName, leavingName, opts.direction);
  }

  _insertViewAt(view: ViewController, index: number) {
    var existingIndex = this._views.indexOf(view);
    if (existingIndex > -1) {
      // this view is already in the stack!!
      // move it to its new location
      this._views.splice(index, 0, this._views.splice(existingIndex, 1)[0]);

    } else {
      // this is a new view to add to the stack
      // create the new entering view
      view._setNav(this);

      // give this inserted view an ID
      this._ids++;
      if (!view.id) {
        view.id = `${this.id}-${this._ids}`;
      }

      // insert the entering view into the correct index in the stack
      this._views.splice(index, 0, view);
    }
  }

  _removeView(view: ViewController) {
    const views = this._views;
    const index = views.indexOf(view);
    assert(index > -1, 'view must be part of the stack');
    if (index > -1) {
      views.splice(index, 1);
    }
  }

  _destroyView(view: ViewController) {
    view._destroy(this._renderer);
    this._removeView(view);
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
        this._destroyView(view);

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

  _preLoad(view: ViewController) {
    assert(this.isTransitioning(), 'nav controller should be transitioning');

    view._preLoad();
  }

  _willLoad(view: ViewController) {
    assert(this.isTransitioning(), 'nav controller should be transitioning');

    view._willLoad();
  }

  _didLoad(view: ViewController) {
    assert(this.isTransitioning(), 'nav controller should be transitioning');
    assert(NgZone.isInAngularZone(), 'callback should be zoned');

    view._didLoad();
    this.viewDidLoad.emit(view);
    this._app.viewDidLoad.emit(view);
  }

  _willEnter(view: ViewController) {
    assert(this.isTransitioning(), 'nav controller should be transitioning');
    assert(NgZone.isInAngularZone(), 'callback should be zoned');

    view._willEnter();
    this.viewWillEnter.emit(view);
    this._app.viewWillEnter.emit(view);
  }

  _didEnter(view: ViewController) {
    assert(this.isTransitioning(), 'nav controller should be transitioning');
    assert(NgZone.isInAngularZone(), 'callback should be zoned');

    view._didEnter();
    this.viewDidEnter.emit(view);
    this._app.viewDidEnter.emit(view);
  }

  _willLeave(view: ViewController) {
    assert(this.isTransitioning(), 'nav controller should be transitioning');
    assert(NgZone.isInAngularZone(), 'callback should be zoned');

    view._willLeave();
    this.viewWillLeave.emit(view);
    this._app.viewWillLeave.emit(view);
  }

  _didLeave(view: ViewController) {
    assert(this.isTransitioning(), 'nav controller should be transitioning');
    assert(NgZone.isInAngularZone(), 'callback should be zoned');

    view._didLeave();
    this.viewDidLeave.emit(view);
    this._app.viewDidLeave.emit(view);
  }

  _willUnload(view: ViewController) {
    assert(this.isTransitioning(), 'nav controller should be transitioning');
    assert(NgZone.isInAngularZone(), 'callback should be zoned');

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
    for (var view of this._views) {
      view._willUnload();
      view._destroy(this._renderer);
    }
    // purge stack
    this._views.length = 0;

    // release swipe back gesture and transition
    this._sbGesture && this._sbGesture.destroy();
    this._sbTrns && this._sbTrns.destroy();
    this._sbGesture = this._sbTrns = null;

    // Unregister navcontroller
    if (this.parent && this.parent.unregisterChildNav) {
      this.parent.unregisterChildNav(this);
    }
  }

  swipeBackStart() {
    if (this.isTransitioning() || this._queue.length > 0) {
      return;
    }

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
      this._app.setEnabled(false, ACTIVE_TRANSITION_DEFAULT);
      this.setTransitioning(true);

      // set the transition animation's progress
      this._sbTrns.progressStep(stepValue);
    }
  }

  swipeBackEnd(shouldComplete: boolean, currentStepValue: number, velocity: number) {
    if (this._sbTrns && this._sbGesture) {
      // the swipe back gesture has ended
      const dur = this._sbTrns.getDuration() / (Math.abs(velocity) + 1);
      this._sbTrns.progressEnd(shouldComplete, currentStepValue, dur);
    }
  }

  _sbCheck() {
    if (!this._sbEnabled && this._isPortal) {
      return;
    }

    // this nav controller can have swipe to go back
    if (!this._sbGesture) {
      // create the swipe back gesture if we haven't already
      const opts = {
        edge: 'left',
        threshold: this._sbThreshold
      };
      this._sbGesture = new SwipeBackGesture(this, document.body, this._gestureCtrl, opts);
    }

    if (this.canSwipeBack()) {
      this._sbGesture.listen();
    } else {
      this._sbGesture.unlisten();
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
    return this._trnsTm;
  }

  setTransitioning(isTransitioning: boolean) {
    this._trnsTm = isTransitioning;
  }

  getActive(): ViewController {
    return this._views[this._views.length - 1];
  }

  isActive(view: ViewController): boolean {
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
    for (let view of this._views) {
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
const ACTIVE_TRANSITION_DEFAULT = 5000;
const ACTIVE_TRANSITION_OFFSET = 2000;
