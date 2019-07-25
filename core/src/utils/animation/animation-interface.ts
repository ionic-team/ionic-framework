export interface Animation {
  parentAnimation: Animation | undefined;
  elements: HTMLElement[];
  childAnimations: Animation[];
  beforeAddClasses: string[];
  beforeRemoveClasses: string[];
  beforeStylesValue: { [property: string]: any };
  afterAddClasses: string[];
  afterRemoveClasses: string[];
  afterStylesValue: { [property: string]: any };

  animationFinish(): void;

  play(): Animation;
  playAsync(): Promise<Animation>;
  playSync(): Animation;
  pause(): Animation;
  stop(): Animation;
  destroy(): Animation;

  progressStart(forceLinearEasing: boolean): Animation;
  progressStep(step: number): Animation;
  progressEnd(shouldComplete: boolean, step: number): Animation;

  from(property: string, value: any): Animation;
  to(property: string, value: any): Animation;
  fromTo(property: string, fromValue: any, toValue: any): Animation;
  keyframes(keyframes: any[]): Animation;

  addAnimation(animationToADd: Animation | Animation[] | undefined | null): Animation;
  addTarget(target: string): Animation;
  addElement(el: Element | Element[] | Node | Node[] | NodeList | undefined | null): Animation;
  iterations(iterations: number): Animation;
  fill(fill: 'auto' | 'none' | 'forwards' | 'backwards' | 'both' | undefined): Animation;
  direction(direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' | undefined): Animation;
  duration(duration: number): Animation;
  easing(easing: string): Animation;
  delay(delay: number): Animation;
  name(name: string): Animation;
  parent(animation: Animation): Animation;

  getKeyframes(): any[];
  getDirection(): 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' | undefined;
  getFill(): 'auto' | 'none' | 'forwards' | 'backwards' | 'both' | undefined;
  getDelay(): number | undefined;
  getIterations(): number | undefined;
  getEasing(): string | undefined;
  getDuration(): number | undefined;

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

  onFinish(callback: any): Animation;
}
