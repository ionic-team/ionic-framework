import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, State, Watch, h, readTask, writeTask } from '@stencil/core';
import { findClosestIonContent, getScrollElement, printIonContentErrorMsg } from '@utils/content';

import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-infinite-scroll',
  styleUrl: 'infinite-scroll.scss',
})
export class InfiniteScroll implements ComponentInterface {
  private thrPx = 0;
  private thrPc = 0;
  private scrollEl?: HTMLElement;
  private contentEl: HTMLElement | null = null;

  /**
   * didFire exists so that ionInfinite
   * does not fire multiple times if
   * users continue to scroll after
   * scrolling into the infinite
   * scroll threshold.
   */
  private didFire = false;
  private isBusy = false;

  @Element() el!: HTMLElement;
  @State() isLoading = false;

  /**
   * The threshold distance from the bottom
   * of the content to call the `infinite` output event when scrolled.
   * The threshold value can be either a percent, or
   * in pixels. For example, use the value of `10%` for the `infinite`
   * output event to get called when the user has scrolled 10%
   * from the bottom of the page. Use the value `100px` when the
   * scroll is within 100 pixels from the bottom of the page.
   */
  @Prop() threshold = '15%';

  @Watch('threshold')
  protected thresholdChanged() {
    const val = this.threshold;
    if (val.lastIndexOf('%') > -1) {
      this.thrPx = 0;
      this.thrPc = parseFloat(val) / 100;
    } else {
      this.thrPx = parseFloat(val);
      this.thrPc = 0;
    }
  }

  /**
   * If `true`, the infinite scroll will be hidden and scroll event listeners
   * will be removed.
   *
   * Set this to true to disable the infinite scroll from actively
   * trying to receive new data while scrolling. This is useful
   * when it is known that there is no more data that can be added, and
   * the infinite scroll is no longer needed.
   */
  @Prop() disabled = false;

  @Watch('disabled')
  protected disabledChanged() {
    const disabled = this.disabled;
    if (disabled) {
      this.isLoading = false;
      this.isBusy = false;
    }
    this.enableScrollEvents(!disabled);
  }

  /**
   * The position of the infinite scroll element.
   * The value can be either `top` or `bottom`.
   */
  @Prop() position: 'top' | 'bottom' = 'bottom';

  /**
   * If `true`, the infinite scroll will preserve the scroll position
   * when the content is re-rendered. This is useful when the content is
   * re-rendered with new keys, and the scroll position should be preserved.
   */
  @Prop() preserveRerenderScrollPosition: boolean = false;

  /**
   * Emitted when the scroll reaches
   * the threshold distance. From within your infinite handler,
   * you must call the infinite scroll's `complete()` method when
   * your async operation has completed.
   */
  @Event() ionInfinite!: EventEmitter<void>;

  async connectedCallback() {
    this.contentEl = findClosestIonContent(this.el);
    if (!this.contentEl) {
      printIonContentErrorMsg(this.el);
      return;
    }
    this.scrollEl = await getScrollElement(this.contentEl);
    this.thresholdChanged();
    this.disabledChanged();
    if (this.position === 'top') {
      writeTask(() => {
        if (this.scrollEl) {
          this.scrollEl.scrollTop = this.scrollEl.scrollHeight - this.scrollEl.clientHeight;
        }
      });
    }
  }

  disconnectedCallback() {
    this.enableScrollEvents(false);
    this.scrollEl = undefined;
  }

  private onScroll = () => {
    const scrollEl = this.scrollEl;
    if (!scrollEl || !this.canStart()) {
      return 1;
    }

    const infiniteHeight = this.el.offsetHeight;
    if (infiniteHeight === 0) {
      // if there is no height of this element then do nothing
      return 2;
    }
    const scrollTop = scrollEl.scrollTop;
    const scrollHeight = scrollEl.scrollHeight;
    const height = scrollEl.offsetHeight;
    const threshold = this.thrPc !== 0 ? height * this.thrPc : this.thrPx;

    const distanceFromInfinite =
      this.position === 'bottom'
        ? scrollHeight - infiniteHeight - scrollTop - threshold - height
        : scrollTop - infiniteHeight - threshold;

    if (distanceFromInfinite < 0) {
      if (!this.didFire) {
        this.isLoading = true;
        this.didFire = true;

        // Lock the min height of the siblings of the infinite scroll
        // if we are preserving the rerender scroll position
        this.lockSiblingMinHeight(true);

        this.ionInfinite.emit();
        return 3;
      }
    }

    return 4;
  };

  /**
   * Loop through our sibling elements and lock or unlock their min height.
   * This keeps our siblings, for example `ion-list`, the same height as their
   * content currently is, so when it loads new data and the DOM removes the old
   * data, the height of the container doesn't change and we don't lose our scroll position.
   *
   * We preserve existing min-height values, if they're set, so we don't erase what
   * has been previously set by the user when we restore after complete is called.
   */
  private lockSiblingMinHeight(lock: boolean) {
    if (!this.preserveRerenderScrollPosition) {
      return;
    }

    // Loop through all the siblings of the infinite scroll, but ignore the infinite scroll itself
    const siblings = this.el.parentElement?.children || [];
    for (const sibling of siblings) {
      if (sibling !== this.el && sibling instanceof HTMLElement) {
        if (lock) {
          const elementHeight = sibling.getBoundingClientRect().height;
          const previousMinHeight = sibling.style.minHeight;
          if (previousMinHeight) {
            sibling.style.setProperty('--ion-previous-min-height', previousMinHeight);
          }
          sibling.style.minHeight = `${elementHeight}px`;
        } else {
          const previousMinHeight = sibling.style.getPropertyValue('--ion-previous-min-height');
          sibling.style.minHeight = previousMinHeight || 'auto';
          sibling.style.removeProperty('--ion-previous-min-height');
        }
      }
    }
  }

  /**
   * Call `complete()` within the `ionInfinite` output event handler when
   * your async operation has completed. For example, the `loading`
   * state is while the app is performing an asynchronous operation,
   * such as receiving more data from an AJAX request to add more items
   * to a data list. Once the data has been received and UI updated, you
   * then call this method to signify that the loading has completed.
   * This method will change the infinite scroll's state from `loading`
   * to `enabled`.
   */
  @Method()
  async complete() {
    const scrollEl = this.scrollEl;
    if (!this.isLoading || !scrollEl) {
      return;
    }
    this.isLoading = false;

    if (this.position === 'top') {
      /**
       * New content is being added at the top, but the scrollTop position stays the same,
       * which causes a scroll jump visually. This algorithm makes sure to prevent this.
       * (Frame 1)
       *    - complete() is called, but the UI hasn't had time to update yet.
       *    - Save the current content dimensions.
       *    - Wait for the next frame using _dom.read, so the UI will be updated.
       * (Frame 2)
       *    - Read the new content dimensions.
       *    - Calculate the height difference and the new scroll position.
       *    - Delay the scroll position change until other possible dom reads are done using _dom.write to be performant.
       * (Still frame 2, if I'm correct)
       *    - Change the scroll position (= visually maintain the scroll position).
       *    - Change the state to re-enable the InfiniteScroll.
       *    - This should be after changing the scroll position, or it could
       *    cause the InfiniteScroll to be triggered again immediately.
       * (Frame 3)
       *    Done.
       */
      this.isBusy = true;
      // ******** DOM READ ****************
      // Save the current content dimensions before the UI updates
      const prev = scrollEl.scrollHeight - scrollEl.scrollTop;

      // ******** DOM READ ****************
      requestAnimationFrame(() => {
        readTask(() => {
          // UI has updated, save the new content dimensions
          const scrollHeight = scrollEl.scrollHeight;
          // New content was added on top, so the scroll position should be changed immediately to prevent it from jumping around
          const newScrollTop = scrollHeight - prev;

          // ******** DOM WRITE ****************
          requestAnimationFrame(() => {
            writeTask(() => {
              scrollEl.scrollTop = newScrollTop;
              this.isBusy = false;
              this.didFire = false;
            });
          });
        });
      });
    } else {
      this.didFire = false;
    }

    // Unlock the min height of the siblings of the infinite scroll
    // if we are preserving the rerender scroll position
    setTimeout(() => {
      this.lockSiblingMinHeight(false);
    }, 100);
  }

  private canStart(): boolean {
    return !this.disabled && !this.isBusy && !!this.scrollEl && !this.isLoading;
  }

  private enableScrollEvents(shouldListen: boolean) {
    if (this.scrollEl) {
      if (shouldListen) {
        this.scrollEl.addEventListener('scroll', this.onScroll);
      } else {
        this.scrollEl.removeEventListener('scroll', this.onScroll);
      }
    }
  }

  render() {
    const theme = getIonTheme(this);
    const disabled = this.disabled;
    return (
      <Host
        class={{
          [theme]: true,
          'infinite-scroll-loading': this.isLoading,
          'infinite-scroll-enabled': !disabled,
        }}
      />
    );
  }
}
