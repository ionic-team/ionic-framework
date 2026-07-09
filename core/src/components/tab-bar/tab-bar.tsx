import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, State, Watch, h, readTask, writeTask } from '@stencil/core';
import { ION_PAGE_ELEMENT_SELECTOR, findIonContent, getScrollElement } from '@utils/content';
import type { KeyboardController } from '@utils/keyboard/keyboard-controller';
import { createKeyboardController } from '@utils/keyboard/keyboard-controller';
import { createColorClasses } from '@utils/theme';

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
  private scrollEl?: HTMLElement;
  private contentScrollCallback?: () => void;
  private contentWheelCallback?: EventListener;
  private resizeObserver?: ResizeObserver;
  private contentEl?: HTMLElement;

  // scrollEffect="hide" scroll tracking state
  private lastScrollTop = 0;
  private scrollDirectionChangeTop = 0;
  private lastWheelTime = 0;

  private readonly VISIBLE_ZONE = 80;
  private readonly HIDE_THRESHOLD = 60;
  private readonly WHEEL_SCROLL_SUPPRESS_MS = 80;

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
   * Describes the scroll effect that will be applied to the tab bar.
   * `"hide"` slides the tab bar out of view when scrolling down and back in
   * when scrolling up. Applies to all themes.
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
    // If parent ion-footer also has scrollEffect="hide", defer to the footer's animation
    const footerEl = this.el.closest('ion-footer') as (HTMLIonFooterElement & { scrollEffect?: string }) | null;
    if (footerEl?.scrollEffect === 'hide') {
      return;
    }

    const pageEl = this.el.closest(ION_PAGE_ELEMENT_SELECTOR);
    const contentEl = pageEl ? findIonContent(pageEl) : null;

    if (!contentEl) {
      return;
    }

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

    contentEl.classList.add('content-tab-bar-hide-scroll-partner');
  };

  private updateHideSlideY() {
    readTask(() => {
      const heightPx = this.el.offsetHeight;
      writeTask(() => {
        this.el.style.setProperty('--internal-tab-bar-hide-slide-y', `${heightPx}px`);
        if (this.contentEl) {
          this.contentEl.style.setProperty('--internal-tab-bar-hide-slide-y', `${heightPx}px`);
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
          writeTask(() => {
            this.scrollHidden = false;
            this.updateContentHiddenClass(false);
          });
        }
        return;
      }

      if (ev.deltaY < 0) {
        this.scrollDirectionChangeTop = scrollTop;
        if (this.scrollHidden) {
          writeTask(() => {
            this.scrollHidden = false;
            this.updateContentHiddenClass(false);
          });
        }
      } else if (ev.deltaY > 0) {
        const delta = scrollTop - this.scrollDirectionChangeTop;
        if (delta >= this.HIDE_THRESHOLD && !this.scrollHidden) {
          writeTask(() => {
            this.scrollHidden = true;
            this.updateContentHiddenClass(true);
          });
        }
      }
    });
  };

  private handleScrollEffectHide = () => {
    if (Date.now() - this.lastWheelTime < this.WHEEL_SCROLL_SUPPRESS_MS) {
      return;
    }

    readTask(() => {
      const scrollTop = this.scrollEl!.scrollTop;

      if (scrollTop <= this.VISIBLE_ZONE) {
        if (this.scrollHidden) {
          writeTask(() => {
            this.scrollHidden = false;
            this.updateContentHiddenClass(false);
          });
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
        writeTask(() => {
          this.scrollHidden = shouldHide;
          this.updateContentHiddenClass(shouldHide);
        });
      }
    });
  };

  private updateContentHiddenClass(hidden: boolean) {
    if (this.contentEl) {
      this.contentEl.classList.toggle('content-tab-bar-hide-scroll-hidden', hidden);
    }
  }

  private destroyScrollEffect() {
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
      this.contentEl.classList.remove('content-tab-bar-hide-scroll-partner', 'content-tab-bar-hide-scroll-hidden');
      this.contentEl.style.removeProperty('--internal-tab-bar-hide-slide-y');
      this.contentEl = undefined;
    }

    this.el.style.removeProperty('--internal-tab-bar-hide-slide-y');
    if (this.scrollHidden) {
      this.scrollHidden = false;
    }
    this.lastScrollTop = 0;
    this.scrollDirectionChangeTop = 0;
    this.lastWheelTime = 0;
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
    const { color, translucent, keyboardVisible, scrollEffect, scrollHidden, expand } = this;
    const theme = getIonTheme(this);
    const shape = this.getShape();
    const shouldHide = keyboardVisible && this.el.getAttribute('slot') !== 'top';

    return (
      <Host
        role="tablist"
        aria-hidden={shouldHide || scrollHidden ? 'true' : null}
        inert={scrollHidden ? '' : null}
        class={createColorClasses(color, {
          [theme]: true,
          'tab-bar-translucent': translucent,
          'tab-bar-hidden': shouldHide,
          'tab-bar-scroll-effect-hide': scrollEffect === 'hide',
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
