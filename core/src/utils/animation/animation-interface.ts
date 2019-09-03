export interface Animation {
  parentAnimation: Animation | undefined;
  elements: HTMLElement[];
  childAnimations: Animation[];

  animationFinish(): void;
  play(): Animation;
  playAsync(): Promise<Animation>;
  playSync(): Animation;
  pause(): Animation;
  stop(): Animation;
  destroy(): Animation;

  progressStart(forceLinearEasing: boolean): Animation;
  progressStep(step: number): Animation;
  progressEnd(shouldComplete: boolean, step: number, dur: number | undefined): Animation;

  from(property: string, value: any): Animation;
  to(property: string, value: any): Animation;
  fromTo(property: string, fromValue: any, toValue: any): Animation;
  keyframes(keyframes: any[]): Animation;

  addAnimation(animationToADd: Animation | Animation[] | undefined | null): Animation;
  addElement(el: Element | Element[] | Node | Node[] | NodeList | undefined | null): Animation;
  iterations(iterations: number): Animation;
  fill(fill: AnimationFill | undefined): Animation;
  direction(direction: AnimationDirection | undefined): Animation;
  duration(duration: number): Animation;
  easing(easing: string): Animation;
  delay(delay: number): Animation;
  parent(animation: Animation): Animation;
  update(deep: boolean): Animation;

  getKeyframes(): any[];
  getDirection(): AnimationDirection | undefined;
  getFill(): AnimationFill | undefined;
  getDelay(): number | undefined;
  getIterations(): number | undefined;
  getEasing(): string | undefined;
  getDuration(): number | undefined;
  getWebAnimations(): any[];

  afterAddRead(readFn: () => void): Animation;
  afterAddWrite(writeFn: () => void): Animation;
  afterClearStyles(propertyNames: string[]): Animation;
  afterStyles(styles: { [property: string]: any }): Animation;
  afterRemoveClass(className: string | string[] | undefined): Animation;
  afterAddClass(className: string | string[] | undefined): Animation;

  beforeAddRead(readFn: () => void): Animation;
  beforeAddWrite(writeFn: () => void): Animation;
  beforeClearStyles(propertyNames: string[]): Animation;
  beforeStyles(styles: { [property: string]: any }): Animation;
  beforeRemoveClass(className: string | string[] | undefined): Animation;
  beforeAddClass(className: string | string[] | undefined): Animation;

  onFinish(callback: (didComplete: boolean, animation: Animation) => void, opts?: AnimationOnFinishOptions): Animation;
  clearOnFinish(): Animation;
}

export interface AnimationOnFinishCallback {
  callback: (didComplete: boolean, animation: Animation) => void;
  opts: AnimationOnFinishOptions;
}

export interface AnimationOnFinishOptions {
  oneTimeCallback: boolean;
}

export type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
export type AnimationFill = 'auto' | 'none' | 'forwards' | 'backwards' | 'both';
