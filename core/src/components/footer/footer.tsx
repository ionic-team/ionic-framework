import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { findIonContent, getScrollElement, printIonContentErrorMsg } from '@utils/content';
import type { KeyboardController } from '@utils/keyboard/keyboard-controller';
import { createKeyboardController } from '@utils/keyboard/keyboard-controller';
import { printIonWarning } from '@utils/logging';
import type { ScrollHideController } from '@utils/scroll-hide-controller';
import { createScrollHideController } from '@utils/scroll-hide-controller';

import { config } from '../../global/config';
import { getIonTheme } from '../../global/ionic-global';

import type { FooterScrollEffect } from './footer-interface';
import { handleFooterFade } from './footer.utils';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-footer',
  styleUrls: {
    ios: 'footer.ios.scss',
    md: 'footer.md.scss',
    ionic: 'footer.md.scss',
  },
})
export class Footer implements ComponentInterface {
  private scrollEl?: HTMLElement;
  private contentScrollCallback?: () => void;
  private keyboardCtrl: KeyboardController | null = null;
  private keyboardCtrlPromise: Promise<KeyboardController> | null = null;
  private scrollHideCtrl?: ScrollHideController;
  private scrollHideCtrlPromise: Promise<ScrollHideController> | null = null;
  private hasWarnedCollapse = false;
  private activeEffect?: string;

  @State() private keyboardVisible = false;

  @Element() el!: HTMLIonFooterElement;

  /**
   * Describes the scroll effect that will be applied to the footer.
   * `"hide"` slides the footer out of view when scrolling down and back in
   * when scrolling up.
   * `"fade"` fades the toolbar background on scroll.
   */
  @Prop({ reflect: true }) scrollEffect?: FooterScrollEffect;

  /**
   * Describes the scroll effect that will be applied to the footer.
   * Only applies when the theme is `"ios"`.
   *
   * @deprecated Use `scrollEffect` instead.
   */
  @Prop() collapse?: 'fade';

  /**
   * If `true`, the footer will be translucent.
   * Only applies when the theme is `"ios"` and the device supports
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   *
   * Note: In order to scroll content behind the footer, the `fullscreen`
   * attribute needs to be set on the content.
   */
  @Prop() translucent = false;

  componentDidLoad() {
    this.checkCollapsibleFooter();
  }

  componentDidUpdate() {
    this.checkCollapsibleFooter();
  }

  async connectedCallback() {
    const promise = createKeyboardController(async (keyboardOpen, waitForResize) => {
      /**
       * If the keyboard is hiding, then we need to wait
       * for the webview to resize. Otherwise, the footer
       * will flicker before the webview resizes.
       */
      if (keyboardOpen === false && waitForResize !== undefined) {
        await waitForResize;
      }

      this.keyboardVisible = keyboardOpen; // trigger re-render by updating state
    });
    this.keyboardCtrlPromise = promise;

    const keyboardCtrl = await promise;

    /**
     * Only assign if this is still the current promise.
     * Otherwise, a new connectedCallback has started or
     * disconnectedCallback was called, so destroy this instance.
     */
    if (this.keyboardCtrlPromise === promise) {
      this.keyboardCtrl = keyboardCtrl;
      this.keyboardCtrlPromise = null;
    } else {
      keyboardCtrl.destroy();
    }
  }

  disconnectedCallback() {
    this.destroyCollapsibleFooter();

    if (this.keyboardCtrlPromise) {
      this.keyboardCtrlPromise.then((ctrl) => ctrl.destroy());
      this.keyboardCtrlPromise = null;
    }

    if (this.keyboardCtrl) {
      this.keyboardCtrl.destroy();
      this.keyboardCtrl = null;
    }
  }

  private checkCollapsibleFooter = async () => {
    const { scrollEffect, collapse } = this;

    if (collapse !== undefined && scrollEffect === undefined && !this.hasWarnedCollapse) {
      this.hasWarnedCollapse = true;
      printIonWarning(
        `[ion-footer] - The \`collapse\` property is deprecated. Use \`scrollEffect\` instead.\nExample: <ion-footer scroll-effect="${collapse}">`,
        this.el
      );
    }

    const effect = scrollEffect ?? collapse;

    // Skip teardown/rebuild if the effect hasn't changed.
    // This prevents keyboard toggles (which trigger re-renders via
    // @State keyboardVisible) from destroying the scroll controller
    // and resetting isHidden.
    if (effect === this.activeEffect) {
      return;
    }

    const hasHide = effect === 'hide';
    const hasFade = effect === 'fade';

    this.destroyCollapsibleFooter();

    const appRootSelector = config.get('appRootSelector', 'ion-app');
    const pageEl = this.el.closest(`${appRootSelector}, ion-page, .ion-page, page-inner`);
    const contentEl = pageEl ? findIonContent(pageEl) : null;

    if (hasHide && contentEl) {
      await this.setupScrollEffectHide(contentEl);
      this.activeEffect = effect;
      return;
    }

    // fade via the deprecated `collapse` prop is iOS-only.
    // fade via the new `scrollEffect` prop works in all themes.
    const isModeRestricted = scrollEffect === undefined && getIonTheme(this) !== 'ios';
    if (hasFade && !isModeRestricted) {
      if (!contentEl) {
        printIonContentErrorMsg(this.el);
        return;
      }

      this.setupFadeFooter(contentEl);
      this.activeEffect = effect;
    }
  };

  private setupScrollEffectHide = async (contentEl: HTMLElement) => {
    const setupPromise = createScrollHideController(contentEl, {
      el: this.el,
      cssVar: '--internal-footer-hide-height',
      hiddenClass: 'footer-scroll-hidden',
      contentPartnerClass: 'content-footer-hide-scroll-partner',
      contentHiddenClass: 'content-footer-hide-scroll-hidden',
    });
    this.scrollHideCtrlPromise = setupPromise;

    const controller = await setupPromise;

    if (this.scrollHideCtrlPromise === setupPromise) {
      this.scrollHideCtrlPromise = null;
      controller.init();
      this.scrollHideCtrl = controller;
    }
  };

  private setupFadeFooter = async (contentEl: HTMLElement) => {
    const scrollEl = (this.scrollEl = await getScrollElement(contentEl));

    /**
     * Handle fading of toolbars on scroll
     */
    this.contentScrollCallback = () => {
      handleFooterFade(scrollEl, this.el);
    };
    scrollEl.addEventListener('scroll', this.contentScrollCallback);

    handleFooterFade(scrollEl, this.el);
  };

  private destroyCollapsibleFooter() {
    this.activeEffect = undefined;
    this.scrollHideCtrlPromise = null;

    if (this.scrollHideCtrl) {
      this.scrollHideCtrl.destroy();
      this.scrollHideCtrl = undefined;
    }

    if (this.scrollEl && this.contentScrollCallback) {
      this.scrollEl.removeEventListener('scroll', this.contentScrollCallback);
      this.contentScrollCallback = undefined;
    }
  }

  render() {
    const { translucent, scrollEffect, collapse } = this;
    const theme = getIonTheme(this);
    const effect = scrollEffect ?? collapse;
    // fade via the deprecated `collapse` prop is iOS-only.
    const isModeRestricted = scrollEffect === undefined && theme !== 'ios';
    const hasHide = effect === 'hide';
    const hasFade = effect === 'fade' && !isModeRestricted;
    const tabs = this.el.closest('ion-tabs');
    const tabBar = tabs?.querySelector(':scope > ion-tab-bar');

    return (
      <Host
        role="contentinfo"
        class={{
          [theme]: true,

          // Used internally for styling
          [`footer-${theme}`]: true,

          [`footer-translucent`]: translucent,
          [`footer-translucent-${theme}`]: translucent,
          ['footer-toolbar-padding']: !this.keyboardVisible && (!tabBar || tabBar.slot !== 'bottom'),

          'footer-collapse-fade': hasFade,
          'footer-scroll-effect-hide': hasHide,
        }}
      >
        {theme === 'ios' && translucent && <div class="footer-background"></div>}
        <slot></slot>
      </Host>
    );
  }
}
