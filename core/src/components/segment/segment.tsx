import { Component, Element, Event, EventEmitter, Listen, Prop, Watch } from '@stencil/core';
import { Color, InputChangeEvent, Mode } from '../../interface';


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
  @Prop() color?: Color;

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
    this.update();
    this.ionChange.emit({value});
  }

  /**
   * Emitted when the value property has changed.
   */
  @Event() ionChange!: EventEmitter<InputChangeEvent>;

  @Listen('ionSelect')
  segmentClick(ev: CustomEvent) {
    const selectedButton = ev.target as HTMLIonSegmentButtonElement;
    this.value = selectedButton.value;
  }

  componentDidLoad() {
    if (this.value === undefined) {
      const buttons = Array.from(this.el.querySelectorAll('ion-segment-button'));
      const checked = buttons.find(b => b.checked);
      if (checked) {
        this.value = checked.value;
      }
    }
    this.update();
  }

  private update() {
    const value = this.value;
    const buttons = Array.from(this.el.querySelectorAll('ion-segment-button'));
    for (const button of buttons) {
      button.checked = (button.value === value);
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
