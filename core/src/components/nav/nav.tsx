import { Build, Component, Element, Event, EventEmitter, Method, Prop, Watch } from '@stencil/core';
import {
  NavDirection,
  NavOptions,
  NavParams,
  NavResult,
  TransitionDoneFn,
  TransitionInstruction,
  ViewState,
  convertToViews,
  isPresent,
} from './nav-util';

import { ViewController, isViewController } from './view-controller';
import { Animation, Config, DomController, FrameworkDelegate, GestureDetail, NavOutlet } from '../..';
import { RouteID, RouteWrite, RouterDirection } from '../router/utils/interfaces';
import { AnimationOptions, ViewLifecycle, lifecycle, transition } from '../../utils/transition';
import { assert } from '../../utils/helpers';

import iosTransitionAnimation from './animations/ios.transition';
import mdTransitionAnimation from './animations/md.transition';

@Component({
  tag: 'ion-nav',
})
export class NavControllerBase implements NavOutlet {

  private _ids = -1;
  private _init = false;
  private _queue: TransitionInstruction[] = [];
  private _sbTrns: Animation;
  private useRouter = false;
  isTransitioning = false;
  private _destroyed = false;

  _views: ViewController[] = [];

  id: string;
  name: string;
  mode: string;

  parent: any;

  @Element() el: HTMLElement;

  @Prop({context: 'dom'}) dom: DomController;
  @Prop({context: 'config'}) config: Config;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: HTMLIonAnimationControllerElement;
  @Prop({ mutable: true }) swipeBackEnabled: boolean;
  @Prop({ mutable: true }) animated: boolean;
  @Prop() delegate: FrameworkDelegate;
  @Prop() rootParams: any;
  @Prop() root: any;
  @Watch('root')
  rootChanged() {
    if (this.root) {
      if (!this.useRouter) {
        this.setRoot(this.root, this.rootParams);
      } else if (Build.isDev) {
        console.warn('<ion-nav> does not support a root attribute when using ion-router.');
      }
    }
  }

  @Event() ionNavChanged: EventEmitter<void>;

  componentWillLoad() {
    this.id = 'n' + (++ctrlIds);
    this.useRouter = !!document.querySelector('ion-router') && !this.el.closest('[no-router]');
    if (this.swipeBackEnabled === undefined) {
      this.swipeBackEnabled = this.config.getBoolean('swipeBackEnabled', this.mode === 'ios');
    }
    if (this.animated === undefined) {
      this.animated = this.config.getBoolean('animate', true);
    }
  }

  componentDidLoad() {
    this.rootChanged();
  }

  componentDidUnload() {
    this.destroy();
  }

  @Method()
  push(page: any, params?: NavParams, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return this._queueTrns({
      insertStart: -1,
      insertViews: [{ page: page, params: params }],
      opts: opts,
    }, done);
  }

  @Method()
  insert(insertIndex: number, page: any, params?: NavParams, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return this._queueTrns({
      insertStart: insertIndex,
      insertViews: [{ page: page, params: params }],
      opts: opts,
    }, done);
  }

  @Method()
  insertPages(insertIndex: number, insertPages: any[], opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return this._queueTrns({
      insertStart: insertIndex,
      insertViews: insertPages,
      opts: opts,
    }, done);
  }

  @Method()
  pop(opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return this._queueTrns({
      removeStart: -1,
      removeCount: 1,
      opts: opts,
    }, done);
  }

  @Method()
  popTo(indexOrViewCtrl: any, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    const config: TransitionInstruction = {
      removeStart: -1,
      removeCount: -1,
      opts: opts
    };
    if (isViewController(indexOrViewCtrl)) {
      config.removeView = indexOrViewCtrl;
      config.removeStart = 1;
    } else if (typeof indexOrViewCtrl === 'number') {
      config.removeStart = indexOrViewCtrl + 1;
    }
    return this._queueTrns(config, done);
  }

  @Method()
  popToRoot(opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return this._queueTrns({
      removeStart: 1,
      removeCount: -1,
      opts: opts,
    }, done);
  }

  @Method()
  popAll(): Promise<boolean[]> {
    const promises: Promise<boolean>[] = [];
    for (let i = this._views.length - 1; i >= 0; i--) {
      promises.push(this.pop(undefined));
    }
    return Promise.all(promises);
  }

  @Method()
  removeIndex(startIndex: number, removeCount = 1, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return this._queueTrns({
      removeStart: startIndex,
      removeCount: removeCount,
      opts: opts,
    }, done);
  }

  @Method()
  removeView(viewController: ViewController, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return this._queueTrns({
      removeView: viewController,
      removeStart: 0,
      removeCount: 1,
      opts: opts,
    }, done);
  }

  @Method()
  setRoot(pageOrViewCtrl: any, params?: any, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return this.setPages([{ page: pageOrViewCtrl, params: params }], opts, done);
  }

  @Method()
  setPages(pages: any[], opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    if (!opts) {
      opts = {};
    }
    // if animation wasn't set to true then default it to NOT animate
    if (opts.animate !== true) {
      opts.animate = false;
    }
    return this._queueTrns({
      insertStart: 0,
      insertViews: pages,
      removeStart: 0,
      removeCount: -1,
      opts: opts
    }, done);
  }

  @Method()
  setRouteId(id: string, params: any = {}, direction: number): Promise<RouteWrite> {
    const active = this.getActive();

    if (active && active.matches(id, params)) {
      return Promise.resolve({changed: false, element: active.element});
    }

    const viewController = this._views.find(v => v.matches(id, params));

    let resolve: (result: RouteWrite) => void;
    const promise = new Promise<RouteWrite>((r) => resolve = r);
    let finish: Promise<boolean>;
    const commonOpts: NavOptions = {
      updateURL: false,
      viewIsReady: () => {
        let mark: Function;
        const p = new Promise(r => mark = r);
        resolve({
          changed: true,
          element: this.getActive().element,
          markVisible: async () => {
            mark();
            await finish;
          }
        });
        return p;
      }
    };
    if (viewController) {
      finish = this.popTo(viewController, {...commonOpts, direction: NavDirection.Back});
    } else if (direction === 1) {
      finish = this.push(id, params, commonOpts);
    } else if (direction === -1) {
      finish = this.setRoot(id, params, {...commonOpts, direction: NavDirection.Back, animate: true});
    } else {
      finish = this.setRoot(id, params, commonOpts);
    }
    return promise;
  }

  @Method()
  getRouteId(): RouteID|undefined {
    const active = this.getActive();
    return active ? {
      id: active.element.tagName,
      params: active.data,
      element: active.element
    } : undefined;
  }

  @Method()
  canGoBack(view = this.getActive()): boolean {
    return !!(view && this.getPrevious(view));
  }

  @Method()
  getActive(): ViewController {
    return this._views[this._views.length - 1];
  }

  @Method()
  getByIndex(index: number): ViewController {
    return this._views[index];
  }

  @Method()
  getPrevious(view = this.getActive()): ViewController|undefined {
    const views = this._views;
    const index = views.indexOf(view);
    return (index > 0) ? views[index - 1] : undefined;
  }

  @Method()
  getViews(): Array<ViewController> {
    return this._views.slice();
  }

  /**
   * Return a view controller
   */
  @Method()
  getViewById(id: string): ViewController|undefined {
    return this._views.find(vc => vc.id === id);
  }

  indexOf(viewController: ViewController) {
    return this._views.indexOf(viewController);
  }

  length() {
    return this._views.length;
  }

  // _queueTrns() adds a navigation stack change to the queue and schedules it to run:
  // 1. _nextTrns(): consumes the next transition in the queue
  // 2. _viewInit(): initializes enteringView if required
  // 3. _viewTest(): ensures canLeave/canEnter returns true, so the operation can continue
  // 4. _postViewInit(): add/remove the views from the navigation stack
  // 5. _transitionInit(): initializes the visual transition if required and schedules it to run
  // 6. _viewAttachToDOM(): attaches the enteringView to the DOM
  // 7. _transitionStart(): called once the transition actually starts, it initializes the Animation underneath.
  // 8. _transitionFinish(): called once the transition finishes
  // 9. _cleanup(): syncs the navigation internal state with the DOM. For example it removes the pages from the DOM or hides/show them.
  private _queueTrns(ti: TransitionInstruction, done: TransitionDoneFn|undefined): Promise<boolean> {
    const promise = new Promise<boolean>((resolve, reject) => {
      ti.resolve = resolve;
      ti.reject = reject;
    });
    ti.done = done;

    // Normalize empty
    if (ti.insertViews && ti.insertViews.length === 0) {
      ti.insertViews = undefined;
    }

    // Enqueue transition instruction
    this._queue.push(ti);

    // if there isn't a transition already happening
    // then this will kick off this transition
    this._nextTrns();

    return promise;
  }

  private _success(result: NavResult, ti: TransitionInstruction) {
    if (this._queue === null) {
      this._fireError('nav controller was destroyed', ti);
      return;
    }
    this._init = true;

    if (ti.done) {
      ti.done(
        result.hasCompleted,
        result.requiresTransition,
        result.enteringView,
        result.leavingView,
        result.direction
      );
    }
    ti.resolve(result.hasCompleted);

    if (ti.opts.updateURL !== false && this.useRouter) {
      const router = document.querySelector('ion-router');
      if (router) {
        const direction = (result.direction === NavDirection.Back)
          ? RouterDirection.Back
          : RouterDirection.Forward;

        router && router.navChanged(direction);
      }
    }
    this.ionNavChanged.emit();
  }

  private _failed(rejectReason: any, ti: TransitionInstruction) {
    if (this._queue === null) {
      this._fireError('nav controller was destroyed', ti);
      return;
    }
    this._queue.length = 0;
    this._fireError(rejectReason, ti);
  }

  private _fireError(rejectReason: any, ti: TransitionInstruction) {
    if (ti.done) {
      ti.done(false, false, rejectReason);
    }
    if (ti.reject && !this._destroyed) {
      ti.reject(rejectReason);
    } else {
      ti.resolve(false);
    }
  }

  private _nextTrns(): boolean {
    // this is the framework's bread 'n butta function
    // only one transition is allowed at any given time
    if (this.isTransitioning) {
      return false;
    }

    // there is no transition happening right now
    // get the next instruction
    const ti = this._queue.shift();
    if (!ti) {
      return false;
    }

    this.runTransition(ti);
    return true;
  }

  private async runTransition(ti: TransitionInstruction) {
    try {
      // set that this nav is actively transitioning
      this.isTransitioning = true;
      this._prepareTI(ti);

      const leavingView = this.getActive();
      const enteringView = this._getEnteringView(ti, leavingView);

      if (!leavingView && !enteringView) {
        throw new Error('no views in the stack to be removed');
      }

      // Needs transition?
      ti.requiresTransition = (ti.enteringRequiresTransition || ti.leavingRequiresTransition) && enteringView !== leavingView;

      if (enteringView && enteringView._state === ViewState.New) {
        await enteringView.init(this.el);
      }
      this._postViewInit(enteringView, leavingView, ti);

      const result = await this._transition(enteringView, leavingView, ti);

      this._success(result, ti);
    } catch (rejectReason) {
      this._failed(rejectReason, ti);
    }
    this.isTransitioning = false;
    this._nextTrns();
  }

  private _prepareTI(ti: TransitionInstruction) {
    const viewsLength = this._views.length;

    ti.opts = ti.opts || {};

    if (ti.opts.delegate === undefined) {
      ti.opts.delegate = this.delegate;
    }
    if (ti.removeView != null) {
      assert(isPresent(ti.removeStart), 'removeView needs removeStart');
      assert(isPresent(ti.removeCount), 'removeView needs removeCount');

      const index = this._views.indexOf(ti.removeView);
      if (index < 0) {
        throw new Error('removeView was not found');
      }
      ti.removeStart += index;
    }
    if (ti.removeStart != null) {
      if (ti.removeStart < 0) {
        ti.removeStart = (viewsLength - 1);
      }
      if (ti.removeCount < 0) {
        ti.removeCount = (viewsLength - ti.removeStart);
      }
      ti.leavingRequiresTransition = (ti.removeCount > 0) && ((ti.removeStart + ti.removeCount) === viewsLength);
    }

    if (ti.insertViews) {
      // allow -1 to be passed in to auto push it on the end
      // and clean up the index if it's larger then the size of the stack
      if (ti.insertStart < 0 || ti.insertStart > viewsLength) {
        ti.insertStart = viewsLength;
      }
      ti.enteringRequiresTransition = (ti.insertStart === viewsLength);
    }

    const insertViews = ti.insertViews;
    if (!insertViews) {
      return;
    }
    assert(insertViews.length > 0, 'length can not be zero');
    const viewControllers = convertToViews(insertViews);

    if (viewControllers.length === 0) {
      throw new Error('invalid views to insert');
    }

    // Check all the inserted view are correct
    for (let i = 0; i < viewControllers.length; i++) {
      const view = viewControllers[i];
      view.delegate = ti.opts.delegate;
      const nav = view._nav;
      if (nav && nav !== this) {
        throw new Error('inserted view was already inserted');
      }
      if (view._state === ViewState.Destroyed) {
        throw new Error('inserted view was already destroyed');
      }
    }
    ti.insertViews = viewControllers;
  }

  private _getEnteringView(ti: TransitionInstruction, leavingView: ViewController): ViewController {
    const insertViews = ti.insertViews;
    if (insertViews) {
      // grab the very last view of the views to be inserted
      // and initialize it as the new entering view
      return insertViews[insertViews.length - 1];
    }

    const removeStart = ti.removeStart;
    if (isPresent(removeStart)) {
      const views = this._views;
      const removeEnd = removeStart + ti.removeCount;
      for (let i = views.length - 1; i >= 0; i--) {
        const view = views[i];
        if ((i < removeStart || i >= removeEnd) && view !== leavingView) {
          return view;
        }
      }
    }
    return null;
  }

  private _postViewInit(enteringView: ViewController, leavingView: ViewController, ti: TransitionInstruction) {
    assert(leavingView || enteringView, 'Both leavingView and enteringView are null');
    assert(ti.resolve, 'resolve must be valid');
    assert(ti.reject, 'reject must be valid');

    const opts = ti.opts;
    const insertViews = ti.insertViews;
    const removeStart = ti.removeStart;
    const removeCount = ti.removeCount;
    let destroyQueue: ViewController[] = undefined;

    // there are views to remove
    if (isPresent(removeStart)) {
      assert(removeStart >= 0, 'removeStart can not be negative');
      assert(removeCount >= 0, 'removeCount can not be negative');

      destroyQueue = [];
      for (let i = 0; i < removeCount; i++) {
        const view = this._views[i + removeStart];
        if (view && view !== enteringView && view !== leavingView) {
          destroyQueue.push(view);
        }
      }
      // default the direction to "back"
      opts.direction = opts.direction || NavDirection.Back;
    }

    const finalBalance = this._views.length + (insertViews ? insertViews.length : 0) - (removeCount ? removeCount : 0);
    assert(finalBalance >= 0, 'final balance can not be negative');
    if (finalBalance === 0) {
      console.warn(`You can't remove all the pages in the navigation stack. nav.pop() is probably called too many times.`,
        this, this.el);

      throw new Error('navigation stack needs at least one root page');
    }

    // At this point the transition can not be rejected, any throw should be an error
    // there are views to insert
    if (insertViews) {
      // manually set the new view's id if an id was passed in the options
      if (isPresent(opts.id)) {
        enteringView.id = opts.id;
      }

      // add the views to the
      for (let i = 0; i < insertViews.length; i++) {
        const view = insertViews[i];
        this._insertViewAt(view, ti.insertStart + i);
      }

      if (ti.enteringRequiresTransition) {
        // default to forward if not already set
        opts.direction = opts.direction || NavDirection.Forward;
      }
    }

    // if the views to be removed are in the beginning or middle
    // and there is not a view that needs to visually transition out
    // then just destroy them and don't transition anything
    // batch all of lifecycles together
    // let's make sure, callbacks are zoned
    if (destroyQueue && destroyQueue.length > 0) {
      for (let i = 0; i < destroyQueue.length; i++) {
        const view = destroyQueue[i];
        lifecycle(view.element, ViewLifecycle.WillLeave);
        lifecycle(view.element, ViewLifecycle.DidLeave);
        lifecycle(view.element, ViewLifecycle.WillUnload);
      }

      // once all lifecycle events has been delivered, we can safely detroy the views
      for (let i = 0; i < destroyQueue.length; i++) {
        this._destroyView(destroyQueue[i]);
      }
    }

    // set which animation it should use if it wasn't set yet
    if (ti.requiresTransition && !opts.animation) {
      opts.animation = isPresent(ti.removeStart)
        ? (leavingView || enteringView).getTransitionName(opts.direction)
        : (enteringView || leavingView).getTransitionName(opts.direction);
    }
  }

  private async _transition(enteringView: ViewController, leavingView: ViewController, ti: TransitionInstruction): Promise<NavResult> {
    if (!ti.requiresTransition) {
      // transition is not required, so we are already done!
      // they're inserting/removing the views somewhere in the middle or
      // beginning, so visually nothing needs to animate/transition
      // resolve immediately because there's no animation that's happening
      return Promise.resolve({
        hasCompleted: true,
        requiresTransition: false
      });
    }
    if (this._sbTrns) {
      this._sbTrns.destroy();
      this._sbTrns = null;
    }

    // we should animate (duration > 0) if the pushed page is not the first one (startup)
    // or if it is a portal (modal, actionsheet, etc.)
    const shouldAnimate = this.animated && this._init && this._views.length > 1;

    const animationBuilder = (shouldAnimate)
      ? this.mode === 'ios' ? iosTransitionAnimation : mdTransitionAnimation
      : undefined;

    const progressAnimation = ti.opts.progressAnimation
      ? (animation: Animation) => this._sbTrns = animation
      : undefined;

    const opts = ti.opts;
    const enteringEl = enteringView && enteringView.element;
    const leavingEl = leavingView && leavingView.element;
    const animationOpts: AnimationOptions = {
      animationCtrl: this.animationCtrl,
      animationBuilder: animationBuilder,
      animation: undefined,

      direction: opts.direction as NavDirection,
      duration: opts.duration,
      easing: opts.easing,
      viewIsReady: opts.viewIsReady,

      showGoBack: this.canGoBack(enteringView),
      progressAnimation,
      baseEl: this.el,
      enteringEl,
      leavingEl
    };
    const trns = await transition(animationOpts);
    return this._transitionFinish(trns, enteringView, leavingView, ti.opts);
  }

  private _transitionFinish(transition: Animation|void, enteringView: ViewController, leavingView: ViewController, opts: NavOptions): NavResult {
    const hasCompleted = transition ? transition.hasCompleted : true;

    if (hasCompleted) {
      this._cleanup(enteringView);
    } else {
      this._cleanup(leavingView);
    }

    // this is the root transition
    // it's safe to destroy this transition
    transition && transition.destroy();

    return {
      hasCompleted: hasCompleted,
      requiresTransition: true,
      enteringView,
      leavingView,
      direction: opts.direction
    };
  }

  private _insertViewAt(view: ViewController, index: number) {
    const existingIndex = this._views.indexOf(view);
    if (existingIndex > -1) {
      // this view is already in the stack!!
      // move it to its new location
      assert(view._nav === this, 'view is not part of the nav');
      this._views.splice(index, 0, this._views.splice(existingIndex, 1)[0]);
    } else {
      assert(!view._nav, 'nav is used');
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

  private _removeView(view: ViewController) {
    assert(view._state === ViewState.Attached || view._state === ViewState.Destroyed, 'view state should be loaded or destroyed');

    const views = this._views;
    const index = views.indexOf(view);
    assert(index > -1, 'view must be part of the stack');
    if (index >= 0) {
      views.splice(index, 1);
    }
  }

  private _destroyView(view: ViewController) {
    view._destroy();
    this._removeView(view);
  }

  /**
   * DOM WRITE
   */
  private _cleanup(activeView: ViewController) {
    // ok, cleanup time!! Destroy all of the views that are
    // INACTIVE and come after the active view
    // only do this if the views exist, though
    if (!this._destroyed) {
      const activeViewIndex = this._views.indexOf(activeView);
      const views = this._views;

      for (let i = views.length - 1; i >= 0; i--) {
        const view = views[i];
        if (i > activeViewIndex) {
          // this view comes after the active view
          // let's unload it
          lifecycle(view.element, ViewLifecycle.WillUnload);
          this._destroyView(view);

        } else if (i < activeViewIndex) {
          // this view comes before the active view
          // and it is not a portal then ensure it is hidden
          view.element.hidden = true;
        }
      }
    }
  }

  destroy() {
    const views = this._views;
    let view: ViewController;
    for (let i = 0; i < views.length; i++) {
      view = views[i];
      lifecycle(view.element, ViewLifecycle.WillUnload);
      view._destroy();
    }

    // release swipe back gesture and transition
    this._sbTrns && this._sbTrns.destroy();
    this._queue = this._views = this._sbTrns = null;

    // Unregister navcontroller
    if (this.parent && this.parent.unregisterChildNav) {
      // TODO: event
      this.parent.unregisterChildNav(this);
    }

    this._destroyed = true;
  }

  private swipeBackStart() {
    if (this.isTransitioning || this._queue.length > 0) {
      return;
    }

    // default the direction to "back";
    const opts: NavOptions = {
      direction: NavDirection.Back,
      progressAnimation: true
    };

    this._queueTrns({
      removeStart: -1,
      removeCount: 1,
      opts: opts,
    }, undefined);
  }

  private swipeBackProgress(detail: GestureDetail) {
    if (this._sbTrns) {
      // continue to disable the app while actively dragging
      // TODO
      // this.app.setEnabled(false, ACTIVE_TRANSITION_DEFAULT);
      this.isTransitioning = true;

      // set the transition animation's progress
      const delta = detail.deltaX;
      const stepValue = delta / window.innerWidth;
      // set the transition animation's progress
      this._sbTrns.progressStep(stepValue);
    }
  }

  private swipeBackEnd(detail: GestureDetail) {
    if (this._sbTrns) {
      // the swipe back gesture has ended
      const delta = detail.deltaX;
      const width = window.innerWidth;
      const stepValue = delta / width;
      const velocity = detail.velocityX;
      const z = width / 2.0;
      const shouldComplete = (velocity >= 0)
        && (velocity > 0.2 || detail.deltaX > z);

      const missing = shouldComplete ? 1 - stepValue : stepValue;
      const missingDistance = missing * width;
      let realDur = 0;
      if (missingDistance > 5) {
        const dur = missingDistance / Math.abs(velocity);
        realDur = Math.min(dur, 300);
      }

      this._sbTrns.progressEnd(shouldComplete, stepValue, realDur);
    }
  }

  canSwipeBack(): boolean {
    return (
      this.swipeBackEnabled &&
      !this.isTransitioning &&
      this.canGoBack()
    );
  }

  render() {
    const dom = [];
    if (this.swipeBackEnabled) {
      dom.push(<ion-gesture
        canStart={this.canSwipeBack.bind(this)}
        onStart={this.swipeBackStart.bind(this)}
        onMove={this.swipeBackProgress.bind(this)}
        onEnd={this.swipeBackEnd.bind(this)}
        gestureName='goback-swipe'
        gesturePriority={10}
        type='pan'
        direction='x'
        threshold={10}
        attachTo='body'/>);
    }
    if (this.mode === 'ios') {
      dom.push(<div class='nav-decor'/>);
    }
    dom.push(<slot></slot>);
    return dom;
  }
}

let ctrlIds = -1;
