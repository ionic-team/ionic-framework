
export interface Animation {
  new(elm?: Node|Node[]|NodeList): Animation;
  add: (childAnimation: Animation) => Animation;
  addElement: (elm: Node|Node[]|NodeList) => Animation;
  afterAddClass: (className: string) => Animation;
  afterClearStyles: (propertyNames: string[]) => Animation;
  afterRemoveClass: (className: string) => Animation;
  afterStyles: (styles: { [property: string]: any; }) => Animation;
  beforeAddClass: (className: string) => Animation;
  beforeClearStyles: (propertyNames: string[]) => Animation;
  beforeRemoveClass: (className: string) => Animation;
  beforeStyles: (styles: { [property: string]: any; }) => Animation;
  destroy: () => void;
  duration: (milliseconds: number) => Animation;
  getDuration(opts?: PlayOptions): number;
  easing: (name: string) => Animation;
  easingReverse: (name: string) => Animation;
  from: (prop: string, val: any) => Animation;
  fromTo: (prop: string, fromVal: any, toVal: any, clearProperyAfterTransition?: boolean) => Animation;
  hasCompleted: boolean;
  isPlaying: boolean;
  onFinish: (callback: (animation: Animation) => void, opts?: {oneTimeCallback?: boolean, clearExistingCallacks?: boolean}) => Animation;
  play: (opts?: PlayOptions) => void;
  syncPlay: () => void;
  progressEnd: (shouldComplete: boolean, currentStepValue: number, dur: number) => void;
  progressStep: (stepValue: number) => void;
  progressStart: () => void;
  reverse: (shouldReverse?: boolean) => Animation;
  stop: (stepValue?: number) => void;
  to: (prop: string, val: any, clearProperyAfterTransition?: boolean) => Animation;
}


export interface AnimationBuilder {
  (elm?: HTMLElement): Animation;
}


export interface AnimationOptions {
  animation?: string;
  duration?: number;
  easing?: string;
  direction?: string;
  isRTL?: boolean;
  ev?: any;
}


export interface PlayOptions {
  duration?: number;
  promise?: boolean;
}


export interface EffectProperty {
  effectName: string;
  trans: boolean;
  wc?: string;
  to?: EffectState;
  from?: EffectState;
  [state: string]: any;
}


export interface EffectState {
  val: any;
  num: number;
  effectUnit: string;
}
