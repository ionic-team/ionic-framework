import { Animation } from '../../../interface';

/**
 * iOS Modal Enter Animation for the Card presentation style
 */
export function iosEnterCardAnimation(AnimationC: Animation, baseEl: HTMLElement, presentingEl?: HTMLElement): Promise<Animation> {
  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));

  wrapperAnimation.beforeStyles({ 'opacity': 1 })
                  .fromTo('translateY', '100%', '44px');

  backdropAnimation.fromTo('opacity', 0.01, 0.4);

  const bodyEl = document.body;
  bodyEl.style.backgroundColor = 'black';

  const presentingAnimation = new AnimationC();

  if (presentingEl) {
    presentingAnimation
      .beforeStyles({
        'transform': 'translateY(0)'
      })
      .beforeAddClass('presenting-view-card')
      .addElement(presentingEl)
      .duration(1000)
      .fromTo('translateY', '0px', '-5px')
      .fromTo('scale', 1, 0.92);
  }

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(1000)
    .beforeAddClass('show-modal')
    .add(backdropAnimation)
    .add(wrapperAnimation)
    .add(presentingAnimation));
}
