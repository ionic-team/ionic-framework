import { Animation } from '../../../interface';

/**
 * iOS Modal Leave Animation
 */
export function iosLeaveCardAnimation(AnimationC: Animation, baseEl: HTMLElement, presentingEl?: HTMLElement): Promise<Animation> {
  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  const wrapperEl = baseEl.querySelector('.modal-wrapper');
  wrapperAnimation.addElement(wrapperEl);
  const wrapperElRect = wrapperEl!.getBoundingClientRect();

  const presentingAnimation = new AnimationC();

  const bodyEl = document.body;
  const bodyAnimation = new AnimationC();
  bodyAnimation
    .addElement(bodyEl)
    .afterStyles({ 'background-color': '' });

  if (presentingEl) {
    presentingAnimation
      .addElement(presentingEl)
      .duration(1000)
      .fromTo('translateY', '-5px', '0px')
      .fromTo('scale', 0.92, 1);
  }

  wrapperAnimation.beforeStyles({ 'opacity': 1 })
                  .fromTo('translateY', '44px', `${(baseEl.ownerDocument as any).defaultView.innerHeight - wrapperElRect.top}px`);

  backdropAnimation.fromTo('opacity', 0.4, 0.0);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(1000)
    .add(bodyAnimation)
    .add(backdropAnimation)
    .add(wrapperAnimation)
    .add(presentingAnimation));
}
