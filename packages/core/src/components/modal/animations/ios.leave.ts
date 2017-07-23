

/**
 * iOS Modal Leave Animation
 */
export default function(baseElm: HTMLElement) {
  const baseAnimation = new Ionic.Animation();

  const backdropAnimation = new Ionic.Animation();
  backdropAnimation.addElement(baseElm.querySelector('.modal-backdrop'));

  const wrapperAnimation = new Ionic.Animation();
  const wrapperElm = baseElm.querySelector('.modal-wrapper');
  wrapperAnimation.addElement(wrapperElm);
  const wrapperElmRect = wrapperElm.getBoundingClientRect();

  wrapperAnimation.beforeStyles({ 'opacity': 1 })
                  .fromTo('translateY', '0%', `${window.innerHeight - wrapperElmRect.top}px`);

  backdropAnimation.fromTo('opacity', 0.4, 0.0);

  return baseAnimation
    .addElement(baseElm)
    .easing('ease-out')
    .duration(250)
    .add(backdropAnimation)
    .add(wrapperAnimation);
}
