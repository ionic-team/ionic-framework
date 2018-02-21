import { AnimationOptions, Transition, ViewController } from '../../../index';
import { canNavGoBack } from '../nav-utils';
import { isDef } from '../../../utils/helpers';

const DURATION = 500;
const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
const OPACITY = 'opacity';
const TRANSFORM = 'transform';
const TRANSLATEX = 'translateX';
const CENTER = '0%';
const OFF_OPACITY = 0.8;
const SHOW_BACK_BTN_CSS = 'show-back-button';

export function buildIOSTransition(rootTransition: Transition, enteringView: ViewController, leavingView: ViewController, opts: AnimationOptions): Promise<Transition> {
  // Cool we're all hydrated, and can do deep selector
  rootTransition.enteringView = enteringView;
  rootTransition.leavingView = leavingView;

  const isRTL = document.dir === 'rtl';
  const OFF_RIGHT = isRTL ? '-99.5%' : '99.5%';
  const OFF_LEFT = isRTL ? '31%' : '-31%';

  rootTransition.duration(isDef(opts.duration) ? opts.duration : DURATION);
  rootTransition.easing(isDef(opts.easing) ? opts.easing : EASING);


  rootTransition.addElement(enteringView.element);
  rootTransition.beforeRemoveClass('hide-page');

  if (leavingView) {
    const navEl = leavingView.element.closest('ion-nav');
    if (navEl) {
      const navDecor = rootTransition.create();
      navDecor.addElement(navEl).duringAddClass('show-decor');
      rootTransition.add(navDecor);
    }
  }

  const backDirection = (opts.direction === 'back');
  // setting up enter view
  if (enteringView) {
    const contentEl = enteringView.element.querySelector('ion-content');
    const headerEls = enteringView.element.querySelectorAll('ion-header > *:not(ion-toolbar),ion-footer > *');
    const enteringToolBarEle = enteringView.element.querySelector('ion-toolbar');
    const enteringContent = rootTransition.create();

    if (!contentEl && !enteringToolBarEle && headerEls.length === 0) {
      enteringContent.addElement(enteringView.element.querySelector('ion-page,ion-nav,ion-tabs'));
    } else {
      enteringContent.addElement(contentEl);
      enteringContent.addElement(headerEls);
    }

    rootTransition.add(enteringContent);

    if (backDirection) {
      enteringContent
        .beforeClearStyles([OPACITY])
        .fromTo(TRANSLATEX, OFF_LEFT, CENTER, true)
        .fromTo(OPACITY, OFF_OPACITY, 1, true);
    } else {
      // entering content, forward direction
      enteringContent
        .beforeClearStyles([OPACITY])
        .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);

    }

    if (enteringToolBarEle) {
      const enteringToolBar = rootTransition.create();
      enteringToolBar.addElement(enteringToolBarEle);
      rootTransition.add(enteringToolBar);

      const enteringTitle = rootTransition.create();
      enteringTitle.addElement(enteringToolBarEle.querySelector('ion-title'));

      const enteringToolBarItems = rootTransition.create();
      enteringToolBarItems.addElement(enteringToolBarEle.querySelectorAll('ion-buttons,[menuToggle]'));

      const enteringToolBarBg = rootTransition.create();
      enteringToolBarBg.addElement(enteringToolBarEle.querySelector('.toolbar-background'));

      const enteringBackButton = rootTransition.create();
      enteringBackButton.addElement(enteringToolBarEle.querySelector('.back-button'));

      enteringToolBar
        .add(enteringTitle)
        .add(enteringToolBarItems)
        .add(enteringToolBarBg)
        .add(enteringBackButton);

      enteringTitle.fromTo(OPACITY, 0.01, 1, true);
      enteringToolBarItems.fromTo(OPACITY, 0.01, 1, true);

      if (backDirection) {
        enteringTitle.fromTo(TRANSLATEX, OFF_LEFT, CENTER, true);

        if (canNavGoBack(enteringView.nav, enteringView)) {
          // back direction, entering page has a back button
          enteringBackButton.beforeAddClass(SHOW_BACK_BTN_CSS).fromTo(OPACITY, 0.01, 1, true);
        }
      } else {
        // entering toolbar, forward direction
        enteringTitle.fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);

        enteringToolBarBg
          .beforeClearStyles([OPACITY])
          .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);

        if (canNavGoBack(enteringView.nav, enteringView)) {

          // forward direction, entering page has a back button
          enteringBackButton
            .beforeAddClass(SHOW_BACK_BTN_CSS)
            .fromTo(OPACITY, 0.01, 1, true);


          const enteringBackBtnText = rootTransition.create();
          enteringBackBtnText.addElement(enteringToolBarEle.querySelector('.back-button .button-text'));

          enteringBackBtnText.fromTo(TRANSLATEX, (isRTL ? '-100px' : '100px'), '0px');
          enteringToolBar.add(enteringBackBtnText);
        } else {
          enteringBackButton.beforeRemoveClass(SHOW_BACK_BTN_CSS);
        }
      }
    }
  }

  // setup leaving view
  if (leavingView) {

    const leavingContent = rootTransition.create();
    leavingContent.addElement(leavingView.element.querySelector('ion-content'));
    leavingContent.addElement(leavingView.element.querySelectorAll('ion-header > *:not(ion-toolbar),ion-footer > *'));
    rootTransition.add(leavingContent);

    if (backDirection) {
      // leaving content, back direction
      leavingContent
        .beforeClearStyles([OPACITY])
        .fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));


    } else {
      // leaving content, forward direction
      leavingContent
        .fromTo(TRANSLATEX, CENTER, OFF_LEFT, true)
        .fromTo(OPACITY, 1, OFF_OPACITY, true);
    }

    const leavingToolBarEle = leavingView.element.querySelector('ion-toolbar');
    if (leavingToolBarEle) {
      const leavingToolBar = rootTransition.create();
      leavingToolBar.addElement(leavingToolBarEle);

      const leavingTitle = rootTransition.create();
      leavingTitle.addElement(leavingToolBarEle.querySelector('ion-title'));

      const leavingToolBarItems = rootTransition.create();
      leavingToolBarItems.addElement(leavingToolBarEle.querySelectorAll('ion-buttons,[menuToggle]'));

      const leavingToolBarBg = rootTransition.create();
      leavingToolBarBg.addElement(leavingToolBarEle.querySelector('.toolbar-background'));

      const leavingBackButton = rootTransition.create();
      leavingBackButton.addElement(leavingToolBarEle.querySelector('.back-button'));

      leavingToolBar
        .add(leavingTitle)
        .add(leavingToolBarItems)
        .add(leavingBackButton)
        .add(leavingToolBarBg);

      rootTransition.add(leavingToolBar);

      // fade out leaving toolbar items
      leavingBackButton.fromTo(OPACITY, 0.99, 0, true);
      leavingTitle.fromTo(OPACITY, 0.99, 0, true);
      leavingToolBarItems.fromTo(OPACITY, 0.99, 0, true);

      if (backDirection) {
        // leaving toolbar, back direction
        leavingTitle.fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));

        // leaving toolbar, back direction, and there's no entering toolbar
        // should just slide out, no fading out
        leavingToolBarBg
          .beforeClearStyles([OPACITY])
          .fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));

        const leavingBackBtnText = rootTransition.create();
        leavingBackBtnText.addElement(leavingToolBarEle.querySelector('.back-button .button-text'));
        leavingBackBtnText.fromTo(TRANSLATEX, CENTER, (isRTL ? -115 : 115) + 'px');
        leavingToolBar.add(leavingBackBtnText);

      } else {
        // leaving toolbar, forward direction
        leavingTitle
          .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
          .afterClearStyles([TRANSFORM]);

        leavingBackButton.afterClearStyles([OPACITY]);
        leavingTitle.afterClearStyles([OPACITY]);
        leavingToolBarItems.afterClearStyles([OPACITY]);
      }
    }
  }
  // Return the rootTransition promise
  return Promise.resolve(rootTransition);
}
