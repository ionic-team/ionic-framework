import { Animation } from '../../../index';

/**
 * @hidden
 * Menu Type
 * Base class which is extended by the various types. Each
 * type will provide their own animations for open and close
 * and registers itself with Menu.
 */
export default function baseAnimation(Animation: Animation): Animation {
  return new Animation()
    .easing('cubic-bezier(0.0, 0.0, 0.2, 1)')
    .easingReverse('cubic-bezier(0.4, 0.0, 0.6, 1)')
    .duration(280);
}
