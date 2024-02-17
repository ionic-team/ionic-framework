import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, Method, State, Watch, forceUpdate, h } from '@stencil/core';
import type { ButtonInterface } from '@utils/element-interface';
import type { Attributes } from '@utils/helpers';
import { addEventListener, removeEventListener, inheritAttributes } from '@utils/helpers';
import { hostContext } from '@utils/theme';

import { getIonTheme } from '../../global/ionic-global';
import type { SegmentValue } from '../segment/segment-interface';

import type { SegmentButtonLayout } from './segment-button-interface';

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
    md: 'segment-button.md.scss',
    ionic: 'segment-button.md.scss',
  },
  shadow: true,
})
export class SegmentButton implements ComponentInterface, ButtonInterface {
  private segmentEl: HTMLIonSegmentElement | null = null;
  private nativeEl: HTMLButtonElement | undefined;
  private inheritedAttributes: Attributes = {};

  @Element() el!: HTMLElement;

  @State() checked = false;

  /**
   * If `true`, the user cannot interact with the segment button.
   */
  @Prop({ mutable: true }) disabled = false;

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
  @Prop() value: SegmentValue = 'ion-sb-' + ids++;
  @Watch('value')
  valueChanged() {
    this.updateState();
  }

  connectedCallback() {
    const segmentEl = (this.segmentEl = this.el.closest('ion-segment'));
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

  componentWillLoad() {
    this.inheritedAttributes = {
      ...inheritAttributes(this.el, ['aria-label']),
    };
  }

  private get hasLabel() {
    return !!this.el.querySelector('ion-label');
  }

  private get hasIcon() {
    return !!this.el.querySelector('ion-icon');
  }

  private updateStyle = () => {
    forceUpdate(this);
  };

  private updateState = () => {
    const { segmentEl } = this;

    if (segmentEl) {
      this.checked = segmentEl.value === this.value;

      if (segmentEl.disabled) {
        this.disabled = true;
      }
    }
  };

  /**
   * @internal
   * Focuses the native <button> element
   * inside of ion-segment-button.
   */
  @Method()
  async setFocus() {
    const { nativeEl } = this;

    if (nativeEl !== undefined) {
      nativeEl.focus();
    }
  }

  render() {
    const { checked, type, disabled, hasIcon, hasLabel, layout, segmentEl } = this;
    const theme = getIonTheme(this);
    const hasSegmentColor = () => segmentEl?.color !== undefined;
    return (
      <Host
        class={{
          [theme]: true,
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
          aria-selected={checked ? 'true' : 'false'}
          role="tab"
          ref={(el) => (this.nativeEl = el)}
          type={type}
          class="button-native"
          part="native"
          disabled={disabled}
          {...this.inheritedAttributes}
        >
          <span class="button-inner">
            <slot></slot>
          </span>
          {theme === 'md' && <ion-ripple-effect></ion-ripple-effect>}
        </button>
        <div
          part="indicator"
          class={{
            'segment-button-indicator': true,
            'segment-button-indicator-animated': true,
          }}
        >
          <div part="indicator-background" class="segment-button-indicator-background"></div>
        </div>
      </Host>
    );
  }
}
