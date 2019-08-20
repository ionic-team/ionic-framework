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
  scoped: true
})
export class Segment implements ComponentInterface {
  private gesture?: Gesture;
  private indicatorEl!: HTMLDivElement | undefined;
  private nextIndex?: number;

  private didInit = false;

  private animated = false;

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
  valueChanged(value: string | undefined) {
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

  componentDidRender() {
    this.calculateIndicatorPosition();
  }

  onStart(detail: GestureDetail) {
    this.activate(detail);
  }

  onMove(detail: GestureDetail) {
    this.setNextIndex(detail, false);
  }

  onEnd(detail: GestureDetail) {
    this.setNextIndex(detail, true);

    this.activated = false;

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
  }

  private calculateIndicatorPosition() {
    const mode = getIonMode(this);
    const indicator = this.indicatorEl;
    const activated = this.activated;
    const buttons = this.getButtons();
    const index = buttons.findIndex(button => button.value === this.value);

    // If there is no indicator rendered or there is no checked button
    // then don't move the indicator's position
    if (!indicator || index === -1) {
      return;
    }

    // Transform the indicator based on the index of the button
    const left = `${(index * 100)}%`;
    const width = `calc(${1 / buttons.length * 100}%)`;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scale the indicator smaller if the gesture started on it, the mode is
    // ios, and the user does not have reduced motion on
    const transform = activated && mode === 'ios' && !reduceMotion
      ? `translate3d(${left}, 0, 0) scale(0.95)`
      : `translate3d(${left}, 0, 0)`;

    writeTask(() => {
      const indicatorStyle = indicator.style;

      indicatorStyle.width = width;
      indicatorStyle.transform = transform;
      indicatorStyle.display = `block`;
    });

    // After the indicator is set for the first time
    // we can animate it between the segment buttons
    this.animated = true;
  }

  // TODO width is off for the very left and very right of buttons
  private setNextIndex(detail: GestureDetail, isEnd: boolean) {
    const activated = this.activated;
    const buttons = this.getButtons();
    const index = this.nextIndex !== undefined ? this.nextIndex : buttons.findIndex(button => button.checked === true);
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

    let nextIndex = this.nextIndex;

    // If the indicator is currently activated then we have started the gesture
    // on top of the checked button so we need to slide the indicator
    // by checking the button next to it as we move
    if (activated && !isEnd) {
      if (currentX < left) {
        const newIndex = index - 1;

        if (newIndex >= 0) {
          nextIndex = newIndex;
        }
      } else if (currentX > (left + width)) {
        const newIndex = index + 1;

        if (newIndex < buttons.length) {
          nextIndex = newIndex;
        }
      }
    }

    // If the indicator is not activated then we will just set the indicator
    // where the gesture ended
    if (!activated && isEnd) {
      if (currentX < left) {
        const diff = Math.ceil((left - currentX) / width);
        const newIndex = index - diff;

        if (newIndex >= 0) {
          nextIndex = newIndex;
        }
      } else if (currentX > (left + width)) {
        const diff = Math.floor((currentX - left) / width);
        const newIndex = index + diff;

        if (newIndex < buttons.length) {
          nextIndex = newIndex;
        }
      }
    }

    if (nextIndex !== undefined && !buttons[nextIndex].disabled) {
      buttons[nextIndex].checked = true;
    }
    this.nextIndex = nextIndex;
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
        <div
          part="indicator"
          class={{
            'segment-checked-indicator': true,
            'segment-checked-indicator-animated': this.animated
          }}
          ref={el => this.indicatorEl = el}
        >
          <div class="segment-checked-indicator-background"></div>
        </div>
      </Host>
    );
  }
}
