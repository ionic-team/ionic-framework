import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, State, Watch, h } from '@stencil/core';
import { renderHiddenInput, inheritAriaAttributes } from '@utils/helpers';
import type { Attributes } from '@utils/helpers';
import { hapticAvailable, hapticSelection } from '@utils/native/haptic';
import { isRTL } from '@utils/rtl';
import { createColorClasses, hostContext } from '@utils/theme';
import { checkmarkOutline, removeOutline, ellipseOutline } from 'ionicons/icons';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import type { Color, Gesture, GestureDetail, Mode } from '../../interface';

import type { ToggleChangeEventDetail } from './toggle-interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot - The label text to associate with the toggle. Use the "labelPlacement" property to control where the label is placed relative to the toggle.
 *
 * @part track - The background track of the toggle.
 * @part handle - The toggle handle, or knob, used to change the checked state.
 * @part label - The label text describing the toggle.
 */
@Component({
  tag: 'ion-toggle',
  styleUrls: {
    ios: 'toggle.ios.scss',
    md: 'toggle.md.scss',
  },
  shadow: true,
})
export class Toggle implements ComponentInterface {
  private inputId = `ion-tg-${toggleIds++}`;
  private gesture?: Gesture;
  private focusEl?: HTMLElement;
  private hapticEl?: HTMLElement;
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

    if (this.hapticEl) {
      this.hapticEl.click();
    }

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

  private onClick = (ev: MouseEvent) => {
    if (this.disabled) {
      return;
    }

    ev.preventDefault();

    if (this.lastDrag + 300 < Date.now()) {
      this.toggleChecked();
    }
  };

  private onFocus = () => {
    this.ionFocus.emit();
  };

  private onBlur = () => {
    this.ionBlur.emit();
  };

  private getSwitchLabelIcon = (mode: Mode, checked: boolean) => {
    if (mode === 'md') {
      return checked ? checkmarkOutline : removeOutline;
    }
    return checked ? removeOutline : ellipseOutline;
  };

  private renderOnOffSwitchLabels(mode: Mode, checked: boolean) {
    const icon = this.getSwitchLabelIcon(mode, checked);

    return (
      <ion-icon
        class={{
          'toggle-switch-icon': true,
          'toggle-switch-icon-checked': checked,
        }}
        icon={icon}
        aria-hidden="true"
      ></ion-icon>
    );
  }

  private renderToggleControl() {
    const mode = getIonMode(this);

    const { enableOnOffLabels, checked } = this;
    return (
      <div class="toggle-icon" part="track" ref={(el) => (this.toggleTrack = el)}>
        {/* The iOS on/off labels are rendered outside of .toggle-icon-wrapper,
         since the wrapper is translated when the handle is interacted with and
         this would move the on/off labels outside of the view box */}
        {enableOnOffLabels &&
          mode === 'ios' && [this.renderOnOffSwitchLabels(mode, true), this.renderOnOffSwitchLabels(mode, false)]}
        <div class="toggle-icon-wrapper">
          <div class="toggle-inner" part="handle">
            {enableOnOffLabels && mode === 'md' && this.renderOnOffSwitchLabels(mode, checked)}
          </div>
        </div>
      </div>
    );
  }

  /**
   * On Safari (iOS 18+) we can trigger haptic feedback programatically
   * by rendering <input type="checkbox" switch> element
   * with an associated <label>  and triggering click()
   * on the <label> element.
   */
  private renderFallbackHapticElements() {
    const { inputId } = this;
    const mode = getIonMode(this);

    if (hapticAvailable() || mode !== 'ios') {
      return;
    }

    return (
      <label aria-hidden="true" ref={(hapticEl) => (this.hapticEl = hapticEl)} style={{ display: 'none' }}>
        <input
          id={inputId + '-haptic'}
          type="checkbox"
          // @ts-expect-error safari-only custom attrrbute required for haptic feedback
          switch
          style={{ display: 'none' }}
        />
      </label>
    );
  }

  private get hasLabel() {
    return this.el.textContent !== '';
  }

  render() {
    const { activated, color, checked, disabled, el, justify, labelPlacement, inputId, name, alignment } = this;

    const mode = getIonMode(this);
    const value = this.getValue();
    const rtl = isRTL(el) ? 'rtl' : 'ltr';
    renderHiddenInput(true, el, name, checked ? value : '', disabled);

    return (
      <Host
        class={createColorClasses(color, {
          [mode]: true,
          'in-item': hostContext('ion-item', el),
          'toggle-activated': activated,
          'toggle-checked': checked,
          'toggle-disabled': disabled,
          [`toggle-justify-${justify}`]: justify !== undefined,
          [`toggle-alignment-${alignment}`]: alignment !== undefined,
          [`toggle-label-placement-${labelPlacement}`]: true,
          [`toggle-${rtl}`]: true,
        })}
      >
        {this.renderFallbackHapticElements()}
        <label class="toggle-wrapper" onClick={this.onClick}>
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
            {...this.inheritedAttributes}
          />
          <div
            class={{
              'label-text-wrapper': true,
              'label-text-wrapper-hidden': !this.hasLabel,
            }}
            part="label"
          >
            <slot></slot>
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
