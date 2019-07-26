import { Animation } from '../../../interface';

/**
 * md Toast Leave Animation
 */
export const mdLeaveAnimation = (AnimationC: Animation, baseEl: ShadowRoot): Promise<Animation> => {
  const baseAnimation = new AnimationC();

  const wrapperAnimation = new AnimationC();

  const hostEl = baseEl.host || baseEl;
  const wrapperEl = baseEl.querySelector('.toast-wrapper') as HTMLElement;

  wrapperAnimation.addElement(wrapperEl);

  wrapperAnimation.fromTo('opacity', 0.99, 0);

  return Promise.resolve(baseAnimation
    .addElement(hostEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(300)
    .add(wrapperAnimation));
};
