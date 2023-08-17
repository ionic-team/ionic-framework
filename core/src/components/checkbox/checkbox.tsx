import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, Watch, h } from '@stencil/core';
import type { LegacyFormController } from '@utils/forms';
import { createLegacyFormController } from '@utils/forms';
import type { Attributes } from '@utils/helpers';
import { getAriaLabel, inheritAriaAttributes, renderHiddenInput } from '@utils/helpers';
import { printIonWarning } from '@utils/logging';
import { createColorClasses, hostContext } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { Color, Mode, StyleEventDetail } from '../../interface';

import type { CheckboxChangeEventDetail } from './checkbox-interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot - The label text to associate with the checkbox. Use the "labelPlacement" property to control where the label is placed relative to the checkbox.
 *
 * @part container - The container for the checkbox mark.
 * @part mark - The checkmark used to indicate the checked state.
 */
@Component({
  tag: 'ion-checkbox',
  styleUrls: {
    ios: 'checkbox.ios.scss',
    md: 'checkbox.md.scss',
  },
  shadow: true,
})
export class Checkbox implements ComponentInterface {
  private inputId = `ion-cb-${checkboxIds++}`;
  private focusEl?: HTMLElement;
  private legacyFormController!: LegacyFormController; // TODO(FW-3100): remove this
  private inheritedAttributes: Attributes = {};

  // TODO(FW-3100): remove this
  // This flag ensures we log the deprecation warning at most once.
  private hasLoggedDeprecationWarning = false;

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
   */
  @Prop() labelPlacement: 'start' | 'end' | 'fixed' | 'stacked' = 'start';

  /**
   * How to pack the label and checkbox within a line when using `labelPlacement="start | end | fixed"`.
   * `"start"`: The label and checkbox will appear on the left in LTR and
   * on the right in RTL.
   * `"end"`: The label and checkbox will appear on the right in LTR and
   * on the left in RTL.
   * `"space-between"`: The label and checkbox will appear on opposite
   * ends of the line with space between the two elements.
   */
  @Prop() justify: 'start' | 'end' | 'space-between' = 'space-between';

  /**
   * How to pack the label and control along the cross axis when using `labelPlacement="stacked"`.
   * `"start"`: The label and control will appear at the top of the container.
   * `"center"`: The label and control will appear at the center of the container.
   */
  @Prop() align: 'start' | 'center' = 'start';

  // TODO(FW-3100): remove this
  /**
   * Set the `legacy` property to `true` to forcibly use the legacy form control markup.
   * Ionic will only opt checkboxes in to the modern form markup when they are
   * using either the `aria-label` attribute or have text in the default slot. As a result,
   * the `legacy` property should only be used as an escape hatch when you want to
   * avoid this automatic opt-in behavior.
   *
   * Note that this property will be removed in an upcoming major release
   * of Ionic, and all form components will be opted-in to using the modern form markup.
   */
  @Prop() legacy?: boolean;

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

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  // TODO(FW-3100): remove this
  connectedCallback() {
    this.legacyFormController = createLegacyFormController(this.el);
  }

  componentWillLoad() {
    this.emitStyle();

    // TODO(FW-3100): remove check
    if (!this.legacyFormController.hasLegacyControl()) {
      this.inheritedAttributes = {
        ...inheritAriaAttributes(this.el),
      };
    }
  }

  @Watch('checked')
  @Watch('disabled')
  protected styleChanged() {
    this.emitStyle();
  }

  private emitStyle() {
    const style: StyleEventDetail = {
      'interactive-disabled': this.disabled,
    };

    // TODO(FW-3100): remove this
    if (this.legacyFormController.hasLegacyControl()) {
      style['checkbox-checked'] = this.checked;
    }

    this.ionStyle.emit(style);
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

  private toggleChecked = (ev: any) => {
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

  // TODO(FW-3100): run contents of renderCheckbox directly instead
  render() {
    const { legacyFormController } = this;

    return legacyFormController.hasLegacyControl() ? this.renderLegacyCheckbox() : this.renderCheckbox();
  }

  private renderCheckbox() {
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
    } = this;
    const mode = getIonMode(this);
    const path = getSVGPath(mode, indeterminate);

    renderHiddenInput(true, el, name, checked ? value : '', disabled);

    return (
      <Host
        class={createColorClasses(color, {
          [mode]: true,
          'in-item': hostContext('ion-item', el),
          'checkbox-checked': checked,
          'checkbox-disabled': disabled,
          'checkbox-indeterminate': indeterminate,
          interactive: true,
          [`checkbox-justify-${justify}`]: true,
          [`checkbox-align-${this.align}`]: true,
          [`checkbox-label-placement-${labelPlacement}`]: true,
        })}
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
          >
            <slot></slot>
          </div>
          <div class="native-wrapper">
            <svg class="checkbox-icon" viewBox="0 0 24 24" part="container">
              {path}
            </svg>
          </div>
        </label>
      </Host>
    );
  }

  // TODO(FW-3100): remove this
  private renderLegacyCheckbox() {
    if (!this.hasLoggedDeprecationWarning) {
      printIonWarning(
        `ion-checkbox now requires providing a label with either the default slot or the "aria-label" attribute. To migrate, remove any usage of "ion-label" and pass the label text to either the component or the "aria-label" attribute.

Example: <ion-checkbox>Label</ion-checkbox>
Example with aria-label: <ion-checkbox aria-label="Label"></ion-checkbox>

Developers can use the "legacy" property to continue using the legacy form markup. This property will be removed in an upcoming major release of Ionic where this form control will use the modern form markup.`,
        this.el
      );

      if (this.legacy) {
        printIonWarning(
          `ion-checkbox is being used with the "legacy" property enabled which will forcibly enable the legacy form markup. This property will be removed in an upcoming major release of Ionic where this form control will use the modern form markup.
Developers can dismiss this warning by removing their usage of the "legacy" property and using the new checkbox syntax.`,
          this.el
        );
      }

      this.hasLoggedDeprecationWarning = true;
    }

    const { color, checked, disabled, el, getSVGPath, indeterminate, inputId, name, value } = this;
    const mode = getIonMode(this);
    const { label, labelId, labelText } = getAriaLabel(el, inputId);
    const path = getSVGPath(mode, indeterminate);

    renderHiddenInput(true, el, name, checked ? value : '', disabled);

    return (
      <Host
        aria-labelledby={label ? labelId : null}
        aria-checked={`${checked}`}
        aria-hidden={disabled ? 'true' : null}
        role="checkbox"
        class={createColorClasses(color, {
          [mode]: true,
          'in-item': hostContext('ion-item', el),
          'checkbox-checked': checked,
          'checkbox-disabled': disabled,
          'checkbox-indeterminate': indeterminate,
          'legacy-checkbox': true,
          interactive: true,
        })}
      >
        <svg class="checkbox-icon" viewBox="0 0 24 24" part="container">
          {path}
        </svg>
        <label htmlFor={inputId}>{labelText}</label>
        <input
          type="checkbox"
          aria-checked={`${checked}`}
          disabled={disabled}
          id={inputId}
          onChange={this.toggleChecked}
          onFocus={() => this.onFocus()}
          onBlur={() => this.onBlur()}
          ref={(focusEl) => (this.focusEl = focusEl)}
        />
      </Host>
    );
  }

  private getSVGPath(mode: Mode, indeterminate: boolean): HTMLElement {
    let path = indeterminate ? (
      <path d="M6 12L18 12" part="mark" />
    ) : (
      <path d="M5.9,12.5l3.8,3.8l8.8-8.8" part="mark" />
    );

    if (mode === 'md') {
      path = indeterminate ? (
        <path d="M2 12H22" part="mark" />
      ) : (
        <path d="M1.73,12.91 8.1,19.28 22.79,4.59" part="mark" />
      );
    }

    return path;
  }
}

let checkboxIds = 0;
