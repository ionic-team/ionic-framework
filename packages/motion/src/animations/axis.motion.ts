import { Animation, AnimationBuilder, createAnimation } from '@ionic/core';
import { AnimationOptions, Axis } from '../';

const createXAxisTransition = (enteringEl: HTMLElement, leavingEl: HTMLElement, backDirection: boolean): Animation[] => {
  const enteringTransition = createAnimation().addElement(enteringEl);
  const leavingTransition = createAnimation().addElement(leavingEl);

  if (backDirection) {
    enteringTransition
      .keyframes([
        { offset: 0, opacity: 0, transform: 'translate3d(-30px, 0, 0)' },
        { offset: 0.3, opacity: 0 },
        { offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ]);

    leavingTransition
      .keyframes([
        { offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' },
        { offset: 0.3, opacity: 0 },
        { offset: 1, opacity: 0, transform: 'translate3d(30px, 0, 0)' },
      ]);
  } else {
    enteringTransition
      .keyframes([
        { offset: 0, opacity: 0, transform: 'translate3d(30px, 0, 0)' },
        { offset: 0.3, opacity: 0 },
        { offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ]);

    leavingTransition
      .keyframes([
        { offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' },
        { offset: 0.3, opacity: 0 },
        { offset: 1, opacity: 0, transform: 'translate3d(-30px, 0, 0)' },
      ]);
  }

  return [enteringTransition, leavingTransition];
};
const createYAxisTransition = (enteringEl: HTMLElement, leavingEl: HTMLElement, backDirection: boolean): Animation[] => {
  const enteringTransition = createAnimation().addElement(enteringEl);
  const leavingTransition = createAnimation().addElement(leavingEl);

  if (backDirection) {
    enteringTransition
      .keyframes([
        { offset: 0, opacity: 0, transform: 'translate3d(0, -30px, 0)' },
        { offset: 0.3, opacity: 0 },
        { offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ]);

    leavingTransition
      .keyframes([
        { offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' },
        { offset: 0.3, opacity: 0 },
        { offset: 1, opacity: 0, transform: 'translate3d(0, 30px, 0)' },
      ]);
  } else {
    enteringTransition
      .keyframes([
        { offset: 0, opacity: 0, transform: 'translate3d(0, 30px, 0)' },
        { offset: 0.3, opacity: 0 },
        { offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ]);

    leavingTransition
      .keyframes([
        { offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' },
        { offset: 0.3, opacity: 0 },
        { offset: 1, opacity: 0, transform: 'translate3d(0, -30px, 0)' },
      ]);
  }

  return [enteringTransition, leavingTransition];
};
const createFadeZAxisTransition = (enteringEl: HTMLElement, leavingEl: HTMLElement, backDirection: boolean): Animation[] => {
  const enteringTransition = createAnimation().addElement(enteringEl);
  const leavingTransition = createAnimation().addElement(leavingEl);

  if (backDirection) {
    enteringTransition
      .keyframes([
        { offset: 0, opacity: 0, transform: 'scale3d(1.1, 1.1, 1)' },
        { offset: 1, opacity: 1, transform: 'scale3d(1, 1, 1)' },
      ]);

    leavingTransition
      .keyframes([
        { offset: 0, opacity: 1, transform: 'scale3d(1, 1, 1)' },
        { offset: 0.2, opacity: 1 },
        { offset: 0.4, opacity: 0 },
        { offset: 1, opacity: 0, transform: 'scale3d(0.8, 0.8, 1)' },
      ]);
  } else {
    enteringTransition
      .keyframes([
        { offset: 0, opacity: 0, transform: 'scale3d(0.8, 0.8, 1)' },
        { offset: 0.2, opacity: 0 },
        { offset: 0.4, opacity: 1 },
        { offset: 1, opacity: 1, transform: 'scale3d(1, 1, 1)' },
      ]);

    leavingTransition
      .keyframes([
        { offset: 0, transform: 'scale3d(1, 1, 1)' },
        { offset: 1, transform: 'scale3d(1.1, 1.1, 1)' },
      ]);
  }

  return [enteringTransition, leavingTransition];
};
const createNormalZAxisTransition = (enteringEl: HTMLElement, leavingEl: HTMLElement, backDirection: boolean): Animation[] => {
  const enteringTransition = createAnimation().addElement(enteringEl);
  const leavingTransition = createAnimation().addElement(leavingEl);

  if (backDirection) {
    enteringTransition
      .keyframes([
        { offset: 0, opacity: 0, transform: 'scale3d(1.1, 1.1, 1)' },
        { offset: 0.3, opacity: 0 },
        { offset: 1, opacity: 1, transform: 'scale3d(1, 1, 1)' },
      ]);

    leavingTransition
      .keyframes([
        { offset: 0, opacity: 1, transform: 'scale3d(1, 1, 1)' },
        { offset: 0.3, opacity: 0 },
        { offset: 1, opacity: 0, transform: 'scale3d(0.8, 0.8, 1)' },
      ]);
  } else {
    enteringTransition
      .keyframes([
        { offset: 0, opacity: 0, transform: 'scale3d(0.8, 0.8, 1)' },
        { offset: 0.3, opacity: 0 },
        { offset: 1, opacity: 1, transform: 'scale3d(1, 1, 1)' },
      ]);

    leavingTransition
      .keyframes([
        { offset: 0, opacity: 1, transform: 'scale3d(1, 1, 1)' },
        { offset: 0.3, opacity: 0 },
        { offset: 1, opacity: 0, transform: 'scale3d(1.1, 1.1, 1)' },
      ]);
  }

  return [enteringTransition, leavingTransition];
};
const createZAxisTransition = (enteringEl: HTMLElement, leavingEl: HTMLElement, fade: boolean, backDirection: boolean): Animation[] => fade ? createFadeZAxisTransition(enteringEl, leavingEl, backDirection) : createNormalZAxisTransition(enteringEl, leavingEl, backDirection);

export const sharedAxisTransition = (axis: Axis = 'z', fade: boolean = false, animationOpts: AnimationOptions = {}): AnimationBuilder => {
  const { duration, easing } = animationOpts;

  return (_: HTMLElement, opts: any): Animation => {
    const backDirection = opts.direction === 'back';
    const { enteringEl, leavingEl } = opts;

    const baseTransition = createAnimation()
      .duration(duration !== undefined ? duration : 300)
      .easing(easing || 'ease');

    switch (axis) {
      case 'x':
        baseTransition.addAnimation(createXAxisTransition(enteringEl, leavingEl, backDirection));
        break;
      case 'y':
        baseTransition.addAnimation(createYAxisTransition(enteringEl, leavingEl, backDirection));
        break;
      default:
        baseTransition.addAnimation(createZAxisTransition(enteringEl, leavingEl, fade, backDirection));
        break;
    }

    return baseTransition;
  };
};
