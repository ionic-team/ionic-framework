import { Component, Element, Event, EventEmitter, Listen, Prop, Watch } from '@stencil/core';
import { Color, InputChangeEvent, Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';


@Component({
  tag: 'ion-segment',
  styleUrls: {
    ios: 'segment.ios.scss',
    md: 'segment.md.scss'
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
    this.updateButtons();
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
      const checked = this.getButtons().find(b => b.checked);
      if (checked) {
        this.value = checked.value;
      }
    }
    this.updateButtons();
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

  hostData() {
    return {
      class: {
        ...createThemedClasses(this.mode, this.color, 'segment'),
        'segment-disabled': this.disabled
      }
    };
  }

}
