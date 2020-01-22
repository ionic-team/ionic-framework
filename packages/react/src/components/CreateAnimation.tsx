import { Animation, AnimationCallbackOptions, AnimationDirection, AnimationFill, AnimationKeyFrames, AnimationLifecycle, createAnimation } from '@ionic/core';
import React from 'react';

type LifecycleCallback = (callback: AnimationLifecycle, opts?: AnimationCallbackOptions) => void;
type HookCallback = () => void;
interface PartialPropertyValue { property: string; value: any; }
interface PropertyValue { property: string; fromValue: any; toValue: any; }

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
  from?: PartialPropertyValue;
  to?: PartialPropertyValue;
  fromTo?: PropertyValue;

  play?: boolean;
  pause?: boolean;
  stop?: boolean;
  destroy?: boolean;

  progressStart?: { forceLinearEasing: boolean, step?: number };
  progressStep?: { step: number };
  progressEnd?: { playTo: 0 | 1 | undefined, step: number, dur?: number };
}

/**
 * TODO
 * progressStart
 * progressStep
 * progressEnd
 * addAnimation
 */

 /**
  * QUESTIONS
  * How do I update props on the fly? (i.e. toggle play/pause)
  * Should the before/after hooks accept arrays of
  * callback in the core method?
  * How do I accept multiples elements even if they aren't immediately nested?
  */

export class CreateAnimation extends React.Component<CreateAnimationProps> {
  private nodes: Map<number, HTMLElement> = new Map();
  animation?: Animation;

  updateAnimation() {
    if (this.animation === undefined) { return; }

    console.log(this);
    const animation = this.animation!;

    if (this.nodes.size > 0) {
      animation.addElement(Array.from(this.nodes.values()));
    }

    const props = this.props;
    for (const key in props) {
      // TODO
      if (props.hasOwnProperty(key) && !['children', 'progressStart', 'progressStep', 'progressEnd', 'play', 'from', 'to', 'fromTo', 'onFinish'].includes(key)) {
        console.log(key as any, animation as any, props as any);
        (animation as any)[key]((props as any)[key]);
      }
    }

    const fromValues = this.props.from;
    if (fromValues) {
      const values = (Array.isArray(fromValues)) ? fromValues : [fromValues];
      values.forEach(val => animation.from(val.property, val.value));
    }

    const toValues = this.props.to;
    if (toValues) {
      const values = (Array.isArray(toValues)) ? toValues : [toValues];
      values.forEach(val => animation.to(val.property, val.value));
    }

    const fromToValues = this.props.fromTo;
    if (fromToValues) {
      const values = (Array.isArray(fromToValues)) ? fromToValues : [fromToValues];
      values.forEach(val => animation.fromTo(val.property, val.fromValue, val.toValue));
    }

    const onFinishValues = this.props.onFinish;
    if (onFinishValues) {
      const values = (Array.isArray(onFinishValues)) ? onFinishValues : [onFinishValues];
      values.forEach(val => animation.onFinish(val.callback, val.opts));
    }
    
    checkPlayback(animation, props);    
  }

  componentDidMount() {
    this.animation = createAnimation();
    this.updateAnimation();
  }

  componentDidUpdate(prevProps: any) {
    const animation = this.animation;
    if (animation === undefined) { return; }

    const props = this.props;
    const { progressStart, progressStep, progressEnd } = props;

    if (progressStart && (prevProps.progressStart?.forceLinearEasing !== progressStart?.forceLinearEasing || prevProps.progressStart?.step !== progressStart?.step)) {
      animation.progressStart(progressStart.forceLinearEasing, progressStart.step);
    }

    if (progressStep && prevProps.progressStep?.step !== progressStep?.step) {
      animation.progressStep(progressStep.step);
    }

    if (progressEnd && (prevProps.progressEnd?.playTo !== progressEnd?.playTo || prevProps.progressEnd?.step !== progressEnd?.step || prevProps?.dur !== progressEnd?.dur)) {
      animation.progressEnd(progressEnd.playTo, progressEnd.step, progressEnd.dur);
    }
    
    checkPlayback(animation, props, prevProps);
  }

  render() {
    const { children } = this.props;
    return (
      <>
        {React.Children.map(children, ((child, id) => React.cloneElement(child as any, { ref: (el: any) => this.nodes.set(id, el) })))}
      </>
    );
  }

}

const checkPlayback = (animation: Animation, currentProps: any = {}, prevProps: any = {}, ) => {
  if (!prevProps.play && currentProps.play) {
    animation.play();
  }
  
  if (!prevProps.pause && currentProps.pause) {
    animation.pause();
  }
  
  if (!prevProps.stop && currentProps.stop) {
    animation.stop();
  }
  
  if (!prevProps.destroy && currentProps.destroy) {
    animation.destroy();
  }
}
