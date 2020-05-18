import { Animation, AnimationBuilder, createAnimation } from '@ionic/core';

export type Axis = 'x' | 'y' | 'z';

export interface AnimationOptions {
  duration?: number;
  easing?: string;
}

export const sharedAxisTransition = (axis: Axis = 'z', fade: boolean = false, animationOpts: AnimationOptions = {}): AnimationBuilder => {
  const { duration, easing } = animationOpts;

  console.debug(`[@ionic/motion Configuration]: Axis: ${axis}, Fade: ${fade}, Duration: ${duration}, Easing: ${easing}`);

  return (_: HTMLElement, opts: any): Animation => {
    const backDirection = opts.direction === 'back';
    const { enteringEl } = opts;
    const { leavingEl } = opts;

    const baseTransition = createAnimation()
      .duration(duration !== undefined ? duration : 300)
      .easing(easing || 'ease');

    switch (axis) {
      case 'x':
        if (backDirection) {
          const leavingTransition = createAnimation()
            .addElement(leavingEl)
            .keyframes([
              { offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' },
              { offset: 0.3, opacity: 0, transform: 'translate3d(9px, 0, 0)' },
              { offset: 1, opacity: 0, transform: 'translate3d(30px, 0, 0)' },
            ]);

          const enteringTransition = createAnimation()
            .addElement(enteringEl)
            .keyframes([
              { offset: 0, opacity: 0, transform: 'translate3d(-30px, 0, 0)' },
              { offset: 0.3, opacity: 0, transform: 'translate3d(-21px, 0, 0)' },
              { offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' },
            ]);

          baseTransition.addAnimation([leavingTransition, enteringTransition]);
        } else {
          const leavingTransition = createAnimation()
            .addElement(leavingEl)
            .keyframes([
              { offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' },
              { offset: 0.3, opacity: 0, transform: 'translate3d(-9px, 0, 0)' },
              { offset: 1, opacity: 0, transform: 'translate3d(-30px, 0, 0)' },
            ]);

          const enteringTransition = createAnimation()
            .addElement(enteringEl)
            .keyframes([
              { offset: 0, opacity: 0, transform: 'translate3d(30px, 0, 0)' },
              { offset: 0.3, opacity: 0, transform: 'translate3d(21px, 0, 0)' },
              { offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' },
            ]);

          baseTransition.addAnimation([leavingTransition, enteringTransition]);
        }

        break;
      case 'y':
        if (backDirection) {
          const leavingTransition = createAnimation()
            .addElement(leavingEl)
            .keyframes([
              { offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' },
              { offset: 0.3, opacity: 0, transform: 'translate3d(0, 9px, 0)' },
              { offset: 1, opacity: 0, transform: 'translate3d(0, 30px, 0)' },
            ]);

          const enteringTransition = createAnimation()
            .addElement(enteringEl)
            .keyframes([
              { offset: 0, opacity: 0, transform: 'translate3d(0, -30px, 0)' },
              { offset: 0.3, opacity: 0, transform: 'translate3d(0, -21px, 0)' },
              { offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' },
            ]);

          baseTransition.addAnimation([leavingTransition, enteringTransition]);
        } else {
          const leavingTransition = createAnimation()
            .addElement(leavingEl)
            .keyframes([
              { offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' },
              { offset: 0.3, opacity: 0, transform: 'translate3d(0, -9px, 0)' },
              { offset: 1, opacity: 0, transform: 'translate3d(0, -30px, 0)' },
            ]);

          const enteringTransition = createAnimation()
            .addElement(enteringEl)
            .keyframes([
              { offset: 0, opacity: 0, transform: 'translate3d(0, 30px, 0)' },
              { offset: 0.3, opacity: 0, transform: 'translate3d(0, 21px, 0)' },
              { offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' },
            ]);

          baseTransition.addAnimation([leavingTransition, enteringTransition]);
        }

        break;
      default:

        if (backDirection) {
          const leavingTransition = createAnimation()
            .addElement(leavingEl)
            .keyframes([
              { offset: 0, opacity: 1, transform: 'scale3d(1, 1, 1)' },
              { offset: 0.6, opacity: 1, transform: 'scale3d(0.88, 0.88, 1)' },
              { offset: 0.8, opacity: 0, transform: 'scale3d(0.84, 0.84, 1)' },
              { offset: 1, opacity: 0, transform: 'scale3d(0.8, 0.8, 1)' },
            ]);

          const enteringTransition = createAnimation()
            .addElement(enteringEl)
            .keyframes([
              { offset: 0, transform: 'scale3d(1.1, 1.1, 1)' },
              { offset: 1, transform: 'scale3d(1, 1, 1)' },
            ]);

          baseTransition.addAnimation([leavingTransition, enteringTransition]);
        } else {
          const leavingTransition = createAnimation()
            .addElement(leavingEl)
            .keyframes([
              { offset: 0, transform: 'scale3d(1, 1, 1)' },
              { offset: 1, transform: 'scale3d(1.1, 1.1, 1)' },
            ]);

          const enteringTransition = createAnimation()
            .addElement(enteringEl)
            .keyframes([
              { offset: 0, opacity: 0, transform: 'scale3d(0.8, 0.8, 1)' },
              { offset: 0.2, opacity: 0, transform: 'scale3d(0.84, 0.84, 1)' },
              { offset: 0.4, opacity: 1, transform: 'scale3d(0.88, 0.88, 1)' },
              { offset: 1, opacity: 1, transform: 'scale3d(1, 1, 1)' },
            ]);

          baseTransition.addAnimation([leavingTransition, enteringTransition]);
        }

        break;
    }

    return baseTransition;
  };
};
