import { Component, Element, Event, EventEmitter, Listen, Prop, Watch } from '@stencil/core';


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
  @Element() private el: HTMLElement;

  /**
   * The color to use for the text color.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode: 'ios' | 'md';

  /*
   * If true, the user cannot interact with the segment. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * the value of the segment.
   */
  @Prop({ mutable: true }) value: string;

  @Watch('value')
  protected valueChanged(val: string) {
    this.selectButton(val);
    this.ionChange.emit();
  }

  /**
   * Emitted when the value property has changed.
   */
  @Event() ionChange: EventEmitter;


  componentDidLoad() {
    this.selectButton(this.value);
  }

  @Listen('ionClick')
  segmentClick(ev: CustomEvent) {
    const selectedButton = ev.target as HTMLIonSegmentButtonElement;

    this.value = selectedButton.value;
  }

  selectButton(val: string) {
    const buttons = this.el.querySelectorAll('ion-segment-button');

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];

      button.activated = (button.value === val);

      // If there is no value set on the segment and a button
      // is checked we should activate it
      if (!val && button.checked) {
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
