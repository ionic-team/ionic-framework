import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Listen, Prop, State, Watch, h, writeTask } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, SegmentChangeEventDetail, StyleEventDetail } from '../../interface';
import { Gesture, GestureDetail } from '../../utils/gesture';
import { createColorClasses } from '../../utils/theme';

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
   */
  @Prop() scrollable = false;

  /**
   * the value of the segment.
   */
  @Prop({ mutable: true }) value?: string | null;

  /**
   * Emitted when the value property has changed.
   */
  @Event() ionChange!: EventEmitter<SegmentChangeEventDetail>;

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  @Watch('value')
  protected valueChanged(value: string | undefined) {
    if (this.didInit) {
      this.updateButtons();
      this.ionChange.emit({ value });
    }
  }

  @Watch('disabled')
  disabledChanged() {
    if (this.gesture) {
      this.gesture.setDisabled(this.disabled);
    }
  }

  @Listen('ionSelect')
  segmentClick(ev: CustomEvent) {
    const button = ev.target as HTMLIonSegmentButtonElement;
    this.value = button.value;
  }

  connectedCallback() {
    if (this.value === undefined) {
      const checked = this.getButtons().find(b => b.checked);
      if (checked) {
        this.value = checked.value;
      }
    }
    this.emitStyle();
  }

  componentWillLoad() {
    this.emitStyle();
  }

  async componentDidLoad() {
    this.updateButtons();
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

    this.setNextIndex(detail, true);

    detail.event.preventDefault();
    detail.event.stopImmediatePropagation();
  }

  private activate(detail: GestureDetail) {
    const clicked = detail.event.target as HTMLIonSegmentButtonElement;
    const buttons = this.getButtons();
    const checked = buttons.find(button => button.checked === true);

    // Make sure we are only checking for activation on a segment button
    // since disabled buttons will get the click on the segment
    if (clicked.tagName !== 'ION-SEGMENT-BUTTON') {
      return;
    }

    // If there are no checked buttons, set the current button to checked
    if (!checked) {
      clicked.checked = true;
    }

    // If the gesture began on the clicked button with the indicator
    // then we should activate the indicator
    if (clicked.checked) {
      this.activated = true;
    }

    this.activateIndicator();
  }

  private activateIndicator() {
    const activated = this.activated;
    const buttons = this.getButtons();
    const clicked = buttons.find(button => button.checked === true);
    const mode = getIonMode();

    if (!clicked) {
      return;
    }

    const indicator = this.getIndicator(clicked);

    if (!indicator) {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (activated && mode === 'ios' && !reduceMotion) {
      indicator.style.setProperty('transform', 'scale(0.95)');
    } else {
      indicator.style.setProperty('transform', '');
    }
  }

  private getIndicator(button: HTMLIonSegmentButtonElement): HTMLDivElement | null {
    return button.shadowRoot && button.shadowRoot.querySelector('.segment-checked-indicator');
  }

  private checkButton(clicked: HTMLIonSegmentButtonElement, checked: HTMLIonSegmentButtonElement) {
    const activated = this.activated;
    const mode = getIonMode(this);
    const currentIndicator = this.getIndicator(clicked);
    const previousIndicator = this.getIndicator(checked);

    if (previousIndicator === null || currentIndicator === null) {
      return;
    }

    const previousClientRect = previousIndicator.getBoundingClientRect();
    const currentClientRect = currentIndicator.getBoundingClientRect();
    const widthDelta = previousClientRect.width / currentClientRect.width;
    const xPosition = previousClientRect.left - currentClientRect.left;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scale iOS smaller when activated
    const activatedScale = widthDelta * 0.95;

    // Scale the indicator smaller if the gesture started on it, the mode is
    // ios, and the user does not have reduced motion on
    const transform = activated && mode === 'ios' && !reduceMotion
      ? `translate3d(${xPosition}px, 0, 0) scaleX(${activatedScale}) scaleY(0.95)`
      : `translate3d(${xPosition}px, 0, 0) scaleX(${widthDelta})`;

    // Clear the z-index when the transition ends
    const endHandler = () => {
      checked.style.setProperty('z-index', '');
      currentIndicator.removeEventListener('transitionend', endHandler);
    };
    currentIndicator.addEventListener('transitionend', endHandler);

    writeTask(() => {
      // When the current indicator transition begins, we need to set the z-index
      // to 1 on the previous button so that when the indicator moves over the text
      // is still on top
      checked.style.setProperty('z-index', '1');

      // Remove the transition before positioning on top of the old indicator
      currentIndicator.classList.remove('segment-checked-indicator-animated');
      currentIndicator.style.setProperty('transform', transform);

      // Force a repaint to ensure the transform happens
      currentIndicator.getBoundingClientRect();

      // Add the transition to move the indicator into place
      currentIndicator.classList.add('segment-checked-indicator-animated');
      if (activated && mode === 'ios' && !reduceMotion) {
        currentIndicator.style.setProperty('transform', 'scale(0.95)');
      } else {
        currentIndicator.style.setProperty('transform', '');
      }
    });

    clicked.checked = true;
    this.setCheckedClasses();
  }

  private setCheckedClasses() {
    const buttons = this.getButtons();
    const index = buttons.findIndex(button => button.checked === true);
    const next = index + 1;

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
    const index = buttons.findIndex(button => button.checked === true);
    const startEl = buttons[index];

    if (index === -1) {
      return;
    }

    const currentX = detail.currentX;

    // Get the element that the touch event started on in case
    // it was the checked button, then we will move the indicator
    const rect = startEl.getBoundingClientRect();
    const left = rect.left;
    const width = rect.width;

    let nextIndex;

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
    }

    // If the indicator is not activated then we will just set the indicator
    // where the gesture ended
    if (!activated && isEnd) {
      if (decreaseIndex) {
        const diff = Math.abs(Math.ceil((left - currentX) / width));
        const newIndex = index - diff;

        if (newIndex >= 0) {
          nextIndex = newIndex;
        }
      } else if (increaseIndex) {
        const diff = Math.abs(Math.floor((currentX - left) / width));
        const newIndex = index + diff;

        if (newIndex < buttons.length) {
          nextIndex = newIndex;
        }
      }
    }

    if (isEnd) {
      this.activateIndicator();
    }

    if (nextIndex === undefined || buttons[nextIndex].disabled) {
      return;
    }

    const clicked = buttons[nextIndex];
    const checked = buttons[index];

    this.checkButton(clicked, checked);
  }

  private emitStyle() {
    this.ionStyle.emit({
      'segment': true
    });
  }

  private updateButtons() {
    const value = this.value;
    for (const button of this.getButtons()) {
      button.checked = (button.value === value);
    }
  }

  private getButtons() {
    return Array.from(this.el.querySelectorAll('ion-segment-button'));
  }

  render() {
    const mode = getIonMode(this);

    return (
      <Host
        class={{
          ...createColorClasses(this.color),
          [mode]: true,
          'segment-disabled': this.disabled,
          'segment-scrollable': this.scrollable
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
