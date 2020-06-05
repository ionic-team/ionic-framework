export { sharedAxisTransition } from './animations/axis.transition';

export interface AnimationOptions {
  duration?: number;
  easing?: string;
}

export type Axis = 'x' | 'y' | 'z';
