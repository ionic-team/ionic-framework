export { sharedAxisTransition } from './animations/axis.motion';
export { fadeMotion, fadeMotionEnter, fadeMotionLeave } from './animations/fade.motion';
export { fadeThroughMotion, fadeThroughMotionEnter, fadeThroughMotionLeave } from './animations/fade-through.motion';

export interface AnimationOptions {
  duration?: number;
  easing?: string;
}

export type Axis = 'x' | 'y' | 'z';
