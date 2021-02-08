import {
  Animation,
  AnimationCallbackOptions,
  AnimationDirection,
  AnimationFill,
  AnimationKeyFrames,
  AnimationLifecycle,
  createAnimation,
} from '@ionic/core';
import React from 'react';

interface PartialPropertyValue {
  property: string;
  value: any;
}
interface PropertyValue {
  property: string;
  fromValue: any;
  toValue: any;
}

export interface CreateAnimationProps {
  delay?: number;
  direction?: AnimationDirection;
  duration?: number;
  easing?: string;
  fill?: AnimationFill;
  iterations?: number;
  id?: string;

  afterAddRead?: () => void;
  afterAddWrite?: () => void;
  afterClearStyles?: string[];
  afterStyles?: { [property: string]: any };
  afterAddClass?: string | string[];
  afterRemoveClass?: string | string[];

  beforeAddRead?: () => void;
  beforeAddWrite?: () => void;
  beforeClearStyles?: string[];
  beforeStyles?: { [property: string]: any };
  beforeAddClass?: string | string[];
  beforeRemoveClass?: string | string[];

  onFinish?: { callback: AnimationLifecycle; opts?: AnimationCallbackOptions };

  keyframes?: AnimationKeyFrames;
  from?: PartialPropertyValue[] | PartialPropertyValue;
  to?: PartialPropertyValue[] | PartialPropertyValue;
  fromTo?: PropertyValue[] | PropertyValue;

  play?: boolean;
  pause?: boolean;
  stop?: boolean;
  destroy?: boolean;

  progressStart?: { forceLinearEasing: boolean; step?: number };
  progressStep?: { step: number };
  progressEnd?: { playTo: 0 | 1 | undefined; step: number; dur?: number };
}

export class CreateAnimation extends React.PureComponent<CreateAnimationProps> {
  nodes: Map<number, HTMLElement> = new Map();
  animation: Animation;

  constructor(props: any) {
    super(props);

    this.animation = createAnimation(props.id);
  }

  setupAnimation(props: any) {
    const animation = this.animation;

    if (this.nodes.size > 0) {
      animation.addElement(Array.from(this.nodes.values()));
    }

    checkConfig(animation, props);
    checkPlayback(animation, props);
  }

  componentDidMount() {
    const props = this.props;
    this.setupAnimation(props);
  }

  componentDidUpdate(prevProps: any) {
    const animation = this.animation;

    const props = this.props;

    checkConfig(animation, props, prevProps);
    checkProgress(animation, props, prevProps);
    checkPlayback(animation, props, prevProps);
  }

  render() {
    const { children } = this.props;
    return (
      <>
        {React.Children.map(children, (child, id) =>
          React.cloneElement(child as any, { ref: (el: any) => this.nodes.set(id, el) })
        )}
      </>
    );
  }
}

const checkConfig = (animation: Animation, currentProps: any = {}, prevProps: any = {}) => {
  const reservedProps = [
    'children',
    'progressStart',
    'progressStep',
    'progressEnd',
    'pause',
    'stop',
    'destroy',
    'play',
    'from',
    'to',
    'fromTo',
    'onFinish',
  ];
  for (const key in currentProps) {
    if (
      currentProps.hasOwnProperty(key) &&
      !reservedProps.includes(key) &&
      currentProps[key] !== prevProps[key]
    ) {
      (animation as any)[key]((currentProps as any)[key]);
    }
  }

  const fromValues = currentProps.from;
  if (fromValues && fromValues !== prevProps.from) {
    const values = Array.isArray(fromValues) ? fromValues : [fromValues];
    values.forEach((val) => animation.from(val.property, val.value));
  }

  const toValues = currentProps.to;
  if (toValues && toValues !== prevProps.to) {
    const values = Array.isArray(toValues) ? toValues : [toValues];
    values.forEach((val) => animation.to(val.property, val.value));
  }

  const fromToValues = currentProps.fromTo;
  if (fromToValues && fromToValues !== prevProps.fromTo) {
    const values = Array.isArray(fromToValues) ? fromToValues : [fromToValues];
    values.forEach((val) => animation.fromTo(val.property, val.fromValue, val.toValue));
  }

  const onFinishValues = currentProps.onFinish;
  if (onFinishValues && onFinishValues !== prevProps.onFinish) {
    const values = Array.isArray(onFinishValues) ? onFinishValues : [onFinishValues];
    values.forEach((val) => animation.onFinish(val.callback, val.opts));
  }
};

const checkProgress = (animation: Animation, currentProps: any = {}, prevProps: any = {}) => {
  const { progressStart, progressStep, progressEnd } = currentProps;

  if (
    progressStart &&
    (prevProps.progressStart?.forceLinearEasing !== progressStart?.forceLinearEasing ||
      prevProps.progressStart?.step !== progressStart?.step)
  ) {
    animation.progressStart(progressStart.forceLinearEasing, progressStart.step);
  }

  if (progressStep && prevProps.progressStep?.step !== progressStep?.step) {
    animation.progressStep(progressStep.step);
  }

  if (
    progressEnd &&
    (prevProps.progressEnd?.playTo !== progressEnd?.playTo ||
      prevProps.progressEnd?.step !== progressEnd?.step ||
      prevProps?.dur !== progressEnd?.dur)
  ) {
    animation.progressEnd(progressEnd.playTo, progressEnd.step, progressEnd.dur);
  }
};

const checkPlayback = (animation: Animation, currentProps: any = {}, prevProps: any = {}) => {
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
};
