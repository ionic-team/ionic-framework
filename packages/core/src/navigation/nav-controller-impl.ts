
import { NavController } from './nav-controller';
import { getStateData } from './nav-controller-data';
import { NavControllerDelegate } from './nav-controller-delegate';
import {
  DIRECTION_BACK,
  DIRECTION_FORWARD,
  STATE_ATTACHED,
  STATE_DESTROYED,
  STATE_INITIALIZED,
  STATE_NEW,
  NavControllerData,
  TransitionInstruction,
} from './nav-utils';


import { ViewController } from './view-controller';
import { assert, isDef } from '../utils/helpers';

const queueMap = new Map<string, TransitionInstruction[]>();

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
  nextTransaction(ti.id);

  return promise;
}

export function nextTransaction(navId: string): Promise<any> {
  const stateData = getStateData(navId);

  if (stateData.transitioning) {
    return Promise.resolve();
  }

  const topTransaction = getTopTransaction(navId);
  if (!topTransaction) {
    return Promise.resolve();
  }

  return initializeViewBeforeTransition(topTransaction).then(([enteringView, leavingView]) => {
    return startTransition(enteringView, leavingView, topTransaction);
  });
}

export function startTransition(enteringView: ViewController, exitingView: ViewController, ti: TransitionInstruction) {
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

  // TODO - don't understand the transition controller stuff

}

export function initializeViewBeforeTransition(ti: TransitionInstruction): Promise<ViewController[]> {
  let leavingView: ViewController = null;
  let enteringView: ViewController = null;
  return startTransaction(ti).then(() => {
    return convertComponentToViewController(ti, null);
  }).then((viewControllers: ViewController[]) => {

    // TODO - probably update start here
    console.log('vc: ', viewControllers);
    leavingView = getActiveView(ti.nav.id);
    const stateData = getStateData(ti.id);
    enteringView = getEnteringView(ti, stateData, leavingView);

    if (!leavingView && !enteringView) {
      throw new Error('No views in the stack to remove');
    }

    if (enteringView && enteringView.getState() === STATE_NEW) {
      return initializeComponent(enteringView, null);
    }
    return null;
  }).then(() => {
    ti.requiresTransition = (ti.enteringRequiresTransition || ti.leavingRequiresTransition) && enteringView !== leavingView;
  }).then(() => {
    return testIfViewsCanLeaveAndEnter(enteringView, leavingView, ti);
  }).then(() => {
    return afterComponentInitialized(enteringView, leavingView, ti);
  }).then(() => {
    return [enteringView, leavingView];
  });
}

export function afterComponentInitialized(enteringView: ViewController, leavingView: ViewController, ti: TransitionInstruction): Promise<any> {
  return Promise.resolve().then(() => {
    assert(!!(leavingView || enteringView), 'Both leavingView and enteringView are null');
    assert(!!ti.resolve, 'resolve must be valid');
    assert(!!ti.reject, 'reject must be valid');

    const destroyQueue: ViewController[] = [];

    const stateData = getStateData(ti.id);

    ti.opts = ti.opts || {};

    if (isDef(ti.removeStart)) {
      assert(ti.removeStart >= 0, 'removeStart can not be negative');
      assert(ti.removeStart >= 0, 'removeCount can not be negative');

      for (let i = 0; i < ti.removeCount; i++) {
        const view = stateData.views[i + ti.removeStart];
        if (view && view !== enteringView && view !== leavingView) {
          destroyQueue.push(view);
        }
      }

      ti.opts.direction = ti.opts.direction || DIRECTION_BACK;
    }

    const finalBalance = stateData.views.length + (ti.insertViews ? ti.insertViews.length : 0) - (ti.removeCount ? ti.removeCount : 0);
    assert(finalBalance >= 0, 'final balance can not be negative');
    if (finalBalance === 0 && !stateData.isPortal) {
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
        insertViewAt(ti.nav, stateData, ti.insertViews[i], ti.insertStart + i);
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
      const lifeCyclePromises: Promise<any>[] = [];
      for (let i = 0; i < destroyQueue.length; i++) {
        const view = destroyQueue[i];
        lifeCyclePromises.push(view.willLeave(true));
        lifeCyclePromises.push(view.didLeave());
        lifeCyclePromises.push(view.willUnload());
      }

      // once all lifecycle events has been delivered, we can safely detroy the views
      return Promise.all(lifeCyclePromises).then(() => {
        const destroyQueuePromises: Promise<any>[] = [];
        for (const viewController of destroyQueue) {
          destroyQueuePromises.push(destroyView(viewController, stateData));
        }
        return Promise.all(destroyQueuePromises);
      });
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

export function destroyView(viewController: ViewController, stateData: NavControllerData) {
  return viewController.destroy().then(() => {
    return removeViewFromList(viewController, stateData);
  });
}

export function removeViewFromList(viewController: ViewController, stateData: NavControllerData) {
  assert(viewController.getState() === STATE_ATTACHED || viewController.getState() === STATE_DESTROYED, 'view state should be loaded or destroyed');
  const index = stateData.views.indexOf(viewController);
  assert(index > -1, 'view must be part of the stack');
  if (index >= 0) {
    stateData.views.splice(index, 1);
  }
}

export function insertViewAt(nav: NavController, stateData: NavControllerData, view: ViewController, index: number) {
  const existingIndex = stateData.views.indexOf(view);
  if (existingIndex > -1) {
    // this view is already in the stack!!
    // move it to its new location
    assert(view.getNav() === this, 'view is not part of the nav');
    stateData.views.splice(index, 0, stateData.views.splice(existingIndex, 1)[0]);
  } else {
    const correspondingNav = view.getNav();
    assert(!correspondingNav || (this._isPortal && correspondingNav === this), 'nav is used');
    // this is a new view to add to the stack
    // create the new entering view
    view.setNav(this);

    // give this inserted view an ID
    viewIds++;
    if (!view.id) {
      view.id = `${nav.id}-${viewIds}`;
    }

    // insert the entering view into the correct index in the stack
    stateData.views.splice(index, 0, view);
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
  if (viewController.getInstance() && viewController.getInstance()[methodName]) {
    try {
      const result = viewController.getInstance()[methodName];
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

export function initializeComponent(enteringView: ViewController, delegate: NavControllerDelegate) {
  // do whatever framework specific stuff needed to initialize a component
  // in some cases, it may even mean adding it to the dom in a hidden state
  return delegate.initializeComponent(enteringView).then(() => {
    enteringView.setState(STATE_INITIALIZED);
  });
}

export function startTransaction(ti: TransitionInstruction) {
  const stateData = getStateData(ti.id);

  const viewsLength = stateData.views ? stateData.views.length : 0;

  if (isDef(ti.removeView)) {
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

  stateData.transitioning = true;
  return Promise.resolve();
}

export function getEnteringView(ti: TransitionInstruction, stateData: NavControllerData, leavingView: ViewController): ViewController {
  if (ti.insertViews) {
    // grab the very last view of the views to be inserted
    // and initialize it as the new entering view
    return ti.insertViews[ti.insertViews.length - 1];
  }
  if (isDef(ti.removeStart)) {
    var removeEnd = ti.removeStart + ti.removeCount;
    for (let i = stateData.views.length - 1; i >= 0; i--) {
      if ((i < ti.removeStart || i >= removeEnd) && stateData.views[i] !== leavingView) {
        return stateData.views[i];
      }
    }
  }
  return null;
}

export function convertComponentToViewController(ti: TransitionInstruction, delegate: NavControllerDelegate): Promise<ViewController[]> {
  if (ti.insertViews) {
    assert(ti.insertViews.length > 0, 'length can not be zero');
    return delegate.convertViewsToViewControllers(ti.insertViews).then((viewControllers: ViewController[]) => {
      assert(ti.insertViews.length === viewControllers.length, 'lengths does not match');
      viewControllers = viewControllers.filter(v => !!v);
      if (viewControllers.length === 0) {
        throw new Error('No views to insert');
      }

      for (const viewController of viewControllers) {
        const associatedNav = viewController.getNav();
        if (associatedNav && associatedNav.id !== ti.id) {
          throw new Error('The view has already inserted into a different nav');
        }
        if (viewController.getState() === STATE_DESTROYED) {
          throw new Error('The view has already been destroyed');
        }
      }
      ti.insertViews = viewControllers;
      return viewControllers;
    });
  }
  return Promise.resolve([]);
}

export function getActiveView(id: string) {
  const views = getStateData(id).views || [];
  return views[views.length - 1];
}

export function addToQueue(ti: TransitionInstruction) {
  const list = queueMap.get(ti.id) || [];
  list.push(ti);
  queueMap.set(ti.id, list);
}

export function getQueue(id: string) {
  return queueMap.get(id) || [];
}

export function getTopTransaction(id: string) {
  const queue = getQueue(id);
  if (!queue.length) {
    return null;
  }
  const tmp = queue.concat();
  const toReturn = tmp.shift();
  queueMap.set(id, tmp);
  return toReturn;
}

let viewIds = 0;
