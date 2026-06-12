import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { findIonContent, getScrollElement, printIonContentErrorMsg } from '@utils/content';
import type { KeyboardController } from '@utils/keyboard/keyboard-controller';
import { createKeyboardController } from '@utils/keyboard/keyboard-controller';

import { config } from '../../global/config';
import { getIonTheme } from '../../global/ionic-global';

import { handleFooterFade, createFooterHideInteraction } from './footer.utils';

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
  private footerHideCleanup?: () => void;
  private appliedCollapse?: 'fade' | 'hide';
  private appliedTheme?: string;
  private didLoad = false;
  private setupToken = 0;
  private keyboardCtrl: KeyboardController | null = null;
  private keyboardCtrlPromise: Promise<KeyboardController> | null = null;

  @State() private keyboardVisible = false;

  @Element() el!: HTMLIonFooterElement;

  /**
   * Describes the scroll effect that will be applied to the footer.
   *
   * - `"fade"` only applies when the theme is `"ios"`.
   * - `"hide"` applies to all themes (`"ios"`, `"md"`, and `"ionic"`): the footer
   *   slides down and fades out after cumulative downward scrolling on the page content,
   *   and returns on any upward scroll (same behavior as `ion-header[collapse="hide"]`).
   */
  @Prop() collapse?: 'fade' | 'hide';

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
    this.didLoad = true;
    this.checkCollapsibleFooter();
  }

  componentDidUpdate() {
    this.checkCollapsibleFooter();
  }

  async connectedCallback() {
    // On re-attach (didLoad already true but disconnectedCallback ran since),
    // componentDidLoad will not fire again — re-run setup here.
    if (this.didLoad) {
      this.checkCollapsibleFooter();
    }

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

  private checkCollapsibleFooter = () => {
    const theme = getIonTheme(this);
    const { collapse } = this;
    const hasFade = collapse === 'fade';
    const hasHide = collapse === 'hide';

    const runIosFade = theme === 'ios' && hasFade;

    if (!runIosFade && !hasHide) {
      this.destroyCollapsibleFooter();
      return;
    }

    // Skip teardown/rebuild when the collapse mode and theme have not changed
    // since the last setup — avoids thrashing listeners and resetting scroll
    // accumulators on unrelated re-renders (e.g. keyboardVisible state flips).
    const activeMode = hasHide ? 'hide' : 'fade';
    if (this.appliedCollapse === activeMode && this.appliedTheme === theme) {
      return;
    }

    this.destroyCollapsibleFooter();

    const appRootSelector = config.get('appRootSelector', 'ion-app');
    const pageEl = this.el.closest(`${appRootSelector},ion-page,.ion-page,page-inner`);
    const contentEl = pageEl ? findIonContent(pageEl) : null;

    if (!contentEl) {
      printIonContentErrorMsg(this.el);
      return;
    }

    this.appliedCollapse = activeMode;
    this.appliedTheme = theme;

    if (runIosFade) {
      this.setupFadeFooter(contentEl);
    } else if (hasHide) {
      void this.setupHideFooter(contentEl);
    }
  };

  private async setupHideFooter(contentEl: HTMLElement) {
    const token = ++this.setupToken;
    const scrollEl = await getScrollElement(contentEl);
    // A newer checkCollapsibleFooter ran while we were awaiting — abandon.
    if (token !== this.setupToken) {
      return;
    }
    this.scrollEl = scrollEl;
    this.footerHideCleanup = createFooterHideInteraction(this.el, scrollEl);
  }

  private setupFadeFooter = async (contentEl: HTMLElement) => {
    const token = ++this.setupToken;
    const scrollEl = await getScrollElement(contentEl);
    if (token !== this.setupToken) {
      return;
    }
    this.scrollEl = scrollEl;

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
    // Invalidate any in-flight setupHideFooter/setupFadeFooter awaits.
    this.setupToken++;

    if (this.footerHideCleanup) {
      this.footerHideCleanup();
      this.footerHideCleanup = undefined;
    }

    if (this.scrollEl && this.contentScrollCallback) {
      this.scrollEl.removeEventListener('scroll', this.contentScrollCallback);
      this.contentScrollCallback = undefined;
    }

    this.appliedCollapse = undefined;
    this.appliedTheme = undefined;
  }

  render() {
    const { translucent, collapse } = this;
    const theme = getIonTheme(this);
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

          [`footer-collapse-${collapse}`]: collapse !== undefined,
        }}
      >
        {theme === 'ios' && translucent && <div class="footer-background"></div>}
        <slot></slot>
      </Host>
    );
  }
}
