import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, Watch, h } from '@stencil/core';

// TODO(FW-2845) - Use @utils/forms and @utils/logging when https://github.com/ionic-team/stencil/issues/3826 is resolved
import { getIonMode } from '../../global/ionic-global';
import type { CheckboxChangeEventDetail, Color, StyleEventDetail } from '../../interface';
import type { LegacyFormController } from '../../utils/forms';
import { createLegacyFormController } from '../../utils/forms';
import { getAriaLabel, renderHiddenInput } from '../../utils/helpers';
import { printIonWarning } from '../../utils/logging';
import { createColorClasses, hostContext } from '../../utils/theme';

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
  private legacyFormController!: LegacyFormController;

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

  connectedCallback() {
    this.legacyFormController = createLegacyFormController(this.el);
  }

  componentWillLoad() {
    this.emitStyle();
  }

  @Watch('checked')
  checkedChanged() {
    this.emitStyle();
  }

  @Watch('disabled')
  disabledChanged() {
    this.emitStyle();
  }

  private emitStyle() {
    this.ionStyle.emit({
      'checkbox-checked': this.checked,
      'interactive-disabled': this.disabled,
    });
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

  render() {
    const { legacyFormController } = this;

    return legacyFormController.hasLegacyControl() ? this.renderLegacyCheckbox() : this.renderCheckbox();
  }

  private renderCheckbox() {
    const { color, checked, disabled, el, indeterminate, inputId, name, value } = this;
    const mode = getIonMode(this);
    const { label, labelId, labelText } = getAriaLabel(el, inputId);

    renderHiddenInput(true, el, name, checked ? value : '', disabled);

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
          interactive: true,
        })}
      >
        <label class="checkbox-wrapper">
          <div class="label-text-wrapper">
            <slot></slot>
          </div>
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
        </label>
      </Host>
    );
  }

  private renderLegacyCheckbox() {
    if (!this.hasLoggedDeprecationWarning) {
      printIonWarning(
        `Using ion-checkbox with an ion-label has been deprecated. To migrate, remove the ion-label and pass your label directly into ion-checkbox instead.
Example: <ion-checkbox>Email:</ion-checkbox>
For checkboxes that do not have a visible label, developers should use "aria-label" so screen readers can announce the purpose of the checkbox.`,
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

    const { color, checked, disabled, el, indeterminate, inputId, name, value } = this;
    const mode = getIonMode(this);
    const { label, labelId, labelText } = getAriaLabel(el, inputId);

    renderHiddenInput(true, el, name, checked ? value : '', disabled);

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
}

let checkboxIds = 0;
