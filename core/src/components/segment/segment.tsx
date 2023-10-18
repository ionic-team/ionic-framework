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

  @Element() el!: HTMLIonSegmentElement;

  @State() activated = false;

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
  protected valueChanged(value: SegmentValue | undefined) {
    /**
     * `ionSelect` is emitted every time the value changes (internal or external changes).
     * Used by `ion-segment-button` to determine if the button should be checked.
     */
    this.ionSelect.emit({ value });
    this.scrollActiveButtonIntoView();
  }

  /**
   * If `true`, navigating to an `ion-segment-button` with the keyboard will focus and select the element.
   * If `false`, keyboard navigation will only focus the `ion-segment-button` element.
   */
  @Prop() selectOnFocus = false;

  /**
   * Emitted when the value property has changed and any
   * dragging pointer has been released from `ion-segment`.
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
        this.emitValueChange();
      }
    }
    this.valueBeforeGesture = undefined;
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

  private getButtons() {
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
      if (activated) {
        button.classList.add('segment-button-activated');
      } else {
        button.classList.remove('segment-button-activated');
      }
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

    this.value = current.value;

    if (current !== previous) {
      this.emitValueChange();
    }

    if (this.scrollable || !this.swipeGesture) {
      if (previous) {
        this.checkButton(previous, current);
      } else {
        this.setCheckedClasses();
      }
    }
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
        <slot></slot>
      </Host>
    );
  }
}
