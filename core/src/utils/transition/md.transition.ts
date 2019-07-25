import { IonicAnimation } from '../../interface';
import { createAnimation } from '../animation/animation';
import { TransitionOptions } from '../transition';

export const mdTransitionAnimation = (opts: TransitionOptions): IonicAnimation => {
  try {
    const OFF_BOTTOM = '40px';
    const CENTER = '0px';

    const rootAnimation = createAnimation();

    const enteringEl = opts.enteringEl;
    const leavingEl = opts.leavingEl;
    const backDirection = (opts.direction === 'back');

    const ionPageElement = getIonPageElement(enteringEl);
    const enteringToolbarEle = ionPageElement.querySelector('ion-toolbar');

    rootAnimation
      .addElement(ionPageElement)
      .beforeRemoveClass('ion-page-invisible')
      .fill('both');

    if (backDirection) {
      rootAnimation
        .duration(opts.duration || 200)
        .easing('cubic-bezier(0.47,0,0.745,0.715)');
    } else {
      rootAnimation
        .duration(opts.duration || 280)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .fromTo('transform', `translateY(${OFF_BOTTOM})`, `translateY(${CENTER})`)
        .fromTo('opacity', 0.01, 1);
    }

    if (enteringToolbarEle) {
      const enteringToolBarAnimation = createAnimation();
      enteringToolBarAnimation.addElement(enteringToolbarEle);
      rootAnimation.addAnimation(enteringToolBarAnimation);
    }

    if (leavingEl && backDirection) {
      rootAnimation
        .duration(opts.duration || 200)
        .easing('cubic-bezier(0.47,0,0.745,0.715)');

      const leavingPageAnimation = createAnimation();
      leavingPageAnimation
        .addElement(getIonPageElement(leavingEl))
        .fromTo('transform', `translateY(${CENTER})`, `translateY(${OFF_BOTTOM})`)
        .fromTo('opacity', 1, 0);

      rootAnimation.addAnimation(leavingPageAnimation);
    }

    return rootAnimation;
  } catch (err) {
    throw err;
  }
};

const getIonPageElement = (element: HTMLElement) => {
  if (element.classList.contains('ion-page')) {
    return element;
  }

  const ionPage = element.querySelector(':scope > .ion-page, :scope > ion-nav, :scope > ion-tabs');
  if (ionPage) {
    return ionPage;
  }
  // idk, return the original element so at least something animates and we don't have a null pointer
  return element;
};
