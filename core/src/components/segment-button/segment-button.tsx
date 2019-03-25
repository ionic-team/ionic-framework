import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Prop, Watch } from '@stencil/core';

import { Mode, SegmentButtonLayout } from '../../interface';

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

  @Listen('click')
  onClick() {
    this.checked = true;
  }

  private get hasLabel() {
    return !!this.el.querySelector('ion-label');
  }

  private get hasIcon() {
    return !!this.el.querySelector('ion-icon');
  }

  hostData() {
    const { checked, disabled, hasIcon, hasLabel, layout } = this;
    return {
      'aria-disabled': disabled ? 'true' : null,
      class: {
        [`${this.mode}`]: true,
        'segment-button-has-label': hasLabel,
        'segment-button-has-icon': hasIcon,
        'segment-button-has-label-only': hasLabel && !hasIcon,
        'segment-button-has-icon-only': hasIcon && !hasLabel,
        'segment-button-disabled': disabled,
        'segment-button-checked': checked,
        [`segment-button-layout-${layout}`]: true,
        'ion-activatable': true,
        'ion-activatable-instant': true,
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
      >
        <slot></slot>
        {this.mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </button>,
      <div class="segment-button-indicator"></div>
    ];
  }
}
