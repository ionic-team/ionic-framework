import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Prop, State, Watch, h, writeTask } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, SegmentChangeEventDetail, StyleEventDetail } from '../../interface';
import { Gesture, GestureDetail } from '../../utils/gesture';
import { pointerCoord } from '../../utils/helpers';
import { createColorClasses, hostContext } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-segment',
  styleUrls: {
    ios: 'segment.ios.scss',
    md: 'segment.md.scss'
  },
  shadow: true
})
export class Segment implements ComponentInterface {
  private gesture?: Gesture;
  private didInit = false;
  private checked?: HTMLIonSegmentButtonElement;

  @Element() el!: HTMLIonSegmentElement;

  @State() activated = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

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
   * the value of the segment.
   */
  @Prop({ mutable: true }) value?: string | null;

  @Watch('value')
  protected valueChanged(value: string | undefined) {
    if (this.didInit) {
      this.ionChange.emit({ value });
    }
  }

  /**
   * Emitted when the value property has changed.
   */
  @Event() ionChange!: EventEmitter<SegmentChangeEventDetail>;

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  @Watch('disabled')
  disabledChanged() {
    if (this.gesture && !this.scrollable) {
      this.gesture.enable(!this.disabled);
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

    this.gesture = (await import('../../utils/gesture')).createGesture({
      el: this.el,
      gestureName: 'segment',
      gesturePriority: 100,
      threshold: 0,
      passive: false,
      onStart: ev => this.onStart(ev),
      onMove: ev => this.onMove(ev),
      onEnd: ev => this.onEnd(ev),
    });
    this.gesture.enable(!this.scrollable);
    this.disabledChanged();
    this.didInit = true;
  }

  onStart(detail: GestureDetail) {
    this.activate(detail);
  }

  onMove(detail: GestureDetail) {
    this.setNextIndex(detail);
  }

  onEnd(detail: GestureDetail) {
    this.activated = false;

    const checkedValidButton = this.setNextIndex(detail, true);

    detail.event.preventDefault();
    detail.event.stopImmediatePropagation();

    if (checkedValidButton) {
      this.addRipple(detail);
    }
  }

  private getButtons() {
    return Array.from(this.el.querySelectorAll('ion-segment-button'));
  }

  /**
   * The gesture blocks the segment button ripple. This
   * function adds the ripple based on the checked segment
   * and where the cursor ended.
   */
  private addRipple(detail: GestureDetail) {
    const buttons = this.getButtons();
    const checked = buttons.find(button => button.value === this.value);

    const ripple = checked!.shadowRoot!.querySelector('ion-ripple-effect');

    if (!ripple) { return; }

    const { x, y } = pointerCoord(detail.event);

    ripple.addRipple(x, y).then(remove => remove());
  }

  private activate(detail: GestureDetail) {
    const clicked = detail.event.target as HTMLIonSegmentButtonElement;
    const buttons = this.getButtons();
    const checked = buttons.find(button => button.value === this.value);

    // Make sure we are only checking for activation on a segment button
    // since disabled buttons will get the click on the segment
    if (clicked.tagName !== 'ION-SEGMENT-BUTTON') {
      return;
    }

    // If there are no checked buttons, set the current button to checked
    if (!checked) {
      this.value = clicked.value;
    }

    // If the gesture began on the clicked button with the indicator
    // then we should activate the indicator
    if (this.value === clicked.value) {
      this.activated = true;
    }
  }

  private getIndicator(button: HTMLIonSegmentButtonElement): HTMLDivElement | null {
    return button.shadowRoot && button.shadowRoot.querySelector('.segment-button-indicator');
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
    const index = buttons.findIndex(button => button.value === this.value);
    const next = index + 1;

    // Keep track of the currently checked button
    this.checked = buttons.find(button => button.value === this.value);

    for (const button of buttons) {
      button.classList.remove('segment-button-after-checked');
    }
    if (next < buttons.length) {
      buttons[next].classList.add('segment-button-after-checked');
    }
  }

  private setNextIndex(detail: GestureDetail, isEnd = false) {
    const isRTL = document.dir === 'rtl';
    const activated = this.activated;
    const buttons = this.getButtons();
    const index = buttons.findIndex(button => button.value === this.value);
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
    const previousY = rect.y;
    const nextEl = document.elementFromPoint(currentX, previousY) as HTMLIonSegmentButtonElement;

    const decreaseIndex = isRTL ? currentX > (left + width) : currentX < left;
    const increaseIndex = isRTL ? currentX < left : currentX > (left + width);

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

    /* tslint:disable-next-line */
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
      'segment': true
    });
  }

  private onClick = (ev: Event) => {
    const current = ev.target as HTMLIonSegmentButtonElement;
    const previous = this.checked;
    this.value = current.value;

    if (previous && this.scrollable) {
      this.checkButton(previous, current);
    }

    this.checked = current;
  }

  render() {
    const mode = getIonMode(this);

    return (
      <Host
        onClick={this.onClick}
        class={{
          ...createColorClasses(this.color),
          [mode]: true,
          'in-toolbar': hostContext('ion-toolbar', this.el),
          'in-toolbar-color': hostContext('ion-toolbar[color]', this.el),
          'segment-activated': this.activated,
          'segment-disabled': this.disabled,
          'segment-scrollable': this.scrollable
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
