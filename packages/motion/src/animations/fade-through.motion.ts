import { AnimationOptions } from '../';
import { Animation, AnimationBuilder, createAnimation } from '@ionic/core';

const createBase = (animationOpts: AnimationOptions, enteringEl: HTMLElement, leavingEl: HTMLElement): { [key: string]: Animation; } => {
  const { duration, easing } = animationOpts;
  const rootAnimation = createAnimation()
    .duration(duration !== undefined ? duration : 300)
    .easing(easing || 'ease');

  const leavingAnimation = createAnimation().addElement(leavingEl);
  const enteringAnimation = createAnimation().addElement(enteringEl);

  rootAnimation.addAnimation([leavingAnimation, enteringAnimation]);

  return { rootAnimation, enteringAnimation, leavingAnimation };
};

const enter = (animationOpts: AnimationOptions, enteringEl: HTMLElement, leavingEl: HTMLElement): Animation => {
  const { rootAnimation, enteringAnimation, leavingAnimation } = createBase(animationOpts, enteringEl, leavingEl);

  leavingAnimation.keyframes([
    { offset: 0, opacity: 1 },
    { offset: 0.3, opacity: 0 },
    { offset: 1, opacity: 0 },
  ]);

  enteringAnimation.keyframes([
    { offset: 0, opacity: 0, transform: 'scale(0.92)' },
    { offset: 0.3, opacity: 0, transform: 'scale(0.92)' },
    { offset: 1, opacity: 1, transform: 'scale(1)' },
  ]);

  return rootAnimation;
};

const leave = (animationOpts: AnimationOptions, enteringEl: HTMLElement, leavingEl: HTMLElement): Animation => {
  const { rootAnimation, enteringAnimation, leavingAnimation } = createBase(animationOpts, enteringEl, leavingEl);

  leavingAnimation.keyframes([
    { offset: 0, opacity: 1, transform: 'scale(1)' },
    { offset: 0.7, opacity: 0, transform: 'scale(0.92)' },
    { offset: 1, opacity: 0, transform: 'scale(0.92)' },
  ]);

  enteringAnimation.keyframes([
    { offset: 0, opacity: 0 },
    { offset: 0.7, opacity: 0 },
    { offset: 1, opacity: 1 },
  ]);

  return rootAnimation;
};

export const fadeThroughMotionEnter = (presentingEl: HTMLElement, animationOpts: AnimationOptions = {}): AnimationBuilder => (baseEl: HTMLElement): Animation => enter(animationOpts, baseEl, presentingEl);

export const fadeThroughMotionLeave = (presentingEl: HTMLElement, animationOpts: AnimationOptions = {}): AnimationBuilder => (baseEl: HTMLElement): Animation => leave(animationOpts, presentingEl, baseEl);

export const fadeThroughMotion = (animationOpts: AnimationOptions = {}): AnimationBuilder => (_: HTMLElement, opts: any): Animation => {
  const backDirection = opts.direction === 'back';
  const { enteringEl, leavingEl } = opts;

  return backDirection ? leave(animationOpts, enteringEl, leavingEl) : enter(animationOpts, enteringEl, leavingEl);
};
