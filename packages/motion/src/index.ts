export { sharedAxisTransition } from './animations/axis.motion';
export { fadeMotion } from './animations/fade.motion';
export { fadeThroughMotion } from './animations/fade-through.motion';

export interface AnimationOptions {
  duration?: number;
  easing?: string;
}

export type Axis = 'x' | 'y' | 'z';
