import { Animation, AnimationBuilder } from '../';
import { NavDirection } from '../components/nav/nav-util';

export function transition(opts: AnimationOptions): Promise<Animation|null> {
  beforeTransition(opts);

  return (opts.leavingEl && (opts.animationBuilder || opts.animation))
    ? animation(opts)
    : noAnimation(opts); // fast path for no animation
}

function beforeTransition(opts: AnimationOptions) {
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  setZIndex(enteringEl, leavingEl, opts.direction);

  if (opts.showGoBack) {
    enteringEl.classList.add('can-go-back');
  } else {
    enteringEl.classList.remove('can-go-back');
  }
  enteringEl.hidden = false;
  if (leavingEl) {
    leavingEl.hidden = false;
  }
}

async function animation(opts: AnimationOptions): Promise<Animation> {
  await waitForReady(opts, true);

  const trns = await createTransition(opts);
  fireWillEvents(opts.window, opts.enteringEl, opts.leavingEl);
  await playTransition(trns, opts);

  if (trns.hasCompleted) {
    fireDidEvents(opts.window, opts.enteringEl, opts.leavingEl);
  }
  return trns;
}

async function noAnimation(opts: AnimationOptions): Promise<null> {
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;
  if (enteringEl) {
    enteringEl.classList.remove('hide-page');
  }
  if (leavingEl) {
    leavingEl.classList.remove('hide-page');
  }
  await waitForReady(opts, false);

  fireWillEvents(opts.window, enteringEl, leavingEl);
  fireDidEvents(opts.window, enteringEl, leavingEl);
  return null;
}

async function waitForReady(opts: AnimationOptions, defaultDeep: boolean) {
  const deep = opts.deepWait != null ? opts.deepWait : defaultDeep;
  const promises = deep ? [
    deepReady(opts.enteringEl),
    deepReady(opts.leavingEl),
  ] : [
    shallowReady(opts.enteringEl),
    shallowReady(opts.leavingEl),
  ];

  await Promise.all(promises);
  await notifyViewReady(opts.viewIsReady, opts.enteringEl);
}

async function notifyViewReady(viewIsReady: undefined | ((enteringEl: HTMLElement) => Promise<any>), enteringEl: HTMLElement) {
  if (viewIsReady) {
    await viewIsReady(enteringEl);
  }
}

function createTransition(opts: AnimationOptions) {
  if (opts.animation) {
    return opts.animation;
  }
  return opts.animationCtrl.create(opts.animationBuilder, opts.baseEl, opts);
}

function playTransition(transition: Animation, opts: AnimationOptions): Promise<Animation> {
  const progressAnimation = opts.progressAnimation;
  const promise = new Promise<Animation>(resolve => transition.onFinish(resolve));

  // cool, let's do this, start the transition
  if (progressAnimation) {
    // this is a swipe to go back, just get the transition progress ready
    // kick off the swipe animation start
    transition.progressStart();
    progressAnimation(transition);

  } else {
    // only the top level transition should actually start "play"
    // kick it off and let it play through
    // ******** DOM WRITE ****************
    transition.play();
  }
  // create a callback for when the animation is done
  return promise;
}

function fireWillEvents(win: Window, enteringEl: HTMLElement|undefined, leavingEl: HTMLElement|undefined) {
  lifecycle(win, leavingEl, ViewLifecycle.WillLeave);
  lifecycle(win, enteringEl, ViewLifecycle.WillEnter);
}

function fireDidEvents(win: Window, enteringEl: HTMLElement|undefined, leavingEl: HTMLElement|undefined) {
  lifecycle(win, enteringEl, ViewLifecycle.DidEnter);
  lifecycle(win, leavingEl, ViewLifecycle.DidLeave);
}

export function lifecycle(win: Window, el: HTMLElement|undefined, eventName: ViewLifecycle) {
  if (el) {
    const CEvent: typeof CustomEvent = (win as any).CustomEvent;
    const event = new CEvent(eventName, {
      bubbles: false,
      cancelable: false,
    });
    el.dispatchEvent(event);
  }
}

function shallowReady(el: Element|undefined): Promise<any> {
  if (el && (el as any).componentOnReady) {
    return (el as any).componentOnReady();
  }
  return Promise.resolve();
}

function deepReady(el: Element|undefined): Promise<any> {
  if (!el) {
    return Promise.resolve();
  }
  if (customElements.get) {
    if (customElements.get(el.tagName.toLowerCase())) {
      return componentOnReady(el);
    } else {
      return Promise.all(Array.from(el.children).map(deepReady));
    }
  }
  return componentOnReady(el);
}

function componentOnReady(el: Element) {
  if ((el as any).componentOnReady) {
    return (el as any).componentOnReady();
  } else {
    return Promise.all(Array.from(el.children).map(deepReady));
  }
}

function setZIndex(
  enteringEl: HTMLElement | undefined,
  leavingEl: HTMLElement | undefined,
  direction: NavDirection | undefined,
) {
  if (enteringEl) {
    enteringEl.style.zIndex = (direction === NavDirection.Back)
      ? '99'
      : '101';
  }
  if (leavingEl) {
    leavingEl.style.zIndex = '100';
  }
}

export const enum ViewLifecycle {
  WillEnter = 'ionViewWillEnter',
  DidEnter = 'ionViewDidEnter',
  WillLeave = 'ionViewWillLeave',
  DidLeave = 'ionViewDidLeave',
  WillUnload = 'ionViewWillUnload',
}

export interface AnimationOptions {
  animationCtrl: HTMLIonAnimationControllerElement;
  animationBuilder: AnimationBuilder|undefined;
  animation?: Animation;
  direction?: NavDirection;
  duration?: number;
  easing?: string;
  deepWait?: boolean;
  viewIsReady?: (enteringEl: HTMLElement) => Promise<any>;
  showGoBack?: boolean;
  progressAnimation?: Function;
  window: Window;
  enteringEl: HTMLElement;
  leavingEl: HTMLElement|undefined;
  baseEl: HTMLElement;
}
