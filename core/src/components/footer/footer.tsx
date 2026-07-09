import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, State, h, readTask, writeTask } from '@stencil/core';
import { ION_PAGE_ELEMENT_SELECTOR, findIonContent, getScrollElement, printIonContentErrorMsg } from '@utils/content';
import type { KeyboardController } from '@utils/keyboard/keyboard-controller';
import { createKeyboardController } from '@utils/keyboard/keyboard-controller';
import { printIonWarning } from '@utils/logging';

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
  private contentWheelCallback?: EventListener;
  private keyboardCtrl: KeyboardController | null = null;
  private keyboardCtrlPromise: Promise<KeyboardController> | null = null;
  private resizeObserver?: ResizeObserver;
  private contentEl?: HTMLElement;

  // scrollEffect="hide" scroll tracking state
  private scrollHidden = false;
  private previousScrollTop = 0;
  private scrollTopAtDirectionChange = 0;
  private lastWheelEventTime = 0;

  private readonly TOP_VISIBLE_THRESHOLD = 80;
  private readonly SCROLL_HIDE_THRESHOLD = 60;
  private readonly WHEEL_SUPPRESS_DURATION_MS = 80;

  @State() private keyboardVisible = false;

  @Element() el!: HTMLIonFooterElement;

  /**
   * Describes the scroll effect that will be applied to the footer.
   * `"hide"` slides the footer out of view when scrolling down and back in
   * when scrolling up.
   * `"fade"` fades the toolbar background on scroll.
   */
  @Prop() scrollEffect?: FooterScrollEffect;

  /**
   * Describes the scroll effect that will be applied to the footer.
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

    if (collapse !== undefined && scrollEffect === undefined) {
      printIonWarning(
        `The \`collapse\` property on \`ion-footer\` is deprecated. Use \`scrollEffect\` instead.\nExample: <ion-footer scroll-effect="${collapse}">`
      );
    }

    const hasHide = (scrollEffect ?? collapse) === 'hide';
    const hasFade = (scrollEffect ?? collapse) === 'fade';

    this.destroyCollapsibleFooter();

    const pageEl = this.el.closest(ION_PAGE_ELEMENT_SELECTOR);
    const contentEl = pageEl ? findIonContent(pageEl) : null;

    if (hasHide && contentEl) {
      await this.setupScrollEffectHide(contentEl);
      return;
    }

    if (hasFade) {
      if (!contentEl) {
        printIonContentErrorMsg(this.el);
        return;
      }

      this.setupFadeFooter(contentEl);
    }
  };

  private setupScrollEffectHide = async (contentEl: HTMLElement) => {
    this.contentEl = contentEl;
    const scrollEl = (this.scrollEl = await getScrollElement(contentEl));

    this.updateHideSlideY();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.updateHideSlideY());
      this.resizeObserver.observe(this.el);
    }

    this.contentScrollCallback = () => this.handleScrollEffectHide();
    scrollEl.addEventListener('scroll', this.contentScrollCallback, { passive: true });

    this.contentWheelCallback = (ev: Event) => this.handleWheelEffectHide(ev as WheelEvent);
    scrollEl.addEventListener('wheel', this.contentWheelCallback, { passive: true });

    contentEl.classList.add('content-footer-hide-scroll-partner');
  };

  private updateHideSlideY() {
    readTask(() => {
      const footerHeightPx = this.el.offsetHeight;
      writeTask(() => {
        this.el.style.setProperty('--internal-footer-hide-slide-y', `${footerHeightPx}px`);
        if (this.contentEl) {
          this.contentEl.style.setProperty('--internal-footer-hide-slide-y', `${footerHeightPx}px`);
        }
      });
    });
  }

  private handleWheelEffectHide = (ev: WheelEvent) => {
    this.lastWheelEventTime = Date.now();

    readTask(() => {
      const currentScrollTop = this.scrollEl!.scrollTop;

      if (currentScrollTop <= this.TOP_VISIBLE_THRESHOLD) {
        if (this.scrollHidden) {
          writeTask(() => this.setHidden(false));
        }
        return;
      }

      if (ev.deltaY < 0) {
        this.scrollTopAtDirectionChange = currentScrollTop;
        if (this.scrollHidden) {
          writeTask(() => this.setHidden(false));
        }
      } else if (ev.deltaY > 0) {
        const scrolledSinceDirectionChange = currentScrollTop - this.scrollTopAtDirectionChange;
        if (scrolledSinceDirectionChange >= this.SCROLL_HIDE_THRESHOLD && !this.scrollHidden) {
          writeTask(() => this.setHidden(true));
        }
      }
    });
  };

  private handleScrollEffectHide = () => {
    // Suppress scroll events shortly after a wheel event — delta already processed via wheel
    if (Date.now() - this.lastWheelEventTime < this.WHEEL_SUPPRESS_DURATION_MS) {
      return;
    }

    readTask(() => {
      const currentScrollTop = this.scrollEl!.scrollTop;

      if (currentScrollTop <= this.TOP_VISIBLE_THRESHOLD) {
        if (this.scrollHidden) {
          writeTask(() => this.setHidden(false));
        }
        this.previousScrollTop = currentScrollTop;
        return;
      }

      const isScrollingDown = currentScrollTop > this.previousScrollTop;
      const wasScrollingDown = this.previousScrollTop > this.scrollTopAtDirectionChange;

      if (isScrollingDown !== wasScrollingDown) {
        this.scrollTopAtDirectionChange = this.previousScrollTop;
      }

      const scrolledSinceDirectionChange = Math.abs(currentScrollTop - this.scrollTopAtDirectionChange);
      const requiredScrollDistance = isScrollingDown ? this.SCROLL_HIDE_THRESHOLD : 0;
      this.previousScrollTop = currentScrollTop;

      if (scrolledSinceDirectionChange < requiredScrollDistance) {
        return;
      }

      const shouldHide = isScrollingDown;
      if (shouldHide !== this.scrollHidden) {
        writeTask(() => this.setHidden(shouldHide));
      }
    });
  };

  private setHidden(hidden: boolean) {
    this.scrollHidden = hidden;
    this.el.classList.toggle('footer-scroll-hidden', hidden);

    if (hidden) {
      this.el.setAttribute('inert', '');
      this.el.setAttribute('aria-hidden', 'true');
    } else {
      this.el.removeAttribute('inert');
      this.el.removeAttribute('aria-hidden');
    }

    if (this.contentEl) {
      this.contentEl.classList.toggle('content-footer-hide-scroll-hidden', hidden);
    }
  }

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
    if (this.scrollEl && this.contentScrollCallback) {
      this.scrollEl.removeEventListener('scroll', this.contentScrollCallback);
      this.contentScrollCallback = undefined;
    }

    if (this.scrollEl && this.contentWheelCallback) {
      this.scrollEl.removeEventListener('wheel', this.contentWheelCallback);
      this.contentWheelCallback = undefined;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }

    if (this.contentEl) {
      this.contentEl.classList.remove('content-footer-hide-scroll-partner', 'content-footer-hide-scroll-hidden');
      this.contentEl.style.removeProperty('--internal-footer-hide-slide-y');
      this.contentEl = undefined;
    }

    if (this.scrollHidden) {
      this.el.classList.remove('footer-scroll-hidden');
      this.el.removeAttribute('inert');
      this.el.removeAttribute('aria-hidden');
      this.scrollHidden = false;
    }
    this.el.style.removeProperty('--internal-footer-hide-slide-y');
    this.previousScrollTop = 0;
    this.scrollTopAtDirectionChange = 0;
    this.lastWheelEventTime = 0;
  }

  render() {
    const { translucent, scrollEffect, collapse } = this;
    const theme = getIonTheme(this);
    const hasHide = (scrollEffect ?? collapse) === 'hide';
    const hasFade = (scrollEffect ?? collapse) === 'fade';
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
