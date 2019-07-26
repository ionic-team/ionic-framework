import { Animation } from '../../../interface';

/**
 * iOS Toast Leave Animation
 */
export const iosLeaveAnimation = (AnimationC: Animation, baseEl: ShadowRoot, position: string): Promise<Animation> => {
  const baseAnimation = new AnimationC();

  const wrapperAnimation = new AnimationC();

  const hostEl = baseEl.host || baseEl;
  const wrapperEl = baseEl.querySelector('.toast-wrapper') as HTMLElement;

  wrapperAnimation.addElement(wrapperEl);

  const bottom = `calc(-10px - var(--ion-safe-area-bottom, 0px))`;
  const top = `calc(10px + var(--ion-safe-area-top, 0px))`;

  switch (position) {
    case 'top':
      wrapperAnimation.fromTo('translateY', top, '-100%');
      break;
    case 'middle':
      wrapperAnimation.fromTo('opacity', 0.99, 0);
      break;
    default:
      wrapperAnimation.fromTo('translateY', bottom, '100%');
      break;
  }
  return Promise.resolve(baseAnimation
    .addElement(hostEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(300)
    .add(wrapperAnimation));
};
