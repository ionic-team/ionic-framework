import { Component, Element, Event, EventEmitter, Prop, Watch } from '@stencil/core';
import { Color, Mode } from '../../interface';
import { createColorClasses } from '../../utils/theme';

let ids = 0;

@Component({
  tag: 'ion-segment-button',
  styleUrl: 'segment-button.scss',
  shadow: true
})
export class SegmentButton {

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

  /**
   * If true, the segment button is selected. Defaults to `false`.
   */
  @Prop({mutable: true}) checked = false;

  /*
   * If true, the user cannot interact with the segment button. Default false.
   */
  @Prop() disabled = false;

  /**
   * The value of the segment button.
   */
  @Prop() value: string = 'ion-sb-' + (ids++);

  /**
   * Emitted when the segment button is clicked.
   */
  @Event() ionSelect!: EventEmitter<void>;

  @Watch('checked')
  checkedChanged(checked: boolean, prev: boolean) {
    if (checked && !prev) {
      this.ionSelect.emit();
    }
  }

  hostData() {
    const { disabled, checked, color } = this;
    return {
      class: {
        ...createColorClasses(color),
        'segment-button-disabled': disabled,
        'segment-checked': checked,
      },
      'tappable': true,
    };
  }

  render() {
    return [
      <button
        aria-pressed={this.checked}
        class="segment-button-native"
        disabled={this.disabled}
        onClick={() => this.checked = true }>
          <slot></slot>
          { this.mode === 'md' && <ion-ripple-effect tapClick={true} parent={this.el}/> }
      </button>
    ];
  }
}
