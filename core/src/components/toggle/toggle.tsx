import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, Gesture, GestureDetail, StyleEventDetail, ToggleChangeEventDetail } from '../../interface';
import { getAriaLabel, renderHiddenInput } from '../../utils/helpers';
import { hapticSelection } from '../../utils/native/haptic';
import { createColorClasses, hostContext } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part track - The background track of the toggle.
 * @part handle - The toggle handle, or knob, used to change the checked state.
 */
@Component({
  tag: 'ion-toggle',
  styleUrls: {
    ios: 'toggle.ios.scss',
    md: 'toggle.md.scss'
  },
  shadow: true
})
export class Toggle implements ComponentInterface {

  private inputId = `ion-tg-${toggleIds++}`;
  private gesture?: Gesture;
  private focusEl?: HTMLElement;
  private lastDrag = 0;

  @Element() el!: HTMLElement;

  @State() activated = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

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
   * Emitted when the value property has changed.
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

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  @Watch('checked')
  checkedChanged(isChecked: boolean) {
    this.ionChange.emit({
      checked: isChecked,
      value: this.value
    });
  }

  @Watch('disabled')
  disabledChanged() {
    this.emitStyle();
    if (this.gesture) {
      this.gesture.enable(!this.disabled);
    }
  }

  async connectedCallback() {
    this.gesture = (await import('../../utils/gesture')).createGesture({
      el: this.el,
      gestureName: 'toggle',
      gesturePriority: 100,
      threshold: 5,
      passive: false,
      onStart: () => this.onStart(),
      onMove: ev => this.onMove(ev),
      onEnd: ev => this.onEnd(ev),
    });
    this.disabledChanged();
  }

  disconnectedCallback() {
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
  }

  componentWillLoad() {
    this.emitStyle();
  }

  private emitStyle() {
    this.ionStyle.emit({
      'interactive-disabled': this.disabled,
    });
  }

  private onStart() {
    this.activated = true;

    // touch-action does not work in iOS
    this.setFocus();
  }

  private onMove(detail: GestureDetail) {
    if (shouldToggle(document, this.checked, detail.deltaX, -10)) {
      this.checked = !this.checked;
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

  private onClick = (ev: Event) => {
    ev.preventDefault();

    if (this.lastDrag + 300 < Date.now()) {
      this.checked = !this.checked;
    }
  }

  private onFocus = () => {
    this.ionFocus.emit();
  }

  private onBlur = () => {
    this.ionBlur.emit();
  }

  render() {
    const { activated, color, checked, disabled, el, inputId, name } = this;
    const mode = getIonMode(this);
    const { label, labelId, labelText } = getAriaLabel(el, inputId);
    const value = this.getValue();

    renderHiddenInput(true, el, name, (checked ? value : ''), disabled);

    return (
      <Host
        onClick={this.onClick}
        aria-labelledby={label ? labelId : null}
        aria-checked={`${checked}`}
        aria-hidden={disabled ? 'true' : null}
        role="switch"
        class={createColorClasses(color, {
          [mode]: true,
          'in-item': hostContext('ion-item', el),
          'toggle-activated': activated,
          'toggle-checked': checked,
          'toggle-disabled': disabled,
          'interactive': true
        })}
      >
        <div class="toggle-icon" part="track">
          <div class="toggle-icon-wrapper">
            <div class="toggle-inner" part="handle" />
          </div>
        </div>
        <label htmlFor={inputId}>
          {labelText}
        </label>
        <input
          type="checkbox"
          role="switch"
          aria-checked={`${checked}`}
          disabled={disabled}
          id={inputId}
          onFocus={() => this.onFocus()}
          onBlur={() => this.onBlur()}
          ref={focusEl => this.focusEl = focusEl}
        />
      </Host>
    );
  }
}

const shouldToggle = (doc: HTMLDocument, checked: boolean, deltaX: number, margin: number): boolean => {
  const isRTL = doc.dir === 'rtl';

  if (checked) {
    return (!isRTL && (margin > deltaX)) ||
      (isRTL && (- margin < deltaX));
  } else {
    return (!isRTL && (- margin < deltaX)) ||
      (isRTL && (margin > deltaX));
  }
};

let toggleIds = 0;
