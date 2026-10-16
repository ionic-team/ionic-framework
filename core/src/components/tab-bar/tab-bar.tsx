import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, State, Watch, h } from '@stencil/core';
import { findIonContent, findVisibleIonContent, getScrollElement, observeVisibleIonContent } from '@utils/content';
import { componentOnReady } from '@utils/helpers';
import type { KeyboardController } from '@utils/keyboard/keyboard-controller';
import { createKeyboardController } from '@utils/keyboard/keyboard-controller';
import { printIonWarning } from '@utils/logging';
import type { ScrollHideController } from '@utils/scroll-hide-controller';
import { createScrollHideController } from '@utils/scroll-hide-controller';
import { createColorClasses } from '@utils/theme';

import { config } from '../../global/config';
import { getIonTheme } from '../../global/ionic-global';
import type { Color } from '../../interface';
import { handleFooterFade } from '../footer/footer.utils';

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
  private scrollHideCtrlPromise: Promise<ScrollHideController> | null = null;
  private hasWarnedFooter = false;
  private stopObservingContent?: () => void;
  private fadeScrollEl?: HTMLElement;
  private fadeScrollCallback?: () => void;
  private fadeSetupId = 0;
  private contentSetupId = 0;
  private activeContentEl?: HTMLElement | null;
  private isActiveContentEnabled = false;

  @Element() el!: HTMLElement;

  @State() keyboardVisible = false;

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
   * when scrolling back quickly. A tab bar that is out of view is shown again
   * when an element in it receives focus.
   * `"fade"` fades the tab bar background out when the content is scrolled
   * to the end.
   *
   * Note: `"hide"` is ignored when the tab bar is nested inside an
   * `ion-footer` to avoid leaving an empty footer visible on screen.
   * Set `scroll-effect="hide"` on the footer instead so the entire
   * footer hides together.
   */
  @Prop({ reflect: true }) scrollEffect?: TabBarScrollEffect;
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

    const { scrollEffect } = this;

    if (scrollEffect !== 'hide' && scrollEffect !== 'fade') {
      return;
    }

    // When nested inside ion-footer, the tab-bar should not hide
    // independently — doing so would leave an empty footer behind.
    // The footer should own the scroll effect instead.
    if (scrollEffect === 'hide' && this.el.closest('ion-footer')) {
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

    /**
     * A tab bar that is a direct child of ion-tabs is rendered outside of
     * the pages that the tabs show, so it follows the content of whichever
     * page is visible. Otherwise, it follows the content of the page it is in.
     */
    const tabsEl = this.el.parentElement?.tagName === 'ION-TABS' ? this.el.parentElement : null;

    if (tabsEl !== null) {
      const stopObserving = observeVisibleIonContent(tabsEl, (contentEl) =>
        this.setupScrollEffectForContent(contentEl, true)
      );
      const onTabBarScrollEffectChange = () => this.setupScrollEffectForContent(findVisibleIonContent(tabsEl), true);
      tabsEl.addEventListener('ionTabBarScrollEffectChange', onTabBarScrollEffectChange);

      this.stopObservingContent = () => {
        stopObserving();
        tabsEl.removeEventListener('ionTabBarScrollEffectChange', onTabBarScrollEffectChange);
      };
      return;
    }

    const appRootSelector = config.get('appRootSelector', 'ion-app');
    const pageEl = this.el.closest(`${appRootSelector}, ion-page, .ion-page, page-inner`);

    this.setupScrollEffectForContent(pageEl ? findIonContent(pageEl) : null, false);
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

      // Toggle aria-hidden imperatively for the keyboard case,
      // so that render() does not clear it on re-render.
      const shouldHide = keyboardOpen && this.el.getAttribute('slot') !== 'top';
      if (shouldHide) {
        this.el.setAttribute('aria-hidden', 'true');
      } else {
        this.el.removeAttribute('aria-hidden');
      }
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

  /**
   * Whether the scroll effect applies to the page with the given content.
   * A page can turn it on or off with `tabBarScrollEffect`. Otherwise, it
   * applies to every page of a tab bar that is in a page, and for a tab bar
   * in `ion-tabs` only to pages that cannot go back, since the tab bar
   * is expected to stay in place on pages that were navigated to.
   */
  private isScrollEffectEnabled(contentEl: HTMLElement, isInTabs: boolean) {
    const { tabBarScrollEffect } = contentEl as HTMLIonContentElement;

    if (tabBarScrollEffect !== undefined) {
      return tabBarScrollEffect;
    }

    return !isInTabs || contentEl.closest('.ion-page')?.classList.contains('can-go-back') !== true;
  }

  private setupScrollEffectForContent = async (contentEl: HTMLElement | null, isInTabs: boolean) => {
    const setupId = ++this.contentSetupId;

    if (contentEl !== null) {
      // The properties of the content can only be read once it is ready
      await new Promise((resolve) => componentOnReady(contentEl, resolve));

      if (this.contentSetupId !== setupId) {
        return;
      }
    }

    const isEnabled = contentEl !== null && this.isScrollEffectEnabled(contentEl, isInTabs);

    if (contentEl === this.activeContentEl && isEnabled === this.isActiveContentEnabled) {
      return;
    }

    this.activeContentEl = contentEl;
    this.isActiveContentEnabled = isEnabled;
    this.destroyScrollEffectForContent();

    if (contentEl === null || !isEnabled) {
      this.el.style.removeProperty('--opacity-scale');
      return;
    }

    if (this.scrollEffect === 'fade') {
      await this.setupFadeTabBar(contentEl);
    } else {
      await this.setupHideTabBar(contentEl);
    }
  };

  private setupHideTabBar = async (contentEl: HTMLElement) => {
    const isTop = this.el.getAttribute('slot') === 'top';

    const setupPromise = createScrollHideController(contentEl, {
      el: this.el,
      edge: isTop ? 'top' : 'bottom',
      cssVar: '--internal-tab-bar-hide-height',
      hiddenClass: 'tab-bar-scroll-hidden',
      settlingClass: 'tab-bar-scroll-settling',
      contentPartnerClass: 'content-tab-bar-hide-scroll-partner',
      contentHiddenClass: 'content-tab-bar-hide-scroll-hidden',
      getHideDistance: () => {
        const { position, top, bottom } = getComputedStyle(this.el);

        // A tab bar that floats above the content also has to move past the space around it
        const spacing = position === 'absolute' ? parseFloat(isTop ? top : bottom) || 0 : 0;

        return this.el.offsetHeight + spacing;
      },
    });
    this.scrollHideCtrlPromise = setupPromise;

    const controller = await setupPromise;

    if (this.scrollHideCtrlPromise === setupPromise) {
      this.scrollHideCtrlPromise = null;
      controller.init();
      this.scrollHideCtrl = controller;
    }
  };

  private setupFadeTabBar = async (contentEl: HTMLElement) => {
    const setupId = ++this.fadeSetupId;

    const scrollEl = await getScrollElement(contentEl);

    if (this.fadeSetupId !== setupId) {
      return;
    }

    this.fadeScrollEl = scrollEl;

    /**
     * Handle fading of the tab bar background on scroll
     */
    this.fadeScrollCallback = () => {
      handleFooterFade(scrollEl, this.el);
    };
    scrollEl.addEventListener('scroll', this.fadeScrollCallback);

    handleFooterFade(scrollEl, this.el);
  };

  private destroyScrollEffectForContent() {
    this.fadeSetupId++;
    this.scrollHideCtrlPromise = null;

    if (this.scrollHideCtrl) {
      this.scrollHideCtrl.destroy();
      this.scrollHideCtrl = undefined;
    }

    if (this.fadeScrollEl && this.fadeScrollCallback) {
      this.fadeScrollEl.removeEventListener('scroll', this.fadeScrollCallback);
    }
    this.fadeScrollEl = undefined;
    this.fadeScrollCallback = undefined;
  }

  private destroyScrollEffect() {
    this.contentSetupId++;
    this.activeContentEl = undefined;
    this.isActiveContentEnabled = false;

    if (this.stopObservingContent) {
      this.stopObservingContent();
      this.stopObservingContent = undefined;
    }

    this.destroyScrollEffectForContent();
    this.el.style.removeProperty('--opacity-scale');
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
    const { color, translucent, keyboardVisible, scrollEffect, expand } = this;
    const theme = getIonTheme(this);
    const shape = this.getShape();
    const shouldHide = keyboardVisible && this.el.getAttribute('slot') !== 'top';

    return (
      <Host
        role="tablist"
        class={createColorClasses(color, {
          [theme]: true,
          'tab-bar-translucent': translucent,
          'tab-bar-hidden': shouldHide,
          'tab-bar-scroll-effect-hide': scrollEffect === 'hide',
          'tab-bar-scroll-effect-fade': scrollEffect === 'fade',
          [`tab-bar-${expand}`]: true,
          [`tab-bar-${shape}`]: shape !== undefined,
        })}
      >
        {scrollEffect === 'fade' && <div class="tab-bar-background"></div>}
        <slot></slot>
      </Host>
    );
  }
}
