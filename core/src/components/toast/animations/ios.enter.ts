import { Animation } from '../../../interface';

/**
 * iOS Toast Enter Animation
 */
export const iosEnterAnimation = (AnimationC: Animation, baseEl: ShadowRoot, position: string): Promise<Animation> => {
  const baseAnimation = new AnimationC();

  const wrapperAnimation = new AnimationC();

  const hostEl = baseEl.host || baseEl;
  const wrapperEl = baseEl.querySelector('.toast-wrapper') as HTMLElement;

  wrapperAnimation.addElement(wrapperEl);

  const bottom = `calc(-10px - var(--ion-safe-area-bottom, 0px))`;
  const top = `calc(10px + var(--ion-safe-area-top, 0px))`;

  switch (position) {
    case 'top':
      wrapperAnimation.fromTo('translateY', '-100%', top);
      break;
    case 'middle':
      const topPosition = Math.floor(
        hostEl.clientHeight / 2 - wrapperEl.clientHeight / 2
      );
      wrapperEl.style.top = `${topPosition}px`;
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
    default:
      wrapperAnimation.fromTo('translateY', '100%', bottom);
      break;
  }
  return Promise.resolve(baseAnimation
    .addElement(hostEl)
    .easing('cubic-bezier(.155,1.105,.295,1.12)')
    .duration(400)
    .add(wrapperAnimation));
};
