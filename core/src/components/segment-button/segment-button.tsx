import { Component, ComponentInterface, Element, Event, EventEmitter, Prop, Watch } from '@stencil/core';

import { Color, Mode, SegmentButtonLayout } from '../../interface';
import { createColorClasses } from '../../utils/theme';

let ids = 0;

@Component({
  tag: 'ion-segment-button',
  styleUrls: {
    ios: 'segment-button.ios.scss',
    md: 'segment-button.md.scss'
  },
  shadow: true
})
export class SegmentButton implements ComponentInterface {

  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  /**
   * If `true`, the segment button is selected.
   */
  @Prop({ mutable: true }) checked = false;

  /**
   * If `true`, the user cannot interact with the segment button.
   */
  @Prop() disabled = false;

  /**
   * Set the layout of the text and icon in the segment.
   */
  @Prop() layout?: SegmentButtonLayout = 'icon-top';

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

  private onClick = () => {
    this.checked = true;
  }

  private get hasLabel() {
    return !!this.el.querySelector('ion-label');
  }

  private get hasIcon() {
    return !!this.el.querySelector('ion-icon');
  }

  hostData() {
    const { disabled, checked, color, layout, hasIcon, hasLabel } = this;
    return {
      'ion-activatable': 'instant',
      'aria-disabled': disabled ? 'true' : null,
      class: {
        ...createColorClasses(color),
        'segment-button-has-label': hasLabel,
        'segment-button-has-icon': hasIcon,
        'segment-button-has-label-only': hasLabel && !hasIcon,
        'segment-button-has-icon-only': hasIcon && !hasLabel,
        'segment-button-disabled': disabled,
        'segment-button-checked': checked,
        [`segment-button-layout-${layout}`]: true
      }
    };
  }

  render() {
    return [
      <button
        type="button"
        aria-pressed={this.checked ? 'true' : null}
        class="button-native"
        disabled={this.disabled}
        onClick={this.onClick}
      >
        <slot></slot>
        {this.mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </button>,
      <div class="segment-button-indicator"></div>
    ];
  }
}
