import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, State, Watch, h, readTask, writeTask } from '@stencil/core';
import { findIonContent, getScrollElement } from '@utils/content';
import type { KeyboardController } from '@utils/keyboard/keyboard-controller';
import { createKeyboardController } from '@utils/keyboard/keyboard-controller';
import { printIonWarning } from '@utils/logging';
import type { ScrollHideController } from '@utils/scroll-hide-controller';
import { createScrollHideController } from '@utils/scroll-hide-controller';
import { createColorClasses } from '@utils/theme';

import { config } from '../../global/config';
import { getIonTheme } from '../../global/ionic-global';
import type { Color } from '../../interface';

import type { TabBarChangedEventDetail, TabBarScrollEffect } from './tab-bar-interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-tab-bar',
  styleUrls: {
    ios: 'tab-bar.ios.scss',
    md: 'tab-bar.md.scss',
    ionic: 'tab-bar.ionic.scss',
  },
  shadow: true,
})
export class TabBar implements ComponentInterface {
  private keyboardCtrl: KeyboardController | null = null;
  private keyboardCtrlPromise: Promise<KeyboardController> | null = null;
  private didLoad = false;
  private scrollHideCtrl?: ScrollHideController;
  private resizeObserver?: ResizeObserver;
  private contentEl?: HTMLElement;
  private setupHidePromise: Promise<HTMLElement> | null = null;
  private hasWarnedFooter = false;

  @Element() el!: HTMLElement;

  @State() keyboardVisible = false;
  @State() isHidden = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * The selected tab component
   */
  @Prop() selectedTab?: string;
  @Watch('selectedTab')
  selectedTabChanged() {
    // Skip the initial watcher call that happens during component load
    // We handle that in componentDidLoad to ensure children are ready
    if (!this.didLoad) {
      return;
    }

    if (this.selectedTab !== undefined) {
      this.ionTabBarChanged.emit({
        tab: this.selectedTab,
      });
    }
  }

  /**
   * Describes the scroll effect that will be applied to the tab bar.
   * `"hide"` slides the tab bar out of view when scrolling down and back in
   * when scrolling up.
   */
  @Prop() scrollEffect?: TabBarScrollEffect;
  @Watch('scrollEffect')
  scrollEffectChanged() {
    this.checkScrollEffect();
  }

  /**
   * If `true`, the tab bar will be translucent.
   * Only applies when the theme is `"ios"` and the device supports
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   */
  @Prop() translucent = false;

  /**
   * Set to `"compact"` to display a width based on the items
   * inside the tab bar. This value will only work for the
   * `ionic` theme.
   *
   * Set to `"full"` to display a full width tab bar.
   *
   * Defaults to `"full"`.
   */
  @Prop() expand: 'compact' | 'full' = 'full';

  /**
   * Set to `"soft"` for a tab bar with slightly rounded corners,
   * `"round"` for a tab bar with fully rounded corners, or
   * `"rectangular"` for a tab bar without rounded corners.
   *
   * Defaults to `"round"` for the `"ionic"` theme, undefined for all other themes.
   */
  @Prop() shape?: 'soft' | 'round' | 'rectangular';

  /** @internal */
  @Event() ionTabBarChanged!: EventEmitter<TabBarChangedEventDetail>;

  /**
   * @internal
   * This event is used in IonContent to correctly
   * calculate the fullscreen content offsets
   * when IonTabBar is used.
   */
  @Event() ionTabBarLoaded!: EventEmitter<void>;

  componentDidLoad() {
    this.ionTabBarLoaded.emit();
    this.didLoad = true;

    if (this.selectedTab !== undefined) {
      this.ionTabBarChanged.emit({
        tab: this.selectedTab,
      });
    }

    this.checkScrollEffect();
  }

  private checkScrollEffect() {
    this.destroyScrollEffect();
    if (this.scrollEffect === 'hide') {
      this.setupScrollEffect();
    }
  }

  async connectedCallback() {
    const promise = createKeyboardController(async (keyboardOpen, waitForResize) => {
      /**
       * If the keyboard is hiding, then we need to wait
       * for the webview to resize. Otherwise, the tab bar
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
    this.destroyScrollEffect();

    if (this.keyboardCtrlPromise) {
      this.keyboardCtrlPromise.then((ctrl) => ctrl.destroy());
      this.keyboardCtrlPromise = null;
    }

    if (this.keyboardCtrl) {
      this.keyboardCtrl.destroy();
      this.keyboardCtrl = null;
    }
  }

  private setupScrollEffect = async () => {
    // When nested inside ion-footer, the tab-bar should not hide
    // independently — doing so would leave an empty footer behind.
    // The footer should own the scroll effect instead.
    if (this.el.closest('ion-footer')) {
      if (!this.hasWarnedFooter) {
        this.hasWarnedFooter = true;
        printIonWarning(
          `[ion-tab-bar] - scroll-effect="hide" is ignored when nested inside <ion-footer>. ` +
            `Set scroll-effect="hide" on the <ion-footer> instead.`,
          this.el
        );
      }
      return;
    }

    const appRootSelector = config.get('appRootSelector', 'ion-app');
    const pageEl = this.el.closest(`${appRootSelector}, ion-page, .ion-page, page-inner`);
    const contentEl = pageEl ? findIonContent(pageEl) : null;

    if (!contentEl) {
      return;
    }

    this.contentEl = contentEl;

    const promise = getScrollElement(contentEl);
    this.setupHidePromise = promise;

    const scrollEl = await promise;

    /**
     * Only assign if this is still the current promise.
     * Otherwise, a new checkScrollEffect has started or
     * disconnectedCallback was called, so this setup is stale.
     */
    if (this.setupHidePromise === promise) {
      this.setupHidePromise = null;

      this.updateHideHeight();

      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => this.updateHideHeight());
        this.resizeObserver.observe(this.el);
      }

      this.scrollHideCtrl = createScrollHideController(scrollEl, (hidden) => this.setHidden(hidden));

      contentEl.classList.add('content-tab-bar-hide-scroll-partner');
    }
  };

  /**
   * Reads the tab bar's current height and writes it as a CSS variable
   * on both the tab bar and the sibling content. The content uses this
   * value to expand its scroll area when the tab bar hides (gap compensation).
   */
  private updateHideHeight() {
    readTask(() => {
      const tabBarHeightPx = this.el.offsetHeight;
      writeTask(() => {
        this.el.style.setProperty('--internal-tab-bar-hide-height', `${tabBarHeightPx}px`);
        if (this.contentEl) {
          this.contentEl.style.setProperty('--internal-tab-bar-hide-height', `${tabBarHeightPx}px`);
        }
      });
    });
  }

  private setHidden(hidden: boolean) {
    this.isHidden = hidden;
    this.el.classList.toggle('tab-bar-scroll-hidden', hidden);

    if (hidden) {
      this.el.setAttribute('inert', '');
      this.el.setAttribute('aria-hidden', 'true');
    } else {
      this.el.removeAttribute('inert');
      this.el.removeAttribute('aria-hidden');
    }

    if (this.contentEl) {
      this.contentEl.classList.toggle('content-tab-bar-hide-scroll-hidden', hidden);
    }
  }

  private destroyScrollEffect() {
    if (this.scrollHideCtrl) {
      this.scrollHideCtrl.destroy();
      this.scrollHideCtrl = undefined;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }

    if (this.contentEl) {
      this.contentEl.classList.remove('content-tab-bar-hide-scroll-partner', 'content-tab-bar-hide-scroll-hidden');
      this.contentEl.style.removeProperty('--internal-tab-bar-hide-height');
      this.contentEl = undefined;
    }

    this.el.style.removeProperty('--internal-tab-bar-hide-height');
    if (this.isHidden) {
      this.el.classList.remove('tab-bar-scroll-hidden');
      this.el.removeAttribute('inert');
      this.el.removeAttribute('aria-hidden');
      this.isHidden = false;
    }
  }

  private getShape(): string | undefined {
    const theme = getIonTheme(this);
    const { shape } = this;

    // TODO(ROU-11234): Remove theme check when shapes are defined for all themes.
    if (theme !== 'ionic') {
      return undefined;
    }

    if (shape === undefined) {
      return 'round';
    }

    return shape;
  }

  render() {
    const { color, translucent, keyboardVisible, scrollEffect, isHidden, expand } = this;
    const theme = getIonTheme(this);
    const shape = this.getShape();
    const shouldHide = keyboardVisible && this.el.getAttribute('slot') !== 'top';

    return (
      <Host
        role="tablist"
        aria-hidden={shouldHide || isHidden ? 'true' : null}
        inert={isHidden ? '' : null}
        class={createColorClasses(color, {
          [theme]: true,
          'tab-bar-translucent': translucent,
          'tab-bar-hidden': shouldHide,
          'tab-bar-scroll-effect-hide': scrollEffect === 'hide',
          'tab-bar-scroll-hidden': isHidden,
          [`tab-bar-${expand}`]: true,
          [`tab-bar-${shape}`]: shape !== undefined,
        })}
      >
        <slot></slot>
      </Host>
    );
  }
}
