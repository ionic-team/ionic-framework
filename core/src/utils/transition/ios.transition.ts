import { IonicAnimation } from '../../interface';
import { createAnimation } from '../animation/animation';
import { TransitionOptions } from '../transition';

/**
 * If a view has the iOS Large Header in use,
 * we do not always want to interfere with the styles
 * of the title in the main header as they can change
 * depending on whether or not the large header is collapsed.
 */
const hasCollapsableHeader = (el: any): boolean => {
  return el && el.classList.contains('collapse-header-title-hidden');
};

const addSafeArea = (val: number, side = 'top'): string => {
  return `calc(${val}px + var(--ion-safe-area-${side}))`;
};

const cloneElement = async (el: any, deep = false, elementToAppendTo?: any, hidden = false): Promise<any> => {
  try {
    const fetchCachedElement = elementToAppendTo.querySelector(`${el.tagName.toLowerCase()}.ion-cloned-element`);

    if (fetchCachedElement) {
      if (fetchCachedElement.componentOnReady) {
        await fetchCachedElement.componentOnReady();
      }

      return fetchCachedElement;
    }

    const clone = el.cloneNode(deep);

    if (hidden) {
      clone.style.setProperty('display', 'none');
    }

    clone.classList.add('ion-cloned-element');

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

export const shadow = <T extends Element>(el: T): ShadowRoot | T => {
  return el.shadowRoot || el;
};

export const iosTransitionAnimation = async (navEl: HTMLElement, opts: TransitionOptions): Promise<IonicAnimation> => {
  try {
    const DURATION = 540;
    const EASING = 'cubic-bezier(0.32,0.72,0,1)';
    const OPACITY = 'opacity';
    const TRANSFORM = 'transform';
    const CENTER = '0%';
    const OFF_OPACITY = 0.8;

    const isRTL = (navEl.ownerDocument as any).dir === 'rtl';
    const OFF_RIGHT = isRTL ? '-99.5%' : '99.5%';
    const OFF_LEFT = isRTL ? '33%' : '-33%';

    const enteringEl = opts.enteringEl;
    const leavingEl = opts.leavingEl;

    const backDirection = (opts.direction === 'back');
    const contentEl = enteringEl.querySelector(':scope > ion-content');
    const headerEls = enteringEl.querySelectorAll(':scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *');
    const enteringToolBarEls = enteringEl.querySelectorAll(':scope > ion-header > ion-toolbar');

    const rootAnimation = createAnimation();
    const enteringContentAnimation = createAnimation();

    let leavingLargeTitleEl: any;
    let enteringLargeTitleEl: any;
    let enteringBackButtonEl: any;
    let leavingBackButtonEl: any;

    rootAnimation
      .addElement(enteringEl)
      .duration(opts.duration || DURATION)
      .easing(opts.easing || EASING)
      .fill('both')
      .beforeRemoveClass('ion-page-invisible');

    if (leavingEl && navEl) {
      const navDecorAnimation = createAnimation();
      navDecorAnimation.addElement(navEl);
      rootAnimation.addAnimation(navDecorAnimation);
    }

    if (!contentEl && enteringToolBarEls.length === 0 && headerEls.length === 0) {
      enteringContentAnimation.addElement(enteringEl.querySelector(':scope > .ion-page, :scope > ion-nav, :scope > ion-tabs'));
    } else {
      enteringContentAnimation.addElement(contentEl);
      enteringContentAnimation.addElement(headerEls);
    }

    rootAnimation.addAnimation(enteringContentAnimation);

    if (backDirection) {
      enteringContentAnimation
        .beforeClearStyles([OPACITY])
        .fromTo('transform', `translateX(${OFF_LEFT})`, `translateX(${CENTER})`)
        .fromTo(OPACITY, OFF_OPACITY, 1);
    } else {
      // entering content, forward direction
      enteringContentAnimation
        .beforeClearStyles([OPACITY])
        .fromTo('transform', `translateX(${OFF_RIGHT})`, `translateX(${CENTER})`);
    }

    if (contentEl) {
      const enteringTransitionEffectEl = shadow(contentEl).querySelector('.transition-effect');
      if (enteringTransitionEffectEl) {
        const enteringTransitionCoverEl = enteringTransitionEffectEl.querySelector('.transition-cover');
        const enteringTransitionShadowEl = enteringTransitionEffectEl.querySelector('.transition-shadow');

        const enteringTransitionEffect = createAnimation();
        const enteringTransitionCover = createAnimation();
        const enteringTransitionShadow = createAnimation();

        enteringTransitionEffect
          .addElement(enteringTransitionEffectEl)
          .beforeStyles({ opacity: '1' })
          .afterStyles({ opacity: '' });

        enteringTransitionCover
          .addElement(enteringTransitionCoverEl)
          .beforeClearStyles([OPACITY])
          .fromTo(OPACITY, 0, 0.1);

        enteringTransitionShadow
          .addElement(enteringTransitionShadowEl)
          .beforeClearStyles([OPACITY])
          .fromTo(OPACITY, 0.03, 0.70);

        enteringTransitionEffect.addAnimation([enteringTransitionCover, enteringTransitionShadow]);
        enteringContentAnimation.addAnimation([enteringTransitionEffect]);
      }
    }

    enteringToolBarEls.forEach(enteringToolBarEl => {
      const enteringToolBar = createAnimation();
      enteringToolBar.addElement(enteringToolBarEl);
      rootAnimation.addAnimation(enteringToolBar);

      const enteringTitle = createAnimation();
      const enteringTitleEl = enteringToolBarEl.querySelector('ion-title');
      enteringTitle.addElement(enteringTitleEl);

      const enteringToolBarButtons = createAnimation();
      enteringToolBarButtons.addElement(enteringToolBarEl.querySelectorAll('ion-buttons,[menuToggle]'));

      const enteringToolBarItems = createAnimation();
      enteringToolBarItems.addElement(enteringToolBarEl.querySelectorAll(':scope > *:not(ion-title):not(ion-buttons):not([menuToggle])'));

      const enteringToolBarBg = createAnimation();
      enteringToolBarBg.addElement(shadow(enteringToolBarEl).querySelector('.toolbar-background'));

      const enteringBackButton = createAnimation();
      const backButtonEl = enteringToolBarEl.querySelector('ion-back-button');

      enteringToolBar.addAnimation([enteringTitle, enteringToolBarButtons, enteringToolBarItems, enteringToolBarBg, enteringBackButton]);
      if (!hasCollapsableHeader(enteringTitleEl)) {
        enteringTitle.fromTo(OPACITY, 0.01, 1);
      } else {
        const largeTitleEl = enteringEl.querySelector('ion-title.title-ios-large') as HTMLElement;

        if (largeTitleEl && !enteringLargeTitleEl) {
          enteringLargeTitleEl = largeTitleEl;
        }
      }

      enteringToolBarButtons.fromTo(OPACITY, 0.01, 1);
      enteringToolBarItems.fromTo(OPACITY, 0.01, 1);

      if (backDirection) {
        enteringTitle.fromTo('transform', `translateX(${OFF_LEFT})`, `translateX(${CENTER})`);

        enteringToolBarItems.fromTo('transform', `translateX(${OFF_LEFT})`, `translateX(${CENTER})`);

        // back direction, entering page has a back button
        enteringBackButton.fromTo(OPACITY, 0.01, 1);
      } else {
        // entering toolbar, forward direction
        enteringTitle.fromTo('transform', `translateX(${OFF_RIGHT})`, `translateX(${CENTER})`);

        enteringToolBarItems.fromTo('transform', `translateX(${OFF_RIGHT})`, `translateX(${CENTER})`);

        enteringToolBarBg
          .beforeClearStyles([OPACITY])
          .fromTo(OPACITY, 0.01, 1);

        // forward direction, entering page has a back button
        enteringBackButton.fromTo(OPACITY, 0.01, 1);

        if (backButtonEl) {
          const isCollapsed = (backButtonEl.closest('ion-buttons[collapse]') as HTMLElement);
          if (!enteringBackButtonEl && isCollapsed) {
            if (isCollapsed.style.opacity !== '0') {
              enteringBackButtonEl = backButtonEl;
            }
          } else {
            const enteringBackBtnText = createAnimation();
            enteringBackBtnText
              .addElement(shadow(backButtonEl).querySelector('.button-text'))
              .fromTo(`transform`, (isRTL ? 'translateX(-100px)' : 'translateX(100px)'), 'translateX(0px)');

            enteringToolBar.addAnimation(enteringBackBtnText);
          }
        }
      }
    });

    // setup leaving view
    if (leavingEl) {

      const leavingContent = createAnimation();
      const leavingContentEl = leavingEl.querySelector(':scope > ion-content');

      leavingContent.addElement(leavingContentEl);
      leavingContent.addElement(leavingEl.querySelectorAll(':scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *'));
      rootAnimation.addAnimation(leavingContent);

      if (backDirection) {
        // leaving content, back direction
        leavingContent
          .beforeClearStyles([OPACITY])
          .fromTo('transform', `translateX(${CENTER})`, (isRTL ? 'translateX(-100%)' : 'translateX(100%)'));

      } else {
        // leaving content, forward direction
        leavingContent
          .fromTo('transform', `translateX(${CENTER})`, `translateX(${OFF_LEFT})`)
          .fromTo(OPACITY, 1, OFF_OPACITY);
      }

      if (leavingContentEl) {
        const leavingTransitionEffectEl = shadow(leavingContentEl).querySelector('.transition-effect');

        if (leavingTransitionEffectEl) {
          const leavingTransitionCoverEl = leavingTransitionEffectEl.querySelector('.transition-cover');
          const leavingTransitionShadowEl = leavingTransitionEffectEl.querySelector('.transition-shadow');

          const leavingTransitionEffect = createAnimation();
          const leavingTransitionCover = createAnimation();
          const leavingTransitionShadow = createAnimation();

          leavingTransitionEffect
            .addElement(leavingTransitionEffectEl)
            .beforeStyles({ opacity: '1' })
            .afterStyles({ opacity: '' });

          leavingTransitionCover
            .addElement(leavingTransitionCoverEl)
            .beforeClearStyles([OPACITY])
            .fromTo(OPACITY, 0.1, 0);

          leavingTransitionShadow
            .addElement(leavingTransitionShadowEl)
            .beforeClearStyles([OPACITY])
            .fromTo(OPACITY, 0.70, 0.03);

          leavingTransitionEffect.addAnimation([leavingTransitionCover, leavingTransitionShadow]);
          leavingContent.addAnimation([leavingTransitionEffect]);
        }
      }

      const leavingToolBarEls = leavingEl.querySelectorAll(':scope > ion-header > ion-toolbar');
      leavingToolBarEls.forEach(leavingToolBarEl => {
        const leavingToolBar = createAnimation();
        leavingToolBar.addElement(leavingToolBarEl);

        const leavingTitle = createAnimation();
        const leavingTitleEl = leavingToolBarEl.querySelector('ion-title');
        leavingTitle.addElement(leavingTitleEl);

        const leavingToolBarButtons = createAnimation();
        leavingToolBarButtons.addElement(leavingToolBarEl.querySelectorAll('ion-buttons,[menuToggle]'));

        const leavingToolBarItems = createAnimation();
        const leavingToolBarItemEls = leavingToolBarEl.querySelectorAll(':scope > *:not(ion-title):not(ion-buttons):not([menuToggle])');
        if (leavingToolBarItemEls.length > 0) {
          leavingToolBarItems.addElement(leavingToolBarItemEls);
        }

        const leavingToolBarBg = createAnimation();
        leavingToolBarBg.addElement(shadow(leavingToolBarEl).querySelector('.toolbar-background'));

        const leavingBackButton = createAnimation();
        const backButtonEl = leavingToolBarEl.querySelector('ion-back-button');
        if (backButtonEl) {
          leavingBackButton.addElement(backButtonEl);
        }

        leavingToolBar.addAnimation([leavingTitle, leavingToolBarButtons, leavingToolBarItems, leavingBackButton, leavingToolBarBg]);
        rootAnimation.addAnimation(leavingToolBar);

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

        leavingToolBarButtons.fromTo(OPACITY, 0.99, 0);
        leavingToolBarItems.fromTo(OPACITY, 0.99, 0);

        if (backDirection) {
          // leaving toolbar, back direction
          leavingTitle.fromTo('transform', `translateX(${CENTER})`, (isRTL ? 'translateX(-100%)' : 'translateX(100%)'));
          leavingToolBarItems.fromTo('transform', `translateX(${CENTER})`, (isRTL ? 'translateX(-100%)' : 'translateX(100%)'));

          // leaving toolbar, back direction, and there's no entering toolbar
          // should just slide out, no fading out
          leavingToolBarBg
            .beforeClearStyles([OPACITY])
            .fromTo(OPACITY, 1, 0.01);

          if (backButtonEl) {
            const isCollapsed = backButtonEl.closest('ion-buttons[collapse]') as HTMLElement;
            if (!leavingBackButtonEl && isCollapsed) {
              if (isCollapsed.style.opacity !== '0') {
                leavingBackButtonEl = backButtonEl;
              }
            } else {
              const leavingBackBtnText = createAnimation();
              leavingBackBtnText
                .addElement(shadow(backButtonEl).querySelector('.button-text'))
                .fromTo('transform', `translateX(${CENTER})`, `translateX(${(isRTL ? -124 : 124) + 'px'})`);
              leavingToolBar.addAnimation(leavingBackBtnText);
            }
          }

        } else {
          // leaving toolbar, forward direction
          leavingTitle
            .fromTo('transform', `translateX(${CENTER})`, `translateX(${OFF_LEFT})`)
            .afterClearStyles([TRANSFORM]);
          leavingToolBarItems
            .fromTo('transform', `translateX(${CENTER})`, `translateX(${OFF_LEFT})`)
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
     * Setup large iOS title navigation for leaving view
     */
    if (leavingLargeTitleEl && enteringBackButtonEl) {
      /**
       * Set up leaving large title
       */
      const clonedTitleEl = await cloneElement(leavingLargeTitleEl, true, document.body, true);
      const clonedLargeTitleAnimation = createAnimation();
      clonedLargeTitleAnimation.addElement(clonedTitleEl);

      clonedLargeTitleAnimation
        .beforeStyles({
          'transform-origin': 'left center',
          'height': '46px',
          'display': '',
          'position': 'relative'
        })
        .beforeAddWrite(() => {
          leavingLargeTitleEl.style.setProperty('visibility', 'hidden');
          leavingLargeTitleEl.style.setProperty('pointer-events', 'none');
        })
        .afterAddWrite(() => {
          leavingLargeTitleEl.style.setProperty('visibility', '');
          leavingLargeTitleEl.style.setProperty('pointer-events', '');
          clonedTitleEl.style.setProperty('display', 'none');
        })
        .duration(DURATION)
        .keyframes([
          { offset: 0, opacity: 0.99, transform: `translate(0, ${addSafeArea(49)}) scale(1)` },
          { offset: 0.6, opacity: 0 },
          { offset: 1, opacity: 0, transform: `translate(18px, ${addSafeArea(0)}) scale(0.5)` }
        ]);

      rootAnimation.addAnimation(clonedLargeTitleAnimation);

      /**
       * Setup entering back button
       */
      const enteringBackButtonTextAnimation = createAnimation();
      const enteringBackButtonIconAnimation = createAnimation();

      const clonedBackButtonEl = await cloneElement(enteringBackButtonEl, false, document.body);

      clonedBackButtonEl.style.setProperty('display', 'block');
      clonedBackButtonEl.style.setProperty('position', 'fixed');

      const backButtonTextEl = clonedBackButtonEl.querySelector('.button-text');
      const backButtonIconEl = clonedBackButtonEl.querySelector('ion-icon');

      enteringBackButtonIconAnimation.addElement(backButtonIconEl);
      enteringBackButtonTextAnimation.addElement(backButtonTextEl);

      enteringBackButtonTextAnimation
        .beforeStyles({
          'transform-origin': 'left center'
        })
        .beforeAddWrite(() => {
          enteringBackButtonEl.style.setProperty('visibility', 'hidden');
          enteringBackButtonEl.style.setProperty('pointer-events', 'none');
        })
        .afterAddWrite(() => {
          enteringBackButtonEl.style.setProperty('visibility', '');
          enteringBackButtonEl.style.setProperty('pointer-events', '');
          clonedBackButtonEl.style.setProperty('display', 'none');
        })
        .keyframes([
          { offset: 0, opacity: 0, transform: `translate(-7px, ${addSafeArea(8)}) scale(2.1)` },
          { offset: 1, opacity: 1, transform: `translate(4px, ${addSafeArea(-40)}) scale(1)` }
        ]);

      enteringBackButtonIconAnimation
        .beforeStyles({
          'transform-origin': 'right center'
        })
        .delay(DURATION * 0.4)
        .duration(DURATION * 0.5)
        .keyframes([
          { offset: 0, opacity: 0, transform: `translate3d(4px, ${addSafeArea(-35)}, 0) scale(0.6)` },
          { offset: 1, opacity: 1, transform: `translate3d(4px, ${addSafeArea(-40)}, 0) scale(1)` }
        ]);

      rootAnimation.addAnimation([enteringBackButtonTextAnimation, enteringBackButtonIconAnimation]);
    } else if (enteringLargeTitleEl && leavingBackButtonEl) {
      /**
       * Set up leaving large title
       */
      const clonedTitleEl = await cloneElement(enteringLargeTitleEl, true, document.body, true);
      const clonedLargeTitleAnimation = createAnimation();
      clonedLargeTitleAnimation.addElement(clonedTitleEl);

      clonedLargeTitleAnimation
        .beforeStyles({
          'transform-origin': 'left center',
          'height': '46px',
          'display': '',
          'position': 'relative'
        })
        .beforeAddWrite(() => {
          enteringLargeTitleEl.style.setProperty('visibility', 'hidden');
          enteringLargeTitleEl.style.setProperty('pointer-events', 'none');
        })
        .afterAddWrite(() => {
          enteringLargeTitleEl.style.setProperty('visibility', '');
          enteringLargeTitleEl.style.setProperty('pointer-events', '');
          clonedTitleEl.style.setProperty('display', 'none');
        })
        .keyframes([
          { offset: 0, opacity: 0, transform: `translate(18px, ${addSafeArea(0)}) scale(0.49)` },
          { offset: 0.1, opacity: 0 },
          { offset: 1, opacity: 1, transform: `translate(0, ${addSafeArea(49)}) scale(1)` }
        ]);

      rootAnimation.addAnimation(clonedLargeTitleAnimation);

      /**
       * Setup entering back button
       */
      const leavingBackButtonTextAnimation = createAnimation();
      const leavingBackButtonIconAnimation = createAnimation();

      const clonedBackButtonEl = await cloneElement(leavingBackButtonEl, false, document.body);

      clonedBackButtonEl.style.display = 'block';
      clonedBackButtonEl.style.position = 'fixed';

      const backButtonTextEl = clonedBackButtonEl.querySelector('.button-text');
      const backButtonIconEl = clonedBackButtonEl.querySelector('ion-icon');

      leavingBackButtonIconAnimation.addElement(backButtonIconEl);
      leavingBackButtonTextAnimation.addElement(backButtonTextEl);

      leavingBackButtonTextAnimation
        .beforeStyles({
          'transform-origin': 'left center'
        })
        .beforeAddWrite(() => {
          leavingBackButtonEl.style.setProperty('visibility', 'hidden');
          leavingBackButtonEl.style.setProperty('pointer-events', 'none');
        })
        .afterAddWrite(() => {
          leavingBackButtonEl.style.setProperty('visibility', '');
          leavingBackButtonEl.style.setProperty('pointer-events', '');
          clonedBackButtonEl.style.setProperty('display', 'none');
        })
        .keyframes([
          { offset: 0, opacity: 1, transform: `translate(4px, ${addSafeArea(-40)}) scale(1)` },
          { offset: 0.6, opacity: 0 },
          { offset: 1, opacity: 0, transform: `translate(-7px, ${addSafeArea(8)}) scale(2.1)` }
        ]);

      leavingBackButtonIconAnimation
        .beforeStyles({
          'transform-origin': 'right center'
        })
        .keyframes([
          { offset: 0, opacity: 1, transform: `translate(4px, ${addSafeArea(-40)}) scale(1)` },
          { offset: 0.1, opacity: 0, transform: `translate(4px, ${addSafeArea(-35)}) scale(0.6)` },
          { offset: 1, opacity: 0, transform: `translate(4px, ${addSafeArea(-35)}) scale(0.6)` }
        ]);

      rootAnimation.addAnimation([leavingBackButtonTextAnimation, leavingBackButtonIconAnimation]);
    }

    return rootAnimation;
  } catch (err) {
    throw err;
  }
};
