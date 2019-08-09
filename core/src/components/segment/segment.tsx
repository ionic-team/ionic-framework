import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Listen, Prop, Watch, h, writeTask } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, SegmentChangeEventDetail, StyleEventDetail } from '../../interface';
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
  private indicatorEl!: HTMLDivElement | undefined;

  private didInit = false;

  private animated = false;

  @Element() el!: HTMLIonSegmentElement;

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

  @Watch('value')
  protected valueChanged(value: string | undefined) {
    if (this.didInit) {
      this.updateButtons();
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

  componentDidLoad() {
    this.updateButtons();
    this.didInit = true;
  }

  componentDidRender() {
    this.calculateIndicatorPosition();
  }

  private calculateIndicatorPosition() {
    const indicator = this.indicatorEl;

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

    // TODO if the button is already checked we
    // need to transform the scale on press
    writeTask(() => {
      const indicatorStyle = indicator.style;

      indicatorStyle.width = width;
      indicatorStyle.transform = `translate3d(${left}, 0, 0)`;
      indicatorStyle.display = `block`;
    });

    // After the indicator is set for the first time
    // we can animate it between the segment buttons
    this.animated = true;
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
