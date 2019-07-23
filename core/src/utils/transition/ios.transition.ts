import { Animation } from '../../interface';
import { Animation as AnimationNew, createAnimation } from '../animation/animation';
import { TransitionOptions } from '../transition';

export const shadow = <T extends Element>(el: T): ShadowRoot | T => {
  return el.shadowRoot || el;
};

export const newIosTransitionAnimation = (navEl: HTMLElement, opts: TransitionOptions): Promise<AnimationNew> => {
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

    rootAnimation
      .addElement(enteringEl)
      .duration(opts.duration || DURATION)
      .easing(opts.easing || EASING)
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
      enteringTitle.addElement(enteringToolBarEl.querySelector('ion-title'));

      const enteringToolBarButtons = createAnimation();
      enteringToolBarButtons.addElement(enteringToolBarEl.querySelectorAll('ion-buttons,[menuToggle]'));

      const enteringToolBarItems = createAnimation();
      enteringToolBarItems.addElement(enteringToolBarEl.querySelectorAll(':scope > *:not(ion-title):not(ion-buttons):not([menuToggle])'));

      const enteringToolBarBg = createAnimation();
      enteringToolBarBg.addElement(shadow(enteringToolBarEl).querySelector('.toolbar-background'));

      const enteringBackButton = createAnimation();
      const backButtonEl = enteringToolBarEl.querySelector('ion-back-button');

      if (backButtonEl) {
        enteringBackButton.addElement(backButtonEl);
      }

      enteringToolBar.addAnimation([enteringTitle, enteringToolBarButtons, enteringToolBarItems, enteringToolBarBg, enteringBackButton]);
      enteringTitle.fromTo(OPACITY, 0.01, 1);
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
          const enteringBackBtnText = createAnimation();
          enteringBackBtnText
            .addElement(shadow(backButtonEl).querySelector('.button-text'))
            .fromTo(`transform`, (isRTL ? 'translateX(-100px)' : 'translateX(100px)'), 'translateX(0px)');

          enteringToolBar.addAnimation(enteringBackBtnText);
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
        leavingTitle.addElement(leavingToolBarEl.querySelector('ion-title'));

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
        leavingTitle.fromTo(OPACITY, 0.99, 0);
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
            const leavingBackBtnText = createAnimation();
            leavingBackBtnText.addElement(shadow(backButtonEl).querySelector('.button-text'));
            leavingBackBtnText.fromTo('transform', `translateX(${CENTER})`, `translateX(${(isRTL ? -124 : 124) + 'px'})`);
            leavingToolBar.addAnimation(leavingBackBtnText);
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
          leavingTitle.afterClearStyles([OPACITY]);
          leavingToolBarButtons.afterClearStyles([OPACITY]);
        }
      });
    }

    return rootAnimation as any;
  } catch (err) {
    throw err;
  }
};

export const iosTransitionAnimation = (AnimationC: Animation, navEl: HTMLElement, opts: TransitionOptions): Promise<Animation> => {

  const DURATION = 540;
  const EASING = 'cubic-bezier(0.32,0.72,0,1)';
  const OPACITY = 'opacity';
  const TRANSFORM = 'transform';
  const TRANSLATEX = 'translateX';
  const CENTER = '0%';
  const OFF_OPACITY = 0.8;

  const backDirection = (opts.direction === 'back');
  const isRTL = (navEl.ownerDocument as any).dir === 'rtl';
  const OFF_RIGHT = isRTL ? '-99.5%' : '99.5%';
  const OFF_LEFT = isRTL ? '33%' : '-33%';

  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;
  const contentEl = enteringEl.querySelector(':scope > ion-content');
  const headerEls = enteringEl.querySelectorAll(':scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *');
  const enteringToolBarEls = enteringEl.querySelectorAll(':scope > ion-header > ion-toolbar');
  const enteringContent = new AnimationC();

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

  if (!contentEl && enteringToolBarEls.length === 0 && headerEls.length === 0) {
    enteringContent.addElement(enteringEl.querySelector(':scope > .ion-page, :scope > ion-nav, :scope > ion-tabs'));
  } else {
    enteringContent
      .addElement(contentEl)
      .addElement(headerEls);
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

    if (contentEl) {
      const enteringTransitionEffectEl = shadow(contentEl).querySelector('.transition-effect');

      if (enteringTransitionEffectEl) {
        const enteringTransitionCoverEl = enteringTransitionEffectEl.querySelector('.transition-cover');
        const enteringTransitionShadowEl = enteringTransitionEffectEl.querySelector('.transition-shadow');

        const enteringTransitionEffect = new AnimationC();
        const enteringTransitionCover = new AnimationC();
        const enteringTransitionShadow = new AnimationC();

        enteringTransitionEffect
          .addElement(enteringTransitionEffectEl)
          .beforeStyles({ opacity: '1' })
          .afterStyles({ opacity: '' });

        enteringTransitionCover
          .addElement(enteringTransitionCoverEl)
          .beforeClearStyles([OPACITY])
          .fromTo(OPACITY, 0, 0.1, true);

        enteringTransitionShadow
          .addElement(enteringTransitionShadowEl)
          .beforeClearStyles([OPACITY])
          .fromTo(OPACITY, 0.70, 0.03, true);

        enteringContent
          .add(enteringTransitionEffect)
          .add(enteringTransitionCover)
          .add(enteringTransitionShadow);
      }
    }
  }

  enteringToolBarEls.forEach(enteringToolBarEl => {
    const enteringToolBar = new AnimationC();
    const enteringTitle = new AnimationC();
    const enteringToolBarButtons = new AnimationC();
    const enteringToolBarItems = new AnimationC();
    const enteringToolBarBg = new AnimationC();
    const enteringBackButton = new AnimationC();
    const backButtonEl = enteringToolBarEl.querySelector('ion-back-button');

    enteringToolBar.addElement(enteringToolBarEl);
    rootTransition.add(enteringToolBar);

    enteringTitle.addElement(enteringToolBarEl.querySelector('ion-title'));

    enteringToolBarButtons.addElement(enteringToolBarEl.querySelectorAll('ion-buttons,[menuToggle]'));

    enteringToolBarItems.addElement(enteringToolBarEl.querySelectorAll(':scope > *:not(ion-title):not(ion-buttons):not([menuToggle])'));

    enteringToolBarBg.addElement(shadow(enteringToolBarEl).querySelector('.toolbar-background'));

    if (backButtonEl) {
      enteringBackButton.addElement(backButtonEl);
    }

    enteringToolBar
      .add(enteringTitle)
      .add(enteringToolBarButtons)
      .add(enteringToolBarItems)
      .add(enteringToolBarBg)
      .add(enteringBackButton);

    enteringTitle.fromTo(OPACITY, 0.01, 1, true);
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
    const leavingContentEl = leavingEl.querySelector(':scope > ion-content');

    leavingContent
      .addElement(leavingContentEl)
      .addElement(leavingEl.querySelectorAll(':scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *'));

    rootTransition.add(leavingContent);

    if (backDirection) {
      // leaving content, back direction
      leavingContent
        .beforeClearStyles([OPACITY])
        .fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));

      if (leavingContentEl) {
        const leavingTransitionEffectEl = shadow(leavingContentEl).querySelector('.transition-effect');
        if (leavingTransitionEffectEl) {
          const leavingTransitionCoverEl = leavingTransitionEffectEl.querySelector('.transition-cover');
          const leavingTransitionShadowEl = leavingTransitionEffectEl.querySelector('.transition-shadow');

          const leavingTransitionEffect = new AnimationC();
          const leavingTransitionCover = new AnimationC();
          const leavingTransitionShadow = new AnimationC();

          leavingTransitionEffect
            .addElement(leavingTransitionEffectEl)
            .beforeStyles({ opacity: '1' })
            .afterStyles({ opacity: '' });

          leavingTransitionCover
            .addElement(leavingTransitionCoverEl)
            .beforeClearStyles([OPACITY])
            .fromTo(OPACITY, 0.1, 0, true);

          leavingTransitionShadow
            .addElement(leavingTransitionShadowEl)
            .beforeClearStyles([OPACITY])
            .fromTo(OPACITY, 0.70, 0.03, true);

          leavingContent
            .add(leavingTransitionEffect)
            .add(leavingTransitionCover)
            .add(leavingTransitionShadow);
        }
      }

    } else {
      // leaving content, forward direction
      leavingContent
        .fromTo(TRANSLATEX, CENTER, OFF_LEFT, true)
        .fromTo(OPACITY, 1, OFF_OPACITY, true);
    }

    const leavingToolBarEls = leavingEl.querySelectorAll(':scope > ion-header > ion-toolbar');
    leavingToolBarEls.forEach(leavingToolBarEl => {
      const leavingToolBar = new AnimationC();
      const leavingTitle = new AnimationC();
      const leavingToolBarButtons = new AnimationC();
      const leavingToolBarItems = new AnimationC();
      const leavingToolBarItemEls = leavingToolBarEl.querySelectorAll(':scope > *:not(ion-title):not(ion-buttons):not([menuToggle])');
      const leavingToolBarBg = new AnimationC();
      const leavingBackButton = new AnimationC();
      const backButtonEl = leavingToolBarEl.querySelector('ion-back-button');

      leavingToolBar.addElement(leavingToolBarEl);

      leavingTitle.addElement(leavingToolBarEl.querySelector('ion-title'));

      leavingToolBarButtons.addElement(leavingToolBarEl.querySelectorAll('ion-buttons,[menuToggle]'));

      if (leavingToolBarItemEls.length > 0) {
        leavingToolBarItems.addElement(leavingToolBarItemEls);
      }

      leavingToolBarBg.addElement(shadow(leavingToolBarEl).querySelector('.toolbar-background'));

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
      leavingTitle.fromTo(OPACITY, 0.99, 0);
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
        leavingTitle.afterClearStyles([OPACITY]);
        leavingToolBarButtons.afterClearStyles([OPACITY]);
      }
    });
  }

  // Return the rootTransition promise
  return Promise.resolve(rootTransition);
};
