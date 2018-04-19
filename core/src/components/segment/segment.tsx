import { Component, Element, Event, EventEmitter, Listen, Prop, Watch } from '@stencil/core';
import { Mode } from '../..';


@Component({
  tag: 'ion-segment',
  styleUrls: {
    ios: 'segment.ios.scss',
    md: 'segment.md.scss'
  },
  host: {
    theme: 'segment'
  }
})
export class Segment {

  @Element() el!: HTMLElement;

  /**
   * The color to use for the text color.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   */
  @Prop() color!: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /*
   * If true, the user cannot interact with the segment. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * the value of the segment.
   */
  @Prop({ mutable: true }) value?: string;

  @Watch('value')
  protected valueChanged(value: string | undefined) {
    this.selectButton();
    this.ionChange.emit({value});
  }

  /**
   * Emitted when the value property has changed.
   */
  @Event() ionChange!: EventEmitter;

  @Listen('ionClick')
  segmentClick(ev: CustomEvent) {
    const selectedButton = ev.target as HTMLIonSegmentButtonElement;
    this.value = selectedButton.value;
  }

  componentDidLoad() {
    this.selectButton();
  }

  private selectButton() {
    const value = this.value;
    const buttons = Array.from(this.el.querySelectorAll('ion-segment-button'));
    for (const button of buttons) {
      button.activated = (button.value === value);

      // If there is no value set on the segment and a button
      // is checked we should activate it
      if (!value && button.checked) {
        button.activated = button.checked;
      }
    }
  }

  hostData() {
    return {
      class: {
        'segment-disabled': this.disabled
      }
    };
  }

}
