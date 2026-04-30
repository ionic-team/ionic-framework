import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { findClosestIonContent, disableContentScrollY, resetContentScrollY } from '@utils/content';
import { isEndSide } from '@utils/helpers';
import { printIonWarning } from '@utils/logging';
import { watchForOptions } from '@utils/watch-options';

import { getIonTheme } from '../../global/ionic-global';
import type { Gesture, GestureDetail } from '../../interface';
import type { Side } from '../menu/menu-interface';

const SWIPE_MARGIN = 30;
const ELASTIC_FACTOR = 0.55;
const IONIC_ELASTIC_FACTOR = 0.15;
const IONIC_SNAP_OPEN_RATIO = 0.4;
const IONIC_EXPAND_TRIGGER = 40;
const IONIC_FULL_SWIPE_VELOCITY_THRESHOLD = 400;
const IONIC_OPEN_VELOCITY_THRESHOLD = 200;
const IONIC_ACTION_BASE_WIDTH = 64;
const IONIC_CONFIRM_PAUSE = 300;
const FULL_SWIPE_TRANSITION_MS = 250;
const IONIC_EXPAND_RESISTANCE_FACTOR = 0.95;

/** Expandable, non-disabled option (matches item-option expandable class). */
const EXPANDABLE_OPTION_SELECTOR = 'ion-item-option.item-option-expandable:not(.item-option-disabled)';
const ITEM_OPTION_EXPAND_THRESHOLD_CLASS = 'item-option-expand-threshold';

const enum ItemSide {
  None = 0,
  Start = 1 << 0,
  End = 1 << 1,
  Both = Start | End,
}

const enum SlidingState {
  Disabled = 1 << 1,
  Enabled = 1 << 2,
  End = 1 << 3,
  Start = 1 << 4,

  SwipeEnd = 1 << 5,
  SwipeStart = 1 << 6,
  AnimatingFullSwipe = 1 << 7,
}

let openSlidingItem: HTMLIonItemSlidingElement | undefined;

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-item-sliding',
  styleUrls: {
    ios: 'item-sliding.ios.scss',
    md: 'item-sliding.md.scss',
    ionic: 'item-sliding.ionic.scss',
  },
})
export class ItemSliding implements ComponentInterface {
  private item: HTMLIonItemElement | null = null;
  private openAmount = 0;
  private initialOpenAmount = 0;
  private optsWidthRightSide = 0;
  private optsWidthLeftSide = 0;
  private sides = ItemSide.None;
  private tmr?: ReturnType<typeof setTimeout>;
  private animationAbortController?: AbortController;
  private leftOptions?: HTMLIonItemOptionsElement;
  private rightOptions?: HTMLIonItemOptionsElement;
  private optsDirty = true;
  private gesture?: Gesture;
  private contentEl: HTMLElement | null = null;
  private initialContentScrollY = true;
  private mutationObserver?: MutationObserver;
  private leftExpandableBaseWidth = IONIC_ACTION_BASE_WIDTH;
  private rightExpandableBaseWidth = IONIC_ACTION_BASE_WIDTH;

  private isIonicTheme(): boolean {
    return getIonTheme(this) === 'ionic';
  }

  @Element() el!: HTMLIonItemSlidingElement;

  @State() state: SlidingState = SlidingState.Disabled;

  /**
   * If `true`, the user cannot interact with the sliding item.
   */
  @Prop() disabled = false;
  @Watch('disabled')
  disabledChanged() {
    if (this.gesture) {
      this.gesture.enable(!this.disabled);
    }
  }

  /**
   * Emitted when the sliding position changes.
   */
  @Event() ionDrag!: EventEmitter;

  async connectedCallback() {
    const { el } = this;
    this.item = el.querySelector('ion-item');
    this.contentEl = findClosestIonContent(el);

    /**
     * The MutationObserver needs to be added before we
     * call updateOptions below otherwise we may miss
     * ion-item-option elements that are added to the DOM
     * while updateOptions is running and before the MutationObserver
     * has been initialized.
     */
    this.mutationObserver = watchForOptions<HTMLIonItemOptionElement>(el, 'ion-item-option', async () => {
      await this.updateOptions();
    });

    await this.updateOptions();

    this.gesture = (await import('../../utils/gesture')).createGesture({
      el,
      gestureName: 'item-swipe',
      gesturePriority: 100,
      threshold: 5,
      canStart: (ev) => this.canStart(ev),
      onStart: () => this.onStart(),
      onMove: (ev) => this.onMove(ev),
      onEnd: (ev) => this.onEnd(ev),
    });
    this.disabledChanged();
  }

  disconnectedCallback() {
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }

    if (this.tmr !== undefined) {
      clearTimeout(this.tmr);
      this.tmr = undefined;
    }

    // Abort any in-progress animation. The abort handler rejects the pending
    // promise, causing animateFullSwipe's finally block to run cleanup.
    this.animationAbortController?.abort();

    this.item = null;
    this.leftOptions = this.rightOptions = undefined;

    if (openSlidingItem === this.el) {
      openSlidingItem = undefined;
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = undefined;
    }
  }

  /**
   * Get the amount the item is open in pixels.
   */
  @Method()
  getOpenAmount(): Promise<number> {
    return Promise.resolve(this.openAmount);
  }

  /**
   * Get the ratio of the open amount of the item compared to the width of the options.
   * If the number returned is positive, then the options on the right side are open.
   * If the number returned is negative, then the options on the left side are open.
   * If the absolute value of the number is greater than 1, the item is open more than
   * the width of the options.
   */
  @Method()
  getSlidingRatio(): Promise<number> {
    return Promise.resolve(this.getSlidingRatioSync());
  }

  /**
   * Open the sliding item.
   *
   * @param side The side of the options to open. If a side is not provided, it will open the first set of options it finds within the item.
   */
  @Method()
  async open(side: Side | undefined) {
    if ((this.state & SlidingState.AnimatingFullSwipe) !== 0) {
      return;
    }

    /**
     * It is possible for the item to be added to the DOM
     * after the item-sliding component was created. As a result,
     * if this.item is null, then we should attempt to
     * query for the ion-item again.
     * However, if the item is already defined then
     * we do not query for it again.
     */
    const item = (this.item = this.item ?? this.el.querySelector('ion-item'));
    if (item === null) {
      return;
    }

    const optionsToOpen = this.getOptions(side);
    if (!optionsToOpen) {
      return;
    }

    /**
     * If side is not set, we need to infer the side
     * so we know which direction to move the options
     */
    if (side === undefined) {
      side = optionsToOpen === this.leftOptions ? 'start' : 'end';
    }

    // In RTL we want to switch the sides
    side = isEndSide(side) ? 'end' : 'start';

    const isStartOpen = this.openAmount < 0;
    const isEndOpen = this.openAmount > 0;

    /**
     * If a side is open and a user tries to
     * re-open the same side, we should not do anything
     */
    if (isStartOpen && optionsToOpen === this.leftOptions) {
      return;
    }
    if (isEndOpen && optionsToOpen === this.rightOptions) {
      return;
    }

    this.closeOpened();

    this.state = SlidingState.Enabled;

    requestAnimationFrame(() => {
      this.calculateOptsWidth();

      const width = side === 'end' ? this.optsWidthRightSide : -this.optsWidthLeftSide;
      openSlidingItem = this.el;

      this.setOpenAmount(width, false);
      this.state = side === 'end' ? SlidingState.End : SlidingState.Start;
    });
  }

  /**
   * Close the sliding item. Items can also be closed from the [List](./list).
   */
  @Method()
  async close() {
    if ((this.state & SlidingState.AnimatingFullSwipe) !== 0) {
      return;
    }
    this.setOpenAmount(0, true);
  }

  /**
   * Close all of the sliding items in the list. Items can also be closed from the [List](./list).
   */
  @Method()
  async closeOpened(): Promise<boolean> {
    if (openSlidingItem !== undefined) {
      openSlidingItem.close();
      openSlidingItem = undefined;
      return true;
    }
    return false;
  }

  /**
   * Given an optional side, return the ion-item-options element.
   *
   * @param side This side of the options to get. If a side is not provided it will
   * return the first one available.
   */
  private getOptions(side?: string): HTMLIonItemOptionsElement | undefined {
    if (side === undefined) {
      return this.leftOptions || this.rightOptions;
    } else if (side === 'start') {
      return this.leftOptions;
    } else {
      return this.rightOptions;
    }
  }

  /**
   * Check if the given item options element contains at least one expandable, non-disabled option.
   */
  private hasExpandableOptions(options: HTMLIonItemOptionsElement | undefined): boolean {
    if (!options) return false;

    const optionElements = options.querySelectorAll('ion-item-option');
    return Array.from(optionElements).some((option: any) => {
      return option.expandable === true && !option.disabled;
    });
  }

  /**
   * Returns a Promise that resolves after `ms` milliseconds, or rejects if the
   * given AbortSignal is fired before the timer expires.
   */
  private delay(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const id = setTimeout(resolve, ms);
      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(id);
          reject(new DOMException('Animation cancelled', 'AbortError'));
        },
        { once: true }
      );
    });
  }

  /**
   * Animate the item to a specific position using CSS transitions.
   * Returns a Promise that resolves when the animation completes, or rejects if
   * the given AbortSignal is fired.
   */
  private animateToPosition(position: number, duration: number, signal: AbortSignal): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.item) {
        return resolve();
      }

      this.el.classList.add('item-sliding-full-swipe-transition');
      this.item.style.transform = `translate3d(${-position}px, 0, 0)`;

      const id = setTimeout(resolve, duration);
      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(id);
          reject(new DOMException('Animation cancelled', 'AbortError'));
        },
        { once: true }
      );
    });
  }

  /**
   * Calculate the swipe threshold distance required to trigger a full swipe animation.
   * Returns the maximum options width plus a margin to ensure it's achievable.
   */
  private getSwipeThreshold(direction: 'start' | 'end'): number {
    const maxWidth = direction === 'end' ? this.optsWidthRightSide : this.optsWidthLeftSide;
    return maxWidth + SWIPE_MARGIN;
  }

  /**
   * Native (ios/md) full swipe: off-screen → fire swipe → return.
   * Ionic theme uses `animateIonicFullSwipe` instead (see `onEndIonic`).
   */
  private async animateFullSwipe(direction: 'start' | 'end') {
    const abortController = new AbortController();
    this.animationAbortController = abortController;
    const { signal } = abortController;

    // Prevent interruption during animation
    if (this.gesture) {
      this.gesture.enable(false);
    }

    try {
      const options = direction === 'end' ? this.rightOptions : this.leftOptions;

      // Trigger expandable state without moving the item
      // Set state directly so expandable option fills its container, starting from
      // the exact position where the user released, without any visual snap.
      this.state =
        direction === 'end'
          ? SlidingState.End | SlidingState.SwipeEnd | SlidingState.AnimatingFullSwipe
          : SlidingState.Start | SlidingState.SwipeStart | SlidingState.AnimatingFullSwipe;

      await this.delay(100, signal);

      // Animate off-screen while maintaining the expanded state
      const offScreenDistance = direction === 'end' ? window.innerWidth : -window.innerWidth;
      await this.animateToPosition(offScreenDistance, FULL_SWIPE_TRANSITION_MS, signal);

      // Trigger action
      if (options) {
        options.fireSwipeEvent();
      }

      // Small delay before returning
      await this.delay(300, signal);

      // Return to closed state
      await this.animateToPosition(0, FULL_SWIPE_TRANSITION_MS, signal);
    } catch {
      // Animation was aborted (e.g. component disconnected). finally handles cleanup.
    } finally {
      this.animationAbortController = undefined;

      // Reset state
      this.el.classList.remove('item-sliding-full-swipe-transition');
      if (this.item) {
        this.item.style.transform = '';
      }
      this.openAmount = 0;
      this.state = SlidingState.Disabled;

      if (openSlidingItem === this.el) {
        openSlidingItem = undefined;
      }

      if (this.gesture) {
        this.gesture.enable(!this.disabled);
      }
    }
  }

  private queryExpandableOption(options?: HTMLIonItemOptionsElement): HTMLIonItemOptionElement | undefined {
    return options?.querySelector<HTMLIonItemOptionElement>(EXPANDABLE_OPTION_SELECTOR) ?? undefined;
  }

  private getExpandableOption(direction: 'start' | 'end'): HTMLIonItemOptionElement | undefined {
    return this.queryExpandableOption(direction === 'end' ? this.rightOptions : this.leftOptions);
  }

  private getOpenDirectionFromAmount(openAmount: number): 'start' | 'end' | undefined {
    if (openAmount > 0) {
      return 'end';
    }
    if (openAmount < 0) {
      return 'start';
    }
    return undefined;
  }

  private getOptionsWidthForDirection(direction: 'start' | 'end'): number {
    return direction === 'end' ? this.optsWidthRightSide : this.optsWidthLeftSide;
  }

  private getExpandableBaseWidth(direction: 'start' | 'end'): number {
    return direction === 'end' ? this.rightExpandableBaseWidth : this.leftExpandableBaseWidth;
  }

  private setIonicExpandableWidth(direction: 'start' | 'end', width: number, opening: boolean) {
    const expandableOption = this.getExpandableOption(direction);
    if (!expandableOption) {
      return;
    }

    const style = expandableOption.style;
    if (opening) {
      expandableOption.classList.remove('item-sliding-expandable-snapback');
      expandableOption.classList.add('item-sliding-expandable-open');
    } else {
      expandableOption.classList.remove('item-sliding-expandable-open');
      expandableOption.classList.add('item-sliding-expandable-snapback');
    }
    const baseWidth = this.getExpandableBaseWidth(direction);
    style.width = `${Math.max(baseWidth, width)}px`;
  }

  private resetIonicExpandableOptions() {
    [this.leftOptions, this.rightOptions].forEach((options) => {
      if (!options) {
        return;
      }
      options.querySelectorAll(EXPANDABLE_OPTION_SELECTOR).forEach((node) => {
        node.classList.remove(ITEM_OPTION_EXPAND_THRESHOLD_CLASS);
      });
      const expandableOption = this.queryExpandableOption(options);
      if (!expandableOption) {
        return;
      }
      expandableOption.style.width = '';
      expandableOption.classList.remove(
        'item-sliding-expandable-open',
        'item-sliding-expandable-snapback',
        'item-sliding-expandable-width-in',
        'item-sliding-expandable-width-back'
      );
    });
  }

  private updateIonicExpandableFromOpenAmount(openAmount: number, isFinal: boolean, previousOpenAmount: number) {
    if ((this.state & SlidingState.AnimatingFullSwipe) !== 0) {
      return;
    }

    const direction = this.getOpenDirectionFromAmount(openAmount);
    if (direction === undefined) {
      const previousDirection = this.getOpenDirectionFromAmount(previousOpenAmount);
      if (previousDirection === undefined) {
        this.resetIonicExpandableOptions();
        return;
      }

      this.queryExpandableOption(previousDirection === 'end' ? this.rightOptions : this.leftOptions)?.classList.remove(
        ITEM_OPTION_EXPAND_THRESHOLD_CLASS
      );

      this.setIonicExpandableWidth(previousDirection, this.getExpandableBaseWidth(previousDirection), false);
      return;
    }

    const baseWidth = this.getExpandableBaseWidth(direction);
    const optionsWidth = this.getOptionsWidthForDirection(direction);
    const extraWidth = Math.max(0, Math.abs(openAmount) - optionsWidth);
    const resistedExtraWidth = isFinal ? extraWidth : extraWidth * IONIC_EXPAND_RESISTANCE_FACTOR;
    const targetWidth = baseWidth + resistedExtraWidth;

    const expandableOption = this.getExpandableOption(direction);
    if (expandableOption) {
      if (!isFinal && extraWidth >= IONIC_EXPAND_TRIGGER) {
        expandableOption.classList.add(ITEM_OPTION_EXPAND_THRESHOLD_CLASS);
      } else {
        expandableOption.classList.remove(ITEM_OPTION_EXPAND_THRESHOLD_CLASS);
      }
    }

    this.setIonicExpandableWidth(direction, targetWidth, true);
  }

  private async animateIonicFullSwipe(direction: 'start' | 'end') {
    const abortController = new AbortController();
    this.animationAbortController = abortController;
    const { signal } = abortController;
    const expandableOption = this.getExpandableOption(direction);
    const options = direction === 'end' ? this.rightOptions : this.leftOptions;

    if (this.gesture) {
      this.gesture.enable(false);
    }

    try {
      this.state =
        direction === 'end'
          ? SlidingState.End | SlidingState.AnimatingFullSwipe
          : SlidingState.Start | SlidingState.AnimatingFullSwipe;

      if (!this.item) {
        return;
      }

      const itemWidth = this.el.offsetWidth || window.innerWidth;
      const baseWidth = this.getExpandableBaseWidth(direction);
      const expandableTargetWidth = Math.max(baseWidth, itemWidth - 16);
      const offScreenPosition = direction === 'end' ? itemWidth : -itemWidth;

      if (expandableOption) {
        expandableOption.classList.remove('item-sliding-expandable-width-back');
        expandableOption.classList.add('item-sliding-expandable-width-in');
        expandableOption.style.width = `${expandableTargetWidth}px`;
      }

      this.el.classList.remove('item-sliding-ionic-confirm-item-back');
      this.el.classList.add('item-sliding-ionic-confirm-item-in');
      this.item.style.transform = `translate3d(${-offScreenPosition}px, 0, 0)`;
      await this.delay(150, signal);

      options?.fireSwipeEvent();
      await this.delay(IONIC_CONFIRM_PAUSE, signal);

      if (expandableOption) {
        expandableOption.classList.remove('item-sliding-expandable-width-in');
        expandableOption.classList.add('item-sliding-expandable-width-back');
        expandableOption.style.width = `${baseWidth}px`;
      }

      this.el.classList.remove('item-sliding-ionic-confirm-item-in');
      this.el.classList.add('item-sliding-ionic-confirm-item-back');
      this.item.style.transform = 'translate3d(0, 0, 0)';
      await this.delay(480, signal);
    } catch {
      // Animation was aborted. finally handles cleanup.
    } finally {
      this.animationAbortController = undefined;

      this.el.classList.remove('item-sliding-ionic-confirm-item-in', 'item-sliding-ionic-confirm-item-back');
      if (this.item) {
        this.item.style.transform = '';
      }
      this.resetIonicExpandableOptions();
      this.openAmount = 0;
      this.state = SlidingState.Disabled;

      if (openSlidingItem === this.el) {
        openSlidingItem = undefined;
      }

      if (this.gesture) {
        this.gesture.enable(!this.disabled);
      }
    }
  }

  private async updateOptions() {
    const options = this.el.querySelectorAll('ion-item-options');

    let sides = 0;

    // Reset left and right options in case they were removed
    this.leftOptions = this.rightOptions = undefined;

    for (let i = 0; i < options.length; i++) {
      const item = options.item(i);

      /**
       * We cannot use the componentOnReady helper
       * util here since we need to wait for all of these items
       * to be ready before we set `this.sides` and `this.optsDirty`.
       */
      // eslint-disable-next-line custom-rules/no-component-on-ready-method
      const option = (item as any).componentOnReady !== undefined ? await item.componentOnReady() : item;

      const side = isEndSide(option.side ?? option.getAttribute('side')) ? 'end' : 'start';

      if (side === 'start') {
        this.leftOptions = option;
        sides |= ItemSide.Start;
      } else {
        this.rightOptions = option;
        sides |= ItemSide.End;
      }
    }
    this.optsDirty = true;
    this.sides = sides;
  }

  private canStart(gesture: GestureDetail): boolean {
    /**
     * If very close to start of the screen
     * do not open left side so swipe to go
     * back will still work.
     */
    const rtl = document.dir === 'rtl';
    const atEdge = rtl ? window.innerWidth - gesture.startX < 15 : gesture.startX < 15;
    if (atEdge) {
      return false;
    }

    const selected = openSlidingItem;
    if (selected && selected !== this.el) {
      this.closeOpened();
    }

    return !!(this.rightOptions || this.leftOptions);
  }

  private onStart() {
    /**
     * We need to query for the ion-item
     * every time the gesture starts. Developers
     * may toggle ion-item elements via *ngIf.
     */
    this.item = this.el.querySelector('ion-item');

    const { contentEl } = this;
    if (contentEl) {
      this.initialContentScrollY = disableContentScrollY(contentEl);
    }

    openSlidingItem = this.el;

    if (this.tmr !== undefined) {
      clearTimeout(this.tmr);
      this.tmr = undefined;
    }
    if (this.openAmount === 0) {
      this.optsDirty = true;
      this.state = SlidingState.Enabled;
    }
    this.initialOpenAmount = this.openAmount;
    if (this.item) {
      if (this.isIonicTheme()) {
        this.el.classList.remove('item-sliding-transition-open', 'item-sliding-transition-snapback');
      } else {
        this.el.classList.add('item-sliding-dragging');
      }
    }
  }

  private onMove(gesture: GestureDetail) {
    if (this.optsDirty) {
      this.calculateOptsWidth();
    }
    let openAmount = this.initialOpenAmount - gesture.deltaX;

    switch (this.sides) {
      case ItemSide.End:
        openAmount = Math.max(0, openAmount);
        break;
      case ItemSide.Start:
        openAmount = Math.min(0, openAmount);
        break;
      case ItemSide.Both:
        break;
      case ItemSide.None:
        return;
      default:
        printIonWarning('[ion-item-sliding] - invalid ItemSideFlags value', this.sides);
        break;
    }

    if (this.isIonicTheme()) {
      if (openAmount > this.optsWidthRightSide) {
        const overDrag = openAmount - this.optsWidthRightSide;
        openAmount = this.optsWidthRightSide + overDrag * IONIC_ELASTIC_FACTOR;
      } else if (openAmount < -this.optsWidthLeftSide) {
        const overDrag = openAmount + this.optsWidthLeftSide;
        openAmount = -this.optsWidthLeftSide + overDrag * IONIC_ELASTIC_FACTOR;
      }
    } else {
      let optsWidth: number;
      if (openAmount > this.optsWidthRightSide) {
        optsWidth = this.optsWidthRightSide;
        openAmount = optsWidth + (openAmount - optsWidth) * ELASTIC_FACTOR;
      } else if (openAmount < -this.optsWidthLeftSide) {
        optsWidth = -this.optsWidthLeftSide;
        openAmount = optsWidth + (openAmount - optsWidth) * ELASTIC_FACTOR;
      }
    }

    this.setOpenAmount(openAmount, false);
  }

  private onEnd(gesture: GestureDetail) {
    this.el.classList.remove('item-sliding-dragging');
    this.restoreContentScrollAfterSlide();
    if (this.isIonicTheme()) {
      this.onEndIonic(gesture);
    } else {
      this.onEndNative(gesture);
    }
  }

  private restoreContentScrollAfterSlide() {
    const { contentEl, initialContentScrollY } = this;
    if (contentEl) {
      resetContentScrollY(contentEl, initialContentScrollY);
    }
  }

  private onEndNative(gesture: GestureDetail) {
    // Check for full swipe conditions with expandable options
    const rawSwipeDistance = Math.abs(gesture.deltaX);
    const direction = gesture.deltaX < 0 ? 'end' : 'start';
    const options = direction === 'end' ? this.rightOptions : this.leftOptions;
    const hasExpandable = this.hasExpandableOptions(options);

    const shouldTriggerFullSwipe =
      hasExpandable &&
      (rawSwipeDistance > this.getSwipeThreshold(direction) ||
        (Math.abs(gesture.velocityX) > 0.5 &&
          rawSwipeDistance > (direction === 'end' ? this.optsWidthRightSide : this.optsWidthLeftSide) * 0.5));

    if (shouldTriggerFullSwipe) {
      this.animateFullSwipe(direction).catch(() => {
        if (this.gesture) {
          this.gesture.enable(!this.disabled);
        }
      });
      return;
    }

    const velocity = gesture.velocityX;

    let restingPoint = this.openAmount > 0 ? this.optsWidthRightSide : -this.optsWidthLeftSide;

    // Check if the drag didn't clear the buttons mid-point
    // and we aren't moving fast enough to swipe open
    const isResetDirection = this.openAmount > 0 === !(velocity < 0);
    const isMovingFast = Math.abs(velocity) > 0.3;
    const isOnCloseZone = Math.abs(this.openAmount) < Math.abs(restingPoint / 2);
    if (swipeShouldReset(isResetDirection, isMovingFast, isOnCloseZone)) {
      restingPoint = 0;
    }

    const state = this.state;
    this.setOpenAmount(restingPoint, true);

    if ((state & SlidingState.SwipeEnd) !== 0 && this.rightOptions) {
      this.rightOptions.fireSwipeEvent();
    } else if ((state & SlidingState.SwipeStart) !== 0 && this.leftOptions) {
      this.leftOptions.fireSwipeEvent();
    }
  }

  private onEndIonic(gesture: GestureDetail) {
    const velocity = gesture.velocityX;
    const velocityX = velocity * 1000;
    const activeDirection = this.getOpenDirectionFromAmount(this.openAmount);
    if (activeDirection === undefined) {
      this.setOpenAmount(0, true);
      return;
    }

    const optionsWidth = this.getOptionsWidthForDirection(activeDirection);
    const extraWidth = Math.max(0, Math.abs(this.openAmount) - optionsWidth);
    const hasExpandable = this.hasExpandableOptions(activeDirection === 'end' ? this.rightOptions : this.leftOptions);

    const closeDirection =
      activeDirection === 'end'
        ? velocityX > IONIC_FULL_SWIPE_VELOCITY_THRESHOLD
        : velocityX < -IONIC_FULL_SWIPE_VELOCITY_THRESHOLD;

    if (closeDirection) {
      this.setOpenAmount(0, true);
      return;
    }

    if (
      hasExpandable &&
      (extraWidth >= IONIC_EXPAND_TRIGGER || Math.abs(velocityX) > IONIC_FULL_SWIPE_VELOCITY_THRESHOLD)
    ) {
      this.animateIonicFullSwipe(activeDirection).catch(() => {
        if (this.gesture) {
          this.gesture.enable(!this.disabled);
        }
      });
      return;
    }

    const flickOpen =
      activeDirection === 'end'
        ? velocityX < -IONIC_OPEN_VELOCITY_THRESHOLD
        : velocityX > IONIC_OPEN_VELOCITY_THRESHOLD;

    const fullOpen = activeDirection === 'end' ? this.optsWidthRightSide : -this.optsWidthLeftSide;
    const openThreshold = optionsWidth * IONIC_SNAP_OPEN_RATIO;
    const shouldSnapOpen = flickOpen || Math.abs(this.openAmount) > openThreshold;
    const restingPoint = shouldSnapOpen ? fullOpen : 0;

    this.setOpenAmount(restingPoint, true);
  }

  private calculateOptsWidth() {
    this.optsWidthRightSide = 0;
    if (this.rightOptions) {
      this.rightOptions.style.display = 'flex';
      this.optsWidthRightSide = this.rightOptions.offsetWidth;
      const rightExpandable = this.queryExpandableOption(this.rightOptions);
      if (rightExpandable) {
        rightExpandable.style.width = '';
        this.rightExpandableBaseWidth = Math.max(
          IONIC_ACTION_BASE_WIDTH,
          rightExpandable.getBoundingClientRect().width
        );
      }
      this.rightOptions.style.display = '';
    }

    this.optsWidthLeftSide = 0;
    if (this.leftOptions) {
      this.leftOptions.style.display = 'flex';
      this.optsWidthLeftSide = this.leftOptions.offsetWidth;
      const leftExpandable = this.queryExpandableOption(this.leftOptions);
      if (leftExpandable) {
        leftExpandable.style.width = '';
        this.leftExpandableBaseWidth = Math.max(IONIC_ACTION_BASE_WIDTH, leftExpandable.getBoundingClientRect().width);
      }
      this.leftOptions.style.display = '';
    }

    this.optsDirty = false;
  }

  private setOpenAmount(openAmount: number, isFinal: boolean) {
    if (this.tmr !== undefined) {
      clearTimeout(this.tmr);
      this.tmr = undefined;
    }
    if (!this.item) {
      return;
    }

    const { el } = this;
    const style = this.item.style;
    const previousOpenAmount = this.openAmount;
    this.openAmount = openAmount;

    if (this.isIonicTheme()) {
      this.updateIonicExpandableFromOpenAmount(openAmount, isFinal, previousOpenAmount);
    }

    if (this.isIonicTheme() && isFinal) {
      const closing = Math.abs(openAmount) < Math.abs(previousOpenAmount);
      if (closing) {
        this.el.classList.add('item-sliding-transition-snapback');
      } else {
        this.el.classList.add('item-sliding-transition-open');
      }
    }

    if (openAmount > 0) {
      const fullSwipe = !this.isIonicTheme() && openAmount >= this.optsWidthRightSide + SWIPE_MARGIN;
      this.state = fullSwipe ? SlidingState.End | SlidingState.SwipeEnd : SlidingState.End;
    } else if (openAmount < 0) {
      const fullSwipe = !this.isIonicTheme() && openAmount <= -this.optsWidthLeftSide - SWIPE_MARGIN;
      this.state = fullSwipe ? SlidingState.Start | SlidingState.SwipeStart : SlidingState.Start;
    } else {
      el.classList.add('item-sliding-closing');
      if (this.gesture) {
        this.gesture.enable(false);
      }
      this.tmr = setTimeout(() => {
        this.state = SlidingState.Disabled;
        this.tmr = undefined;
        if (this.gesture) {
          this.gesture.enable(!this.disabled);
        }
        el.classList.remove('item-sliding-closing');
      }, 600);

      openSlidingItem = undefined;
      style.transform = '';
      return;
    }

    style.transform = `translate3d(${-openAmount}px,0,0)`;
    this.ionDrag.emit({
      amount: openAmount,
      ratio: this.getSlidingRatioSync(),
    });
  }

  private getSlidingRatioSync(): number {
    if (this.openAmount > 0) {
      return this.openAmount / this.optsWidthRightSide;
    } else if (this.openAmount < 0) {
      return this.openAmount / this.optsWidthLeftSide;
    } else {
      return 0;
    }
  }

  render() {
    const theme = getIonTheme(this);
    return (
      <Host
        class={{
          [theme]: true,
          'item-sliding-active-slide': this.state !== SlidingState.Disabled,
          'item-sliding-active-options-end': (this.state & SlidingState.End) !== 0,
          'item-sliding-active-options-start': (this.state & SlidingState.Start) !== 0,
          'item-sliding-active-swipe-end': (this.state & SlidingState.SwipeEnd) !== 0,
          'item-sliding-active-swipe-start': (this.state & SlidingState.SwipeStart) !== 0,
        }}
      ></Host>
    );
  }
}

const swipeShouldReset = (isResetDirection: boolean, isMovingFast: boolean, isOnResetZone: boolean): boolean => {
  // The logic required to know when the sliding item should close (openAmount=0)
  // depends on three booleans (isResetDirection, isMovingFast, isOnResetZone)
  // and it ended up being too complicated to be written manually without errors
  // so the truth table is attached below: (0=false, 1=true)
  // isResetDirection | isMovingFast | isOnResetZone || shouldClose
  //         0        |       0      |       0       ||    0
  //         0        |       0      |       1       ||    1
  //         0        |       1      |       0       ||    0
  //         0        |       1      |       1       ||    0
  //         1        |       0      |       0       ||    0
  //         1        |       0      |       1       ||    1
  //         1        |       1      |       0       ||    1
  //         1        |       1      |       1       ||    1
  // The resulting expression was generated by resolving the K-map (Karnaugh map):
  return (!isMovingFast && isOnResetZone) || (isResetDirection && isMovingFast);
};
