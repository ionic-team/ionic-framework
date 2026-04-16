import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, State, Watch, h, readTask, writeTask } from '@stencil/core';
import { findIonContent, getScrollElement } from '@utils/content';
import type { KeyboardController } from '@utils/keyboard/keyboard-controller';
import { createKeyboardController } from '@utils/keyboard/keyboard-controller';
import { createColorClasses } from '@utils/theme';

import { getIonTheme } from '../../global/ionic-global';
import type { Color } from '../../interface';

import type { TabBarChangedEventDetail } from './tab-bar-interface';

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
  private scrollEl?: HTMLElement;
  private contentScrollCallback?: () => void;
  private lastScrollTop = 0;
  private scrollDirectionChangeTop = 0;

  @Element() el!: HTMLElement;

  @State() keyboardVisible = false;

  @State() scrollHidden = false;

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
   * If `true`, the tab bar will be hidden when the user scrolls down
   * and shown when the user scrolls up.
   * Only applies when the theme is `"ionic"` and `expand` is `"compact"`.
   */
  @Prop() hideOnScroll = false;

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
    // Set the flag to indicate the component has loaded
    // This allows the watcher to emit changes from this point forward
    this.didLoad = true;

    // Emit the initial selected tab after the component is fully loaded
    // This ensures all child components (ion-tab-button) are ready
    if (this.selectedTab !== undefined) {
      this.ionTabBarChanged.emit({
        tab: this.selectedTab,
      });
    }

    this.setupHideOnScroll();
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
    if (this.keyboardCtrlPromise) {
      this.keyboardCtrlPromise.then((ctrl) => ctrl.destroy());
      this.keyboardCtrlPromise = null;
    }

    if (this.keyboardCtrl) {
      this.keyboardCtrl.destroy();
      this.keyboardCtrl = null;
    }

    this.destroyHideOnScroll();
  }

  private setupHideOnScroll() {
    const theme = getIonTheme(this);
    if (theme !== 'ionic' || !this.hideOnScroll || this.expand !== 'compact') {
      return;
    }

    const footerEl = this.el.closest('ion-footer');
    const pageEl = footerEl?.closest('ion-page, .ion-page') ?? this.el.closest('ion-page, .ion-page');
    const contentEl = pageEl ? findIonContent(pageEl) : null;

    if (!contentEl) {
      return;
    }

    this.initScrollListener(contentEl);
  }

  private async initScrollListener(contentEl: HTMLElement) {
    const scrollEl = (this.scrollEl = await getScrollElement(contentEl));

    this.contentScrollCallback = () => {
      readTask(() => {
        const scrollTop = scrollEl.scrollTop;
        const shouldHide = this.checkScrollStatus(scrollTop);

        if (shouldHide !== this.scrollHidden) {
          writeTask(() => {
            this.scrollHidden = shouldHide;
          });
        }

        this.lastScrollTop = scrollTop;
      });
    };

    scrollEl.addEventListener('scroll', this.contentScrollCallback, { passive: true });
  }

  private destroyHideOnScroll() {
    if (this.scrollEl && this.contentScrollCallback) {
      this.scrollEl.removeEventListener('scroll', this.contentScrollCallback);
      this.contentScrollCallback = undefined;
    }
  }

  private checkScrollStatus(scrollTop: number): boolean {
    // Always visible within the first 80px of scroll
    const visibleZone = 80;
    // Hides after 60px of continuous downward scrolling only, when scrolling up threashold should be 0px
    const scrollThresholdHide = 60;

    if (scrollTop <= visibleZone) {
      return false;
    }

    const isScrollingDown = scrollTop > this.lastScrollTop;
    const wasScrollingDown = this.lastScrollTop > this.scrollDirectionChangeTop;

    if (isScrollingDown !== wasScrollingDown) {
      this.scrollDirectionChangeTop = this.lastScrollTop;
    }

    const delta = Math.abs(scrollTop - this.scrollDirectionChangeTop);
    const threshold = isScrollingDown ? scrollThresholdHide : 0;

    if (delta < threshold) {
      return this.scrollHidden;
    }

    return isScrollingDown;
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
    const { color, translucent, keyboardVisible, scrollHidden, expand, hideOnScroll } = this;
    const theme = getIonTheme(this);
    const shape = this.getShape();
    const shouldHide = keyboardVisible && this.el.getAttribute('slot') !== 'top';

    return (
      <Host
        role="tablist"
        aria-hidden={shouldHide ? 'true' : null}
        class={createColorClasses(color, {
          [theme]: true,
          'tab-bar-translucent': translucent,
          'tab-bar-hidden': shouldHide,
          'tab-bar-hide-on-scroll': hideOnScroll,
          'tab-bar-scroll-hidden': scrollHidden,
          [`tab-bar-${expand}`]: true,
          [`tab-bar-${shape}`]: shape !== undefined,
        })}
      >
        <slot></slot>
      </Host>
    );
  }
}
