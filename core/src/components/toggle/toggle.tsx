import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Prop, QueueApi, State, Watch } from '@stencil/core';

import { CheckedInputChangeEvent, Color, Gesture, GestureDetail, Mode, StyleEvent } from '../../interface';
import { hapticSelection } from '../../utils/haptic';
import { findItemLabel, renderHiddenInput } from '../../utils/helpers';
import { createColorClasses, hostContext } from '../../utils/theme';

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
  private pivotX = 0;
  private gesture?: Gesture;

  @Element() el!: HTMLElement;

  @Prop({ context: 'queue' }) queue!: QueueApi;

  @State() activated = false;
  @State() keyFocus = false;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

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
  @Event() ionChange!: EventEmitter<CheckedInputChangeEvent>;

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
  @Event() ionStyle!: EventEmitter<StyleEvent>;

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
      this.gesture.setDisabled(this.disabled);
    }
  }

  @Listen('click')
  onClick() {
    this.checked = !this.checked;
  }

  @Listen('keyup')
  onKeyUp() {
    this.keyFocus = true;
  }

  @Listen('focus')
  onFocus() {
    this.ionFocus.emit();
  }

  @Listen('blur')
  onBlur() {
    this.keyFocus = false;
    this.ionBlur.emit();
  }

  componentWillLoad() {
    this.emitStyle();
  }

  async componentDidLoad() {
    this.gesture = (await import('../../utils/gesture/gesture')).createGesture({
      el: this.el,
      queue: this.queue,
      gestureName: 'toggle',
      gesturePriority: 100,
      threshold: 0,
      onStart: ev => this.onStart(ev),
      onMove: ev => this.onMove(ev),
      onEnd: ev => this.onEnd(ev),
    });
    this.disabledChanged();
  }

  private emitStyle() {
    this.ionStyle.emit({
      'interactive-disabled': this.disabled,
    });
  }

  private onStart(detail: GestureDetail) {
    this.pivotX = detail.currentX;
    this.activated = true;

    // touch-action does not work in iOS
    detail.event.preventDefault();
    return true;
  }

  private onMove(detail: GestureDetail) {
    const currentX = detail.currentX;
    if (shouldToggle(this.checked, currentX - this.pivotX, -15)) {
      this.checked = !this.checked;
      this.pivotX = currentX;
      hapticSelection();
    }
  }

  private onEnd(detail: GestureDetail) {
    const delta = detail.currentX - this.pivotX;
    if (shouldToggle(this.checked, delta, 4)) {
      this.checked = !this.checked;
      hapticSelection();
    }

    this.activated = false;
  }

  private getValue() {
    return this.value || '';
  }

  hostData() {
    const labelId = this.inputId + '-lbl';
    const label = findItemLabel(this.el);
    if (label) {
      label.id = labelId;
    }

    return {
      'role': 'checkbox',
      'tabindex': '0',
      'aria-disabled': this.disabled ? 'true' : null,
      'aria-checked': `${this.checked}`,
      'aria-labelledby': labelId,

      class: {
        ...createColorClasses(this.color),
        'in-item': hostContext('ion-item', this.el),
        'toggle-activated': this.activated,
        'toggle-checked': this.checked,
        'toggle-disabled': this.disabled,
        'toggle-key': this.keyFocus,
        'interactive': true
      }
    };
  }

  render() {
    const value = this.getValue();
    renderHiddenInput(true, this.el, this.name, (this.checked ? value : ''), this.disabled);

    return (
      <div class="toggle-icon">
        <div class="toggle-inner"/>
      </div>
    );
  }
}

function shouldToggle(checked: boolean, deltaX: number, margin: number): boolean {
  const isRTL = document.dir === 'rtl';

  if (checked) {
    return (!isRTL && (margin > deltaX)) ||
      (isRTL && (- margin < deltaX));
  } else {
    return (!isRTL && (- margin < deltaX)) ||
      (isRTL && (margin > deltaX));
  }
}

let toggleIds = 0;
