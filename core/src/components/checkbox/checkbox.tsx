import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, h } from '@stencil/core';
import type { Attributes } from '@utils/helpers';
import { inheritAriaAttributes, renderHiddenInput } from '@utils/helpers';
import { createColorClasses, hostContext } from '@utils/theme';

import { getIonTheme } from '../../global/ionic-global';
import type { Color, Theme } from '../../interface';

import type { CheckboxChangeEventDetail } from './checkbox-interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @slot - The label text to associate with the checkbox. Use the "labelPlacement" property to control where the label is placed relative to the checkbox.
 *
 * @part container - The container for the checkbox mark.
 * @part label - The label text describing the checkbox.
 * @part mark - The checkmark used to indicate the checked state.
 */
@Component({
  tag: 'ion-checkbox',
  styleUrls: {
    ios: 'checkbox.ios.scss',
    md: 'checkbox.md.scss',
    ionic: 'checkbox.ionic.scss',
  },
  shadow: true,
})
export class Checkbox implements ComponentInterface {
  private inputId = `ion-cb-${checkboxIds++}`;
  private focusEl?: HTMLElement;
  private inheritedAttributes: Attributes = {};

  @Element() el!: HTMLIonCheckboxElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * If `true`, the checkbox is selected.
   */
  @Prop({ mutable: true }) checked = false;

  /**
   * If `true`, the checkbox will visually appear as indeterminate.
   */
  @Prop({ mutable: true }) indeterminate = false;

  /**
   * If `true`, the user cannot interact with the checkbox.
   */
  @Prop() disabled = false;

  /**
   * The value of the checkbox does not mean if it's checked or not, use the `checked`
   * property for that.
   *
   * The value of a checkbox is analogous to the value of an `<input type="checkbox">`,
   * it's only used when the checkbox participates in a native `<form>`.
   */
  @Prop() value: any | null = 'on';

  /**
   * Where to place the label relative to the checkbox.
   * `"start"`: The label will appear to the left of the checkbox in LTR and to the right in RTL.
   * `"end"`: The label will appear to the right of the checkbox in LTR and to the left in RTL.
   * `"fixed"`: The label has the same behavior as `"start"` except it also has a fixed width. Long text will be truncated with ellipses ("...").
   * `"stacked"`: The label will appear above the checkbox regardless of the direction. The alignment of the label can be controlled with the `alignment` property.
   */
  @Prop() labelPlacement: 'start' | 'end' | 'fixed' | 'stacked' = 'start';

  /**
   * How to pack the label and checkbox within a line.
   * `"start"`: The label and checkbox will appear on the left in LTR and
   * on the right in RTL.
   * `"end"`: The label and checkbox will appear on the right in LTR and
   * on the left in RTL.
   * `"space-between"`: The label and checkbox will appear on opposite
   * ends of the line with space between the two elements.
   */
  @Prop() justify: 'start' | 'end' | 'space-between' = 'space-between';

  /**
   * How to control the alignment of the checkbox and label on the cross axis.
   * `"start"`: The label and control will appear on the left of the cross axis in LTR, and on the right side in RTL.
   * `"center"`: The label and control will appear at the center of the cross axis in both LTR and RTL.
   */
  @Prop() alignment: 'start' | 'center' = 'center';

  /**
   * If `true`, the checkbox will be presented with an error style when it is unchecked.
   */
  @Prop() required = false;

  /**
   * Set to `"soft"` for a checkbox with more rounded corners.
   */
  @Prop({ reflect: true }) shape?: 'soft' | 'rectangular' = 'soft';

  /**
   * Set to `"small"` for a checkbox with less height and padding or to `"default"`
   * for a checkbox with the default height and padding.
   */
  @Prop({ reflect: true }) size?: 'small' | 'default' = 'default';

  /**
   * Emitted when the checked property has changed
   * as a result of a user action such as a click.
   * This event will not emit when programmatically
   * setting the checked property.
   */
  @Event() ionChange!: EventEmitter<CheckboxChangeEventDetail>;

  /**
   * Emitted when the checkbox has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the checkbox loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  componentWillLoad() {
    this.inheritedAttributes = {
      ...inheritAriaAttributes(this.el),
    };
  }

  private setFocus() {
    if (this.focusEl) {
      this.focusEl.focus();
    }
  }

  /**
   * Sets the checked property and emits
   * the ionChange event. Use this to update the
   * checked state in response to user-generated
   * actions such as a click.
   */
  private setChecked = (state: boolean) => {
    const isChecked = (this.checked = state);
    this.ionChange.emit({
      checked: isChecked,
      value: this.value,
    });
  };

  private toggleChecked = (ev: Event) => {
    ev.preventDefault();

    this.setFocus();
    this.setChecked(!this.checked);
    this.indeterminate = false;
  };

  private onFocus = () => {
    this.ionFocus.emit();
  };

  private onBlur = () => {
    this.ionBlur.emit();
  };

  private onClick = (ev: MouseEvent) => {
    if (this.disabled) {
      return;
    }

    this.toggleChecked(ev);
  };

  render() {
    const {
      color,
      checked,
      disabled,
      el,
      getSVGPath,
      indeterminate,
      inheritedAttributes,
      inputId,
      justify,
      labelPlacement,
      name,
      value,
      alignment,
      required,
      size,
      shape,
    } = this;
    const theme = getIonTheme(this);

    const path = getSVGPath(theme, indeterminate);

    renderHiddenInput(true, el, name, checked ? value : '', disabled);

    return (
      <Host
        aria-checked={indeterminate ? 'mixed' : `${checked}`}
        class={createColorClasses(color, {
          [theme]: true,
          'in-item': hostContext('ion-item', el),
          'checkbox-checked': checked,
          'checkbox-disabled': disabled,
          'checkbox-indeterminate': indeterminate,
          interactive: true,
          [`checkbox-justify-${justify}`]: true,
          [`checkbox-alignment-${alignment}`]: true,
          [`checkbox-label-placement-${labelPlacement}`]: true,
          'checkbox-required': required,
          [`checkbox-${size}`]: true,
          [`checkbox-${shape}`]: true,
        })}
        onClick={this.onClick}
      >
        <label class="checkbox-wrapper">
          {/*
            The native control must be rendered
            before the visible label text due to https://bugs.webkit.org/show_bug.cgi?id=251951
          */}
          <input
            type="checkbox"
            checked={checked ? true : undefined}
            disabled={disabled}
            id={inputId}
            onChange={this.toggleChecked}
            onFocus={() => this.onFocus()}
            onBlur={() => this.onBlur()}
            ref={(focusEl) => (this.focusEl = focusEl)}
            {...inheritedAttributes}
          />
          <div
            class={{
              'label-text-wrapper': true,
              'label-text-wrapper-hidden': el.textContent === '',
            }}
            part="label"
          >
            <slot></slot>
          </div>
          <div class="native-wrapper">
            <svg class="checkbox-icon" viewBox="0 0 24 24" part="container">
              {path}
            </svg>
            {theme === 'ionic' && <div part="focus-ring" class="focus-ring"></div>}
          </div>
        </label>
      </Host>
    );
  }

  private getSVGPath(theme: Theme, indeterminate: boolean): HTMLElement {
    let path = indeterminate ? (
      <path d="M6 12L18 12" part="mark" />
    ) : (
      <path d="M5.9,12.5l3.8,3.8l8.8-8.8" part="mark" />
    );

    if (theme === 'md') {
      path = indeterminate ? (
        <path d="M2 12H22" part="mark" />
      ) : (
        <path d="M1.73,12.91 8.1,19.28 22.79,4.59" part="mark" />
      );
    } else if (theme === 'ionic') {
      path = indeterminate ? (
        <path d="M6.5 12H17.5" stroke-linecap="round" part="mark" />
      ) : (
        <path d="M6 12.5L10 16.5L18.5 8" stroke-linecap="round" stroke-linejoin="round" part="mark" />
      );
    }

    return path;
  }
}

let checkboxIds = 0;
