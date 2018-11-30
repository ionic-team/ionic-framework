
export interface AnimationController {
  create(animationBuilder?: AnimationBuilder, baseEl?: any, opts?: any): Promise<Animation>;
}

export interface Animation {
  new (): any;
  parent: Animation | undefined;
  hasChildren: boolean;
  addElement(el: Node | Node[] | NodeList): Animation;
  add(childAnimation: Animation): Animation;
  duration(milliseconds: number): Animation;
  easing(name: string): Animation;
  easingReverse(name: string): Animation;
  getDuration(opts?: PlayOptions): number;
  getEasing(): string;
  from(prop: string, val: any): Animation;
  to(prop: string, val: any, clearProperyAfterTransition?: boolean): Animation;
  fromTo(prop: string, fromVal: any, toVal: any, clearProperyAfterTransition?: boolean): Animation;
  beforeAddClass(className: string): Animation;
  beforeRemoveClass(className: string): Animation;
  beforeStyles(styles: { [property: string]: any; }): Animation;
  beforeClearStyles(propertyNames: string[]): Animation;
  beforeAddRead(domReadFn: () => void): Animation;
  beforeAddWrite(domWriteFn: () => void): Animation;
  afterAddClass(className: string): Animation;
  afterRemoveClass(className: string): Animation;
  afterStyles(styles: { [property: string]: any; }): Animation;
  afterClearStyles(propertyNames: string[]): Animation;
  play(opts?: PlayOptions): void;
  playSync(): void;
  playAsync(opts?: PlayOptions): Promise<Animation>;
  reverse(shouldReverse?: boolean): Animation;
  stop(stepValue?: number): void;
  progressStart(): void;
  progressStep(stepValue: number): void;
  progressEnd(shouldComplete: boolean, currentStepValue: number, dur: number): void;
  onFinish(callback: (animation?: Animation) => void, opts?: {oneTimeCallback?: boolean, clearExistingCallbacks?: boolean}): Animation;
  destroy(): void;
  isRoot(): boolean;
  hasCompleted: boolean;
}

export type AnimationBuilder = (Animation: Animation, baseEl: any, opts?: any) => Promise<Animation>;

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
