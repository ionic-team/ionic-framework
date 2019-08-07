import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Listen, Prop, State, Watch, h } from '@stencil/core';

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

  private didInit = false;

  @Element() el!: HTMLIonSegmentElement;

  @State() canAnimate = false;

  /**
   * If `true`, the segment button indicator will animate between
   * checked segment buttons.
   * Defaults to `true`.
   */
  @Prop() animated = true;

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
    if (this.canAnimate && this.animated) {
      this.animateIndicator();
    }
    this.calculateIndicatorPosition(button);
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

  private animateIndicator() {
    const indicator = this.el.querySelector('.segment-checked-indicator') as HTMLElement;
    const transition = getComputedStyle(indicator).getPropertyValue('--indicator-transition');
    indicator.style.transition = transition;
  }

  private async calculateIndicatorPosition(selectedButton: HTMLIonSegmentButtonElement) {
    await this.el.componentOnReady();

    const buttons = this.getButtons();
    const index = buttons.findIndex(button => button.value === selectedButton.value);

    const indicator = await this.el.querySelector('.segment-checked-indicator') as HTMLElement;

    const left = `${(index * 100)}%`;
    const width = `calc(${1 / buttons.length * 100}%)`;

    if (indicator) {
      indicator.style.width = `${width}`;
      indicator.style.transform = `translate3d(${left}, 0, 0)`;
      indicator.style.display = `block`;
    }

    // After the indicator is set for the first time
    // we can animate it between the segment buttons
    this.canAnimate = true;
  }

  private emitStyle() {
    this.ionStyle.emit({
      'segment': true
    });
  }

  private updateButtons() {
    const value = this.value;
    for (const button of this.getButtons()) {
      const checked = (button.value === value);
      button.checked = checked;
      if (checked) {
        this.calculateIndicatorPosition(button);
      }
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
        <div class="segment-checked-indicator">
          <div class="segment-checked-indicator-background"></div>
        </div>
      </Host>
    );
  }
}
