import { Animation, AnimationCallbackOptions, AnimationDirection, AnimationFill, AnimationKeyFrames, AnimationLifecycle, createAnimation } from '@ionic/core';
import React from 'react';

type LifecycleCallback = { callback: AnimationLifecycle, opts?: AnimationCallbackOptions } | { callback: AnimationLifecycle, opts?: AnimationCallbackOptions }[];
type HookCallback = () => void | (() => void)[];

export interface CreateAnimationProps {
  delay?: number;
  direction?: AnimationDirection;
  duration?: number;
  easing?: string;
  fill?: AnimationFill;
  iterations?: number;

  afterAddRead?: HookCallback;
  afterAddWrite?: HookCallback;
  afterClearStyles?: string[];
  afterStyles?: { [property: string]: any };
  afterAddClass?: string | string[];
  afterRemoveClass?: string | string[];

  beforeAddRead?: HookCallback;
  beforeAddWrite?: HookCallback;
  beforeClearStyles?: string[];
  beforeStyles?: { [property: string]: any };
  beforeAddClass?: string | string[];
  beforeRemoveClass?: string | string[];

  onFinish?: LifecycleCallback;

  keyframes?: AnimationKeyFrames;

  play: boolean;
}

/**
 * TODO
 * play
 * pause
 * stop
 * destroy
 * progressStart
 * progressStep
 * progressEnd
 * from
 * to
 * fromTo
 * addAnimation
 * fix onFinish types (they aren't correct)
 */

 /**
  * QUESTIONS
  * How do I call the getter methods? (i.e. getKeyframes())
  * How do I update props on the fly? (i.e. toggle play/pause)
  * Is there a better way to setup the animation
  * other than individually checking each prop?
  * Should the before/after hooks accept arrays of
  * callback in the core method?
  */

export class CreateAnimation extends React.Component<CreateAnimationProps> {
  ref: React.RefObject<HTMLElement> = React.createRef();
  animation?: Animation;

  updateAnimation() {
    if (!this.animation) { return; }

    if (this.ref.current) {
      this.animation.addElement(this.ref.current);
    }

    if (this.props.iterations) {
      this.animation.iterations(this.props.iterations);
    }

    if (this.props.fill) {
      this.animation.fill(this.props.fill);
    }

    if (this.props.direction) {
      this.animation.direction(this.props.direction);
    }

    if (this.props.duration) {
      this.animation.duration(this.props.duration);
    }

    if (this.props.easing) {
      this.animation.easing(this.props.easing);
    }

    if (this.props.delay) {
      this.animation.delay(this.props.delay);
    }

    if (this.props.keyframes) {
      this.animation.keyframes(this.props.keyframes);
    }

    if (this.props.play) {
      this.animation.play();
    }

    const afterAddRead = this.props.afterAddRead;
    if (afterAddRead) {
      this.setCallbacks(afterAddRead, this.animation.afterAddRead);
    }

    const afterAddWrite = this.props.afterAddWrite;
    if (afterAddWrite) {
      this.setCallbacks(afterAddWrite, this.animation.afterAddWrite);
    }

    const afterClearStyles = this.props.afterClearStyles;
    if (afterClearStyles) {
      this.setCallbacks(afterClearStyles, this.animation.afterClearStyles);
    }

    const afterStyles = this.props.afterStyles;
    if (afterStyles) {
      this.setCallbacks(afterStyles, this.animation.afterStyles);
    }

    const afterAddClass = this.props.afterAddClass;
    if (afterAddClass) {
      this.setCallbacks(afterAddClass, this.animation.afterAddClass);
    }

    const afterRemoveClass = this.props.afterRemoveClass;
    if (afterRemoveClass) {
      this.setCallbacks(afterRemoveClass, this.animation.afterRemoveClass);
    }

    const beforeAddRead = this.props.beforeAddRead;
    if (beforeAddRead) {
      this.setCallbacks(beforeAddRead, this.animation.beforeAddRead);
    }

    const beforeAddWrite = this.props.beforeAddWrite;
    if (beforeAddWrite) {
      this.setCallbacks(beforeAddWrite, this.animation.beforeAddWrite);
    }

    const beforeClearStyles = this.props.beforeClearStyles;
    if (beforeClearStyles) {
      this.setCallbacks(beforeClearStyles, this.animation.beforeClearStyles);
    }

    const beforeStyles = this.props.beforeStyles;
    if (beforeStyles) {
      this.setCallbacks(beforeStyles, this.animation.beforeStyles);
    }

    const beforeAddClass = this.props.beforeAddClass;
    if (beforeAddClass) {
      this.setCallbacks(beforeAddClass, this.animation.beforeAddClass);
    }

    const beforeRemoveClass = this.props.beforeRemoveClass;
    if (beforeRemoveClass) {
      this.setCallbacks(beforeRemoveClass, this.animation.beforeRemoveClass);
    }
  }

  setCallbacks(prop: any, method: any) {
    const fns = (Array.isArray(prop)) ? prop : [prop];
    fns.forEach(fn => method(fn));
  }

  componentDidMount() {
    this.animation = createAnimation();
    this.updateAnimation();
  }

  render() {
    const { children } = this.props;
    return (
      <>
        {React.cloneElement(children as any, { ref: this.ref })}
      </>
    );
  }
}
