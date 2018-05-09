import { Animation } from '../../../interface';

/**
 * iOS Toast Leave Animation
 */
export function iosLeaveAnimation(Animation: Animation, baseEl: HTMLElement, position: string): Promise<Animation> {
  const baseAnimation = new Animation();

  const wrapperAnimation = new Animation();
  const wrapperEle = baseEl.querySelector('.toast-wrapper') as HTMLElement;
  wrapperAnimation.addElement(wrapperEle);

  let variable;

  if (CSS.supports('bottom', 'env(safe-area-inset-bottom)')) {
    variable = 'env';
  } else if (CSS.supports('bottom', 'constant(safe-area-inset-bottom)')) {
    variable = 'constant';
  }

  const bottom = variable ? 'calc(-10px - ' + variable + '(safe-area-inset-bottom))' : '-10px';
  const top = variable ? 'calc(' + variable + '(safe-area-inset-top) + 10px)' : '10px';

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
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(300)
    .add(wrapperAnimation));
}
