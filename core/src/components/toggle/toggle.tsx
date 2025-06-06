import checkRegular from '@phosphor-icons/core/assets/regular/check.svg';
import minusRegular from '@phosphor-icons/core/assets/regular/minus.svg';
import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, State, Watch, h } from '@stencil/core';
import { renderHiddenInput, inheritAriaAttributes } from '@utils/helpers';
import type { Attributes } from '@utils/helpers';
import { hapticSelection } from '@utils/native/haptic';
import { isPlatform } from '@utils/platform';
import { isRTL } from '@utils/rtl';
import { createColorClasses, hostContext } from '@utils/theme';
import { checkmarkOutline, removeOutline, ellipseOutline } from 'ionicons/icons';

import { config } from '../../global/config';
import { getIonTheme } from '../../global/ionic-global';
import type { Color, Gesture, GestureDetail } from '../../interface';

import type { ToggleChangeEventDetail } from './toggle-interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @slot - The label text to associate with the toggle. Use the "labelPlacement" property to control where the label is placed relative to the toggle.
 *
 * @part track - The background track of the toggle.
 * @part handle - The toggle handle, or knob, used to change the checked state.
 * @part label - The label text describing the toggle.
 * @part supporting-text - Supporting text displayed beneath the toggle label.
 * @part helper-text - Supporting text displayed beneath the toggle label when the toggle is valid.
 * @part error-text - Supporting text displayed beneath the toggle label when the toggle is invalid and touched.
 */
@Component({
  tag: 'ion-toggle',
  styleUrls: {
    ios: 'toggle.ios.scss',
    md: 'toggle.md.scss',
    ionic: 'toggle.ionic.scss',
  },
  shadow: true,
})
export class Toggle implements ComponentInterface {
  private inputId = `ion-tg-${toggleIds++}`;
  private inputLabelId = `${this.inputId}-lbl`;
  private helperTextId = `${this.inputId}-helper-text`;
  private errorTextId = `${this.inputId}-error-text`;
  private gesture?: Gesture;
  private focusEl?: HTMLElement;
  private lastDrag = 0;
  private inheritedAttributes: Attributes = {};
  private toggleTrack?: HTMLElement;
  private didLoad = false;

  @Element() el!: HTMLIonToggleElement;

  @State() activated = false;

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
   * If `true`, the toggle is selected.
   */
  @Prop({ mutable: true }) checked = false;

  /**
   * If `true`, the user cannot interact with the toggle.
   */
  @Prop() disabled = false;

  /**
   * Text that is placed under the toggle label and displayed when an error is detected.
   */
  @Prop() errorText?: string;

  /**
   * Text that is placed under the toggle label and displayed when no error is detected.
   */
  @Prop() helperText?: string;

  /**
   * The value of the toggle does not mean if it's checked or not, use the `checked`
   * property for that.
   *
   * The value of a toggle is analogous to the value of a `<input type="checkbox">`,
   * it's only used when the toggle participates in a native `<form>`.
   */
  @Prop() value?: string | null = 'on';

  /**
   * Enables the on/off accessibility switch labels within the toggle.
   */
  @Prop() enableOnOffLabels: boolean | undefined = config.get('toggleOnOffLabels');

  /**
   * Where to place the label relative to the input.
   * `"start"`: The label will appear to the left of the toggle in LTR and to the right in RTL.
   * `"end"`: The label will appear to the right of the toggle in LTR and to the left in RTL.
   * `"fixed"`: The label has the same behavior as `"start"` except it also has a fixed width. Long text will be truncated with ellipses ("...").
   * `"stacked"`: The label will appear above the toggle regardless of the direction. The alignment of the label can be controlled with the `alignment` property.
   */
  @Prop() labelPlacement: 'start' | 'end' | 'fixed' | 'stacked' = 'start';

  /**
   * How to pack the label and toggle within a line.
   * `"start"`: The label and toggle will appear on the left in LTR and
   * on the right in RTL.
   * `"end"`: The label and toggle will appear on the right in LTR and
   * on the left in RTL.
   * `"space-between"`: The label and toggle will appear on opposite
   * ends of the line with space between the two elements.
   * Setting this property will change the toggle `display` to `block`.
   */
  @Prop() justify?: 'start' | 'end' | 'space-between';

  /**
   * How to control the alignment of the toggle and label on the cross axis.
   * `"start"`: The label and control will appear on the left of the cross axis in LTR, and on the right side in RTL.
   * `"center"`: The label and control will appear at the center of the cross axis in both LTR and RTL.
   * Setting this property will change the toggle `display` to `block`.
   */
  @Prop() alignment?: 'start' | 'center';

  /**
   * If true, screen readers will announce it as a required field. This property
   * works only for accessibility purposes, it will not prevent the form from
   * submitting if the value is invalid.
   */
  @Prop() required = false;

  /**
   * Emitted when the user switches the toggle on or off.
   *
   * This event will not emit when programmatically setting the `checked` property.
   */
  @Event() ionChange!: EventEmitter<ToggleChangeEventDetail>;

  /**
   * Emitted when the toggle has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the toggle loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  @Watch('disabled')
  disabledChanged() {
    if (this.gesture) {
      this.gesture.enable(!this.disabled);
    }
  }

  private toggleChecked() {
    const { checked, value } = this;

    const isNowChecked = !checked;
    this.checked = isNowChecked;

    this.setFocus();
    this.ionChange.emit({
      checked: isNowChecked,
      value,
    });
  }

  async connectedCallback() {
    /**
     * If we have not yet rendered
     * ion-toggle, then toggleTrack is not defined.
     * But if we are moving ion-toggle via appendChild,
     * then toggleTrack will be defined.
     */
    if (this.didLoad) {
      this.setupGesture();
    }
  }

  componentDidLoad() {
    this.setupGesture();
    this.didLoad = true;
  }

  private setupGesture = async () => {
    const { toggleTrack } = this;

    if (toggleTrack) {
      this.gesture = (await import('../../utils/gesture')).createGesture({
        el: toggleTrack,
        gestureName: 'toggle',
        gesturePriority: 100,
        threshold: 5,
        passive: false,
        onStart: () => this.onStart(),
        onMove: (ev) => this.onMove(ev),
        onEnd: (ev) => this.onEnd(ev),
      });
      this.disabledChanged();
    }
  };

  disconnectedCallback() {
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
  }

  componentWillLoad() {
    this.inheritedAttributes = {
      ...inheritAriaAttributes(this.el),
    };
  }

  private onStart() {
    this.activated = true;

    // touch-action does not work in iOS
    this.setFocus();
  }

  private onMove(detail: GestureDetail) {
    if (shouldToggle(isRTL(this.el), this.checked, detail.deltaX, -10)) {
      this.toggleChecked();
      hapticSelection();
    }
  }

  private onEnd(ev: GestureDetail) {
    this.activated = false;
    this.lastDrag = Date.now();
    ev.event.preventDefault();
    ev.event.stopImmediatePropagation();
  }

  private getValue() {
    return this.value || '';
  }

  private setFocus() {
    if (this.focusEl) {
      this.focusEl.focus();
    }
  }

  private onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === ' ') {
      ev.preventDefault();
      if (!this.disabled) {
        this.toggleChecked();
      }
    }
  };

  private onClick = (ev: MouseEvent) => {
    /**
     * The haptics for the toggle on tap is
     * an iOS-only feature. As such, it should
     * only trigger on iOS.
     */
    const enableHaptics = isPlatform('ios');

    if (this.disabled) {
      return;
    }

    ev.preventDefault();

    if (this.lastDrag + 300 < Date.now()) {
      this.toggleChecked();
      enableHaptics && hapticSelection();
    }
  };

  /**
   * Stops propagation when the display label is clicked,
   * otherwise, two clicks will be triggered.
   */
  private onDivLabelClick = (ev: MouseEvent) => {
    ev.stopPropagation();
  };

  private onFocus = () => {
    this.ionFocus.emit();
  };

  private onBlur = () => {
    this.ionBlur.emit();
  };

  private getSwitchLabelIcon = (checked: boolean) => {
    return checked ? this.toggleCheckedIcon : this.toggleUncheckedIcon;
  };

  get toggleDefaultCheckedIcon(): string {
    // Determine the theme and map to default icons
    const theme = getIonTheme(this);
    const defaultIcons = {
      ios: removeOutline,
      ionic: checkRegular,
      md: checkmarkOutline,
    };

    // Get the default icon based on the theme, falling back to 'md' icon if necessary
    const defaultIcon = defaultIcons[theme] || defaultIcons.md;

    // Return the default icon
    return defaultIcon;
  }

  /**
   * Get the icon to use for the checked icon.
   * Otherwise, use the icon set in the config.
   * If no icon is set in the config, use the default icon.
   */
  get toggleCheckedIcon(): string {
    return config.get('toggleCheckedIcon', this.toggleDefaultCheckedIcon);
  }

  /**
   * Get the icon to use for the unchecked icon.
   * Otherwise, use the icon set in the config.
   * If no icon is set in the config, use the default icon.
   */
  get toggleUncheckedIcon(): string {
    // Determine the theme and map to default icons
    const theme = getIonTheme(this);
    const defaultIcons = {
      ios: ellipseOutline,
      ionic: minusRegular,
      md: removeOutline,
    };

    // Get the default icon based on the theme, falling back to 'md' icon if necessary
    const defaultIcon = defaultIcons[theme] || defaultIcons.md;

    // Return the configured toggle unchecked icon or the default icon
    return config.get('toggleUncheckedIcon', defaultIcon);
  }

  private renderOnOffSwitchLabels(checked: boolean) {
    const icon = this.getSwitchLabelIcon(checked);

    return (
      <ion-icon
        class={{
          'toggle-switch-icon': true,
          'toggle-switch-icon-checked': checked,
          /**
           * The default checked icon is being modified with
           * styling that causes it to rotate by 90 degrees
           * when the theme is `ios`.
           *
           * To prevent any rotation on a custom icon that is
           * set through the config, we need to apply a class
           * that handles the styling only when the default
           * checked icon is being used.
           */
          'toggle-switch-icon-checked-default': checked && icon === this.toggleDefaultCheckedIcon,
        }}
        icon={icon}
        aria-hidden="true"
      ></ion-icon>
    );
  }

  private renderToggleControl() {
    const theme = getIonTheme(this);

    const { enableOnOffLabels, checked } = this;
    return (
      <div class="toggle-icon" part="track" ref={(el) => (this.toggleTrack = el)}>
        {/* The iOS on/off labels are rendered outside of .toggle-icon-wrapper,
         since the wrapper is translated when the handle is interacted with and
         this would move the on/off labels outside of the view box */}
        {enableOnOffLabels &&
          theme === 'ios' && [this.renderOnOffSwitchLabels(true), this.renderOnOffSwitchLabels(false)]}
        <div class="toggle-icon-wrapper">
          <div class="toggle-inner" part="handle">
            {enableOnOffLabels && (theme === 'md' || theme === 'ionic') && this.renderOnOffSwitchLabels(checked)}
          </div>
        </div>
      </div>
    );
  }

  private get hasLabel() {
    return this.el.textContent !== '';
  }

  private getHintTextID(): string | undefined {
    const { el, helperText, errorText, helperTextId, errorTextId } = this;

    if (el.classList.contains('ion-touched') && el.classList.contains('ion-invalid') && errorText) {
      return errorTextId;
    }

    if (helperText) {
      return helperTextId;
    }

    return undefined;
  }

  /**
   * Responsible for rendering helper text and error text.
   * This element should only be rendered if hint text is set.
   */
  private renderHintText() {
    const { helperText, errorText, helperTextId, errorTextId } = this;

    /**
     * undefined and empty string values should
     * be treated as not having helper/error text.
     */
    const hasHintText = !!helperText || !!errorText;
    if (!hasHintText) {
      return;
    }

    return (
      <div class="toggle-bottom">
        <div id={helperTextId} class="helper-text" part="supporting-text helper-text">
          {helperText}
        </div>
        <div id={errorTextId} class="error-text" part="supporting-text error-text">
          {errorText}
        </div>
      </div>
    );
  }

  render() {
    const {
      activated,
      alignment,
      checked,
      color,
      disabled,
      el,
      errorTextId,
      hasLabel,
      inheritedAttributes,
      inputId,
      inputLabelId,
      justify,
      labelPlacement,
      name,
      required,
    } = this;

    const theme = getIonTheme(this);
    const value = this.getValue();
    const rtl = isRTL(el) ? 'rtl' : 'ltr';
    const isIonicTheme = theme === 'ionic';
    renderHiddenInput(true, el, name, checked ? value : '', disabled);

    return (
      <Host
        role="switch"
        aria-checked={`${checked}`}
        aria-describedby={this.getHintTextID()}
        aria-invalid={this.getHintTextID() === errorTextId}
        onClick={this.onClick}
        aria-labelledby={hasLabel ? inputLabelId : null}
        aria-label={inheritedAttributes['aria-label'] || null}
        aria-disabled={disabled ? 'true' : null}
        tabindex={disabled ? undefined : 0}
        onKeyDown={this.onKeyDown}
        class={createColorClasses(color, {
          [theme]: true,
          'in-item': hostContext('ion-item', el),
          'toggle-activated': activated,
          'toggle-checked': checked,
          'toggle-disabled': disabled,
          [`toggle-justify-${justify}`]: justify !== undefined,
          [`toggle-alignment-${alignment}`]: alignment !== undefined,
          [`toggle-label-placement-${labelPlacement}`]: true,
          [`toggle-${rtl}`]: true,
          'ion-activatable': isIonicTheme,
          'ion-focusable': isIonicTheme,
        })}
      >
        <label class="toggle-wrapper" htmlFor={inputId}>
          {/*
            The native control must be rendered
            before the visible label text due to https://bugs.webkit.org/show_bug.cgi?id=251951
          */}
          <input
            type="checkbox"
            role="switch"
            aria-checked={`${checked}`}
            checked={checked}
            disabled={disabled}
            id={inputId}
            onFocus={() => this.onFocus()}
            onBlur={() => this.onBlur()}
            ref={(focusEl) => (this.focusEl = focusEl)}
            required={required}
            {...inheritedAttributes}
          />
          <div
            class={{
              'label-text-wrapper': true,
              'label-text-wrapper-hidden': !hasLabel,
            }}
            part="label"
            id={inputLabelId}
            onClick={this.onDivLabelClick}
          >
            <slot></slot>
            {this.renderHintText()}
          </div>
          <div class="native-wrapper">{this.renderToggleControl()}</div>
        </label>
      </Host>
    );
  }
}

const shouldToggle = (rtl: boolean, checked: boolean, deltaX: number, margin: number): boolean => {
  if (checked) {
    return (!rtl && margin > deltaX) || (rtl && -margin < deltaX);
  } else {
    return (!rtl && -margin < deltaX) || (rtl && margin > deltaX);
  }
};

let toggleIds = 0;
