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
  // TODO typing
  buttons: any;

  @Element() private el: HTMLElement;

  /**
   * @output {Event} Emitted when the value property has changed.
   */
  @Event() ionChange: EventEmitter;

  /**
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /*
   * @input {boolean} If true, the user cannot interact with the segment. Default false.
   */
  @Prop({ mutable: true }) disabled: boolean = false;

  /**
   * @input {string} the value of the segment.
   */
  @Prop({ mutable: true }) value: string;

  @Watch('value')
  protected valueChanged(val: string) {
    this.selectButton(val);
  }

  componentDidLoad() {
    this.buttons = this.el.querySelectorAll('ion-segment-button');

    for (var i = 0; i < this.buttons.length; i++) {
      const button = this.buttons[i];

      button.activated = (button.value === this.value);

      // If there is no value set on the segment and a button
      // is checked we should activate it
      if (!this.value && button.checked) {
        button.activated = button.checked;
      }
    }
  }

  @Listen('ionClick')
  segmentClick(ev: CustomEvent) {
    let selectedButton = ev.detail.segmentButton;

    this.value = selectedButton.value;
    this.selectButton(this.value);

    // TODO should this move to valueChanged
    this.ionChange.emit({ segment: this });
  }

  selectButton(val: string) {
    for (var i = 0; i < this.buttons.length; i++) {
      const button = this.buttons[i];
      button.activated = (button.value === val);
    }

    // returning true tells the renderer to queue an update
    return true;
  }

  hostData() {
    return {
      class: {
        'segment-disabled': this.disabled
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}

export interface SegmentEvent extends Event {
  detail: {
    segment: Segment;
  };
}
