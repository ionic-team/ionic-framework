import { Animation } from '../../../index';

/**
 * MD Toast Enter Animation
 */
export default function mdEnterAnimation(Animation: Animation, baseElm: HTMLElement, position: string): Promise<Animation> {
  const baseAnimation = new Animation();

  const wrapperAnimation = new Animation();
  const wrapperEle = baseElm.querySelector('.toast-wrapper') as HTMLElement;
  wrapperAnimation.addElement(wrapperEle);

  switch (position) {
    case 'top':
      wrapperAnimation.fromTo('translateY', '-100%', '0%');
      break;
    case 'middle':
      const topPosition = Math.floor(
        baseElm.clientHeight / 2 - wrapperEle.clientHeight / 2
      );
      wrapperEle.style.top = `${topPosition}px`;
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
    default:
      wrapperAnimation.fromTo('translateY', '100%', '0%');
      break;
  }
  return Promise.resolve(baseAnimation
    .addElement(baseElm)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .add(wrapperAnimation));
}
