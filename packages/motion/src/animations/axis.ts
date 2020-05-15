import { createAnimation, Animation } from '@ionic/core';

export const sharedAxisTransition = (_: HTMLElement, opts: any): Animation => {
  const backDirection = opts.direction === 'back';
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  const baseTransition = createAnimation()
    .duration(300)
    .easing('ease');

  if (backDirection) {
    const leavingTransition = createAnimation()
      .addElement(leavingEl)
      .keyframes([
        { offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' },
        { offset: 0.3, opacity: 0, transform: 'translate3d(9px, 0, 0)' },
        { offset: 1, opacity: 0, transform: 'translate3d(30px, 0, 0)' }
      ]);

    const enteringTransition = createAnimation()
      .addElement(enteringEl)
      .keyframes([
        { offset: 0, opacity: 0, transform: 'translate3d(-30px, 0, 0)' },
        { offset: 0.3, opacity: 0, transform: 'translate3d(-21px, 0, 0)' },
        { offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }
      ]);

    baseTransition.addAnimation([leavingTransition, enteringTransition]);
  } else {
    const leavingTransition = createAnimation()
      .addElement(leavingEl)
      .keyframes([
        { offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' },
        { offset: 0.3, opacity: 0, transform: 'translate3d(-9px, 0, 0)' },
        { offset: 1, opacity: 0, transform: 'translate3d(-30px, 0, 0)' }
      ]);

    const enteringTransition = createAnimation()
      .addElement(enteringEl)
      .keyframes([
        { offset: 0, opacity: 0, transform: 'translate3d(30px, 0, 0)' },
        { offset: 0.3, opacity: 0, transform: 'translate3d(21px, 0, 0)' },
        { offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }
      ]);

    baseTransition.addAnimation([leavingTransition, enteringTransition]);
  }

  return baseTransition;
}
