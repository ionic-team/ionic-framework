import { QueueApi } from '@stencil/core';

import { LIFECYCLE_DID_ENTER, LIFECYCLE_DID_LEAVE, LIFECYCLE_WILL_ENTER, LIFECYCLE_WILL_LEAVE } from '../../components/nav/constants';
import { Animation, AnimationBuilder, NavDirection, NavOptions } from '../../interface';

const iosTransitionAnimation = () => import('./ios.transition');
const mdTransitionAnimation = () => import('./md.transition');

export function transition(opts: TransitionOptions): Promise<TransitionResult> {
  return new Promise((resolve, reject) => {
    opts.queue.write(() => {
      beforeTransition(opts);
      runTransition(opts).then(result => {
        if (result.animation) {
          result.animation.destroy();
        }
        afterTransition(opts);
        resolve(result);
      }, error => {
        afterTransition(opts);
        reject(error);
      });
    });
  });
}

function beforeTransition(opts: TransitionOptions) {
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  setZIndex(enteringEl, leavingEl, opts.direction);

  if (opts.showGoBack) {
    enteringEl.classList.add('can-go-back');
  } else {
    enteringEl.classList.remove('can-go-back');
  }
  setPageHidden(enteringEl, false);
  if (leavingEl) {
    setPageHidden(leavingEl, false);
  }
}

async function runTransition(opts: TransitionOptions): Promise<TransitionResult> {
  const animationBuilder = await getAnimationBuilder(opts);
  const ani = (animationBuilder)
    ? animation(animationBuilder, opts)
    : noAnimation(opts); // fast path for no animation

  return ani;
}

function afterTransition(opts: TransitionOptions) {
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;
  enteringEl.classList.remove('ion-page-invisible');
  if (leavingEl !== undefined) {
    leavingEl.classList.remove('ion-page-invisible');
  }
}

async function getAnimationBuilder(opts: TransitionOptions): Promise<AnimationBuilder | undefined> {
  if (!opts.leavingEl || !opts.animated || opts.duration === 0) {
    return undefined;
  }
  if (opts.animationBuilder) {
    return opts.animationBuilder;
  }
  const builder = (opts.mode === 'ios')
    ? (await iosTransitionAnimation()).iosTransitionAnimation
    : (await mdTransitionAnimation()).mdTransitionAnimation;

  return builder;
}

async function animation(animationBuilder: AnimationBuilder, opts: TransitionOptions): Promise<TransitionResult> {
  await waitForReady(opts, true);

  const trans = await import('../animation').then(mod => mod.create(animationBuilder, opts.baseEl, opts));
  fireWillEvents(opts.enteringEl, opts.leavingEl);
  await playTransition(trans, opts);
  if (opts.progressCallback) {
    opts.progressCallback(undefined);
  }

  if (trans.hasCompleted) {
    fireDidEvents(opts.enteringEl, opts.leavingEl);
  }
  return {
    hasCompleted: trans.hasCompleted,
    animation: trans
  };
}

async function noAnimation(opts: TransitionOptions): Promise<TransitionResult> {
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  await waitForReady(opts, false);

  fireWillEvents(enteringEl, leavingEl);
  fireDidEvents(enteringEl, leavingEl);

  return {
    hasCompleted: true
  };
}

async function waitForReady(opts: TransitionOptions, defaultDeep: boolean) {
  const deep = opts.deepWait !== undefined ? opts.deepWait : defaultDeep;
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

function playTransition(trans: Animation, opts: TransitionOptions): Promise<Animation> {
  const progressCallback = opts.progressCallback;
  const promise = new Promise<Animation>(resolve => trans.onFinish(resolve));

  // cool, let's do this, start the transition
  if (progressCallback) {
    // this is a swipe to go back, just get the transition progress ready
    // kick off the swipe animation start
    trans.progressStart();
    progressCallback(trans);

  } else {
    // only the top level transition should actually start "play"
    // kick it off and let it play through
    // ******** DOM WRITE ****************
    trans.play();
  }
  // create a callback for when the animation is done
  return promise;
}

function fireWillEvents(enteringEl: HTMLElement | undefined, leavingEl: HTMLElement | undefined) {
  lifecycle(leavingEl, LIFECYCLE_WILL_LEAVE);
  lifecycle(enteringEl, LIFECYCLE_WILL_ENTER);
}

function fireDidEvents(enteringEl: HTMLElement | undefined, leavingEl: HTMLElement | undefined) {
  lifecycle(enteringEl, LIFECYCLE_DID_ENTER);
  lifecycle(leavingEl, LIFECYCLE_DID_LEAVE);
}

export function lifecycle(el: HTMLElement | undefined, eventName: string) {
  if (el) {
    const ev = new CustomEvent(eventName, {
      bubbles: false,
      cancelable: false,
    });
    el.dispatchEvent(ev);
  }
}

function shallowReady(el: Element | undefined): Promise<any> {
  if (el && (el as any).componentOnReady) {
    return (el as any).componentOnReady();
  }
  return Promise.resolve();
}

export async function deepReady(el: any | undefined): Promise<void> {
  const element = el as any;
  if (element) {
    if (element.componentOnReady != null) {
      const stencilEl = await element.componentOnReady();
      if (stencilEl != null) {
        return;
      }
    }
    await Promise.all(Array.from(element.children).map(deepReady));
  }
}

export function setPageHidden(el: HTMLElement, hidden: boolean) {
  if (hidden) {
    el.setAttribute('aria-hidden', 'true');
    el.classList.add('ion-page-hidden');
  } else {
    el.hidden = false;
    el.removeAttribute('aria-hidden');
    el.classList.remove('ion-page-hidden');
  }
}

function setZIndex(
  enteringEl: HTMLElement | undefined,
  leavingEl: HTMLElement | undefined,
  direction: NavDirection | undefined,
) {
  if (enteringEl !== undefined) {
    enteringEl.style.zIndex = (direction === 'back')
      ? '99'
      : '101';
  }
  if (leavingEl !== undefined) {
    leavingEl.style.zIndex = '100';
  }
}

export interface TransitionOptions extends NavOptions {
  queue: QueueApi;
  progressCallback?: ((ani: Animation | undefined) => void);
  window: Window;
  baseEl: any;
  enteringEl: HTMLElement;
  leavingEl: HTMLElement | undefined;
}

export interface TransitionResult {
  hasCompleted: boolean;
  animation?: Animation;
}
