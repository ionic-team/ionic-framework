import type { EventEmitter } from '@stencil/core';
import { Build, Component, Element, Event, Method, Prop, Watch, h } from '@stencil/core';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import type {
  Animation,
  AnimationBuilder,
  ComponentProps,
  FrameworkDelegate,
  Gesture,
  NavComponent,
  NavComponentWithProps,
  NavOptions,
  NavOutlet,
  NavResult,
  RouteID,
  RouteWrite,
  RouterDirection,
  TransitionDoneFn,
  TransitionInstruction,
  ViewController,
} from '../../interface';
import { getTimeGivenProgression } from '../../utils/animation/cubic-bezier';
import { assert } from '../../utils/helpers';
import type { TransitionOptions } from '../../utils/transition';
import { lifecycle, setPageHidden, transition } from '../../utils/transition';

import { LIFECYCLE_DID_LEAVE, LIFECYCLE_WILL_LEAVE, LIFECYCLE_WILL_UNLOAD } from './constants';
import { VIEW_STATE_ATTACHED, VIEW_STATE_DESTROYED, VIEW_STATE_NEW, convertToViews, matches } from './view-controller';

@Component({
  tag: 'ion-nav',
  styleUrl: 'nav.scss',
  shadow: true,
})
export class Nav implements NavOutlet {
  private transInstr: TransitionInstruction[] = [];
  private sbAni?: Animation;
  private animationEnabled = true;
  private useRouter = false;
  private isTransitioning = false;
  private destroyed = false;
  private views: ViewController[] = [];
  private gesture?: Gesture;

  @Element() el!: HTMLElement;

  /** @internal */
  @Prop() delegate?: FrameworkDelegate;

  /**
   * If the nav component should allow for swipe-to-go-back.
   */
  @Prop({ mutable: true }) swipeGesture?: boolean;
  @Watch('swipeGesture')
  swipeGestureChanged() {
    if (this.gesture) {
      this.gesture.enable(this.swipeGesture === true);
    }
  }

  /**
   * If `true`, the nav should animate the transition of components.
   */
  @Prop() animated = true;

  /**
   * By default `ion-nav` animates transition between pages based in the mode (ios or material design).
   * However, this property allows to create custom transition using `AnimateBuilder` functions.
   */
  @Prop() animation?: AnimationBuilder;

  /**
   * Any parameters for the root component
   */
  @Prop() rootParams?: ComponentProps;

  /**
   * Root NavComponent to load
   */
  @Prop() root?: NavComponent;

  @Watch('root')
  rootChanged() {
    const isDev = Build.isDev;
    if (this.root !== undefined) {
      if (!this.useRouter) {
        this.setRoot(this.root, this.rootParams);
      } else if (isDev) {
        console.warn('<ion-nav> does not support a root attribute when using ion-router.');
      }
    }
  }

  /**
   * Event fired when Nav will load a component
   * @internal
   */
  @Event() ionNavWillLoad!: EventEmitter<void>;
  /**
   * Event fired when the nav will change components
   */
  @Event({ bubbles: false }) ionNavWillChange!: EventEmitter<void>;
  /**
   * Event fired when the nav has changed components
   */
  @Event({ bubbles: false }) ionNavDidChange!: EventEmitter<void>;

  componentWillLoad() {
    this.useRouter = document.querySelector('ion-router') !== null && this.el.closest('[no-router]') === null;

    if (this.swipeGesture === undefined) {
      const mode = getIonMode(this);
      this.swipeGesture = config.getBoolean('swipeBackEnabled', mode === 'ios');
    }

    this.ionNavWillLoad.emit();
  }

  async componentDidLoad() {
    this.rootChanged();

    this.gesture = (await import('../../utils/gesture/swipe-back')).createSwipeBackGesture(
      this.el,
      this.canStart.bind(this),
      this.onStart.bind(this),
      this.onMove.bind(this),
      this.onEnd.bind(this)
    );
    this.swipeGestureChanged();
  }

  disconnectedCallback() {
    for (const view of this.views) {
      lifecycle(view.element!, LIFECYCLE_WILL_UNLOAD);
      view._destroy();
    }

    // Release swipe back gesture and transition.
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
    this.transInstr.length = 0;
    this.views.length = 0;
    this.destroyed = true;
  }

  /**
   * Push a new component onto the current navigation stack. Pass any additional
   * information along as an object. This additional information is accessible
   * through NavParams.
   *
   * @param component The component to push onto the navigation stack.
   * @param componentProps Any properties of the component.
   * @param opts The navigation options.
   * @param done The transition complete function.
   */
  @Method()
  push<T extends NavComponent>(
    component: T,
    componentProps?: ComponentProps<T> | null,
    opts?: NavOptions | null,
    done?: TransitionDoneFn
  ): Promise<boolean> {
    return this.insert(-1, component, componentProps, opts, done);
  }

  /**
   * Inserts a component into the navigation stack at the specified index.
   * This is useful to add a component at any point in the navigation stack.
   *
   * @param insertIndex The index to insert the component at in the stack.
   * @param component The component to insert into the navigation stack.
   * @param componentProps Any properties of the component.
   * @param opts The navigation options.
   * @param done The transition complete function.
   */
  @Method()
  insert<T extends NavComponent>(
    insertIndex: number,
    component: T,
    componentProps?: ComponentProps<T> | null,
    opts?: NavOptions | null,
    done?: TransitionDoneFn
  ): Promise<boolean> {
    return this.insertPages(insertIndex, [{ component, componentProps }], opts, done);
  }

  /**
   * Inserts an array of components into the navigation stack at the specified index.
   * The last component in the array will become instantiated as a view, and animate
   * in to become the active view.
   *
   * @param insertIndex The index to insert the components at in the stack.
   * @param insertComponents The components to insert into the navigation stack.
   * @param opts The navigation options.
   * @param done The transition complete function.
   */
  @Method()
  insertPages(
    insertIndex: number,
    insertComponents: NavComponent[] | NavComponentWithProps[],
    opts?: NavOptions | null,
    done?: TransitionDoneFn
  ): Promise<boolean> {
    return this.queueTrns(
      {
        insertStart: insertIndex,
        insertViews: insertComponents,
        opts,
      },
      done
    );
  }

  /**
   * Pop a component off of the navigation stack. Navigates back from the current
   * component.
   *
   * @param opts The navigation options.
   * @param done The transition complete function.
   */
  @Method()
  pop(opts?: NavOptions | null, done?: TransitionDoneFn): Promise<boolean> {
    return this.removeIndex(-1, 1, opts, done);
  }

  /**
   * Pop to a specific index in the navigation stack.
   *
   * @param indexOrViewCtrl The index or view controller to pop to.
   * @param opts The navigation options.
   * @param done The transition complete function.
   */
  @Method()
  popTo(indexOrViewCtrl: number | ViewController, opts?: NavOptions | null, done?: TransitionDoneFn): Promise<boolean> {
    const ti: TransitionInstruction = {
      removeStart: -1,
      removeCount: -1,
      opts,
    };
    if (typeof indexOrViewCtrl === 'object' && (indexOrViewCtrl as ViewController).component) {
      ti.removeView = indexOrViewCtrl;
      ti.removeStart = 1;
    } else if (typeof indexOrViewCtrl === 'number') {
      ti.removeStart = indexOrViewCtrl + 1;
    }
    return this.queueTrns(ti, done);
  }

  /**
   * Navigate back to the root of the stack, no matter how far back that is.
   *
   * @param opts The navigation options.
   * @param done The transition complete function.
   */
  @Method()
  popToRoot(opts?: NavOptions | null, done?: TransitionDoneFn): Promise<boolean> {
    return this.removeIndex(1, -1, opts, done);
  }

  /**
   * Removes a component from the navigation stack at the specified index.
   *
   * @param startIndex The number to begin removal at.
   * @param removeCount The number of components to remove.
   * @param opts The navigation options.
   * @param done The transition complete function.
   */
  @Method()
  removeIndex(
    startIndex: number,
    removeCount = 1,
    opts?: NavOptions | null,
    done?: TransitionDoneFn
  ): Promise<boolean> {
    return this.queueTrns(
      {
        removeStart: startIndex,
        removeCount,
        opts,
      },
      done
    );
  }

  /**
   * Set the root for the current navigation stack to a component.
   *
   * @param component The component to set as the root of the navigation stack.
   * @param componentProps Any properties of the component.
   * @param opts The navigation options.
   * @param done The transition complete function.
   */
  @Method()
  setRoot<T extends NavComponent>(
    component: T,
    componentProps?: ComponentProps<T> | null,
    opts?: NavOptions | null,
    done?: TransitionDoneFn
  ): Promise<boolean> {
    return this.setPages([{ component, componentProps }], opts, done);
  }

  /**
   * Set the views of the current navigation stack and navigate to the last view.
   * By default animations are disabled, but they can be enabled by passing options
   * to the navigation controller. Navigation parameters can also be passed to the
   * individual pages in the array.
   *
   * @param views The list of views to set as the navigation stack.
   * @param opts The navigation options.
   * @param done The transition complete function.
   */
  @Method()
  setPages(
    views: NavComponent[] | NavComponentWithProps[],
    opts?: NavOptions | null,
    done?: TransitionDoneFn
  ): Promise<boolean> {
    opts ??= {};
    // if animation wasn't set to true then default it to NOT animate
    if (opts.animated !== true) {
      opts.animated = false;
    }
    return this.queueTrns(
      {
        insertStart: 0,
        insertViews: views,
        removeStart: 0,
        removeCount: -1,
        opts,
      },
      done
    );
  }

  /**
   * Called by the router to update the view.
   *
   * @param id The component tag.
   * @param params The component params.
   * @param direction A direction hint.
   * @param animation an AnimationBuilder.
   *
   * @return the status.
   * @internal
   */
  @Method()
  setRouteId(
    id: string,
    params: ComponentProps | undefined,
    direction: RouterDirection,
    animation?: AnimationBuilder
  ): Promise<RouteWrite> {
    const active = this.getActiveSync();
    if (matches(active, id, params)) {
      return Promise.resolve({
        changed: false,
        element: active.element,
      });
    }

    let resolve: (result: RouteWrite) => void;
    const promise = new Promise<RouteWrite>((r) => (resolve = r));
    let finish: Promise<boolean>;
    const commonOpts: NavOptions = {
      updateURL: false,
      viewIsReady: (enteringEl) => {
        let mark: () => void;
        const p = new Promise<void>((r) => (mark = r));
        resolve({
          changed: true,
          element: enteringEl,
          markVisible: async () => {
            mark();
            await finish;
          },
        });
        return p;
      },
    };

    if (direction === 'root') {
      finish = this.setRoot(id, params, commonOpts);
    } else {
      // Look for a view matching the target in the view stack.
      const viewController = this.views.find((v) => matches(v, id, params));

      if (viewController) {
        finish = this.popTo(viewController, {
          ...commonOpts,
          direction: 'back',
          animationBuilder: animation,
        });
      } else if (direction === 'forward') {
        finish = this.push(id, params, {
          ...commonOpts,
          animationBuilder: animation,
        });
      } else if (direction === 'back') {
        finish = this.setRoot(id, params, {
          ...commonOpts,
          direction: 'back',
          animated: true,
          animationBuilder: animation,
        });
      }
    }
    return promise;
  }

  /**
   * Called by <ion-router> to retrieve the current component.
   *
   * @internal
   */
  @Method()
  async getRouteId(): Promise<RouteID | undefined> {
    const active = this.getActiveSync();
    if (active) {
      return {
        id: active.element!.tagName,
        params: active.params,
        element: active.element,
      };
    }
    return undefined;
  }

  /**
   * Get the active view.
   */
  @Method()
  async getActive(): Promise<ViewController | undefined> {
    return this.getActiveSync();
  }

  /**
   * Get the view at the specified index.
   *
   * @param index The index of the view.
   */
  @Method()
  async getByIndex(index: number): Promise<ViewController | undefined> {
    return this.views[index];
  }

  /**
   * Returns `true` if the current view can go back.
   *
   * @param view The view to check.
   */
  @Method()
  async canGoBack(view?: ViewController): Promise<boolean> {
    return this.canGoBackSync(view);
  }

  /**
   * Get the previous view.
   *
   * @param view The view to get.
   */
  @Method()
  async getPrevious(view?: ViewController): Promise<ViewController | undefined> {
    return this.getPreviousSync(view);
  }

  getLength() {
    return this.views.length;
  }

  private getActiveSync(): ViewController | undefined {
    return this.views[this.views.length - 1];
  }

  private canGoBackSync(view = this.getActiveSync()): boolean {
    return !!(view && this.getPreviousSync(view));
  }

  private getPreviousSync(view = this.getActiveSync()): ViewController | undefined {
    if (!view) {
      return undefined;
    }
    const views = this.views;
    const index = views.indexOf(view);
    return index > 0 ? views[index - 1] : undefined;
  }

  /**
   * Adds a navigation stack change to the queue and schedules it to run.
   *
   * @returns Whether the transition succeeds.
   */
  private async queueTrns(ti: TransitionInstruction, done: TransitionDoneFn | undefined): Promise<boolean> {
    if (this.isTransitioning && ti.opts?.skipIfBusy) {
      return false;
    }

    const promise = new Promise<boolean>((resolve, reject) => {
      ti.resolve = resolve;
      ti.reject = reject;
    });
    ti.done = done;

    /**
     * If using router, check to see if navigation hooks
     * will allow us to perform this transition. This
     * is required in order for hooks to work with
     * the ion-back-button or swipe to go back.
     */
    if (ti.opts && ti.opts.updateURL !== false && this.useRouter) {
      const router = document.querySelector('ion-router');
      if (router) {
        const canTransition = await router.canTransition();
        if (canTransition === false) {
          return false;
        }
        if (typeof canTransition === 'string') {
          router.push(canTransition, ti.opts!.direction || 'back');
          return false;
        }
      }
    }

    // Normalize empty
    if (ti.insertViews?.length === 0) {
      ti.insertViews = undefined;
    }

    // Enqueue transition instruction
    this.transInstr.push(ti);

    // if there isn't a transition already happening
    // then this will kick off this transition
    this.nextTrns();

    return promise;
  }

  private success(result: NavResult, ti: TransitionInstruction) {
    if (this.destroyed) {
      this.fireError('nav controller was destroyed', ti);
      return;
    }

    if (ti.done) {
      ti.done(
        result.hasCompleted,
        result.requiresTransition,
        result.enteringView,
        result.leavingView,
        result.direction
      );
    }
    ti.resolve!(result.hasCompleted);

    if (ti.opts!.updateURL !== false && this.useRouter) {
      const router = document.querySelector('ion-router');
      if (router) {
        const direction = result.direction === 'back' ? 'back' : 'forward';
        router.navChanged(direction);
      }
    }
  }

  private failed(rejectReason: any, ti: TransitionInstruction) {
    if (this.destroyed) {
      this.fireError('nav controller was destroyed', ti);
      return;
    }
    this.transInstr.length = 0;
    this.fireError(rejectReason, ti);
  }

  private fireError(rejectReason: any, ti: TransitionInstruction) {
    if (ti.done) {
      ti.done(false, false, rejectReason);
    }
    if (ti.reject && !this.destroyed) {
      ti.reject(rejectReason);
    } else {
      ti.resolve!(false);
    }
  }

  /**
   * Consumes the next transition in the queue.
   *
   * @returns whether the transition is executed.
   */
  private nextTrns(): boolean {
    // this is the framework's bread 'n butta function
    // only one transition is allowed at any given time
    if (this.isTransitioning) {
      return false;
    }

    // there is no transition happening right now, executes the next instructions.
    const ti = this.transInstr.shift();
    if (!ti) {
      return false;
    }
    this.runTransition(ti);
    return true;
  }

  /** Executes all the transition instruction from the queue. */
  private async runTransition(ti: TransitionInstruction) {
    try {
      // set that this nav is actively transitioning
      this.ionNavWillChange.emit();
      this.isTransitioning = true;
      this.prepareTI(ti);

      const leavingView = this.getActiveSync();
      const enteringView = this.getEnteringView(ti, leavingView);

      if (!leavingView && !enteringView) {
        throw new Error('no views in the stack to be removed');
      }

      if (enteringView && enteringView.state === VIEW_STATE_NEW) {
        await enteringView.init(this.el);
      }
      this.postViewInit(enteringView, leavingView, ti);

      // Needs transition?
      const requiresTransition =
        (ti.enteringRequiresTransition || ti.leavingRequiresTransition) && enteringView !== leavingView;
      if (requiresTransition && ti.opts && leavingView) {
        const isBackDirection = ti.opts.direction === 'back';

        /**
         * If heading back, use the entering page's animation
         * unless otherwise specified by the developer.
         */
        if (isBackDirection) {
          ti.opts.animationBuilder = ti.opts.animationBuilder || enteringView?.animationBuilder;
        }

        leavingView.animationBuilder = ti.opts.animationBuilder;
      }
      let result: NavResult;
      if (requiresTransition) {
        result = await this.transition(enteringView!, leavingView, ti);
      } else {
        // transition is not required, so we are already done!
        // they're inserting/removing the views somewhere in the middle or
        // beginning, so visually nothing needs to animate/transition
        // resolve immediately because there's no animation that's happening
        result = {
          hasCompleted: true,
          requiresTransition: false,
        };
      }

      this.success(result, ti);
      this.ionNavDidChange.emit();
    } catch (rejectReason) {
      this.failed(rejectReason, ti);
    }
    this.isTransitioning = false;
    this.nextTrns();
  }

  private prepareTI(ti: TransitionInstruction) {
    const viewsLength = this.views.length;

    ti.opts ??= {};
    ti.opts.delegate ??= this.delegate;

    if (ti.removeView !== undefined) {
      assert(ti.removeStart !== undefined, 'removeView needs removeStart');
      assert(ti.removeCount !== undefined, 'removeView needs removeCount');

      const index = this.views.indexOf(ti.removeView);
      if (index < 0) {
        throw new Error('removeView was not found');
      }
      ti.removeStart! += index;
    }
    if (ti.removeStart !== undefined) {
      if (ti.removeStart < 0) {
        ti.removeStart = viewsLength - 1;
      }
      if (ti.removeCount! < 0) {
        ti.removeCount = viewsLength - ti.removeStart;
      }
      ti.leavingRequiresTransition = ti.removeCount! > 0 && ti.removeStart + ti.removeCount! === viewsLength;
    }

    if (ti.insertViews) {
      // allow -1 to be passed in to auto push it on the end
      // and clean up the index if it's larger then the size of the stack
      if (ti.insertStart! < 0 || ti.insertStart! > viewsLength) {
        ti.insertStart = viewsLength;
      }
      ti.enteringRequiresTransition = ti.insertStart === viewsLength;
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
    for (const view of viewControllers) {
      view.delegate = ti.opts.delegate;
      const nav = view.nav;
      if (nav && nav !== this) {
        throw new Error('inserted view was already inserted');
      }
      if (view.state === VIEW_STATE_DESTROYED) {
        throw new Error('inserted view was already destroyed');
      }
    }
    ti.insertViews = viewControllers;
  }

  /**
   * Returns the view that will be entered considering the transition instructions.
   *
   * @param ti The instructions.
   * @param leavingView The view being left or undefined if none.
   *
   * @returns The view that will be entered, undefined if none.
   */
  private getEnteringView(
    ti: TransitionInstruction,
    leavingView: ViewController | undefined
  ): ViewController | undefined {
    // The last inserted view will be entered when view are inserted.
    const insertViews = ti.insertViews;
    if (insertViews !== undefined) {
      return insertViews[insertViews.length - 1];
    }

    // When views are deleted, we will enter the last view that is not removed and not the view being left.
    const removeStart = ti.removeStart;
    if (removeStart !== undefined) {
      const views = this.views;
      const removeEnd = removeStart + ti.removeCount!;
      for (let i = views.length - 1; i >= 0; i--) {
        const view = views[i];
        if ((i < removeStart || i >= removeEnd) && view !== leavingView) {
          return view;
        }
      }
    }

    return undefined;
  }

  /**
   * Adds and Removes the views from the navigation stack.
   *
   * @param enteringView The view being entered.
   * @param leavingView The view being left.
   * @param ti The instructions.
   */
  private postViewInit(
    enteringView: ViewController | undefined,
    leavingView: ViewController | undefined,
    ti: TransitionInstruction
  ): void {
    assert(leavingView || enteringView, 'Both leavingView and enteringView are null');
    assert(ti.resolve, 'resolve must be valid');
    assert(ti.reject, 'reject must be valid');

    // Compute the views to remove.
    const opts = ti.opts!;
    const { insertViews, removeStart, removeCount } = ti;
    /** Records the view to destroy */
    let destroyQueue: ViewController[] | undefined;

    // there are views to remove
    if (removeStart !== undefined && removeCount !== undefined) {
      assert(removeStart >= 0, 'removeStart can not be negative');
      assert(removeCount >= 0, 'removeCount can not be negative');

      destroyQueue = [];
      for (let i = removeStart; i < removeStart + removeCount; i++) {
        const view = this.views[i];
        if (view && view !== enteringView && view !== leavingView) {
          destroyQueue.push(view);
        }
      }
      // default the direction to "back"
      opts.direction ??= 'back';
    }

    const finalNumViews = this.views.length + (insertViews?.length ?? 0) - (removeCount ?? 0);
    assert(finalNumViews >= 0, 'final balance can not be negative');
    if (finalNumViews === 0) {
      console.warn(
        `You can't remove all the pages in the navigation stack. nav.pop() is probably called too many times.`,
        this,
        this.el
      );

      throw new Error('navigation stack needs at least one root page');
    }

    // At this point the transition can not be rejected, any throw should be an error
    // Insert the new views in the stack.
    if (insertViews) {
      // add the views to the
      let insertIndex = ti.insertStart!;
      for (const view of insertViews) {
        this.insertViewAt(view, insertIndex);
        insertIndex++;
      }

      if (ti.enteringRequiresTransition) {
        // default to forward if not already set
        opts.direction ??= 'forward';
      }
    }

    // if the views to be removed are in the beginning or middle
    // and there is not a view that needs to visually transition out
    // then just destroy them and don't transition anything
    // batch all of lifecycles together
    // let's make sure, callbacks are zoned
    if (destroyQueue && destroyQueue.length > 0) {
      for (const view of destroyQueue) {
        lifecycle(view.element, LIFECYCLE_WILL_LEAVE);
        lifecycle(view.element, LIFECYCLE_DID_LEAVE);
        lifecycle(view.element, LIFECYCLE_WILL_UNLOAD);
      }

      // once all lifecycle events has been delivered, we can safely detroy the views
      for (const view of destroyQueue) {
        this.destroyView(view);
      }
    }
  }

  private async transition(
    enteringView: ViewController,
    leavingView: ViewController | undefined,
    ti: TransitionInstruction
  ): Promise<NavResult> {
    // we should animate (duration > 0) if the pushed page is not the first one (startup)
    // or if it is a portal (modal, actionsheet, etc.)
    const opts = ti.opts!;

    const progressCallback = opts.progressAnimation ? (ani: Animation | undefined) => (this.sbAni = ani) : undefined;
    const mode = getIonMode(this);
    const enteringEl = enteringView.element!;
    const leavingEl = leavingView && leavingView.element!;
    const animationOpts: TransitionOptions = {
      mode,
      showGoBack: this.canGoBackSync(enteringView),
      baseEl: this.el,
      progressCallback,
      animated: this.animated && config.getBoolean('animated', true),
      enteringEl,
      leavingEl,
      ...opts,
      animationBuilder: opts.animationBuilder || this.animation || config.get('navAnimation'),
    };
    const { hasCompleted } = await transition(animationOpts);
    return this.transitionFinish(hasCompleted, enteringView, leavingView, opts);
  }

  private transitionFinish(
    hasCompleted: boolean,
    enteringView: ViewController,
    leavingView: ViewController | undefined,
    opts: NavOptions
  ): NavResult {
    const cleanupView = hasCompleted ? enteringView : leavingView;
    if (cleanupView) {
      this.cleanup(cleanupView);
    }

    return {
      hasCompleted,
      requiresTransition: true,
      enteringView,
      leavingView,
      direction: opts.direction,
    };
  }

  /**
   * Inserts a view at the specified index.
   *
   * When the view already is in the stack it will be moved to the new position.
   *
   * @param view The view to insert.
   * @param index The index where to insert the view.
   */
  private insertViewAt(view: ViewController, index: number) {
    const views = this.views;
    const existingIndex = views.indexOf(view);
    if (existingIndex > -1) {
      assert(view.nav === this, 'view is not part of the nav');
      // The view already in the stack, removes it.
      views.splice(existingIndex, 1);
      // and add it back at the requested index.
      views.splice(index, 0, view);
    } else {
      assert(!view.nav, 'nav is used');
      // this is a new view to add to the stack
      // create the new entering view
      view.nav = this;
      views.splice(index, 0, view);
    }
  }

  /**
   * Removes a view from the stack.
   *
   * @param view The view to remove.
   */
  private removeView(view: ViewController) {
    assert(
      view.state === VIEW_STATE_ATTACHED || view.state === VIEW_STATE_DESTROYED,
      'view state should be loaded or destroyed'
    );

    const views = this.views;
    const index = views.indexOf(view);
    assert(index > -1, 'view must be part of the stack');
    if (index >= 0) {
      views.splice(index, 1);
    }
  }

  private destroyView(view: ViewController) {
    view._destroy();
    this.removeView(view);
  }

  /**
   * DOM WRITE
   */
  private cleanup(activeView: ViewController) {
    // ok, cleanup time!! Destroy all of the views that are
    // INACTIVE and come after the active view
    // only do this if the views exist, though
    if (this.destroyed) {
      return;
    }
    const views = this.views;
    const activeViewIndex = views.indexOf(activeView);

    for (let i = views.length - 1; i >= 0; i--) {
      const view = views[i];

      /**
       * When inserting multiple views via insertPages
       * the last page will be transitioned to, but the
       * others will not be. As a result, a DOM element
       * will only be created for the last page inserted.
       * As a result, it is possible to have views in the
       * stack that do not have `view.element` yet.
       */
      const element = view.element;
      if (element) {
        if (i > activeViewIndex) {
          // this view comes after the active view
          // let's unload it
          lifecycle(element, LIFECYCLE_WILL_UNLOAD);
          this.destroyView(view);
        } else if (i < activeViewIndex) {
          // this view comes before the active view
          // and it is not a portal then ensure it is hidden
          setPageHidden(element!, true);
        }
      }
    }
  }

  private canStart(): boolean {
    return (
      !!this.swipeGesture &&
      !this.isTransitioning &&
      this.transInstr.length === 0 &&
      this.animationEnabled &&
      this.canGoBackSync()
    );
  }

  private onStart() {
    this.pop({ direction: 'back', progressAnimation: true });
  }

  private onMove(stepValue: number) {
    if (this.sbAni) {
      this.sbAni.progressStep(stepValue);
    }
  }

  private onEnd(shouldComplete: boolean, stepValue: number, dur: number) {
    if (this.sbAni) {
      this.animationEnabled = false;
      this.sbAni.onFinish(
        () => {
          this.animationEnabled = true;
        },
        { oneTimeCallback: true }
      );

      // Account for rounding errors in JS
      let newStepValue = shouldComplete ? -0.001 : 0.001;

      /**
       * Animation will be reversed here, so need to
       * reverse the easing curve as well
       *
       * Additionally, we need to account for the time relative
       * to the new easing curve, as `stepValue` is going to be given
       * in terms of a linear curve.
       */
      if (!shouldComplete) {
        this.sbAni.easing('cubic-bezier(1, 0, 0.68, 0.28)');
        newStepValue += getTimeGivenProgression([0, 0], [1, 0], [0.68, 0.28], [1, 1], stepValue)[0];
      } else {
        newStepValue += getTimeGivenProgression([0, 0], [0.32, 0.72], [0, 1], [1, 1], stepValue)[0];
      }

      this.sbAni.progressEnd(shouldComplete ? 1 : 0, newStepValue, dur);
    }
  }

  render() {
    return <slot></slot>;
  }
}
