import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import type { LegacyFormController } from '@utils/forms';
import { createLegacyFormController } from '@utils/forms';
import { addEventListener, getAriaLabel, removeEventListener } from '@utils/helpers';
import { printIonWarning } from '@utils/logging';
import { createColorClasses, hostContext } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { Color, StyleEventDetail } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot - The label text to associate with the radio. Use the "labelPlacement" property to control where the label is placed relative to the radio.
 *
 * @part container - The container for the radio mark.
 * @part mark - The checkmark or dot used to indicate the checked state.
 */
@Component({
  tag: 'ion-radio',
  styleUrls: {
    ios: 'radio.ios.scss',
    md: 'radio.md.scss',
  },
  shadow: true,
})
export class Radio implements ComponentInterface {
  private inputId = `ion-rb-${radioButtonIds++}`;
  private radioGroup: HTMLIonRadioGroupElement | null = null;
  private nativeInput!: HTMLInputElement;
  private legacyFormController!: LegacyFormController;

  // This flag ensures we log the deprecation warning at most once.
  private hasLoggedDeprecationWarning = false;

  @Element() el!: HTMLIonRadioElement;

  /**
   * If `true`, the radio is selected.
   */
  @State() checked = false;

  /**
   * The tabindex of the radio button.
   * @internal
   */
  @State() buttonTabindex = -1;

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
   * If `true`, the user cannot interact with the radio.
   */
  @Prop() disabled = false;

  /**
   * the value of the radio.
   */
  @Prop() value?: any | null;

  @Watch('value')
  valueChanged() {
    /**
     * The new value of the radio may
     * match the radio group's value,
     * so we see if it should be checked.
     */
    this.updateState();
  }

  /**
   * Where to place the label relative to the radio.
   * `"start"`: The label will appear to the left of the radio in LTR and to the right in RTL.
   * `"end"`: The label will appear to the right of the radio in LTR and to the left in RTL.
   * `"fixed"`: The label has the same behavior as `"start"` except it also has a fixed width. Long text will be truncated with ellipses ("...").
   * `"stacked"`: The label will appear above the radio regardless of the direction. The alignment of the label can be controlled with the `alignment` property.
   */
  @Prop() labelPlacement: 'start' | 'end' | 'fixed' | 'stacked' = 'start';

  // TODO FW-3125: Remove the legacy property and implementation
  /**
   * Set the `legacy` property to `true` to forcibly use the legacy form control markup.
   * Ionic will only opt components in to the modern form markup when they are
   * using either the `aria-label` attribute or the default slot that contains
   * the label text. As a result, the `legacy` property should only be used as
   * an escape hatch when you want to avoid this automatic opt-in behavior.
   * Note that this property will be removed in an upcoming major release
   * of Ionic, and all form components will be opted-in to using the modern form markup.
   */
  @Prop() legacy?: boolean;

  /**
   * How to pack the label and radio within a line.
   * `"start"`: The label and radio will appear on the left in LTR and
   * on the right in RTL.
   * `"end"`: The label and radio will appear on the right in LTR and
   * on the left in RTL.
   * `"space-between"`: The label and radio will appear on opposite
   * ends of the line with space between the two elements.
   */
  @Prop() justify: 'start' | 'end' | 'space-between' = 'space-between';

  /**
   * How to control the alignment of the radio and label on the cross axis.
   * `"start"`: The label and control will appear on the left of the cross axis in LTR, and on the right side in RTL.
   * `"center"`: The label and control will appear at the center of the cross axis in both LTR and RTL.
   */
  @Prop() alignment: 'start' | 'center' = 'center';

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  /**
   * Emitted when the radio button has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the radio button loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  /** @internal */
  @Method()
  async setFocus(ev: any) {
    // TODO(FW-2832): type (using Event triggers a build error due to conflict with Stencil Event import)
    ev.stopPropagation();
    ev.preventDefault();

    this.el.focus();
  }

  /** @internal */
  @Method()
  async setButtonTabindex(value: number) {
    this.buttonTabindex = value;
  }

  connectedCallback() {
    this.legacyFormController = createLegacyFormController(this.el);
    if (this.value === undefined) {
      this.value = this.inputId;
    }
    const radioGroup = (this.radioGroup = this.el.closest('ion-radio-group'));
    if (radioGroup) {
      this.updateState();
      addEventListener(radioGroup, 'ionValueChange', this.updateState);
    }
  }

  disconnectedCallback() {
    const radioGroup = this.radioGroup;
    if (radioGroup) {
      removeEventListener(radioGroup, 'ionValueChange', this.updateState);
      this.radioGroup = null;
    }
  }

  componentWillLoad() {
    this.emitStyle();
  }

  @Watch('checked')
  @Watch('color')
  @Watch('disabled')
  protected styleChanged() {
    this.emitStyle();
  }

  private emitStyle() {
    const style: StyleEventDetail = {
      'interactive-disabled': this.disabled,
    };

    if (this.legacyFormController.hasLegacyControl()) {
      style['radio-checked'] = this.checked;
    }

    this.ionStyle.emit(style);
  }

  private updateState = () => {
    if (this.radioGroup) {
      this.checked = this.radioGroup.value === this.value;
    }
  };

  private onClick = () => {
    const { radioGroup, checked } = this;

    /**
     * The legacy control uses a native input inside
     * of the radio host, so we can set this.checked
     * to the state of the nativeInput. RadioGroup
     * will prevent the native input from checking if
     * allowEmptySelection="false" by calling ev.preventDefault().
     */
    if (this.legacyFormController.hasLegacyControl()) {
      this.checked = this.nativeInput.checked;
      return;
    }

    /**
     * The modern control does not use a native input
     * inside of the radio host, so we cannot rely on the
     * ev.preventDefault() behavior above. If the radio
     * is checked and the parent radio group allows for empty
     * selection, then we can set the checked state to false.
     * Otherwise, the checked state should always be set
     * to true because the checked state cannot be toggled.
     */
    if (checked && radioGroup?.allowEmptySelection) {
      this.checked = false;
    } else {
      this.checked = true;
    }
  };

  private onFocus = () => {
    this.ionFocus.emit();
  };

  private onBlur = () => {
    this.ionBlur.emit();
  };

  private get hasLabel() {
    return this.el.textContent !== '';
  }

  private renderRadioControl() {
    return (
      <div class="radio-icon" part="container">
        <div class="radio-inner" part="mark" />
        <div class="radio-ripple"></div>
      </div>
    );
  }

  render() {
    const { legacyFormController } = this;

    return legacyFormController.hasLegacyControl() ? this.renderLegacyRadio() : this.renderRadio();
  }

  private renderRadio() {
    const { checked, disabled, color, el, justify, labelPlacement, hasLabel, buttonTabindex, alignment } = this;
    const mode = getIonMode(this);
    const inItem = hostContext('ion-item', el);

    return (
      <Host
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onClick={this.onClick}
        class={createColorClasses(color, {
          [mode]: true,
          'in-item': inItem,
          'radio-checked': checked,
          'radio-disabled': disabled,
          [`radio-justify-${justify}`]: true,
          [`radio-alignment-${alignment}`]: true,
          [`radio-label-placement-${labelPlacement}`]: true,
          // Focus and active styling should not apply when the radio is in an item
          'ion-activatable': !inItem,
          'ion-focusable': !inItem,
        })}
        role="radio"
        aria-checked={checked ? 'true' : 'false'}
        aria-disabled={disabled ? 'true' : null}
        tabindex={buttonTabindex}
      >
        <label class="radio-wrapper">
          <div
            class={{
              'label-text-wrapper': true,
              'label-text-wrapper-hidden': !hasLabel,
            }}
          >
            <slot></slot>
          </div>
          <div class="native-wrapper">{this.renderRadioControl()}</div>
        </label>
      </Host>
    );
  }

  private renderLegacyRadio() {
    if (!this.hasLoggedDeprecationWarning) {
      printIonWarning(
        `ion-radio now requires providing a label with either the default slot or the "aria-label" attribute. To migrate, remove any usage of "ion-label" and pass the label text to either the component or the "aria-label" attribute.

Example: <ion-radio>Option Label</ion-radio>
Example with aria-label: <ion-radio aria-label="Option Label"></ion-radio>

Developers can use the "legacy" property to continue using the legacy form markup. This property will be removed in an upcoming major release of Ionic where this form control will use the modern form markup.`,
        this.el
      );

      if (this.legacy) {
        printIonWarning(
          `ion-radio is being used with the "legacy" property enabled which will forcibly enable the legacy form markup. This property will be removed in an upcoming major release of Ionic where this form control will use the modern form markup.

Developers can dismiss this warning by removing their usage of the "legacy" property and using the new radio syntax.`,
          this.el
        );
      }

      this.hasLoggedDeprecationWarning = true;
    }

    const { inputId, disabled, checked, color, el, buttonTabindex } = this;
    const mode = getIonMode(this);
    const { label, labelId, labelText } = getAriaLabel(el, inputId);

    return (
      <Host
        aria-checked={`${checked}`}
        aria-hidden={disabled ? 'true' : null}
        aria-labelledby={label ? labelId : null}
        role="radio"
        tabindex={buttonTabindex}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onClick={this.onClick}
        class={createColorClasses(color, {
          [mode]: true,
          'in-item': hostContext('ion-item', el),
          interactive: true,
          'radio-checked': checked,
          'radio-disabled': disabled,
          'legacy-radio': true,
        })}
      >
        {this.renderRadioControl()}
        <label htmlFor={inputId}>{labelText}</label>
        <input
          type="radio"
          checked={checked}
          disabled={disabled}
          tabindex="-1"
          id={inputId}
          ref={(nativeEl) => (this.nativeInput = nativeEl as HTMLInputElement)}
        />
      </Host>
    );
  }
}

let radioButtonIds = 0;
