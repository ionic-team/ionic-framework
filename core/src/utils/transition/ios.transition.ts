import { Animation } from '../../interface';
import { TransitionOptions } from '../transition';

const DURATION = 10000;
const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
const OPACITY = 'opacity';
const TRANSFORM = 'transform';
const TRANSLATEX = 'translateX';
const CENTER = '0%';
const OFF_OPACITY = 0.8;

export function shadow<T extends Element>(el: T): ShadowRoot | T {
  return el.shadowRoot || el;
}

/**
 * If a view has the iOS Large Header in use,
 * we do not always want to interfere with the styles
 * of the title in the main header as they can change
 * depending on whether or not the large header is collapsed.
 */
const hasCollapsableHeader = (el: any): boolean => {
  return el && el.classList.contains('collapse-header-title-hidden');
};

export async function iosTransitionAnimation(AnimationC: Animation, navEl: HTMLElement, opts: TransitionOptions): Promise<Animation> {

  let leavingLargeTitleEl: any;
  let enteringBackButtonEl: any;

  const isRTL = (navEl.ownerDocument as any).dir === 'rtl';
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

  enteringToolBarEls.forEach(enteringToolBarEl => {
    const enteringToolBar = new AnimationC();
    enteringToolBar.addElement(enteringToolBarEl);
    rootTransition.add(enteringToolBar);

    const enteringTitle = new AnimationC();
    const enteringTitleEl = enteringToolBarEl.querySelector('ion-title');
    enteringTitle.addElement(enteringTitleEl);

    const enteringToolBarButtons = new AnimationC();
    enteringToolBarButtons.addElement(enteringToolBarEl.querySelectorAll('ion-buttons,[menuToggle]'));

    const enteringToolBarItems = new AnimationC();
    enteringToolBarItems.addElement(enteringToolBarEl.querySelectorAll(':scope > *:not(ion-title):not(ion-buttons):not([menuToggle])'));

    const enteringToolBarBg = new AnimationC();
    enteringToolBarBg.addElement(shadow(enteringToolBarEl).querySelector('.toolbar-background'));

    const enteringBackButton = new AnimationC();
    const backButtonEl = enteringToolBarEl.querySelector('ion-back-button');

    if (backButtonEl) {
      if (!enteringBackButtonEl) {
        enteringBackButtonEl = backButtonEl;
      }
      // enteringBackButton.addElement(backButtonEl);
    }

    enteringToolBar
      .add(enteringTitle)
      .add(enteringToolBarButtons)
      .add(enteringToolBarItems)
      .add(enteringToolBarBg)
      .add(enteringBackButton);

    if (!hasCollapsableHeader(enteringTitleEl)) {
      enteringTitle.fromTo(OPACITY, 0.01, 1, true);
    }
    enteringToolBarButtons.fromTo(OPACITY, 0.01, 1, true);
    enteringToolBarItems.fromTo(OPACITY, 0.01, 1, true);

    if (backDirection) {
      enteringTitle.fromTo(TRANSLATEX, OFF_LEFT, CENTER, true);

      enteringToolBarItems.fromTo(TRANSLATEX, OFF_LEFT, CENTER, true);

      // back direction, entering page has a back button
      enteringBackButton.fromTo(OPACITY, 0.01, 1, true);
    } else {
      // entering toolbar, forward direction
      enteringTitle.fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);

      enteringToolBarItems.fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);

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
  });

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
    leavingToolBarEls.forEach(leavingToolBarEl => {
      const leavingToolBar = new AnimationC();
      leavingToolBar.addElement(leavingToolBarEl);

      const leavingTitle = new AnimationC();
      const leavingTitleEl = leavingToolBarEl.querySelector('ion-title');
      leavingTitle.addElement(leavingTitleEl);

      const leavingToolBarButtons = new AnimationC();
      leavingToolBarButtons.addElement(leavingToolBarEl.querySelectorAll('ion-buttons,[menuToggle]'));

      const leavingToolBarItems = new AnimationC();
      const leavingToolBarItemEls = leavingToolBarEl.querySelectorAll(':scope > *:not(ion-title):not(ion-buttons):not([menuToggle])');
      if (leavingToolBarItemEls.length > 0) {
        leavingToolBarItems.addElement(leavingToolBarItemEls);
      }

      const leavingToolBarBg = new AnimationC();
      leavingToolBarBg.addElement(shadow(leavingToolBarEl).querySelector('.toolbar-background'));

      const leavingBackButton = new AnimationC();
      const backButtonEl = leavingToolBarEl.querySelector('ion-back-button');
      if (backButtonEl) {
        leavingBackButton.addElement(backButtonEl);
      }

      leavingToolBar
        .add(leavingTitle)
        .add(leavingToolBarButtons)
        .add(leavingToolBarItems)
        .add(leavingBackButton)
        .add(leavingToolBarBg);

      rootTransition.add(leavingToolBar);

      // fade out leaving toolbar items
      leavingBackButton.fromTo(OPACITY, 0.99, 0);

      if (!hasCollapsableHeader(leavingTitleEl)) {
        leavingTitle.fromTo(OPACITY, 0.99, 0);
      } else {
        const largeTitleEl = leavingEl.querySelector('ion-title.title-ios-large') as HTMLElement;

        if (largeTitleEl && !leavingLargeTitleEl) {
          leavingLargeTitleEl = largeTitleEl;
        }
      }

      leavingToolBarButtons.fromTo(OPACITY, 0.99, 0, 0);
      leavingToolBarItems.fromTo(OPACITY, 0.99, 0);

      if (backDirection) {
        // leaving toolbar, back direction
        leavingTitle.fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));
        leavingToolBarItems.fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));

        // leaving toolbar, back direction, and there's no entering toolbar
        // should just slide out, no fading out
        leavingToolBarBg
          .beforeClearStyles([OPACITY])
          .fromTo(OPACITY, 1, 0.01);

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
        leavingToolBarItems
          .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
          .afterClearStyles([TRANSFORM, OPACITY]);

        leavingBackButton.afterClearStyles([OPACITY]);

        if (!hasCollapsableHeader(leavingTitleEl)) {
          leavingTitle.afterClearStyles([OPACITY]);
        }

        leavingToolBarButtons.afterClearStyles([OPACITY]);
      }
    });
  }

  /**
   * Setup large iOS title navigation
   */
  if (leavingLargeTitleEl && enteringBackButtonEl) {
    /**
     * Set up leaving large title
     */
    const clonedTitleEl = await cloneElement(leavingLargeTitleEl, true, document.body);
    clonedTitleEl.style.transformOrigin = 'left center';

    const clonedLargeTitleAnimation = new AnimationC();
    clonedLargeTitleAnimation.addElement(clonedTitleEl);

    clonedLargeTitleAnimation
      .beforeStyles({
        'transform': 'scale(1, 1) translate(0, 49px)',
        'height': 'auto',
        'position': 'relative',
        'transition-property': 'opacity, transform'
      })
      .duration([DURATION / 3, DURATION])
      .fromTo(TRANSFORM, 'translate(0, 49px) scale(1)', 'translate(18px, 0px) scale(0.5)')
      .fromTo(OPACITY, 0.99, 0);

    rootTransition.add(clonedLargeTitleAnimation);

    const largeTitleAnimation = new AnimationC();
    largeTitleAnimation.addElement(leavingLargeTitleEl);

    largeTitleAnimation
      .beforeStyles({
        'display': 'none'
      })
      .afterStyles({
        'display': 'inherit'
      });

    rootTransition.add(largeTitleAnimation);

    /**
     * Setup entering back button
     */
    const enteringBackButtonTextAnimation = new AnimationC();
    const enteringBackButtonIconAnimation = new AnimationC();

    const clonedBackButtonEl = await cloneElement(enteringBackButtonEl, false, document.body);

    clonedBackButtonEl.style.display = 'block';
    clonedBackButtonEl.style.position = 'fixed';

    enteringBackButtonEl.style.display = 'none';

    const backButtonTextEl = clonedBackButtonEl.querySelector('.button-text');
    backButtonTextEl.style.transformOrigin = 'left center';

    const backButtonIconEl = clonedBackButtonEl.querySelector('ion-icon');
    backButtonIconEl.style.transformOrigin = 'right center';

    enteringBackButtonIconAnimation.addElement(backButtonIconEl);
    enteringBackButtonTextAnimation.addElement(backButtonTextEl);

    enteringBackButtonTextAnimation
      .fromTo(TRANSFORM, 'translate(-7px, 8px) scale(2.1)', 'translate(4px, -40px) scale(1)')
      .fromTo(OPACITY, 0, 1);

    enteringBackButtonIconAnimation
      .fromTo(TRANSFORM, 'translate(4px, -40px) scale(0.6)', 'translate(4px, -40px) scale(1)')
      .fromTo(OPACITY, 0, 1);

    rootTransition.add(enteringBackButtonTextAnimation);
    rootTransition.add(enteringBackButtonIconAnimation);
  }

  // Return the rootTransition promise
  return Promise.resolve(rootTransition);
}

const cloneElement = async (el: any, deep = false, elementToAppendTo?: any): Promise<any> => {
  try {
    const clone = el.cloneNode(deep);

    if (elementToAppendTo) {
      elementToAppendTo.appendChild(clone);

      if (clone.componentOnReady) {
        await clone.componentOnReady();
      }
    }

    return clone;
  } catch (err) {
    throw err;
  }
};
