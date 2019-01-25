import { Animation } from '../../interface';
import { TransitionOptions } from '../transition';

const DURATION = 500;
const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
const OPACITY = 'opacity';
const TRANSFORM = 'transform';
const TRANSLATEX = 'translateX';
const CENTER = '0%';
const OFF_OPACITY = 0.8;

export function shadow<T extends Element>(el: T): ShadowRoot | T {
  return el.shadowRoot || el;
}

export function iosTransitionAnimation(AnimationC: Animation, navEl: HTMLElement, opts: TransitionOptions): Promise<Animation> {

  const isRTL = document.dir === 'rtl';
  const OFF_RIGHT = isRTL ? '-99.5%' : '99.5%';
  const OFF_LEFT = isRTL ? '33%' : '-33%';

  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  const rootTransition = new AnimationC();
  rootTransition
    .addElement(enteringEl)
    .duration(opts.duration || DURATION)
    .easing(opts.easing || EASING)
    .beforeRemoveClass('ion-page-invisible');

  if (leavingEl && navEl) {
    const navDecor = new AnimationC();
    navDecor
      .addElement(navEl);

    rootTransition.add(navDecor);
  }

  const backDirection = (opts.direction === 'back');
  // setting up enter view
  const contentEl = enteringEl.querySelector(':scope > ion-content');
  const headerEls = enteringEl.querySelectorAll(':scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *');
  const enteringToolBarEls = enteringEl.querySelectorAll(':scope > ion-header > ion-toolbar');
  const enteringContent = new AnimationC();
  console.log(enteringToolBarEls);

  if (!contentEl && enteringToolBarEls.length === 0 && headerEls.length === 0) {
    enteringContent.addElement(enteringEl.querySelector(':scope > .ion-page, :scope > ion-nav, :scope > ion-tabs'));
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

  for (let i = 0; i < enteringToolBarEls.length; i++) {
    const enteringToolBarEle = enteringToolBarEls.item(i);
    const enteringToolBar = new AnimationC();
    enteringToolBar.addElement(enteringToolBarEle);
    rootTransition.add(enteringToolBar);

    const enteringTitle = new AnimationC();
    enteringTitle.addElement(enteringToolBarEle.querySelector('ion-title'));

    const enteringToolBarButtons = new AnimationC();
    enteringToolBarButtons.addElement(enteringToolBarEle.querySelectorAll('ion-buttons,[menuToggle]'));

    const enteringToolbarItems = new AnimationC();
    enteringToolbarItems.addElement(enteringToolBarEle.querySelectorAll(':scope > *:not(ion-title):not(ion-buttons):not([menuToggle]'));

    const enteringToolBarBg = new AnimationC();
    enteringToolBarBg.addElement(shadow(enteringToolBarEle).querySelector('.toolbar-background'));

    const enteringBackButton = new AnimationC();
    const backButtonEl = enteringToolBarEle.querySelector('ion-back-button');
    enteringBackButton.addElement(backButtonEl);

    enteringToolBar
      .add(enteringTitle)
      .add(enteringToolBarButtons)
      .add(enteringToolbarItems)
      .add(enteringToolBarBg)
      .add(enteringBackButton);

    enteringTitle.fromTo(OPACITY, 0.01, 1, true);
    enteringToolBarButtons.fromTo(OPACITY, 0.01, 1, true);
    enteringToolbarItems.fromTo(OPACITY, 0.01, 1, true);

    if (backDirection) {
      enteringTitle.fromTo(TRANSLATEX, OFF_LEFT, CENTER, true);
      enteringToolbarItems.fromTo(TRANSLATEX, OFF_LEFT, CENTER, true);

      // back direction, entering page has a back button
      enteringBackButton.fromTo(OPACITY, 0.01, 1, true);
    } else {
      // entering toolbar, forward direction
      enteringTitle.fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
      enteringToolbarItems.fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);

      enteringToolBarBg
        .beforeClearStyles([OPACITY])
        .fromTo(OPACITY, 0.01, 1, true);

      // forward direction, entering page has a back button
      enteringBackButton.fromTo(OPACITY, 0.01, 1, true);

      if (backButtonEl) {
        const enteringBackBtnText = new AnimationC();
        enteringBackBtnText
          .addElement(shadow(backButtonEl).querySelector('.button-text'))
          .fromTo(TRANSLATEX, (isRTL ? '-100px' : '100px'), '0px');

        enteringToolBar.add(enteringBackBtnText);
      }
    }
  }

  // setup leaving view
  if (leavingEl) {

    const leavingContent = new AnimationC();
    leavingContent.addElement(leavingEl.querySelector(':scope > ion-content'));
    leavingContent.addElement(leavingEl.querySelectorAll(':scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *'));
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

    const leavingToolBarEls = leavingEl.querySelectorAll(':scope > ion-header > ion-toolbar');
    for (let i = 0; i < leavingToolBarEls.length; i++) {
      const leavingToolBarEle = leavingToolBarEls.item(i);
      const leavingToolBar = new AnimationC();
      leavingToolBar.addElement(leavingToolBarEle);

      const leavingTitle = new AnimationC();
      leavingTitle.addElement(leavingToolBarEle.querySelector('ion-title'));

      const leavingToolBarButtons = new AnimationC();
      leavingToolBarButtons.addElement(leavingToolBarEle.querySelectorAll('ion-buttons,[menuToggle]'));

      const leavingToolbarItems = new AnimationC();
      leavingToolbarItems.addElement(leavingToolBarEle.querySelectorAll(':scope > *:not(ion-title):not(ion-buttons):not([menuToggle]'));

      const leavingToolBarBg = new AnimationC();
      leavingToolBarBg.addElement(shadow(leavingToolBarEle).querySelector('.toolbar-background'));

      const leavingBackButton = new AnimationC();
      const backButtonEl = leavingToolBarEle.querySelector('ion-back-button');
      leavingBackButton.addElement(backButtonEl);

      leavingToolBar
        .add(leavingTitle)
        .add(leavingToolBarButtons)
        .add(leavingToolbarItems)
        .add(leavingBackButton)
        .add(leavingToolBarBg);

      rootTransition.add(leavingToolBar);

      // fade out leaving toolbar items
      leavingBackButton.fromTo(OPACITY, 0.99, 0, true);
      leavingTitle.fromTo(OPACITY, 0.99, 0, true);
      leavingToolBarButtons.fromTo(OPACITY, 0.99, 0, true);
      leavingToolbarItems.fromTo(OPACITY, 0.99, 0, true);

      if (backDirection) {
        // leaving toolbar, back direction
        leavingTitle.fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));
        leavingToolbarItems.fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));

        // leaving toolbar, back direction, and there's no entering toolbar
        // should just slide out, no fading out
        leavingToolBarBg
          .beforeClearStyles([OPACITY])
          .fromTo(OPACITY, 1, 0.01, true);

        if (backButtonEl) {
          const leavingBackBtnText = new AnimationC();
          leavingBackBtnText.addElement(shadow(backButtonEl).querySelector('.button-text'));
          leavingBackBtnText.fromTo(TRANSLATEX, CENTER, (isRTL ? -124 : 124) + 'px');
          leavingToolBar.add(leavingBackBtnText);
        }

      } else {
        // leaving toolbar, forward direction
        leavingTitle
          .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
          .afterClearStyles([TRANSFORM]);
        leavingToolbarItems
          .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
          .afterClearStyles([TRANSFORM, OPACITY]);

        leavingBackButton.afterClearStyles([OPACITY]);
        leavingTitle.afterClearStyles([OPACITY]);
        leavingToolBarButtons.afterClearStyles([OPACITY]);
      }
    }
  }
  // Return the rootTransition promise
  return Promise.resolve(rootTransition);
}
