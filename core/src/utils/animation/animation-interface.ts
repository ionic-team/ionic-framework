// TODO(FW-2832): types

export interface Animation {
  parentAnimation: Animation | undefined;
  elements: HTMLElement[];
  childAnimations: Animation[];
  id: string | undefined;

  /**
   * Play the animation
   *
   * If the `sync` options is `true`, the animation will play synchronously. This
   * is the equivalent of running the animation
   * with a duration of 0ms.
   */
  play(opts?: AnimationPlayOptions): Promise<void>;

  /**
   * Pauses the animation
   */
  pause(): void;

  /**
   * Stop the animation and reset
   * all elements to their initial state
   */
  stop(): void;

  /**
   * Destroy the animation and all child animations.
   */
  destroy(clearStyleSheets?: boolean): void;

  progressStart(forceLinearEasing?: boolean, step?: number): Animation;
  progressStep(step: number): Animation;
  progressEnd(playTo: 0 | 1 | undefined, step: number, dur?: number): Animation;

  from(property: string, value: string | number): Animation;
  to(property: string, value: string | number): Animation;
  fromTo(property: string, fromValue: string | number, toValue: string | number): Animation;

  /**
   * Set the keyframes for the animation.
   */
  keyframes(keyframes: AnimationKeyFrames): Animation;

  /**
   * Group one or more animations together to be controlled by a parent animation.
   */
  addAnimation(animationToAdd: Animation | Animation[]): Animation;

  /**
   * Add one or more elements to the animation
   */
  addElement(el: Element | Element[] | Node | Node[] | NodeList): Animation;

  /**
   * Sets the number of times the animation cycle
   * should be played before stopping.
   */
  iterations(iterations: number): Animation;

  /**
   * Sets how the animation applies styles to its
   * elements before and after the animation's execution.
   */
  fill(fill: AnimationFill | undefined): Animation;

  /**
   * Sets whether the animation should play forwards,
   * backwards, or alternating back and forth.
   */
  direction(direction: AnimationDirection | undefined): Animation;

  /**
   * Sets the length of time the animation takes
   * to complete one cycle.
   */
  duration(duration: number | undefined): Animation;

  /**
   * Sets how the animation progresses through the
   * duration of each cycle.
   */
  easing(easing: string | undefined): Animation;

  /**
   * Sets when an animation starts (in milliseconds).
   */
  delay(delay: number | undefined): Animation;

  /**
   * Get an array of keyframes for the animation.
   */
  getKeyframes(): AnimationKeyFrames;

  /**
   * Returns the animation's direction.
   */
  getDirection(): AnimationDirection;

  /**
   * Returns the animation's fill mode.
   */
  getFill(): AnimationFill;

  /**
   * Gets the animation's delay in milliseconds.
   */
  getDelay(): number;

  /**
   * Gets the number of iterations the animation will run.
   */
  getIterations(): number;

  /**
   * Returns the animation's easing.
   */
  getEasing(): string;

  /**
   * Gets the animation's duration in milliseconds.
   */
  getDuration(): number;

  /**
   * Returns the raw Web Animations object
   * for all elements in an Animation.
   * This will return an empty array on
   * browsers that do not support
   * the Web Animations API.
   */
  getWebAnimations(): globalThis.Animation[]; // Use the Web Animation interface, not the Ionic Animations interface

  /**
   * Add a function that performs a
   * DOM read to be run after the
   * animation end
   */
  afterAddRead(readFn: () => void): Animation;

  /**
   * Add a function that performs a
   * DOM write to be run after the
   * animation end
   */
  afterAddWrite(writeFn: () => void): Animation;

  /**
   * Clear CSS inline styles from the animation's
   * elements after the animation ends.
   */
  afterClearStyles(propertyNames: string[]): Animation;

  /**
   * Set CSS inline styles to the animation's
   * elements after the animation ends.
   */
  afterStyles(styles: { [property: string]: any }): Animation;

  /**
   * Add CSS class to the animation's
   * elements after the animation ends.
   */
  afterAddClass(className: string | string[]): Animation;

  /**
   * Remove CSS class from the animation's
   * elements after the animation ends.
   */
  afterRemoveClass(className: string | string[]): Animation;

  /**
   * Add a function that performs a
   * DOM read to be run before the
   * animation starts
   */
  beforeAddRead(readFn: () => void): Animation;

  /**
   * Add a function that performs a
   * DOM write to be run before the
   * animation starts
   */
  beforeAddWrite(writeFn: () => void): Animation;

  /**
   * Clear CSS inline styles from the animation's
   * elements before the animation begins.
   */
  beforeClearStyles(propertyNames: string[]): Animation;

  /**
   * Set CSS inline styles to the animation's
   * elements before the animation begins.
   */
  beforeStyles(styles: { [property: string]: any }): Animation;

  /**
   * Add a class to the animation's
   * elements before the animation starts
   */
  beforeAddClass(className: string | string[]): Animation;

  /**
   * Remove a class from the animation's
   * elements before the animation starts
   */
  beforeRemoveClass(className: string | string[]): Animation;

  /**
   * Add a callback to be run
   * upon the animation ending
   */
  onFinish(callback: AnimationLifecycle, opts?: AnimationCallbackOptions): Animation;

  /**
   * Returns `true` if the animation is running.
   * Returns `false` otherwise.
   */
  isRunning(): boolean;

  /**
   * Sets the parent animation.
   * @internal
   */
  parent(animation: Animation): Animation;

  /**
   * Updates any existing animations.
   * @internal
   */
  update(deep: boolean, toggleAnimationName: boolean, step?: number): Animation;

  /**
   * Forcibly finishes the animation.
   * @internal
   */
  animationFinish(): void;
}

export type AnimationLifecycle = (currentStep: 0 | 1, animation: Animation) => void;
export type AnimationKeyFrames = [AnimationKeyFrameEdge, AnimationKeyFrameEdge] | AnimationKeyFrame[];
export type AnimationStyles = Record<string, any>;

export interface AnimationCallbackOptions {
  oneTimeCallback: boolean;
}

export interface AnimationKeyFrame extends AnimationStyles {
  offset: number;
}

export interface AnimationKeyFrameEdge extends AnimationStyles {
  offset?: number;
}

export interface AnimationPlayOptions {
  sync: boolean;
}

export type AnimationPlayTo = 'start' | 'end';
export type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
export type AnimationFill = 'auto' | 'none' | 'forwards' | 'backwards' | 'both';

export type AnimationBuilder = (baseEl: any, opts?: any) => Animation;
