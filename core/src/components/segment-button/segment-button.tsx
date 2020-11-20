import { Component, ComponentInterface, Element, Host, Prop, State, forceUpdate, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { SegmentButtonLayout } from '../../interface';
import { ButtonInterface } from '../../utils/element-interface';
import { addEventListener, removeEventListener } from '../../utils/helpers';
import { hostContext } from '../../utils/theme';

let ids = 0;

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part native - The native HTML button element that wraps all child elements.
 * @part indicator - The indicator displayed on the checked segment button.
 * @part indicator-background - The background element for the indicator displayed on the checked segment button.
 */
@Component({
  tag: 'ion-segment-button',
  styleUrls: {
    ios: 'segment-button.ios.scss',
    md: 'segment-button.md.scss'
  },
  shadow: true
})
export class SegmentButton implements ComponentInterface, ButtonInterface {
  private segmentEl: HTMLIonSegmentElement | null = null;

  @Element() el!: HTMLElement;

  @State() checked = false;

  /**
   * If `true`, the user cannot interact with the segment button.
   */
  @Prop() disabled = false;

  /**
   * Set the layout of the text and icon in the segment.
   */
  @Prop() layout?: SegmentButtonLayout = 'icon-top';

  /**
   * The type of the button.
   */
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  /**
   * The value of the segment button.
   */
  @Prop() value: string = 'ion-sb-' + (ids++);

  connectedCallback() {
    const segmentEl = this.segmentEl = this.el.closest('ion-segment');
    if (segmentEl) {
      this.updateState();
      addEventListener(segmentEl, 'ionSelect', this.updateState);
      addEventListener(segmentEl, 'ionStyle', this.updateStyle);
    }
  }

  disconnectedCallback() {
    const segmentEl = this.segmentEl;
    if (segmentEl) {
      removeEventListener(segmentEl, 'ionSelect', this.updateState);
      removeEventListener(segmentEl, 'ionStyle', this.updateStyle);
      this.segmentEl = null;
    }
  }

  private get hasLabel() {
    return !!this.el.querySelector('ion-label');
  }

  private get hasIcon() {
    return !!this.el.querySelector('ion-icon');
  }

  private updateStyle = () => {
    forceUpdate(this);
  }

  private updateState = () => {
    if (this.segmentEl) {
      this.checked = this.segmentEl.value === this.value;
    }
  }

  render() {
    const { checked, type, disabled, hasIcon, hasLabel, layout, segmentEl } = this;
    const mode = getIonMode(this);
    const hasSegmentColor = () => segmentEl !== null && segmentEl.color !== undefined;
    return (
      <Host
        aria-disabled={disabled ? 'true' : null}
        class={{
          [mode]: true,
          'in-toolbar': hostContext('ion-toolbar', this.el),
          'in-toolbar-color': hostContext('ion-toolbar[color]', this.el),
          'in-segment': hostContext('ion-segment', this.el),
          'in-segment-color': hasSegmentColor(),
          'segment-button-has-label': hasLabel,
          'segment-button-has-icon': hasIcon,
          'segment-button-has-label-only': hasLabel && !hasIcon,
          'segment-button-has-icon-only': hasIcon && !hasLabel,
          'segment-button-disabled': disabled,
          'segment-button-checked': checked,
          [`segment-button-layout-${layout}`]: true,
          'ion-activatable': true,
          'ion-activatable-instant': true,
          'ion-focusable': true,
        }}
      >
        <button
          type={type}
          aria-pressed={checked ? 'true' : 'false'}
          class="button-native"
          part="native"
          disabled={disabled}
        >
          <span class="button-inner">
            <slot></slot>
          </span>
          {mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
        </button>
        <div
          part="indicator"
          class={{
            'segment-button-indicator': true,
            'segment-button-indicator-animated': true
          }}
        >
          <div part="indicator-background" class="segment-button-indicator-background"></div>
        </div>

      </Host>
    );
  }
}
