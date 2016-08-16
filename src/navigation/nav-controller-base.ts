import { ComponentRef, ComponentFactoryResolver, ElementRef, EventEmitter, NgZone, ReflectiveInjector, Renderer, ViewContainerRef } from '@angular/core';

import { AnimationOptions } from '../animations/animation';
import { App } from '../components/app/app';
import { Config } from '../config/config';
import { TransitionDone, NavInstruction, TransitionResult, convertToViews, NavOptions, DIRECTION_BACK, DIRECTION_FORWARD, INIT_ZINDEX, PORTAL_ZINDEX, TestResult } from './nav-util';
import { isTabs, setZIndex } from './nav-util';
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
  _queue: NavInstruction[] = [];
  _activeTrans: boolean;
  rootTransId: string = null;

  viewDidLoad: EventEmitter<any>;
  viewWillEnter: EventEmitter<any>;
  viewDidEnter: EventEmitter<any>;
  viewWillLeave: EventEmitter<any>;
  viewDidLeave: EventEmitter<any>;
  viewWillUnload: EventEmitter<any>;

  id: string;
  parent: any;
  config: Config;
  trnsTime: number = 0;

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

  setViewport(val: ViewContainerRef) {
    this._viewport = val;
  }

  setRoot(page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any> {
    return this.setPages([{page, params}], opts, done);
  }

  setPages(pages: Array<{page: any, params?: any}>, opts?: NavOptions, done?: Function): Promise<any> {
    let promise: Promise<any>;
    if (!done) {
      // only create a promise if a done callback wasn't provided
      promise = new Promise(res => { done = res; });
    }

    // remove existing views
    //const leavingView = this._remove(0, this._views.length);

    // create view controllers out of the pages and insert the new views
    const views = convertToViews(this._linker, pages);

    if (!views.length) {
      done({
        hasCompleted: false
      });
      return;
    }
  }

  push(page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrans({
      startIndex: -1,
      removeCount: 0,
      opts: opts,
      insertViews: convertToViews(this._linker, [{page: page, params: params}]),
      done: <TransitionDone>done,
    });
  }

  insert(insertIndex: number, page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrans({
      startIndex: insertIndex,
      removeCount: 0,
      opts: opts,
      insertViews: convertToViews(this._linker, [{page: page, params: params}]),
      done: <TransitionDone>done,
    });
  }

  insertPages(insertIndex: number, insertPages: Array<{page: any, params?: any}>, opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrans({
      startIndex: insertIndex,
      removeCount: 0,
      opts: opts,
      insertViews: convertToViews(this._linker, insertPages),
      done: <TransitionDone>done,
    });
  }

  insertViews(insertIndex: number, insertViews: ViewController[], opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrans({
      startIndex: insertIndex,
      removeCount: 0,
      opts: opts,
      insertViews: insertViews,
      done: <TransitionDone>done,
    });
  }

  _insertViews(insertIndex: number, insertViews: ViewController[], opts: NavOptions, done: TransitionDone): void {
    if (!insertViews || !insertViews.length) {
      return done({
        hasCompleted: false,
        rejectReason: 'Invalid number of views to insert'
      });
    }

    const viewsOriginalLength = this._views.length;

    // allow -1 to be passed in to auto push it on the end
    // and clean up the index if it's larger then the size of the stack
    if (insertIndex < 0 || insertIndex > viewsOriginalLength) {
      insertIndex = viewsOriginalLength;
    }

    // get the currently active view
    const leavingView = this.getActive();

    // add the views to the
    insertViews.forEach((view, i) => {
      // create the new entering view
      view._setNav(this);

      // give this inserted view an ID
      view.id = this.id + '-' + (++this._ids);

      // insert the entering view into the correct index in the stack
      this._views.splice(insertIndex + i, 0, view);
    });

    if (insertIndex < viewsOriginalLength) {
      // they're inserting the views somewhere in the middle or
      // beginning, so visually nothing needs to animate/transition
      // resolve immediately because there's no animation that's happening
      return done({ hasCompleted: true });
    }

    if (isBlank(opts)) {
      opts = {};
    }

    // grab the very last view of the views to be inserted
    // and initialize it as the new entering view
    const enteringView = insertViews[insertViews.length - 1];

    // manually set the new view's id if an id was passed in the options
    if (isPresent(opts.id)) {
      enteringView.id = opts.id;
    }

    // set the nav direction to "forward" if it wasn't set
    opts.direction = opts.direction || DIRECTION_FORWARD;

    // set which animation it should use if it wasn't set yet
    if (!opts.animation) {
      opts.animation = enteringView.getTransitionName(opts.direction);
    }

    // huzzah! let us transition these views
    this._transition(enteringView, leavingView, opts, done);
  }

  pop(opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrans({
      startIndex: -1,
      removeCount: 1,
      opts: opts,
      insertViews: null,
      done: <TransitionDone>done,
    });
  }

  popToRoot(opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrans({
      startIndex: 1,
      removeCount: -1,
      opts: opts,
      insertViews: null,
      done: <TransitionDone>done,
    });
  }

  popTo(view: ViewController, opts?: NavOptions, done?: Function): Promise<any> {
    const startIndex = this.indexOf(view);
    const removeCount = this.indexOf(this.getActive()) - startIndex;
    return this._queueTrans({
      startIndex: startIndex + 1,
      removeCount: removeCount,
      opts: opts,
      insertViews: null,
      done: <TransitionDone>done,
    });
  }

  remove(startIndex: number = -1, removeCount: number = 1, opts?: NavOptions, done?: Function): Promise<any> {
    return this._queueTrans({
      startIndex: startIndex,
      removeCount: removeCount,
      opts: opts,
      insertViews: null,
      done: <TransitionDone>done,
    });
  }

  _removeViews(startIndex: number, removeCount: number, opts: NavOptions, done: TransitionDone): void {
    const viewLength = this._views.length;

    if (startIndex === -1) {
      startIndex = (viewLength - 1);
    }

    if (startIndex < 0 || startIndex >= viewLength || removeCount < 1) {
      return done({
        hasCompleted: false,
        rejectReason: 'Invalid index to remove views'
      });
    }

    if (!this._isPortal && startIndex === 0) {
      return done({
        hasCompleted: false,
        rejectReason: 'Cannot pop first view in the nav stack'
      });
    }

    let doTransition = false;
    if (startIndex + removeCount >= viewLength) {
      removeCount =- 1;
      doTransition = true;
    }

    // if the views to be removed are in the beginning or middle
    // and there is not a view that needs to visually transition out
    // then just destroy them and don't transition anything
    this._views.splice(startIndex, removeCount).forEach(view => {
      view._willLeave();
      this.viewWillLeave.emit(view);
      this._app.viewWillLeave.emit(view);

      view._didLeave();
      this.viewDidLeave.emit(view);
      this._app.viewDidLeave.emit(view);

      view._willUnload(this._renderer);
      this.viewWillUnload.emit(view);
      this._app.viewWillUnload.emit(view);
    });

    if (!doTransition) {
      return done({ hasCompleted: true });
    }

    const leavingView = this.getActive();
    const enteringView = this.getPrevious(leavingView);

    if (isBlank(opts)) {
      opts = {};
    }

    // if not set, by default climb up the nav controllers if
    // there isn't a previous view in this nav controller
    if (isBlank(opts.climbNav)) {
      opts.climbNav = true;
    }

    // default the direction to "back"
    opts.direction = opts.direction || DIRECTION_BACK;

    this._transition(enteringView, leavingView, opts, done);
  }

  _queueTrans(instruction: NavInstruction): Promise<any> {
    let promise: Promise<any>;

    if (instruction.done === null) {
      // a null callback can be passed in if we know we don't
      // care about running a promise that comes with the overhead
      instruction.done = noop;

    } else if (!instruction.done) {
      // only create a promise if a done callback wasn't provided
      let resolve: Function;
      let reject: Function;
      promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });

      instruction.done = (transResult: TransitionResult) => {
        if (isPresent(transResult.rejectReason)) {
          reject(transResult.rejectReason);
        } else {
          resolve();
        }
      };
    }

    this._queue.push(instruction);

    // if there isn't a transitoin already happening
    // then this will kick off this transition
    this._nextTrans();

    // promise is undefined if a done callbacks was provided
    return promise;
  }

  _nextTrans() {
    // only one transition is allowed at any given time
    if (!this._activeTrans) {
      // there is no transition happening right now
      // get the next instruction
      const instruction = this._queue.shift();
      if (instruction) {
        // we've got new instructions for the next transition
        if (instruction.insertViews) {
          // this transition is to insert views
          this._insertViews(instruction.startIndex, instruction.insertViews, instruction.opts, instruction.done);

        } else if (instruction.removeCount > 0) {
          // this transition is to remove views
          this._removeViews(instruction.startIndex, instruction.removeCount, instruction.opts, instruction.done);
        }

        instruction.done = instruction.opts = instruction.insertViews = null;
      }
    }
  }

  _transition(enteringView: ViewController, leavingView: ViewController, opts: NavOptions, done: TransitionDone): void {
    if (enteringView === leavingView) {
      // if the entering view and leaving view are the same thing for whatever reason
      return done({
        hasCompleted: false,
         rejectReason: 'Entering and leaving views are the same'
      });
    }

    this._activeTrans = true;

    // figure out if this transition is the root one or a
    // child of a parent nav that has the root transition
    let transId = this.rootTransId = this._transCtrl.getRootTransId(this);
    if (this.rootTransId === null) {
      // this is the root transition, meaning all child navs and their views
      // should be added as a child transition to this one
      transId = this.rootTransId = Date.now().toString();
    }

    // create the transition animation from the TransitionController
    // this will either create the root transition, or add it as a child transition
    const trans = this._transCtrl.get(transId, opts.animation);

    // not using promises on purpose to avoid the async
    // tick allowing the browser to do an unwanted layout/paint
    let enterTest: TestResult = null;
    let leaveTest: TestResult = null;

    const viewResults: ViewInitDone = (enterTestResult: TestResult, leaveTestResult: TestResult) => {
      if (enterTestResult !== null) enterTest = enterTestResult;
      if (leaveTestResult !== null) leaveTest = leaveTestResult;

      if (enterTest && leaveTest) {
        // awesome, we've gotten results for both the entering and leaving views
        // if this is the root transition, then at this point
        // all child navs and views have been rendered, so we can
        // safely reset rootTransId back to null for the next transition
        this.rootTransId = null;

        // continue and see if both views can be transitioned in
        this._postViewInit(trans, enterTest, enteringView, leaveTest, leavingView, opts, done);
      }
    }

    // render the entering view, and all child navs and views
    // ******** DOM WRITE ****************
    this._render(enteringView, leavingView, opts, viewResults);
  }

  /**
   * DOM WRITE
   */
  _render(enteringView: ViewController, leavingView: ViewController, opts: NavOptions, viewInitDone: ViewInitDone) {
    // not using promises on purpose to avoid the async
    // tick allowing the browser to do an unwanted repaint

    if (enteringView) {
      // this transition has an entering view
      // it could already be initialized
      // or it still needs to be initialized

      if (!enteringView._loaded && enteringView.componentType) {
        // entering view has not been initialized yet
        // after being initialized, it'll do the can enter test
        // code for the can enter test to be async

        // add more providers to just this page
        const componentProviders = ReflectiveInjector.resolve([
          { provide: NavController, useValue: this },
          { provide: ViewController, useValue: enteringView },
          { provide: NavParams, useValue: enteringView.getNavParams() }
        ]);

        const componentFactory = this._cfr.resolveComponentFactory(enteringView.componentType);
        const childInjector = ReflectiveInjector.fromResolvedProviders(componentProviders, this._viewport.parentInjector);

        // create ComponentRef instance
        // this does not render to the DOM yet
        enteringView.init(componentFactory.create(childInjector, []));

        // test if this view can activate
        // this is done before ionViewDidLoad
        // and before the component is rendered in the DOM
        // canActivate can be sync or async
        enteringView._lifecycleTest(enteringView, 'Enter', (enteringTestResult: TestResult) => {
          viewInitDone(enteringTestResult, null);
        });

      } else {
        // entering view is already initialized or there is no componentType
        // test if it can enter, no need to pass ComponentRef
        enteringView._lifecycleTest(enteringView, 'Enter', (enteringTestResult: TestResult) => {
          viewInitDone(enteringTestResult, null);
        });
      }

    } else {
      // no entering view for this transition
      viewInitDone({ valid: true }, null);
    }

    if (leavingView) {
      // test if it can leave
      leavingView._lifecycleTest(enteringView, 'Leave', (leavingTestResult: TestResult) => {
        viewInitDone(null, leavingTestResult);
      });

    } else {
      // no leaving view for this transition
      viewInitDone(null, { valid: true });
    }
  }

  _postViewInit(trans: Transition, enterTest: TestResult, enteringView: ViewController, leaveTest: TestResult, leavingView: ViewController, opts: NavOptions, done: TransitionDone): void {
    if (!enterTest.valid || !leaveTest.valid) {
      // did not pass the enter or leave test
      console.debug(`_postViewInit, enterTest.valid: ${enterTest.valid}, leaveTest.valid: ${leaveTest.valid}`)
      return done({
        hasCompleted: false,
        rejectReason: !enterTest.valid ? enterTest.rejectReason : leaveTest.rejectReason
      });
    }

    // passed both the enter and leave tests
    if (!enteringView._loaded) {
      // render the entering component in the DOM
      // ******** DOM WRITE ****************
      this._viewInsert(enteringView, enteringView._cmp, this._viewport);
    }

    // set the correct zIndex for the entering and leaving views
    // ******** DOM WRITE ****************
    setZIndex(this, enteringView, leavingView, opts.direction, this._renderer);

    // always ensure the entering view is viewable
    // ******** DOM WRITE ****************
    enteringView._domShow(true, this._renderer);

    if (leavingView) {
      // always ensure the leaving view is viewable
      // ******** DOM WRITE ****************
      leavingView._domShow(true, this._renderer);
    }

    // ******** DOM WRITE ****************
    this._transStart(trans, enteringView, leavingView, opts, done);
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

  _transStart(trans: Transition, enteringView: ViewController, leavingView: ViewController, opts: NavOptions, done: TransitionDone) {
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

    // initialize the transition with the entering/leaving views
    trans.init(enteringView, leavingView, animationOpts);

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
    enteringView._willEnter();
    this.viewWillEnter.emit(enteringView);
    this._app.viewWillEnter.emit(enteringView);

    if (leavingView) {
      leavingView._willLeave();
      this.viewWillLeave.emit(leavingView);
      this._app.viewWillLeave.emit(leavingView);
    }
  }

  _transFinish(trans: Transition, opts: NavOptions, done: TransitionDone) {
    const hasCompleted = trans.hasCompleted;

    if (hasCompleted) {
      // transition has completed (went from 0 to 1)
      trans.enteringView._didEnter();
      this.viewDidEnter.emit(trans.enteringView);
      this._app.viewDidEnter.emit(trans.enteringView);

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
      trans.destroy();

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

    done({ hasCompleted: hasCompleted });

    this._activeTrans = false;
    this._nextTrans();
  }

  /**
   * DOM WRITE
   */
  _cleanup(activeView: ViewController) {
    // ok, cleanup time!! Destroy all of the views that are
    // INACTIVE and come after the active view
    const activeViewIndex = this.indexOf(activeView);
    let view: ViewController;

    let reorderZIndexes = false;
    for (var i = this._views.length - 1; i >= 0; i--) {
      view = this._views[i];
      if (i > activeViewIndex) {
        // this view comes after the active view
        // let's unload it
        this._views.splice(i, 1);
        view._willUnload(this._renderer);
        this.viewWillUnload.emit(view);
        this._app.viewWillUnload.emit(view);

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
      this._views[i]._willUnload(this._renderer);
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
    let transitionEndTime = this.trnsTime;
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
    //this.trnsTime = (isTransitioning ? Date.now() + fallback : 0);
  }

  getActive() {
    return this._views[this._views.length - 1];
  }

  isActive(view: ViewController) {
    return (view === this.getActive());
  }

  getByIndex(index: number): ViewController {
    return (index < this._views.length && index > -1 ? this._views[index] : null);
  }

  getPrevious(view?: ViewController): ViewController {
    // returns the view controller which is before the given view controller.
    if (!view) {
      view = this.getActive();
    }
    return this.getByIndex(this.indexOf(view) - 1);
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
  private present(enteringView: ViewController, opts?: NavOptions): Promise<any> {
    // deprecated warning: added beta.11 2016-06-27
    console.warn('nav.present() has been deprecated.\n' +
                 'Please inject the overlay\'s controller and use the present method on the instance instead.');
    return Promise.resolve();
  }

}

let ctrlIds = -1;

export interface ViewInitDone {
  (enterTest: TestResult, leaveTest: TestResult): void
}

function resolve() {

}

const DISABLE_APP_MINIMUM_DURATION = 64;
