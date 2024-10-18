import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Listen, Prop, State, Watch, h, writeTask } from '@stencil/core';
import type { Gesture, GestureDetail } from '@utils/gesture';
import { raf } from '@utils/helpers';
import { isRTL } from '@utils/rtl';
import { createColorClasses, hostContext } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { Color, StyleEventDetail } from '../../interface';

import type { SegmentChangeEventDetail, SegmentValue } from './segment-interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-segment',
  styleUrls: {
    ios: 'segment.ios.scss',
    md: 'segment.md.scss',
  },
  shadow: true,
})
export class Segment implements ComponentInterface {
  private gesture?: Gesture;

  // Value before the segment is dragged
  private valueBeforeGesture?: SegmentValue;

  private segmentViewEl?: HTMLIonSegmentViewElement | null = null;

  private nextButtonIndex?: number;

  private io?: IntersectionObserver;

  @Element() el!: HTMLIonSegmentElement;

  @State() activated = false;

  /**
   * The `id` of the `segment-view` element to be associated with this segment.
   */
  @Prop() segmentViewId?: string;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;
  @Watch('color')
  protected colorChanged(value?: Color, oldValue?: Color) {
    /**
     * If color is set after not having
     * previously been set (or vice versa),
     * we need to emit style so the segment-buttons
     * can apply their color classes properly.
     */
    if ((oldValue === undefined && value !== undefined) || (oldValue !== undefined && value === undefined)) {
      this.emitStyle();
    }
  }

  /**
   * If `true`, the user cannot interact with the segment.
   */
  @Prop() disabled = false;

  /**
   * If `true`, the segment buttons will overflow and the user can swipe to see them.
   * In addition, this will disable the gesture to drag the indicator between the buttons
   * in order to swipe to see hidden buttons.
   */
  @Prop() scrollable = false;

  /**
   * If `true`, users will be able to swipe between segment buttons to activate them.
   */
  @Prop() swipeGesture = true;

  @Watch('swipeGesture')
  swipeGestureChanged() {
    this.gestureChanged();
  }

  /**
   * the value of the segment.
   */
  @Prop({ mutable: true }) value?: SegmentValue;

  @Watch('value')
  protected valueChanged(value: SegmentValue | undefined, oldValue?: SegmentValue | undefined) {
    if (oldValue !== undefined && value !== undefined) {
      const buttons = this.getButtons();
      const previous = buttons.find((button) => button.value === oldValue);
      const current = buttons.find((button) => button.value === value);

      if (previous && current) {
        if (!this.segmentViewEl) {
          this.checkButton(previous, current);
        } else {
          this.setCheckedClasses();
        }
      }
    }

    /**
     * `ionSelect` is emitted every time the value changes (internal or external changes).
     * Used by `ion-segment-button` to determine if the button should be checked.
     */
    this.ionSelect.emit({ value });

    // The scroll listener should handle scrolling the active button into view as needed when there is a segment view
    if (!this.segmentViewEl) {
      this.scrollActiveButtonIntoView();
    }
  }

  /**
   * If `true`, navigating to an `ion-segment-button` with the keyboard will focus and select the element.
   * If `false`, keyboard navigation will only focus the `ion-segment-button` element.
   */
  @Prop() selectOnFocus = false;

  /**
   * Emitted when the value property has changed and any dragging pointer has been released from `ion-segment`.
   *
   * This event will not emit when programmatically setting the `value` property.
   */
  @Event() ionChange!: EventEmitter<SegmentChangeEventDetail>;

  /**
   * Emitted when the value of the segment changes from user committed actions
   * or from externally assigning a value.
   *
   * @internal
   */
  @Event() ionSelect!: EventEmitter<SegmentChangeEventDetail>;

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  @Watch('disabled')
  disabledChanged() {
    this.gestureChanged();

    const buttons = this.getButtons();
    for (const button of buttons) {
      button.disabled = this.disabled;
    }
  }

  private gestureChanged() {
    if (this.gesture) {
      this.gesture.enable(!this.scrollable && !this.disabled && this.swipeGesture);
    }
  }

  connectedCallback() {
    this.emitStyle();

    this.segmentViewEl = this.getSegmentView();

    if (this.segmentViewEl) {
      // Disable each button indicator when using a segment view
      // Instead, a single indicator instance will be used
      this.getButtons().forEach((ref) => (ref.hasIndicator = false));

      this.addIntersectionObserver();
    }
  }

  disconnectedCallback() {
    this.segmentViewEl = null;
    if (this.io) {
      this.io.disconnect();
      this.io = undefined;
    }
  }

  componentWillLoad() {
    this.emitStyle();
  }

  async componentDidLoad() {
    this.setCheckedClasses();

    /**
     * We need to wait for the buttons to all be rendered
     * before we can scroll.
     */
    raf(() => {
      /**
       * When the segment loads for the first
       * time we just want to snap the active button into
       * place instead of scroll. Smooth scrolling should only
       * happen when the user interacts with the segment.
       */
      this.scrollActiveButtonIntoView(false);
    });

    this.gesture = (await import('../../utils/gesture')).createGesture({
      el: this.el,
      gestureName: 'segment',
      gesturePriority: 100,
      threshold: 0,
      passive: false,
      onStart: (ev) => this.onStart(ev),
      onMove: (ev) => this.onMove(ev),
      onEnd: (ev) => this.onEnd(ev),
    });
    this.gestureChanged();

    if (this.disabled) {
      this.disabledChanged();
    }
  }

  onStart(detail: GestureDetail) {
    this.valueBeforeGesture = this.value;
    this.activate(detail);
  }

  onMove(detail: GestureDetail) {
    this.setNextIndex(detail);
  }

  onEnd(detail: GestureDetail) {
    this.setActivated(false);

    this.setNextIndex(detail, true);

    detail.event.stopImmediatePropagation();

    const value = this.value;
    if (value !== undefined) {
      if (this.valueBeforeGesture !== value) {
        if (this.segmentViewEl) {
          this.updateSegmentView(value);
        } else {
          this.emitValueChange();
        }
      }
    }
    this.valueBeforeGesture = undefined;
  }

  private distanceToButton(index: number) {
    const buttons = this.getButtons();
    const button = buttons[index];

    return button.offsetLeft;
  }

  private addIntersectionObserver() {
    if (
      typeof (window as any) !== 'undefined' &&
      'IntersectionObserver' in window &&
      'IntersectionObserverEntry' in window &&
      'isIntersecting' in window.IntersectionObserverEntry.prototype
    ) {
      this.io = new IntersectionObserver((data) => {
        /**
         * On slower devices, it is possible for an intersection observer entry to contain multiple
         * objects in the array. This happens when quickly scrolling an image into view and then out of
         * view. In this case, the last object represents the current state of the component.
         */
        if (data[data.length - 1].isIntersecting) {
          this.updateSegmentView(this.value!, false);
          this.initIndicator();
        }
      });

      this.io.observe(this.el);
    }
  }

  private initIndicator() {
    writeTask(() => {
      if (this.segmentViewEl) {
        const buttons = this.getButtons();
        const activeButtonIndex = buttons.findIndex((ref) => ref.value === this.value);
        if (activeButtonIndex >= 0) {
          const activeButtonPosition = buttons[activeButtonIndex].getBoundingClientRect();
          const activeButtonStyles = getComputedStyle(buttons[activeButtonIndex]);
          const indicator = this.el.shadowRoot!.querySelector('.segment-indicator') as HTMLDivElement | null;
          if (indicator) {
            const startingX = this.distanceToButton(activeButtonIndex);

            indicator.style.width = `${activeButtonPosition.width}px`;
            indicator.style.left = `${startingX}px`;

            // Setting a CSS variable works around issue where background element might not be rendered yet
            this.el.style.setProperty('--indicator-color', activeButtonStyles.getPropertyValue('--indicator-color'));
          }
        }
      }
    });
  }

  /**
   * Emits an `ionChange` event.
   *
   * This API should be called for user committed changes.
   * This API should not be used for external value changes.
   */
  private emitValueChange() {
    const { value } = this;
    this.ionChange.emit({ value });
  }

  private getButtons(): HTMLIonSegmentButtonElement[] {
    return Array.from(this.el.querySelectorAll('ion-segment-button'));
  }

  private get checked() {
    return this.getButtons().find((button) => button.value === this.value);
  }

  /*
   * Activate both the segment and the buttons
   * due to a bug with ::slotted in Safari
   */
  private setActivated(activated: boolean) {
    const buttons = this.getButtons();

    buttons.forEach((button) => {
      button.classList.toggle('segment-button-activated', activated);
    });
    this.activated = activated;
  }

  private activate(detail: GestureDetail) {
    const clicked = detail.event.target as HTMLIonSegmentButtonElement;
    const buttons = this.getButtons();
    const checked = buttons.find((button) => button.value === this.value);

    // Make sure we are only checking for activation on a segment button
    // since disabled buttons will get the click on the segment
    if (clicked.tagName !== 'ION-SEGMENT-BUTTON') {
      return;
    }

    // If there are no checked buttons, set the current button to checked
    if (!checked) {
      this.value = clicked.value;
      this.setCheckedClasses();
    }

    // If the gesture began on the clicked button with the indicator
    // then we should activate the indicator
    if (this.value === clicked.value) {
      this.setActivated(true);
    }
  }

  private getIndicator(button: HTMLIonSegmentButtonElement): HTMLDivElement | null {
    const root = button.shadowRoot || button;
    return root.querySelector('.segment-button-indicator');
  }

  private checkButton(previous: HTMLIonSegmentButtonElement, current: HTMLIonSegmentButtonElement) {
    const previousIndicator = this.getIndicator(previous);
    const currentIndicator = this.getIndicator(current);

    if (previousIndicator === null || currentIndicator === null) {
      return;
    }

    const previousClientRect = previousIndicator.getBoundingClientRect();
    const currentClientRect = currentIndicator.getBoundingClientRect();

    const widthDelta = previousClientRect.width / currentClientRect.width;
    const xPosition = previousClientRect.left - currentClientRect.left;

    // Scale the indicator width to match the previous indicator width
    // and translate it on top of the previous indicator
    const transform = `translate3d(${xPosition}px, 0, 0) scaleX(${widthDelta})`;

    writeTask(() => {
      // Remove the transition before positioning on top of the previous indicator
      currentIndicator.classList.remove('segment-button-indicator-animated');
      currentIndicator.style.setProperty('transform', transform);

      // Force a repaint to ensure the transform happens
      currentIndicator.getBoundingClientRect();

      // Add the transition to move the indicator into place
      currentIndicator.classList.add('segment-button-indicator-animated');

      // Remove the transform to slide the indicator back to the button clicked
      currentIndicator.style.setProperty('transform', '');
    });

    this.value = current.value;
    this.setCheckedClasses();
  }

  private setCheckedClasses() {
    const buttons = this.getButtons();
    const index = buttons.findIndex((button) => button.value === this.value);
    const next = index + 1;

    for (const button of buttons) {
      button.classList.remove('segment-button-after-checked');
    }
    if (next < buttons.length) {
      buttons[next].classList.add('segment-button-after-checked');
    }
  }

  private getSegmentView() {
    if (!this.segmentViewId) {
      return null;
    }

    const segmentViewEl = document.getElementById(this.segmentViewId);

    if (!segmentViewEl) {
      console.warn(`Segment: Unable to find 'ion-segment-view' with id="${this.segmentViewId}"`);
      return null;
    }

    if (segmentViewEl.tagName !== 'ION-SEGMENT-VIEW') {
      console.warn(`Segment: Element with id="${this.segmentViewId}" is not an <ion-segment-view> element.`);
      return null;
    }

    return segmentViewEl as HTMLIonSegmentViewElement;
  }

  @Listen('ionSegmentViewScroll', { target: 'body' })
  handleSegmentViewScroll(ev: CustomEvent) {
    const dispatchedFrom = ev.target as HTMLElement;
    const segmentViewEl = this.segmentViewEl as EventTarget;
    const segmentEl = this.el;

    // Only update the indicator if the event was dispatched from the correct segment view
    if (ev.composedPath().includes(segmentViewEl) || dispatchedFrom?.contains(segmentEl)) {
      const buttons = this.getButtons();
      const currentIndex = buttons.findIndex((button) => button.value === this.value);
      const currentButton = buttons[currentIndex];
      const indicator = this.el.shadowRoot!.querySelector('.segment-indicator') as HTMLDivElement | null;

      // If no buttons are found or there is no value set then do nothing
      if (!buttons.length || this.value === undefined || !indicator) return;

      const { scrollDistancePercentage, scrollDistance } = ev.detail;

      const findIndexFrom = (
        array: HTMLIonSegmentButtonElement[],
        predicate: (button: HTMLIonSegmentButtonElement) => boolean,
        startIndex: number
      ) => {
        for (let i = startIndex; i < array.length; i++) {
          if (predicate(array[i])) {
            return i;
          }
        }
        return -1;
      };

      const findIndexFromReverse = (
        array: HTMLIonSegmentButtonElement[],
        predicate: (button: HTMLIonSegmentButtonElement) => boolean,
        startIndex: number
      ) => {
        for (let i = startIndex; i >= 0; i--) {
          if (predicate(array[i])) {
            return i;
          }
        }
        return -1;
      };

      // Find the next valid button (i.e. we need to ignore any disabled buttons)
      const nextIndex =
        this.nextButtonIndex ??
        (scrollDistance > 0
          ? findIndexFrom(buttons, (ref) => !ref.disabled, currentIndex + 1)
          : findIndexFromReverse(buttons, (ref) => !ref.disabled, currentIndex - 1));

      if (nextIndex >= 0 && nextIndex < buttons.length) {
        // Figure out the number of disabled buttons between the current and next button
        const disabledButtons = (
          nextIndex > currentIndex ? buttons.slice(currentIndex, nextIndex) : buttons.slice(nextIndex, currentIndex)
        ).filter((button) => button.disabled).length;

        // Adjust the scroll distance percentage based on the number of "views" scrolled
        // We need to do this because all subsequent calculations are based on the assumption that
        // only one view can be scrolled at a time, but this is not the case when clicking a segment button
        const adjustedScrollDistancePercentage =
          scrollDistancePercentage / (Math.abs(nextIndex - currentIndex) - disabledButtons);

        const nextButton = buttons[nextIndex];
        const nextButtonWidth = nextButton.getBoundingClientRect().width;

        const currentButtonWidth = currentButton.getBoundingClientRect().width;

        // Scale the width based on the width of the next button
        const diff = nextButtonWidth - currentButtonWidth;
        const width = currentButtonWidth + diff * adjustedScrollDistancePercentage;
        const indicatorStyles = getComputedStyle(indicator);
        const indicatorPadding =
          parseFloat(indicatorStyles.paddingLeft.replace('px', '')) +
          parseFloat(indicatorStyles.paddingRight.replace('px', ''));
        indicator.style.width = `${width - indicatorPadding}px`;

        // Translate the indicator based on the scroll distance
        const distanceToNextButton = this.distanceToButton(nextIndex);
        const distanceToCurrentButton = this.distanceToButton(currentIndex);
        indicator.style.left =
          scrollDistance > 0
            ? `${
                distanceToCurrentButton +
                (distanceToNextButton - distanceToCurrentButton) * adjustedScrollDistancePercentage
              }px`
            : `${
                distanceToCurrentButton -
                (distanceToCurrentButton - distanceToNextButton) * adjustedScrollDistancePercentage
              }px`;

        const standardize_color = (str: string) => {
          const ctx = document.createElement('canvas').getContext('2d');
          ctx!.fillStyle = str;
          return ctx!.fillStyle;
        };
        // Helper function to convert hex to RGB
        const hexToRgb = (hex: string) => {
          const bigint = parseInt(hex.slice(1), 16);
          const r = (bigint >> 16) & 255;
          const g = (bigint >> 8) & 255;
          const b = bigint & 255;

          return { r, g, b };
        };
        // Helper function to convert RGB to hex
        const rgbToHex = (r: number, g: number, b: number) => {
          const componentToHex = (c: number) => {
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
          };

          return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
        };
        // Function to calculate the color in between based on percentage
        const interpolateColor = (percentage = adjustedScrollDistancePercentage) => {
          const currentColor = standardize_color(getComputedStyle(currentButton).getPropertyValue('--indicator-color'));
          const nextColor = standardize_color(getComputedStyle(nextButton).getPropertyValue('--indicator-color'));

          const rgb1 = hexToRgb(currentColor);
          const rgb2 = hexToRgb(nextColor);

          const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * percentage);
          const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * percentage);
          const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * percentage);

          return rgbToHex(r, g, b);
        };
        indicator.querySelector('div')!.style.backgroundColor = interpolateColor();

        if (this.scrollable) {
          // Scroll the segment container so the indicator is always in view
          indicator.scrollIntoView({
            behavior: 'instant',
          });
        }
      }
    }
  }

  @Listen('ionSegmentViewScrollEnd', { target: 'body' })
  onScrollEnd(ev: CustomEvent<{ activeContentId: string }>) {
    const dispatchedFrom = ev.target as HTMLElement;
    const segmentViewEl = this.segmentViewEl as EventTarget;
    const segmentEl = this.el;

    if (ev.composedPath().includes(segmentViewEl) || dispatchedFrom?.contains(segmentEl)) {
      this.value = ev.detail.activeContentId;
      this.nextButtonIndex = undefined;
      this.emitValueChange();
    }
  }

  /**
   * Finds the related segment view and sets its current content
   * based on the selected segment button. This method
   * should be called on initial load of the segment,
   * after the gesture is completed (if dragging between segments)
   * and when a segment button is clicked directly.
   */
  private updateSegmentView(value: SegmentValue, smoothScroll = true) {
    const buttons = this.getButtons();
    const button = buttons.find((btn) => btn.value === value);

    // If the button does not have a contentId then there is
    // no associated segment view to update
    if (!button?.contentId) {
      return;
    }

    if (this.segmentViewEl) {
      this.segmentViewEl.setContent(button.contentId, smoothScroll);
    }
  }

  private scrollActiveButtonIntoView(smoothScroll = true) {
    const { scrollable, value, el } = this;

    if (scrollable) {
      const buttons = this.getButtons();
      const activeButton = buttons.find((button) => button.value === value);
      if (activeButton !== undefined) {
        const scrollContainerBox = el.getBoundingClientRect();
        const activeButtonBox = activeButton.getBoundingClientRect();

        /**
         * Subtract the active button x position from the scroll
         * container x position. This will give us the x position
         * of the active button within the scroll container.
         */
        const activeButtonLeft = activeButtonBox.x - scrollContainerBox.x;

        /**
         * If we just used activeButtonLeft, then the active button
         * would be aligned with the left edge of the scroll container.
         * Instead, we want the segment button to be centered. As a result,
         * we subtract half of the scroll container width. This will position
         * the left edge of the active button at the midpoint of the scroll container.
         * We then add half of the active button width. This will position the active
         * button such that the midpoint of the active button is at the midpoint of the
         * scroll container.
         */
        const centeredX = activeButtonLeft - scrollContainerBox.width / 2 + activeButtonBox.width / 2;

        /**
         * We intentionally use scrollBy here instead of scrollIntoView
         * to avoid a WebKit bug where accelerated animations break
         * when using scrollIntoView. Using scrollIntoView will cause the
         * segment container to jump during the transition and then snap into place.
         * This is because scrollIntoView can potentially cause parent element
         * containers to also scroll. scrollBy does not have this same behavior, so
         * we use this API instead.
         *
         * Note that if there is not enough scrolling space to center the element
         * within the scroll container, the browser will attempt
         * to center by as much as it can.
         */
        el.scrollBy({
          top: 0,
          left: centeredX,
          behavior: smoothScroll ? 'smooth' : 'instant',
        });
      }
    }
  }

  private setNextIndex(detail: GestureDetail, isEnd = false) {
    const rtl = isRTL(this.el);
    const activated = this.activated;
    const buttons = this.getButtons();
    const index = buttons.findIndex((button) => button.value === this.value);
    const previous = buttons[index];
    let current;
    let nextIndex;

    if (index === -1) {
      return;
    }

    // Get the element that the touch event started on in case
    // it was the checked button, then we will move the indicator
    const rect = previous.getBoundingClientRect() as DOMRect;
    const left = rect.left;
    const width = rect.width;

    // Get the element that the gesture is on top of based on the currentX of the
    // gesture event and the Y coordinate of the starting element, since the gesture
    // can move up and down off of the segment
    const currentX = detail.currentX;

    const previousY = rect.top + rect.height / 2;

    /**
     * Segment can be used inside the shadow dom
     * so doing document.elementFromPoint would never
     * return a segment button in that instance.
     * We use getRootNode to which will return the parent
     * shadow root if used inside a shadow component and
     * returns document otherwise.
     */
    const root = this.el.getRootNode() as Document | ShadowRoot;
    const nextEl = root.elementFromPoint(currentX, previousY) as HTMLIonSegmentButtonElement;

    const decreaseIndex = rtl ? currentX > left + width : currentX < left;
    const increaseIndex = rtl ? currentX < left : currentX > left + width;

    // If the indicator is currently activated then we have started the gesture
    // on top of the checked button so we need to slide the indicator
    // by checking the button next to it as we move
    if (activated && !isEnd) {
      // Decrease index, move left in LTR & right in RTL
      if (decreaseIndex) {
        const newIndex = index - 1;

        if (newIndex >= 0) {
          nextIndex = newIndex;
        }
        // Increase index, moves right in LTR & left in RTL
      } else if (increaseIndex) {
        if (activated && !isEnd) {
          const newIndex = index + 1;

          if (newIndex < buttons.length) {
            nextIndex = newIndex;
          }
        }
      }

      if (nextIndex !== undefined && !buttons[nextIndex].disabled) {
        current = buttons[nextIndex];
      }
    }

    // If the indicator is not activated then we will just set the indicator
    // to the element where the gesture ended
    if (!activated && isEnd) {
      current = nextEl;
    }

    if (current != null) {
      /**
       * If current element is ion-segment then that means
       * user tried to select a disabled ion-segment-button,
       * and we should not update the ripple.
       */
      if (current.tagName === 'ION-SEGMENT') {
        return false;
      }

      if (previous !== current) {
        this.checkButton(previous, current);
      }
    }

    return true;
  }

  private emitStyle() {
    this.ionStyle.emit({
      segment: true,
    });
  }

  private onClick = (ev: Event) => {
    const current = ev.target as HTMLIonSegmentButtonElement;
    const previous = this.checked;

    // If the current element is a segment then that means
    // the user tried to swipe to a segment button and
    // click a segment button at the same time so we should
    // not update the checked segment button
    if (current.tagName === 'ION-SEGMENT') {
      return;
    }

    if (current !== previous) {
      if (this.segmentViewEl) {
        this.nextButtonIndex = this.getButtons().findIndex((button) => button.value === current.value);
        this.updateSegmentView(current.value);
      } else {
        this.value = current.value;
        this.emitValueChange();
      }
    }

    if (this.scrollable || !this.swipeGesture) {
      if (previous) {
        this.checkButton(previous, current);
      } else {
        this.setCheckedClasses();
      }
    }
  };

  private onSlottedItemsChange = () => {
    /**
     * When the slotted segment buttons change we need to
     * ensure that the new segment buttons are checked if
     * the value matches the segment button value.
     */
    this.valueChanged(this.value);
  };

  private getSegmentButton = (selector: 'first' | 'last' | 'next' | 'previous'): HTMLIonSegmentButtonElement | null => {
    const buttons = this.getButtons().filter((button) => !button.disabled);
    const currIndex = buttons.findIndex((button) => button === document.activeElement);

    switch (selector) {
      case 'first':
        return buttons[0];
      case 'last':
        return buttons[buttons.length - 1];
      case 'next':
        return buttons[currIndex + 1] ?? buttons[0];
      case 'previous':
        return buttons[currIndex - 1] ?? buttons[buttons.length - 1];
      default:
        return null;
    }
  };

  @Listen('keydown')
  onKeyDown(ev: KeyboardEvent) {
    const rtl = isRTL(this.el);
    let keyDownSelectsButton = this.selectOnFocus;
    let current;
    switch (ev.key) {
      case 'ArrowRight':
        ev.preventDefault();
        current = rtl ? this.getSegmentButton('previous') : this.getSegmentButton('next');
        break;
      case 'ArrowLeft':
        ev.preventDefault();
        current = rtl ? this.getSegmentButton('next') : this.getSegmentButton('previous');
        break;
      case 'Home':
        ev.preventDefault();
        current = this.getSegmentButton('first');
        break;
      case 'End':
        ev.preventDefault();
        current = this.getSegmentButton('last');
        break;
      case ' ':
      case 'Enter':
        ev.preventDefault();
        current = document.activeElement as HTMLIonSegmentButtonElement;
        keyDownSelectsButton = true;
      default:
        break;
    }

    if (!current) {
      return;
    }

    if (keyDownSelectsButton) {
      const previous = this.checked;
      this.checkButton(previous || current, current);
      if (current !== previous) {
        this.emitValueChange();
      }
    }
    current.setFocus();
  }

  render() {
    const mode = getIonMode(this);
    return (
      <Host
        role="tablist"
        onClick={this.onClick}
        class={createColorClasses(this.color, {
          [mode]: true,
          'in-toolbar': hostContext('ion-toolbar', this.el),
          'in-toolbar-color': hostContext('ion-toolbar[color]', this.el),
          'segment-activated': this.activated,
          'segment-disabled': this.disabled,
          'segment-scrollable': this.scrollable,
        })}
      >
        {this.segmentViewEl && (
          <div part="indicator" class="segment-indicator">
            <div part="indicator-background" class="segment-indicator-background"></div>
          </div>
        )}
        <slot onSlotchange={this.onSlottedItemsChange}></slot>
      </Host>
    );
  }
}
