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
   * Emitted when the value property has changed.
   */
  @Event() ionChange: EventEmitter<SegmentEventDetail>;

  /**
   * The color to use for the text color.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode: 'ios' | 'md';

  /*
   * If true, the user cannot interact with the segment. Default false.
   */
  @Prop({ mutable: true }) disabled = false;

  /**
   * the value of the segment.
   */
  @Prop({ mutable: true }) value: string;

  @Watch('value')
  protected valueChanged(val: string) {
    this.selectButton(val);
  }

  componentDidLoad() {
    this.buttons = this.el.querySelectorAll('ion-segment-button');

    for (let i = 0; i < this.buttons.length; i++) {
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
    const selectedButton = ev.target as HTMLIonSegmentButtonElement;

    this.value = selectedButton.value;
    this.selectButton(this.value);

    // TODO should this move to valueChanged
    this.ionChange.emit();
  }

  selectButton(val: string) {
    for (let i = 0; i < this.buttons.length; i++) {
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

export interface SegmentEvent extends CustomEvent {
  detail: SegmentEventDetail;
}

export interface SegmentEventDetail {
}
