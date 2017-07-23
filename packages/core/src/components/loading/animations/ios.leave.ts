

/**
 * iOS Loading Leave Animation
 */
export default function(baseElm: HTMLElement) {
  const baseAnimation = new Ionic.Animation();

  const backdropAnimation = new Ionic.Animation();
  backdropAnimation.addElement(baseElm.querySelector('.loading-backdrop'));

  const wrapperAnimation = new Ionic.Animation();
  wrapperAnimation.addElement(baseElm.querySelector('.loading-wrapper'));

  backdropAnimation.fromTo('opacity', 0.3, 0);

  wrapperAnimation.fromTo('opacity', 0.99, 0)
                  .fromTo('scale', 1, 0.9);


  return baseAnimation
    .addElement(baseElm)
    .easing('ease-in-out')
    .duration(200)
    .add(backdropAnimation)
    .add(wrapperAnimation);
}
