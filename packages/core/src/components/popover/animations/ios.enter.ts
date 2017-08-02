
export default function(baseElm: HTMLElement) {
  const baseAnimation = new Ionic.Animation();

  const backdropAnimation = new Ionic.Animation();
  backdropAnimation.addElement(baseElm.querySelector('.popover-backdrop'));

  const wrapperAnimation = new Ionic.Animation();
  wrapperAnimation.addElement(baseElm.querySelector('.popover-wrapper'));

  backdropAnimation.fromTo('opacity', 0.01, 0.3);

  wrapperAnimation.fromTo('opacity', 0.01, 1)
                  .fromTo('scale', 1.1, 1);

  return baseAnimation
    .addElement(baseElm)
    .easing('ease-in-out')
    .duration(200)
    .add(backdropAnimation)
    .add(wrapperAnimation);
}
