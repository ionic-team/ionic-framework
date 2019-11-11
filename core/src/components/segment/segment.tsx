import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Listen, Prop, Watch, h } from '@stencil/core';

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

  @Element() el!: HTMLElement;

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
    const selectedButton = ev.target as HTMLIonSegmentButtonElement;
    this.value = selectedButton.value;
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
      </Host>
    );
  }
}
