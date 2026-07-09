import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, State, h, readTask, writeTask } from '@stencil/core';
import { ION_PAGE_ELEMENT_SELECTOR, findIonContent, getScrollElement, printIonContentErrorMsg } from '@utils/content';
import type { KeyboardController } from '@utils/keyboard/keyboard-controller';
import { createKeyboardController } from '@utils/keyboard/keyboard-controller';
import { printIonWarning } from '@utils/logging';

import { getIonMode, getIonTheme } from '../../global/ionic-global';

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
    ionic: 'footer.ionic.scss',
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
  private lastScrollTop = 0;
  private scrollDirectionChangeTop = 0;
  private lastWheelTime = 0;

  private readonly VISIBLE_ZONE = 80;
  private readonly HIDE_THRESHOLD = 60;
  private readonly WHEEL_SCROLL_SUPPRESS_MS = 80;

  @State() private keyboardVisible = false;

  @Element() el!: HTMLIonFooterElement;

  /**
   * Describes the scroll effect that will be applied to the footer.
   * `"hide"` slides the footer out of view when scrolling down and back in
   * when scrolling up. Applies to all themes.
   * `"fade"` fades the toolbar background on scroll. Only applies in iOS mode.
   */
  @Prop() scrollEffect?: FooterScrollEffect;

  /**
   * Describes the scroll effect that will be applied to the footer.
   * Only applies in iOS mode.
   *
   * @deprecated Use `scrollEffect` instead.
   */
  @Prop() collapse?: 'fade';

  /**
   * If `true`, the footer will be translucent.
   * Only applies when the mode is `"ios"` and the device supports
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
    const mode = getIonMode(this);
    const { scrollEffect, collapse } = this;

    if (collapse !== undefined && scrollEffect === undefined) {
      printIonWarning(
        `The \`collapse\` property on \`ion-footer\` is deprecated. Use \`scrollEffect\` instead.\nExample: <ion-footer scroll-effect="${collapse}">`
      );
    }

    const effectiveEffect = scrollEffect ?? collapse;

    this.destroyCollapsibleFooter();

    const pageEl = this.el.closest(ION_PAGE_ELEMENT_SELECTOR);
    const contentEl = pageEl ? findIonContent(pageEl) : null;

    // scrollEffect="hide" is cross-platform — runs before the iOS guard
    if (effectiveEffect === 'hide' && contentEl) {
      await this.setupScrollEffectHide(contentEl);
      return;
    }

    if (mode !== 'ios') {
      return;
    }

    if (effectiveEffect === 'fade') {
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
      const heightPx = this.el.offsetHeight;
      writeTask(() => {
        this.el.style.setProperty('--internal-footer-hide-slide-y', `${heightPx}px`);
        if (this.contentEl) {
          this.contentEl.style.setProperty('--internal-footer-hide-slide-y', `${heightPx}px`);
        }
      });
    });
  }

  private handleWheelEffectHide = (ev: WheelEvent) => {
    this.lastWheelTime = Date.now();

    readTask(() => {
      const scrollTop = this.scrollEl!.scrollTop;

      if (scrollTop <= this.VISIBLE_ZONE) {
        if (this.scrollHidden) {
          writeTask(() => this.setHidden(false));
        }
        return;
      }

      if (ev.deltaY < 0) {
        this.scrollDirectionChangeTop = scrollTop;
        if (this.scrollHidden) {
          writeTask(() => this.setHidden(false));
        }
      } else if (ev.deltaY > 0) {
        const delta = scrollTop - this.scrollDirectionChangeTop;
        if (delta >= this.HIDE_THRESHOLD && !this.scrollHidden) {
          writeTask(() => this.setHidden(true));
        }
      }
    });
  };

  private handleScrollEffectHide = () => {
    // Suppress scroll events shortly after a wheel event — delta already processed via wheel
    if (Date.now() - this.lastWheelTime < this.WHEEL_SCROLL_SUPPRESS_MS) {
      return;
    }

    readTask(() => {
      const scrollTop = this.scrollEl!.scrollTop;

      if (scrollTop <= this.VISIBLE_ZONE) {
        if (this.scrollHidden) {
          writeTask(() => this.setHidden(false));
        }
        this.lastScrollTop = scrollTop;
        return;
      }

      const isScrollingDown = scrollTop > this.lastScrollTop;
      const wasScrollingDown = this.lastScrollTop > this.scrollDirectionChangeTop;

      if (isScrollingDown !== wasScrollingDown) {
        this.scrollDirectionChangeTop = this.lastScrollTop;
      }

      const delta = Math.abs(scrollTop - this.scrollDirectionChangeTop);
      const threshold = isScrollingDown ? this.HIDE_THRESHOLD : 0;
      this.lastScrollTop = scrollTop;

      if (delta < threshold) {
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
    this.lastScrollTop = 0;
    this.scrollDirectionChangeTop = 0;
    this.lastWheelTime = 0;
  }

  render() {
    const { translucent, scrollEffect, collapse } = this;
    const theme = getIonTheme(this);
    const effectiveEffect = scrollEffect ?? collapse;
    const isHide = effectiveEffect === 'hide';
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

          [`footer-collapse-${effectiveEffect}`]: !isHide && effectiveEffect !== undefined,
          'footer-scroll-effect-hide': isHide,
        }}
      >
        {theme === 'ios' && translucent && <div class="footer-background"></div>}
        <slot></slot>
      </Host>
    );
  }
}
