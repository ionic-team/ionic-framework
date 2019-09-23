import { writeTask } from '@stencil/core';

import { LIFECYCLE_DID_ENTER, LIFECYCLE_DID_LEAVE, LIFECYCLE_WILL_ENTER, LIFECYCLE_WILL_LEAVE } from '../../components/nav/constants';
import { Animation, AnimationBuilder, IonicAnimation, NavDirection, NavOptions } from '../../interface';

const iosTransitionAnimation = () => import('./ios.transition');
const mdTransitionAnimation = () => import('./md.transition');

// TODO: Remove when removing AnimationBuilder
export type IonicAnimationInterface = ((navEl: HTMLElement, opts: TransitionOptions) => IonicAnimation) | ((navEl: HTMLElement, opts: TransitionOptions) => Promise<IonicAnimation>);

export const transition = (opts: TransitionOptions): Promise<TransitionResult> => {
  return new Promise((resolve, reject) => {
    writeTask(() => {
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
};

const beforeTransition = (opts: TransitionOptions) => {
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
};

const runTransition = async (opts: TransitionOptions): Promise<TransitionResult> => {
  const animationBuilder = await getAnimationBuilder(opts);

  const ani = (animationBuilder)
    ? animation(animationBuilder, opts)
    : noAnimation(opts); // fast path for no animation

  return ani;
};

const afterTransition = (opts: TransitionOptions) => {
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;
  enteringEl.classList.remove('ion-page-invisible');
  if (leavingEl !== undefined) {
    leavingEl.classList.remove('ion-page-invisible');
  }
};

const getAnimationBuilder = async (opts: TransitionOptions): Promise<IonicAnimationInterface | AnimationBuilder | undefined> => {
  if (!opts.leavingEl || !opts.animated || opts.duration === 0) {
    return undefined;
  }

  if (opts.animationBuilder) {
    return opts.animationBuilder;
  }

  const getAnimation = (opts.mode === 'ios')
    ? (await iosTransitionAnimation()).iosTransitionAnimation
    : (await mdTransitionAnimation()).mdTransitionAnimation;

  return getAnimation;
};

const animation = async (animationBuilder: IonicAnimationInterface | AnimationBuilder, opts: TransitionOptions): Promise<TransitionResult> => {
  await waitForReady(opts, true);

  let trans: Animation | IonicAnimation;

  try {
    const mod = await import('../animation/old-animation');
    trans = await mod.create(animationBuilder as AnimationBuilder, opts.baseEl, opts);
  } catch (err) {
    trans = (animationBuilder as IonicAnimationInterface)(opts.baseEl, opts) as IonicAnimation;
  }

  fireWillEvents(opts.enteringEl, opts.leavingEl);

  const didComplete = await playTransition(trans, opts);

  // TODO: Remove AnimationBuilder
  (trans as any).hasCompleted = didComplete;

  if (opts.progressCallback) {
    opts.progressCallback(undefined);
  }

  if ((trans as any).hasCompleted) {
    fireDidEvents(opts.enteringEl, opts.leavingEl);
  }

  return {
    hasCompleted: (trans as any).hasCompleted,
    animation: trans
  };
};

const noAnimation = async (opts: TransitionOptions): Promise<TransitionResult> => {
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  await waitForReady(opts, false);

  fireWillEvents(enteringEl, leavingEl);
  fireDidEvents(enteringEl, leavingEl);

  return {
    hasCompleted: true
  };
};

const waitForReady = async (opts: TransitionOptions, defaultDeep: boolean) => {
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
};

const notifyViewReady = async (viewIsReady: undefined | ((enteringEl: HTMLElement) => Promise<any>), enteringEl: HTMLElement) => {
  if (viewIsReady) {
    await viewIsReady(enteringEl);
  }
};

const playTransition = (trans: IonicAnimation | Animation, opts: TransitionOptions): Promise<Animation | boolean> => {
  const progressCallback = opts.progressCallback;

  // TODO: Remove AnimationBuilder
  const promise = new Promise<Animation | boolean>(resolve => trans.onFinish(resolve));

  // cool, let's do this, start the transition
  if (progressCallback) {
    // this is a swipe to go back, just get the transition progress ready
    // kick off the swipe animation start
    trans.progressStart(true);
    progressCallback(trans);

  } else {
    // only the top level transition should actually start "play"
    // kick it off and let it play through
    // ******** DOM WRITE ****************
    trans.play();
  }
  // create a callback for when the animation is done
  return promise;
};

const fireWillEvents = (enteringEl: HTMLElement | undefined, leavingEl: HTMLElement | undefined) => {
  lifecycle(leavingEl, LIFECYCLE_WILL_LEAVE);
  lifecycle(enteringEl, LIFECYCLE_WILL_ENTER);
};

const fireDidEvents = (enteringEl: HTMLElement | undefined, leavingEl: HTMLElement | undefined) => {
  lifecycle(enteringEl, LIFECYCLE_DID_ENTER);
  lifecycle(leavingEl, LIFECYCLE_DID_LEAVE);
};

export const lifecycle = (el: HTMLElement | undefined, eventName: string) => {
  if (el) {
    const ev = new CustomEvent(eventName, {
      bubbles: false,
      cancelable: false,
    });
    el.dispatchEvent(ev);
  }
};

const shallowReady = (el: Element | undefined): Promise<any> => {
  if (el && (el as any).componentOnReady) {
    return (el as any).componentOnReady();
  }
  return Promise.resolve();
};

export const deepReady = async (el: any | undefined): Promise<void> => {
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
};

export const setPageHidden = (el: HTMLElement, hidden: boolean) => {
  if (hidden) {
    el.setAttribute('aria-hidden', 'true');
    el.classList.add('ion-page-hidden');
  } else {
    el.hidden = false;
    el.removeAttribute('aria-hidden');
    el.classList.remove('ion-page-hidden');
  }
};

const setZIndex = (
  enteringEl: HTMLElement | undefined,
  leavingEl: HTMLElement | undefined,
  direction: NavDirection | undefined,
) => {
  if (enteringEl !== undefined) {
    enteringEl.style.zIndex = (direction === 'back')
      ? '99'
      : '101';
  }
  if (leavingEl !== undefined) {
    leavingEl.style.zIndex = '100';
  }
};

export interface TransitionOptions extends NavOptions {
  progressCallback?: ((ani: IonicAnimation | Animation | undefined) => void);
  baseEl: any;
  enteringEl: HTMLElement;
  leavingEl: HTMLElement | undefined;
}

export interface TransitionResult {
  hasCompleted: boolean;
  animation?: Animation | IonicAnimation;
}
