import { Animation, AnimationOptions, Config, FrameworkDelegate, Nav, NavOptions, Transition} from '../index';
import {
  ComponentDataPair,
  NavResult,
  TransitionInstruction,
} from './nav-interfaces';

import {
  DIRECTION_BACK,
  DIRECTION_FORWARD,
  STATE_ATTACHED,
  STATE_DESTROYED,
  STATE_NEW,
  VIEW_ID_START,
  destroyTransition,
  getHydratedTransition,
  getNextTransitionId,
  getParentTransitionId,
  isViewController,
  resolveRoute,
  setZIndex,
  toggleHidden,
  transitionFactory,
} from './nav-utils';


import { ViewController } from './view-controller';

import { assert, focusOutActiveElement, isDef, isNumber } from '../utils/helpers';

import { buildIOSTransition } from './transitions/transition.ios';
import { buildMdTransition } from './transitions/transition.md';

const queueMap = new Map<number, TransitionInstruction[]>();

// public api

export function push(nav: Nav, delegate: FrameworkDelegate, animation: Animation, component: any, data?: any, opts?: NavOptions, done?: () => void): Promise<any> {
  return queueTransaction({
    insertStart: -1,
    insertViews: [{page: component, params: data}],
    opts: opts,
    nav: nav,
    delegate: delegate,
    id: nav.navId,
    animation: animation
  }, done);
}

export function insert(nav: Nav, delegate: FrameworkDelegate, animation: Animation, insertIndex: number, page: any, params?: any, opts?: NavOptions, done?: () => void): Promise<any> {
  return queueTransaction({
    insertStart: insertIndex,
    insertViews: [{ page: page, params: params }],
    opts: opts,
    nav: nav,
    delegate: delegate,
    id: nav.navId,
    animation: animation
  }, done);
}

export function insertPages(nav: Nav, delegate: FrameworkDelegate, animation: Animation, insertIndex: number, insertPages: any[], opts?: NavOptions, done?: () => void): Promise<any> {
  return queueTransaction({
    insertStart: insertIndex,
    insertViews: insertPages,
    opts: opts,
    nav: nav,
    delegate: delegate,
    id: nav.navId,
    animation: animation
  }, done);
}

export function pop(nav: Nav, delegate: FrameworkDelegate, animation: Animation, opts?: NavOptions, done?: () => void): Promise<any> {
  return queueTransaction({
    removeStart: -1,
    removeCount: 1,
    opts: opts,
    nav: nav,
    delegate: delegate,
    id: nav.navId,
    animation: animation
  }, done);
}

export function popToRoot(nav: Nav, delegate: FrameworkDelegate, animation: Animation, opts?: NavOptions, done?: () => void): Promise<any> {
  return queueTransaction({
    removeStart: 1,
    removeCount: -1,
    opts: opts,
    nav: nav,
    delegate: delegate,
    id: nav.navId,
    animation: animation
  }, done);
}

export function popTo(nav: Nav, delegate: FrameworkDelegate, animation: Animation, indexOrViewCtrl: any, opts?: NavOptions, done?: () => void): Promise<any> {
  const config: TransitionInstruction = {
    removeStart: -1,
    removeCount: -1,
    opts: opts,
    nav: nav,
    delegate: delegate,
    id: nav.navId,
    animation: animation
  };
  if (isViewController(indexOrViewCtrl)) {
    config.removeView = indexOrViewCtrl;
    config.removeStart = 1;
  } else if (isNumber(indexOrViewCtrl)) {
    config.removeStart = indexOrViewCtrl + 1;
  }
  return queueTransaction(config, done);
}

export function remove(nav: Nav, delegate: FrameworkDelegate, animation: Animation, startIndex: number, removeCount: number = 1, opts?: NavOptions, done?: () => void): Promise<any> {
  return queueTransaction({
    removeStart: startIndex,
    removeCount: removeCount,
    opts: opts,
    nav: nav,
    delegate: delegate,
    id: nav.navId,
    animation: animation
  }, done);
}

export function removeView(nav: Nav, delegate: FrameworkDelegate, animation: Animation, viewController: ViewController, opts?: NavOptions, done?: () => void): Promise<any> {
  return queueTransaction({
    removeView: viewController,
    removeStart: 0,
    removeCount: 1,
    opts: opts,
    nav: nav,
    delegate: delegate,
    id: nav.navId,
    animation: animation
  }, done);
}

export function setRoot(nav: Nav, delegate: FrameworkDelegate, animation: Animation, page: any, params?: any, opts?: NavOptions, done?: () => void): Promise<any> {
  return setPages(nav, delegate, animation, [{ page: page, params: params }], opts, done);
}

export function setPages(nav: Nav, delegate: FrameworkDelegate, animation: Animation, componentDataPars: ComponentDataPair[], opts?: NavOptions, done?: () => void): Promise<any> {
  if (!isDef(opts)) {
    opts = {};
  }
  if (opts.animate !== true) {
    opts.animate = false;
  }
  return queueTransaction({
    insertStart: 0,
    insertViews: componentDataPars,
    removeStart: 0,
    removeCount: -1,
    opts: opts,
    nav: nav,
    delegate: delegate,
    id: nav.navId,
    animation: animation
  }, done);
}











// private api, exported for testing
export function queueTransaction(ti: TransitionInstruction, done: () => void): Promise<boolean> {
  const promise = new Promise<boolean>((resolve, reject) => {
    ti.resolve = resolve;
    ti.reject = reject;
  });
  ti.done = done;

  // Normalize empty
  if (ti.insertViews && ti.insertViews.length === 0) {
    ti.insertViews = undefined;
  }

  // Normalize empty
  if (ti.insertViews && ti.insertViews.length === 0) {
    ti.insertViews = undefined;
  }

  // Enqueue transition instruction
  addToQueue(ti);

  // if there isn't a transition already happening
  // then this will kick off this transition
  nextTransaction(ti.nav);

  return promise;
}

export function nextTransaction(nav: Nav): Promise<any> {

  if (nav.transitioning) {
    return Promise.resolve();
  }

  const topTransaction = getTopTransaction(nav.navId);
  if (!topTransaction) {
    return Promise.resolve();
  }

  let enteringView: ViewController;
  let leavingView: ViewController;
  return initializeViewBeforeTransition(nav, topTransaction).then(([_enteringView, _leavingView]) => {
    enteringView = _enteringView;
    leavingView = _leavingView;
    return attachViewToDom(nav, enteringView, topTransaction.delegate);
  }).then(() => {
    return loadViewAndTransition(nav, enteringView, leavingView, topTransaction);
    }).then((result: NavResult) => {
      nav.ionNavChanged.emit({ isPop: false });
    return successfullyTransitioned(result, topTransaction);
  }).catch((err: Error) => {
    return transitionFailed(err, topTransaction);
  });
}

export function successfullyTransitioned(result: NavResult, ti: TransitionInstruction) {
  const queue = getQueue(ti.id);
  if (!queue) {
    // TODO, make throw error in the future
    return fireError(new Error('Queue is null, the nav must have been destroyed'), ti);
  }

  ti.nav.isViewInitialized = true;
  ti.nav.transitionId = null;
  ti.nav.transitioning = false;

  // TODO - check if it's a swipe back

  // kick off next transition for this nav I guess
  nextTransaction(ti.nav);

  if (ti.done) {
    ti.done(
      result.hasCompleted,
      result.requiresTransition,
      result.enteringName,
      result.leavingName,
      result.direction
    );
  }
  ti.resolve(result.hasCompleted);
}

export function transitionFailed(error: Error, ti: TransitionInstruction) {
  const queue = getQueue(ti.nav.navId);
  if (!queue) {
    // TODO, make throw error in the future
    return fireError(new Error('Queue is null, the nav must have been destroyed'), ti);
  }

  ti.nav.transitionId = null;
  resetQueue(ti.nav.navId);

  ti.nav.transitioning = false;

  // TODO - check if it's a swipe back

  // kick off next transition for this nav I guess
  nextTransaction(ti.nav);

  fireError(error, ti);
}

export function fireError(error: Error, ti: TransitionInstruction) {
  if (ti.done) {
    ti.done(false, false, error.message);
  }
  if (ti.reject && !ti.nav.destroyed) {
    ti.reject(error);
  } else {
    ti.resolve(false);
  }
}

export function loadViewAndTransition(nav: Nav, enteringView: ViewController, leavingView: ViewController, ti: TransitionInstruction) {
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

  let transition: Transition = null;
  const transitionId = getParentTransitionId(nav);
  nav.transitionId = transitionId >= 0 ? transitionId : getNextTransitionId();

  // create the transition options
  const animationOpts: AnimationOptions = {
    animation: ti.opts.animation,
    direction: ti.opts.direction,
    duration: (ti.opts.animate === false ? 0 : ti.opts.duration),
    easing: ti.opts.easing,
    isRTL: false, // TODO
    ev: ti.opts.event,
  };



  const emptyTransition = transitionFactory(ti.animation);
  transition = getHydratedTransition(animationOpts.animation, nav.config, nav.transitionId, emptyTransition, enteringView, leavingView, animationOpts, getDefaultTransition(nav.config));

  if (nav.swipeToGoBackTransition) {
    nav.swipeToGoBackTransition.destroy();
    nav.swipeToGoBackTransition = null;
  }

  // it's a swipe to go back transition
  if (transition.isRoot() && ti.opts.progressAnimation) {
    nav.swipeToGoBackTransition = transition;
  }

  transition.start();

  return executeAsyncTransition(nav, transition, enteringView, leavingView, ti.delegate, ti.opts, ti.nav.config.getBoolean('animate'));
}

// TODO - transition type
export function executeAsyncTransition(nav: Nav, transition: Transition, enteringView: ViewController, leavingView: ViewController, delegate: FrameworkDelegate, opts: NavOptions, configShouldAnimate: boolean): Promise<NavResult> {
  assert(nav.transitioning, 'must be transitioning');
  nav.transitionId = null;
  setZIndex(nav, enteringView, leavingView, opts.direction);

  // always ensure the entering view is viewable
  // ******** DOM WRITE ****************
  // TODO, figure out where we want to read this data from
  enteringView && toggleHidden(enteringView.element, true, true);

  // always ensure the leaving view is viewable
  // ******** DOM WRITE ****************
  leavingView && toggleHidden(leavingView.element, true, true);

  const isFirstPage = !nav.isViewInitialized && nav.views.length === 1;
  const shouldNotAnimate = isFirstPage && !nav.isPortal;
  if (configShouldAnimate || shouldNotAnimate) {
    opts.animate = false;
  }

  if (opts.animate === false) {
    // if it was somehow set to not animation, then make the duration zero
    transition.duration(0);
  }

  transition.beforeAddRead(() => {
    fireViewWillLifecycles(enteringView, leavingView);
  });

  // get the set duration of this transition
  const duration = transition.getDuration();

  // create a callback for when the animation is done
  const transitionCompletePromise = new Promise(resolve => {
    transition.onFinish(resolve);
  });

  if (transition.isRoot()) {
    if (duration > DISABLE_APP_MINIMUM_DURATION && opts.disableApp !== false) {
      // if this transition has a duration and this is the root transition
      // then set that the app is actively disabled
      // this._app.setEnabled(false, duration + ACTIVE_TRANSITION_OFFSET, opts.minClickBlockDuration);

      // TODO - figure out how to disable the app
    }

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

  return transitionCompletePromise.then(() => {
    return transitionFinish(nav, transition, delegate, opts);
  });
}

export function transitionFinish(nav: Nav, transition: Transition, delegate: FrameworkDelegate, opts: NavOptions): Promise<NavResult> {

  let promise: Promise<any> = null;

  if (transition.hasCompleted) {
    transition.enteringView && transition.enteringView.didEnter();
    transition.leavingView && transition.leavingView.didLeave();

    promise = cleanUpView(nav, delegate, transition.enteringView);
  } else {
    promise = cleanUpView(nav, delegate, transition.leavingView);
  }

  return promise.then(() => {
    if (transition.isRoot())  {

      destroyTransition(transition.transitionId);

      // TODO - enable app

      nav.transitioning = false;

      // TODO - navChange on the deep linker used to be called here

      if (opts.keyboardClose !== false) {
        focusOutActiveElement();
      }
    }

    return {
      hasCompleted: transition.hasCompleted,
      requiresTransition: true,
      direction: opts.direction
    };
  });
}

export function cleanUpView(nav: Nav, delegate: FrameworkDelegate, activeViewController: ViewController): Promise<any> {

  if (nav.destroyed) {
    return Promise.resolve();
  }

  const activeIndex = nav.views.indexOf(activeViewController);
  const promises: Promise<any>[] = [];
  for (let i  = nav.views.length - 1; i >= 0; i--) {
    const inactiveViewController = nav.views[i];
    if (i > activeIndex) {
      // this view comes after the active view
      inactiveViewController.willUnload();
      promises.push(destroyView(nav, delegate, inactiveViewController));
    } else if ( i < activeIndex && !nav.isPortal) {
      // this view comes before the active view
      // and it is not a portal then ensure it is hidden
      toggleHidden(inactiveViewController.element, true, false);
    }
    // TODO - review existing z index code!
  }
  return Promise.all(promises);
}


export function fireViewWillLifecycles(enteringView: ViewController, leavingView: ViewController) {
  leavingView && leavingView.willLeave(!enteringView);
  enteringView && enteringView.willEnter();
}

export function attachViewToDom(nav: Nav, enteringView: ViewController, delegate: FrameworkDelegate) {
  if (enteringView && enteringView.state === STATE_NEW) {
    return delegate.attachViewToDom(nav, enteringView).then(() => {
      enteringView.state = STATE_ATTACHED;
    });
  }
  // it's in the wrong state, so don't attach and just return
  return Promise.resolve();
}

export function initializeViewBeforeTransition(nav: Nav, ti: TransitionInstruction): Promise<ViewController[]> {
  let leavingView: ViewController = null;
  let enteringView: ViewController = null;
  return startTransaction(ti).then(() => {
    const viewControllers = convertComponentToViewController(nav, ti);
    ti.insertViews = viewControllers;
    leavingView = ti.nav.getActive();
    enteringView = getEnteringView(ti, ti.nav, leavingView);

    if (!leavingView && !enteringView) {
      return Promise.reject(new Error('No views in the stack to remove'));
    }

    // mark state as initialized
    // enteringView.state = STATE_INITIALIZED;
    ti.requiresTransition = (ti.enteringRequiresTransition || ti.leavingRequiresTransition) && enteringView !== leavingView;
    return testIfViewsCanLeaveAndEnter(enteringView, leavingView, ti);
  }).then(() => {
    return updateNavStacks(enteringView, leavingView, ti);
  }).then(() => {
    return [enteringView, leavingView];
  });
}

// called _postViewInit in old world
export function updateNavStacks(enteringView: ViewController, leavingView: ViewController, ti: TransitionInstruction): Promise<any> {
  return Promise.resolve().then(() => {
    assert(!!(leavingView || enteringView), 'Both leavingView and enteringView are null');
    assert(!!ti.resolve, 'resolve must be valid');
    assert(!!ti.reject, 'reject must be valid');

    const destroyQueue: ViewController[] = [];

    ti.opts = ti.opts || {};

    if (isDef(ti.removeStart)) {
      assert(ti.removeStart >= 0, 'removeStart can not be negative');
      assert(ti.removeStart >= 0, 'removeCount can not be negative');

      for (let i = 0; i < ti.removeCount; i++) {
        const view = ti.nav.views[i + ti.removeStart];
        if (view && view !== enteringView && view !== leavingView) {
          destroyQueue.push(view);
        }
      }

      ti.opts.direction = ti.opts.direction || DIRECTION_BACK;
    }

    const finalBalance = ti.nav.views.length + (ti.insertViews ? ti.insertViews.length : 0) - (ti.removeCount ? ti.removeCount : 0);
    assert(finalBalance >= 0, 'final balance can not be negative');
    if (finalBalance === 0 && !ti.nav.isPortal) {
      console.warn(`You can't remove all the pages in the navigation stack. nav.pop() is probably called too many times.`);
      throw new Error('Navigation stack needs at least one root page');
    }

    // At this point the transition can not be rejected, any throw should be an error
    // there are views to insert
    if (ti.insertViews) {
      // manually set the new view's id if an id was passed in the options
      if (isDef(ti.opts.id)) {
        enteringView.id = ti.opts.id;
      }

      // add the views to the stack
      for (let i = 0; i < ti.insertViews.length; i++) {
        insertViewIntoNav(ti.nav, ti.insertViews[i], ti.insertStart + i);
      }

      if (ti.enteringRequiresTransition) {
        // default to forward if not already set
        ti.opts.direction = ti.opts.direction || DIRECTION_FORWARD;
      }
    }

    // if the views to be removed are in the beginning or middle
    // and there is not a view that needs to visually transition out
    // then just destroy them and don't transition anything
    // batch all of lifecycles together
    if (destroyQueue && destroyQueue.length) {
      // TODO, figure out how the zone stuff should work in angular
      for (let i = 0; i < destroyQueue.length; i++) {
        const view = destroyQueue[i];
        view.willLeave(true);
        view.didLeave();
        view.willUnload();
      }

      const destroyQueuePromises: Promise<any>[] = [];
      for (const viewController of destroyQueue) {
        destroyQueuePromises.push(destroyView(ti.nav, ti.delegate, viewController));
      }
      return Promise.all(destroyQueuePromises);
    }
    return null;
  }).then(() => {
    // set which animation it should use if it wasn't set yet
    if (ti.requiresTransition && !ti.opts.animation) {
      if (isDef(ti.removeStart)) {
        ti.opts.animation = (leavingView || enteringView).getTransitionName(ti.opts.direction);
      } else {
        ti.opts.animation = (enteringView || leavingView).getTransitionName(ti.opts.direction);
      }
    }
  });
}

export function destroyView(nav: Nav, delegate: FrameworkDelegate, viewController: ViewController) {
  return viewController.destroy(delegate).then(() => {
    return removeViewFromList(nav, viewController);
  });
}

export function removeViewFromList(nav: Nav, viewController: ViewController) {
  assert(viewController.state === STATE_ATTACHED || viewController.state === STATE_DESTROYED, 'view state should be loaded or destroyed');
  const index = nav.views.indexOf(viewController);
  assert(index > -1, 'view must be part of the stack');
  if (index >= 0) {
    nav.views.splice(index, 1);
  }
}

export function insertViewIntoNav(nav: Nav, view: ViewController, index: number) {
  const existingIndex = nav.views.indexOf(view);
  if (existingIndex > -1) {
    // this view is already in the stack!!
    // move it to its new location
    assert(view.nav === nav, 'view is not part of the nav');
    nav.views.splice(index, 0, nav.views.splice(existingIndex, 1)[0]);
  } else {
    assert(!view.nav || (nav.isPortal && view.nav === nav), 'nav is used');
    // this is a new view to add to the stack
    // create the new entering view
    view.nav = nav;

    // give this inserted view an ID
    viewIds++;
    if (!view.id) {
      view.id = `${nav.navId}-${viewIds}`;
    }

    // insert the entering view into the correct index in the stack
    nav.views.splice(index, 0, view);
  }
}

export function testIfViewsCanLeaveAndEnter(enteringView: ViewController, leavingView: ViewController, ti: TransitionInstruction) {
  if (!ti.requiresTransition) {
    return Promise.resolve();
  }

  const promises: Promise<any>[] = [];


  if (leavingView) {
    promises.push(lifeCycleTest(leavingView, 'Leave'));
  }
  if (enteringView) {
    promises.push(lifeCycleTest(enteringView, 'Enter'));
  }

  if (promises.length === 0) {
    return Promise.resolve();
  }

  // darn, async promises, gotta wait for them to resolve
  return Promise.all(promises).then((values: any[]) => {
    if (values.some(result => result === false)) {
      ti.reject = null;
      throw new Error('canEnter/Leave returned false');
    }
  });
}

export function lifeCycleTest(viewController: ViewController, enterOrLeave: string) {
  const methodName = `ionViewCan${enterOrLeave}`;
  if (viewController.instance && viewController.instance[methodName]) {
    try {
      const result = viewController.instance[methodName];
      if (result instanceof Promise) {
        return result;
      }
      return Promise.resolve(result !== false);
    } catch (e) {
      return Promise.reject(new Error(`Unexpected error when calling ${methodName}: ${e.message}`));
    }
  }
  return Promise.resolve(true);
}

export function startTransaction(ti: TransitionInstruction): Promise<any> {

  const viewsLength = ti.nav.views ? ti.nav.views.length : 0;

  if (isDef(ti.removeView)) {
    assert(isDef(ti.removeStart), 'removeView needs removeStart');
    assert(isDef(ti.removeCount), 'removeView needs removeCount');

    const index = ti.nav.views.indexOf(ti.removeView());
    if (index < 0) {
      return Promise.reject(new Error('The removeView was not found'));
    }
    ti.removeStart += index;
  }

  if (isDef(ti.removeStart)) {
    if (ti.removeStart < 0) {
      ti.removeStart = (viewsLength - 1);
    }
    if (ti.removeCount < 0) {
      ti.removeCount = (viewsLength - ti.removeStart);
    }
    ti.leavingRequiresTransition = (ti.removeCount > 0) && ((ti.removeStart + ti.removeCount) === viewsLength);
  }

  if (isDef(ti.insertViews)) {
    // allow -1 to be passed in to auto push it on the end
    // and clean up the index if it's larger then the size of the stack
    if (ti.insertStart < 0 || ti.insertStart > viewsLength) {
      ti.insertStart = viewsLength;
    }
    ti.enteringRequiresTransition = (ti.insertStart === viewsLength);
  }

  ti.nav.transitioning = true;

  return Promise.resolve();
}

export function getEnteringView(ti: TransitionInstruction, nav: Nav, leavingView: ViewController): ViewController {
  if (ti.insertViews && ti.insertViews.length) {
    // grab the very last view of the views to be inserted
    // and initialize it as the new entering view
    return ti.insertViews[ti.insertViews.length - 1];
  }
  if (isDef(ti.removeStart)) {
    var removeEnd = ti.removeStart + ti.removeCount;
    for (let i = nav.views.length - 1; i >= 0; i--) {
      if ((i < ti.removeStart || i >= removeEnd) && nav.views[i] !== leavingView) {
        return nav.views[i];
      }
    }
  }
  return null;
}

export function convertViewsToViewControllers(views: any[]): ViewController[] {
  return views.map(view => {
    if (view) {
      if (isViewController(view)) {
        return view as ViewController;
      }
      return new ViewController(view.page, view.params);
    }
    return null;
  }).filter(view => !!view);
}

export function convertComponentToViewController(nav: Nav, ti: TransitionInstruction): ViewController[] {
  if (ti.insertViews) {
    assert(ti.insertViews.length > 0, 'length can not be zero');
    const viewControllers = convertViewsToViewControllers(ti.insertViews);
    assert(ti.insertViews.length === viewControllers.length, 'lengths does not match');
    if (viewControllers.length === 0) {
      throw new Error('No views to insert');
    }

    for (const viewController of viewControllers) {
      if (viewController.nav && viewController.nav.navId !== ti.id) {
        throw new Error('The view has already inserted into a different nav');
      }
      if (viewController.state === STATE_DESTROYED) {
        throw new Error('The view has already been destroyed');
      }
      if (nav.useRouter && !resolveRoute(nav, viewController.component)) {
        throw new Error('Route not specified for ' + viewController.component);
      }
    }
    return viewControllers;
  }
  return [];
}

export function addToQueue(ti: TransitionInstruction) {
  const list = queueMap.get(ti.id) || [];
  list.push(ti);
  queueMap.set(ti.id, list);
}

export function getQueue(id: number) {
  return queueMap.get(id) || [];
}

export function resetQueue(id: number) {
  queueMap.set(id, []);
}

export function getTopTransaction(id: number) {
  const queue = getQueue(id);
  if (!queue.length) {
    return null;
  }
  const tmp = queue.concat();
  const toReturn = tmp.shift();
  queueMap.set(id, tmp);
  return toReturn;
}

export function getDefaultTransition(config: Config) {
  return config.get('mode') === 'md' ? buildMdTransition : buildIOSTransition;
}

let viewIds = VIEW_ID_START;
const DISABLE_APP_MINIMUM_DURATION = 64;
