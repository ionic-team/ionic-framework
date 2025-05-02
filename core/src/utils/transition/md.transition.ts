import type { Animation } from '../../interface';
import { createAnimation } from '../animation/animation';
import type { TransitionOptions } from '../transition';
import { getIonPageElement } from '../transition';

export const mdTransitionAnimation = (_: HTMLElement, opts: TransitionOptions): Animation => {
  const OFF_BOTTOM = '40px';
  const CENTER = '0px';

  const backDirection = opts.direction === 'back';
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  const ionPageElement = getIonPageElement(enteringEl);
  const enteringToolbarEle = ionPageElement.querySelector('ion-toolbar');
  const rootTransition = createAnimation();

  rootTransition.addElement(ionPageElement).fill('both').beforeRemoveClass('ion-page-invisible');

  // animate the component itself
  if (backDirection) {
    rootTransition.duration((opts.duration ?? 0) || 200).easing('cubic-bezier(0.47,0,0.745,0.715)');
  } else {
    rootTransition
      .duration((opts.duration ?? 0) || 280)
      .easing('cubic-bezier(0.36,0.66,0.04,1)')
      .fromTo('transform', `translateY(${OFF_BOTTOM})`, `translateY(${CENTER})`)
      .fromTo('opacity', 0.01, 1);
  }

  // Animate toolbar if it's there
  if (enteringToolbarEle) {
    const enteringToolBar = createAnimation();
    enteringToolBar.addElement(enteringToolbarEle);
    rootTransition.addAnimation(enteringToolBar);
  }

  // setup leaving view
  if (leavingEl && backDirection) {
    // leaving content
    rootTransition.duration((opts.duration ?? 0) || 200).easing('cubic-bezier(0.47,0,0.745,0.715)');

    const leavingPage = createAnimation();
    leavingPage
      .addElement(getIonPageElement(leavingEl))
      .onFinish((currentStep) => {
        if (currentStep === 1 && leavingPage.elements.length > 0) {
          leavingPage.elements[0].style.setProperty('display', 'none');
        }
      })
      .fromTo('transform', `translateY(${CENTER})`, `translateY(${OFF_BOTTOM})`)
      .fromTo('opacity', 1, 0);

    rootTransition.addAnimation(leavingPage);
  }

  return rootTransition;
};


const dpToPx = (n: number) => window.devicePixelRatio * n;

export const mdTransitionAnimation2 = (_: HTMLElement, opts: TransitionOptions): Animation => {
  const enteringEl = opts.enteringEl;
  const leavingEl  = opts.leavingEl;

  // choose from/to transforms depending on navigation direction
  let enterFrom: string, enterTo: string, leaveFrom: string, leaveTo: string;
  if (opts.direction === 'forward') {
    enterFrom = `translateX(${dpToPx(30)}px)`;
    enterTo   = 'translateX(0%)';
    leaveFrom = 'translateX(0%)';
    leaveTo   = `translateX(-${dpToPx(30)}px)`;
  } else {
    enterFrom = `translateX(-${dpToPx(30)}px)`;
    enterTo   = 'translateX(0%)';
    leaveFrom = 'translateX(0%)';
    leaveTo   = `translateX(${dpToPx(30)}px)`;
  }

  const rootAninmation = createAnimation();

  const enterFade = createAnimation()
    .addElement(enteringEl)
    .delay(100)
    .duration(200)
    .easing('cubic-bezier(0.0, 0.0, 0.2, 1.0)')
    .fromTo('opacity', '0', '1');
  const enterSlide = createAnimation()
    .addElement(enteringEl)
    .duration(300)
    .easing('cubic-bezier(0.4, 0.0, 0.2, 1.0)')
    .fromTo('transform', enterFrom, enterTo);

  rootAninmation.addAnimation([ enterFade, enterSlide ]);

  if (leavingEl) {
    const exitFade = createAnimation()
      .addElement(leavingEl)
      .duration(100)
      .easing('cubic-bezier(0.4, 0.0, 1.0, 1.0)')
      .fromTo('opacity', '1', '0');
    const exitSlide = createAnimation()
      .duration(300)
      .addElement(leavingEl)
      .easing('cubic-bezier(0.4, 0.0, 0.2, 1.0)')
      .fromTo('transform', leaveFrom, leaveTo);

    rootAninmation.addAnimation([ exitFade, exitSlide ]);
  }

  return rootAninmation;
}