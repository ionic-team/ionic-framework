import { AnimationOptions } from '../..';
import { Transition, ViewController } from '../nav-interfaces';
import { canNavGoBack } from '../nav-utils';

import { isDef } from '../../utils/helpers';

const DURATION = 500;
const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
const OPACITY = 'opacity';
const TRANSFORM = 'transform';
const TRANSLATEX = 'translateX';
const CENTER = '0%';
const OFF_OPACITY = 0.8;
const SHOW_BACK_BTN_CSS = 'show-back-button';

export function buildIOSTransition(rootTransition: Transition, enteringView: ViewController, leavingView: ViewController, opts: AnimationOptions): Transition {

  rootTransition.enteringView = enteringView;
  rootTransition.leavingView = leavingView;

  const isRTL = document.dir === 'rtl';
  const OFF_RIGHT = isRTL ? '-99.5%' : '99.5%';
  const OFF_LEFT = isRTL ? '33%' : '-33%';

  rootTransition.duration(isDef(opts.duration) ? opts.duration : DURATION);
  rootTransition.easing(isDef(opts.easing) ? opts.easing : EASING);


  rootTransition.addElement(enteringView.element);
  rootTransition.beforeRemoveClass('hide-page');

  const backDirection = (opts.direction === 'back');

  if (enteringView) {
    const enteringContent = rootTransition.create();
    enteringContent.addElement(enteringView.element.querySelectorAll('ion-header > *:not(ion-navbar),ion-footer > *'));

    rootTransition.add(enteringContent);

    if (backDirection) {
      enteringContent.fromTo(TRANSLATEX, OFF_LEFT, CENTER, true).fromTo(OPACITY, OFF_OPACITY, 1, true);
    } else {
      // entering content, forward direction
      enteringContent.beforeClearStyles([OPACITY]).fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
    }

    const enteringNavbarEle = enteringView.element.querySelector('ion-navbar');
    if (enteringNavbarEle) {
      const enteringNavBar = rootTransition.create();
      enteringNavBar.addElement(enteringNavbarEle);

      rootTransition.add(enteringNavBar);

      const enteringTitle = rootTransition.create();
      enteringTitle.addElement(enteringNavbarEle.querySelector('ion-title'));
      const enteringNavbarItems = rootTransition.create();
      enteringNavbarItems.addElement(enteringNavbarEle.querySelectorAll('ion-buttons,[menuToggle]'));
      const enteringNavbarBg = rootTransition.create();
      enteringNavbarBg.addElement(enteringNavbarEle.querySelector('.toolbar-background'));
      const enteringBackButton = rootTransition.create();
      enteringBackButton.addElement(enteringNavbarEle.querySelector('.back-button'));

      enteringNavBar
      .add(enteringTitle)
      .add(enteringNavbarItems)
      .add(enteringNavbarBg)
      .add(enteringBackButton);

      enteringTitle.fromTo(OPACITY, 0.01, 1, true);
      enteringNavbarItems.fromTo(OPACITY, 0.01, 1, true);

      if (backDirection) {
        enteringTitle.fromTo(TRANSLATEX, OFF_LEFT, CENTER, true);

        if (canNavGoBack(enteringView.nav)) {
          // back direction, entering page has a back button
          enteringBackButton.beforeAddClass(SHOW_BACK_BTN_CSS).fromTo(OPACITY, 0.01, 1, true);
        }
      } else {
        // entering navbar, forward direction
        enteringTitle.fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);

        enteringNavbarBg.beforeClearStyles([OPACITY]).fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);

        if (canNavGoBack(enteringView.nav)) {
          // forward direction, entering page has a back button
          enteringBackButton.beforeAddClass(SHOW_BACK_BTN_CSS).fromTo(OPACITY, 0.01, 1, true);


          const enteringBackBtnText = rootTransition.create();
          enteringBackBtnText.addElement(enteringNavbarEle.querySelector('.back-button-text'));

          enteringBackBtnText.fromTo(TRANSLATEX, (isRTL ? '-100px' : '100px'), '0px');
          enteringNavBar.add(enteringBackBtnText);

        } else {
          enteringBackButton.beforeRemoveClass(SHOW_BACK_BTN_CSS);
        }
      }
    }
  }

  // setup leaving view
  if (leavingView) {

    const leavingContent = rootTransition.create();
    leavingContent.addElement(leavingView.element);
    leavingContent.addElement(leavingView.element.querySelectorAll('ion-header > *:not(ion-navbar),ion-footer > *'));

    rootTransition.add(leavingContent);

    if (backDirection) {
      // leaving content, back direction
      leavingContent.beforeClearStyles([OPACITY]).fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));

    } else {
      // leaving content, forward direction
      leavingContent
        .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
        .fromTo(OPACITY, 1, OFF_OPACITY)
        .afterClearStyles([TRANSFORM, OPACITY]);
    }

    const leavingNavbarEle = leavingView.element.querySelector('ion-navbar');
    if (leavingNavbarEle) {
      const leavingNavBar = rootTransition.create();
      leavingNavBar.addElement(leavingNavbarEle);

      const leavingTitle = rootTransition.create();
      leavingTitle.addElement(leavingNavbarEle.querySelector('ion-title'));

      const leavingNavbarItems = rootTransition.create();
      leavingNavbarItems.addElement(leavingNavbarEle.querySelectorAll('ion-buttons,[menuToggle]'));

      const leavingNavbarBg = rootTransition.create();
      leavingNavbarBg.addElement(leavingNavbarEle.querySelector('.toolbar-background'));

      const leavingBackButton = rootTransition.create();
      leavingBackButton.addElement(leavingNavbarEle.querySelector('.back-button'));

      leavingNavBar
        .add(leavingTitle)
        .add(leavingNavbarItems)
        .add(leavingBackButton)
        .add(leavingNavbarBg);
      this.add(leavingNavBar);

      // fade out leaving navbar items
      leavingBackButton.fromTo(OPACITY, 0.99, 0);
      leavingTitle.fromTo(OPACITY, 0.99, 0);
      leavingNavbarItems.fromTo(OPACITY, 0.99, 0);

      if (backDirection) {
        // leaving navbar, back direction
        leavingTitle.fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));

        // leaving navbar, back direction, and there's no entering navbar
        // should just slide out, no fading out
        leavingNavbarBg
          .beforeClearStyles([OPACITY])
          .fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));

        const leavingBackBtnText = rootTransition.create();
        leavingBackBtnText.addElement(leavingNavbarEle.querySelector('.back-button-text'));
        leavingBackBtnText.fromTo(TRANSLATEX, CENTER, (isRTL ? -300 : 300) + 'px');
        leavingNavBar.add(leavingBackBtnText);

      } else {
        // leaving navbar, forward direction
        leavingTitle
          .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
          .afterClearStyles([TRANSFORM]);

        leavingBackButton.afterClearStyles([OPACITY]);
        leavingTitle.afterClearStyles([OPACITY]);
        leavingNavbarItems.afterClearStyles([OPACITY]);
      }
    }
  }
  return rootTransition;
}
