import { Animation } from '../../../interface';

/**
 * iOS Modal Leave Animation
 */
export function iosLeaveCardAnimation(
  AnimationC: Animation,
  baseEl: HTMLElement,
  presentingEl?: HTMLElement,
  currentY?: number,
  currentBackdropOpacity?: number,
  currentPresentingScale?: number,
  velocityY?: number
  ): Promise<Animation> {
  const duration = velocityY ? 500 - Math.min(400, velocityY * 200) : 500;

  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  const wrapperEl = baseEl.querySelector('.modal-wrapper');
  wrapperAnimation.addElement(wrapperEl);

  const presentingAnimation = new AnimationC();

  const bodyEl = document.body;
  const bodyAnimation = new AnimationC();
  bodyAnimation
    .addElement(bodyEl)
    .afterStyles({ 'background-color': '' });

  if (presentingEl) {
    presentingAnimation
      .addElement(presentingEl)
      .duration(duration)
      .fromTo('translateY', '-5px', '0px')
      .fromTo('scale', currentPresentingScale || 0.92, 1);
  }

  wrapperAnimation.beforeStyles({ 'opacity': 1 })
                  .fromTo('translateY', currentY || '44px', `100%`);

  backdropAnimation.fromTo('opacity', currentBackdropOpacity || 0.4, 0.0);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(duration)
    .add(bodyAnimation)
    .add(backdropAnimation)
    .add(wrapperAnimation)
    .add(presentingAnimation));
}
