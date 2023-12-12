import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Build, Component, Element, Event, Host, Listen, Method, Prop, forceUpdate, h, readTask } from '@stencil/core';
import { componentOnReady, hasLazyBuild } from '@utils/helpers';
import { isPlatform } from '@utils/platform';
import { isRTL } from '@utils/rtl';
import { createColorClasses, hostContext } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { Color } from '../../interface';

import type { ScrollBaseDetail, ScrollDetail } from './content-interface';

/**
 * @slot - Content is placed in the scrollable area if provided without a slot.
 * @slot fixed - Should be used for fixed content that should not scroll.
 *
 * @part background - The background of the content.
 * @part scroll - The scrollable container of the content.
 */
@Component({
  tag: 'ion-content',
  styleUrl: 'content.scss',
  shadow: true,
})
export class Content implements ComponentInterface {
  private watchDog: ReturnType<typeof setInterval> | null = null;
  private isScrolling = false;
  private lastScroll = 0;
  private queued = false;
  private cTop = -1;
  private cBottom = -1;
  private scrollEl?: HTMLElement;
  private backgroundContentEl?: HTMLElement;
  private isMainContent = true;
  private resizeTimeout: ReturnType<typeof setTimeout> | null = null;

  private tabsElement: HTMLElement | null = null;
  private tabsLoadCallback?: () => void;

  // Detail is used in a hot loop in the scroll event, by allocating it here
  // V8 will be able to inline any read/write to it since it's a monomorphic class.
  // https://mrale.ph/blog/2015/01/11/whats-up-with-monomorphism.html
  private detail: ScrollDetail = {
    scrollTop: 0,
    scrollLeft: 0,
    type: 'scroll',
    event: undefined!,
    startX: 0,
    startY: 0,
    startTime: 0,
    currentX: 0,
    currentY: 0,
    velocityX: 0,
    velocityY: 0,
    deltaX: 0,
    deltaY: 0,
    currentTime: 0,
    data: undefined,
    isScrolling: true,
  };

  @Element() el!: HTMLIonContentElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * If `true`, the content will scroll behind the headers
   * and footers. This effect can easily be seen by setting the toolbar
   * to transparent.
   */
  @Prop() fullscreen = false;

  /**
   * If `true` and the content does not cause an overflow scroll, the scroll interaction will cause a bounce.
   * If the content exceeds the bounds of ionContent, nothing will change.
   * Note, this does not disable the system bounce on iOS. That is an OS level setting.
   */
  @Prop({ mutable: true }) forceOverscroll?: boolean;

  /**
   * If you want to enable the content scrolling in the X axis, set this property to `true`.
   */
  @Prop() scrollX = false;

  /**
   * If you want to disable the content scrolling in the Y axis, set this property to `false`.
   */
  @Prop() scrollY = true;

  /**
   * Because of performance reasons, ionScroll events are disabled by default, in order to enable them
   * and start listening from (ionScroll), set this property to `true`.
   */
  @Prop() scrollEvents = false;

  /**
   * Emitted when the scroll has started. This event is disabled by default.
   * Set `scrollEvents` to `true` to enable.
   */
  @Event() ionScrollStart!: EventEmitter<ScrollBaseDetail>;

  /**
   * Emitted while scrolling. This event is disabled by default.
   * Set `scrollEvents` to `true` to enable.
   */
  @Event() ionScroll!: EventEmitter<ScrollDetail>;

  /**
   * Emitted when the scroll has ended. This event is disabled by default.
   * Set `scrollEvents` to `true` to enable.
   */
  @Event() ionScrollEnd!: EventEmitter<ScrollBaseDetail>;

  connectedCallback() {
    this.isMainContent = this.el.closest('ion-menu, ion-popover, ion-modal') === null;

    /**
     * The fullscreen content offsets need to be
     * computed after the tab bar has loaded. Since
     * lazy evaluation means components are not hydrated
     * at the same time, we need to wait for the ionTabBarLoaded
     * event to fire. This does not impact dist-custom-elements
     * because there is no hydration there.
     */
    if (hasLazyBuild(this.el)) {
      /**
       * We need to cache the reference to the tabs.
       * If just the content is unmounted then we won't
       * be able to query for the closest tabs on disconnectedCallback
       * since the content has been removed from the DOM tree.
       */
      const closestTabs = (this.tabsElement = this.el.closest('ion-tabs'));
      if (closestTabs !== null) {
        /**
         * When adding and removing the event listener
         * we need to make sure we pass the same function reference
         * otherwise the event listener will not be removed properly.
         * We can't only pass `this.resize` because "this" in the function
         * context becomes a reference to IonTabs instead of IonContent.
         *
         * Additionally, we listen for ionTabBarLoaded on the IonTabs
         * instance rather than the IonTabBar instance. It's possible for
         * a tab bar to be conditionally rendered/mounted. Since ionTabBarLoaded
         * bubbles, we can catch any instances of child tab bars loading by listening
         * on IonTabs.
         */
        this.tabsLoadCallback = () => this.resize();
        closestTabs.addEventListener('ionTabBarLoaded', this.tabsLoadCallback);
      }
    }
  }

  disconnectedCallback() {
    this.onScrollEnd();

    if (hasLazyBuild(this.el)) {
      /**
       * The event listener and tabs caches need to
       * be cleared otherwise this will create a memory
       * leak where the IonTabs instance can never be
       * garbage collected.
       */
      const { tabsElement, tabsLoadCallback } = this;
      if (tabsElement !== null && tabsLoadCallback !== undefined) {
        tabsElement.removeEventListener('ionTabBarLoaded', tabsLoadCallback);
      }

      this.tabsElement = null;
      this.tabsLoadCallback = undefined;
    }
  }

  /**
   * Rotating certain devices can update
   * the safe area insets. As a result,
   * the fullscreen feature on ion-content
   * needs to be recalculated.
   *
   * We listen for "resize" because we
   * do not care what the orientation of
   * the device is. Other APIs
   * such as ScreenOrientation or
   * the deviceorientation event must have
   * permission from the user first whereas
   * the "resize" event does not.
   *
   * We also throttle the callback to minimize
   * thrashing when quickly resizing a window.
   */
  @Listen('resize', { target: 'window' })
  onResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }

    this.resizeTimeout = setTimeout(() => {
      /**
       * Resize should only happen
       * if the content is visible.
       * When the content is hidden
       * then offsetParent will be null.
       */
      if (this.el.offsetParent === null) {
        return;
      }

      this.resize();
    }, 100);
  }

  private shouldForceOverscroll() {
    const { forceOverscroll } = this;
    const mode = getIonMode(this);
    return forceOverscroll === undefined ? mode === 'ios' && isPlatform('ios') : forceOverscroll;
  }

  private resize() {
    /**
     * Only force update if the component is rendered in a browser context.
     * Using `forceUpdate` in a server context with pre-rendering can lead to an infinite loop.
     * The `hydrateDocument` function in `@stencil/core` will render the `ion-content`, but
     * `forceUpdate` will trigger another render, locking up the server.
     *
     * TODO: Remove if STENCIL-834 determines Stencil will account for this.
     */
    if (Build.isBrowser) {
      if (this.fullscreen) {
        readTask(() => this.readDimensions());
      } else if (this.cTop !== 0 || this.cBottom !== 0) {
        this.cTop = this.cBottom = 0;
        forceUpdate(this);
      }
    }
  }

  private readDimensions() {
    const page = getPageElement(this.el);
    const top = Math.max(this.el.offsetTop, 0);
    const bottom = Math.max(page.offsetHeight - top - this.el.offsetHeight, 0);
    const dirty = top !== this.cTop || bottom !== this.cBottom;
    if (dirty) {
      this.cTop = top;
      this.cBottom = bottom;
      forceUpdate(this);
    }
  }

  private onScroll(ev: UIEvent) {
    const timeStamp = Date.now();
    const shouldStart = !this.isScrolling;
    this.lastScroll = timeStamp;
    if (shouldStart) {
      this.onScrollStart();
    }
    if (!this.queued && this.scrollEvents) {
      this.queued = true;
      readTask((ts) => {
        this.queued = false;
        this.detail.event = ev;
        updateScrollDetail(this.detail, this.scrollEl!, ts, shouldStart);
        this.ionScroll.emit(this.detail);
      });
    }
  }

  /**
   * Get the element where the actual scrolling takes place.
   * This element can be used to subscribe to `scroll` events or manually modify
   * `scrollTop`. However, it's recommended to use the API provided by `ion-content`:
   *
   * i.e. Using `ionScroll`, `ionScrollStart`, `ionScrollEnd` for scrolling events
   * and `scrollToPoint()` to scroll the content into a certain point.
   */
  @Method()
  async getScrollElement(): Promise<HTMLElement> {
    /**
     * If this gets called in certain early lifecycle hooks (ex: Vue onMounted),
     * scrollEl won't be defined yet with the custom elements build, so wait for it to load in.
     */
    if (!this.scrollEl) {
      await new Promise((resolve) => componentOnReady(this.el, resolve));
    }

    return Promise.resolve(this.scrollEl!);
  }

  /**
   * Returns the background content element.
   * @internal
   */
  @Method()
  async getBackgroundElement(): Promise<HTMLElement> {
    if (!this.backgroundContentEl) {
      await new Promise((resolve) => componentOnReady(this.el, resolve));
    }
    return Promise.resolve(this.backgroundContentEl!);
  }

  /**
   * Scroll to the top of the component.
   *
   * @param duration The amount of time to take scrolling to the top. Defaults to `0`.
   */
  @Method()
  scrollToTop(duration = 0): Promise<void> {
    return this.scrollToPoint(undefined, 0, duration);
  }

  /**
   * Scroll to the bottom of the component.
   *
   * @param duration The amount of time to take scrolling to the bottom. Defaults to `0`.
   */
  @Method()
  async scrollToBottom(duration = 0): Promise<void> {
    const scrollEl = await this.getScrollElement();
    const y = scrollEl!.scrollHeight - scrollEl!.clientHeight;
    return this.scrollToPoint(undefined, y, duration);
  }

  /**
   * Scroll by a specified X/Y distance in the component.
   *
   * @param x The amount to scroll by on the horizontal axis.
   * @param y The amount to scroll by on the vertical axis.
   * @param duration The amount of time to take scrolling by that amount.
   */
  @Method()
  async scrollByPoint(x: number, y: number, duration: number): Promise<void> {
    const scrollEl = await this.getScrollElement();
    return this.scrollToPoint(x + scrollEl!.scrollLeft, y + scrollEl!.scrollTop, duration);
  }

  /**
   * Scroll to a specified X/Y location in the component.
   *
   * @param x The point to scroll to on the horizontal axis.
   * @param y The point to scroll to on the vertical axis.
   * @param duration The amount of time to take scrolling to that point. Defaults to `0`.
   */
  @Method()
  async scrollToPoint(x: number | undefined | null, y: number | undefined | null, duration = 0): Promise<void> {
    const el = await this.getScrollElement();
    if (duration < 32) {
      if (y != null) {
        el.scrollTop = y;
      }
      if (x != null) {
        el.scrollLeft = x;
      }
      return;
    }

    let resolve!: () => void;
    let startTime = 0;
    const promise = new Promise<void>((r) => (resolve = r));
    const fromY = el.scrollTop;
    const fromX = el.scrollLeft;

    const deltaY = y != null ? y - fromY : 0;
    const deltaX = x != null ? x - fromX : 0;

    // scroll loop
    const step = (timeStamp: number) => {
      const linearTime = Math.min(1, (timeStamp - startTime) / duration) - 1;
      const easedT = Math.pow(linearTime, 3) + 1;

      if (deltaY !== 0) {
        el.scrollTop = Math.floor(easedT * deltaY + fromY);
      }
      if (deltaX !== 0) {
        el.scrollLeft = Math.floor(easedT * deltaX + fromX);
      }

      if (easedT < 1) {
        // do not use DomController here
        // must use nativeRaf in order to fire in the next frame
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    };
    // chill out for a frame first
    requestAnimationFrame((ts) => {
      startTime = ts;
      step(ts);
    });
    return promise;
  }

  private onScrollStart() {
    this.isScrolling = true;
    this.ionScrollStart.emit({
      isScrolling: true,
    });

    if (this.watchDog) {
      clearInterval(this.watchDog);
    }
    // watchdog
    this.watchDog = setInterval(() => {
      if (this.lastScroll < Date.now() - 120) {
        this.onScrollEnd();
      }
    }, 100);
  }

  private onScrollEnd() {
    if (this.watchDog) clearInterval(this.watchDog);
    this.watchDog = null;
    if (this.isScrolling) {
      this.isScrolling = false;
      this.ionScrollEnd.emit({
        isScrolling: false,
      });
    }
  }

  render() {
    const { isMainContent, scrollX, scrollY, el } = this;
    const rtl = isRTL(el) ? 'rtl' : 'ltr';
    const mode = getIonMode(this);
    const forceOverscroll = this.shouldForceOverscroll();
    const transitionShadow = mode === 'ios';
    const TagType = isMainContent ? 'main' : ('div' as any);

    this.resize();

    return (
      <Host
        class={createColorClasses(this.color, {
          [mode]: true,
          'content-sizing': hostContext('ion-popover', this.el),
          overscroll: forceOverscroll,
          [`content-${rtl}`]: true,
        })}
        style={{
          '--offset-top': `${this.cTop}px`,
          '--offset-bottom': `${this.cBottom}px`,
        }}
      >
        <div ref={(el) => (this.backgroundContentEl = el)} id="background-content" part="background"></div>

        <slot name="new"></slot>

        <TagType
          class={{
            'inner-scroll': true,
            'scroll-x': scrollX,
            'scroll-y': scrollY,
            overscroll: (scrollX || scrollY) && forceOverscroll,
          }}
          ref={(scrollEl: HTMLElement) => (this.scrollEl = scrollEl!)}
          onScroll={this.scrollEvents ? (ev: UIEvent) => this.onScroll(ev) : undefined}
          part="scroll"
        >
          <slot></slot>
        </TagType>

        {transitionShadow ? (
          <div class="transition-effect">
            <div class="transition-cover"></div>
            <div class="transition-shadow"></div>
          </div>
        ) : null}

        <slot name="fixed"></slot>
      </Host>
    );
  }
}

const getParentElement = (el: any) => {
  if (el.parentElement) {
    // normal element with a parent element
    return el.parentElement;
  }
  if (el.parentNode?.host) {
    // shadow dom's document fragment
    return el.parentNode.host;
  }
  return null;
};

const getPageElement = (el: HTMLElement) => {
  const tabs = el.closest('ion-tabs');
  if (tabs) {
    return tabs;
  }

  /**
   * If we're in a popover, we need to use its wrapper so we can account for space
   * between the popover and the edges of the screen. But if the popover contains
   * its own page element, we should use that instead.
   */
  const page = el.closest('ion-app, ion-page, .ion-page, page-inner, .popover-content');
  if (page) {
    return page;
  }

  return getParentElement(el);
};

// ******** DOM READ ****************
const updateScrollDetail = (detail: ScrollDetail, el: Element, timestamp: number, shouldStart: boolean) => {
  const prevX = detail.currentX;
  const prevY = detail.currentY;
  const prevT = detail.currentTime;
  const currentX = el.scrollLeft;
  const currentY = el.scrollTop;
  const timeDelta = timestamp - prevT;

  if (shouldStart) {
    // remember the start positions
    detail.startTime = timestamp;
    detail.startX = currentX;
    detail.startY = currentY;
    detail.velocityX = detail.velocityY = 0;
  }
  detail.currentTime = timestamp;
  detail.currentX = detail.scrollLeft = currentX;
  detail.currentY = detail.scrollTop = currentY;
  detail.deltaX = currentX - detail.startX;
  detail.deltaY = currentY - detail.startY;

  if (timeDelta > 0 && timeDelta < 100) {
    const velocityX = (currentX - prevX) / timeDelta;
    const velocityY = (currentY - prevY) / timeDelta;
    detail.velocityX = velocityX * 0.7 + detail.velocityX * 0.3;
    detail.velocityY = velocityY * 0.7 + detail.velocityY * 0.3;
  }
};
