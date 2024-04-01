import type { ComponentInterface } from '@stencil/core';
import {
  Component,
  Element,
  Host,
  Prop,
  State,
  h,
} from '@stencil/core';
import {
  findIonContent,
  getScrollElement,
  printIonContentErrorMsg,
} from '@utils/content';
import type { KeyboardController } from '@utils/keyboard/keyboard-controller';
import { createKeyboardController } from '@utils/keyboard/keyboard-controller';

import { getIonMode } from '../../global/ionic-global';

import { handleFooterFade } from './footer.utils';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-footer',
  styleUrls: {
    ios: 'footer.ios.scss',
    md: 'footer.md.scss',
  },
})
export class Footer
  implements ComponentInterface
{
  private scrollEl?: HTMLElement;
  private contentScrollCallback?: () => void;
  private keyboardCtrl: KeyboardController | null =
    null;

  @State() private keyboardVisible =
    false;

  @Element() el!: HTMLIonFooterElement;

  /**
   * Describes the scroll effect that will be applied to the footer.
   * Only applies in iOS mode.
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
    this.keyboardCtrl =
      await createKeyboardController(
        async (
          keyboardOpen,
          waitForResize
        ) => {
          /**
           * If the keyboard is hiding, then we need to wait
           * for the webview to resize. Otherwise, the footer
           * will flicker before the webview resizes.
           */
          if (
            keyboardOpen === false &&
            waitForResize !== undefined
          ) {
            await waitForResize;
          }

          this.keyboardVisible =
            keyboardOpen; // trigger re-render by updating state
        }
      );
  }

  disconnectedCallback() {
    if (this.keyboardCtrl) {
      this.keyboardCtrl.destroy();
    }
  }

  private checkCollapsibleFooter =
    () => {
      const mode = getIonMode(this);
      if (mode !== 'ios') {
        return;
      }

      const { collapse } = this;
      const hasFade =
        collapse === 'fade';

      this.destroyCollapsibleFooter();

      if (hasFade) {
        const pageEl = this.el.closest(
          'ion-app,ion-page,.ion-page,page-inner'
        );
        const contentEl = pageEl
          ? findIonContent(pageEl)
          : null;

        if (!contentEl) {
          printIonContentErrorMsg(
            this.el
          );
          return;
        }

        this.setupFadeFooter(contentEl);
      }
    };

  private setupFadeFooter = async (
    contentEl: HTMLElement
  ) => {
    const scrollEl = (this.scrollEl =
      await getScrollElement(
        contentEl
      ));

    /**
     * Handle fading of toolbars on scroll
     */
    this.contentScrollCallback = () => {
      handleFooterFade(
        scrollEl,
        this.el
      );
    };
    scrollEl.addEventListener(
      'scroll',
      this.contentScrollCallback
    );

    handleFooterFade(scrollEl, this.el);
  };

  private destroyCollapsibleFooter() {
    if (
      this.scrollEl &&
      this.contentScrollCallback
    ) {
      this.scrollEl.removeEventListener(
        'scroll',
        this.contentScrollCallback
      );
      this.contentScrollCallback =
        undefined;
    }
  }

  render() {
    const { translucent, collapse } =
      this;
    const mode = getIonMode(this);
    const tabs =
      this.el.closest('ion-tabs');
    const tabBar = tabs?.querySelector(
      ':scope > ion-tab-bar'
    );

    return (
      <Host
        role="contentinfo"
        class={{
          [mode]: true,

          // Used internally for styling
          [`footer-${mode}`]: true,

          [`footer-translucent`]:
            translucent,
          [`footer-translucent-${mode}`]:
            translucent,
          ['footer-toolbar-padding']:
            !this.keyboardVisible &&
            (!tabBar ||
              tabBar.slot !== 'bottom'),

          [`footer-collapse-${collapse}`]:
            collapse !== undefined,
        }}
      >
        {mode === 'ios' &&
          translucent && (
            <div class="footer-background"></div>
          )}
        <slot></slot>
      </Host>
    );
  }
}
