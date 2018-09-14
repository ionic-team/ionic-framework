import { Component, ComponentInterface, Element, Event, EventEmitter, Prop, QueueApi, State, Watch } from '@stencil/core';

import { CheckedInputChangeEvent, Color, Gesture, GestureDetail, Mode, StyleEvent } from '../../interface';
import { hapticSelection } from '../../utils/haptic';
import { deferEvent, renderHiddenInput } from '../../utils/helpers';
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
  private nativeInput!: HTMLInputElement;
  private pivotX = 0;
  private gesture?: Gesture;

  @Element() el!: HTMLElement;

  @Prop({ context: 'queue' }) queue!: QueueApi;

  @State() activated = false;
  @State() keyFocus = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * If true, the toggle is selected. Defaults to `false`.
   */
  @Prop({ mutable: true }) checked = false;

  /*
   * If true, the user cannot interact with the toggle. Default false.
   */
  @Prop() disabled = false;

  /**
   * the value of the toggle.
   */
  @Prop() value = 'on';

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
    this.ionStyle.emit({
      'interactive-disabled': this.disabled,
    });
    if (this.gesture) {
      this.gesture.setDisabled(this.disabled);
    }
  }

  componentWillLoad() {
    this.ionStyle = deferEvent(this.ionStyle);
  }

  async componentDidLoad() {
    const parentItem = this.nativeInput.closest('ion-item');
    if (parentItem) {
      const itemLabel = parentItem.querySelector('ion-label');
      if (itemLabel) {
        itemLabel.id = this.inputId + '-lbl';
        this.nativeInput.setAttribute('aria-labelledby', itemLabel.id);
      }
    }

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
    this.nativeInput.focus();
  }

  private onChange() {
    this.checked = !this.checked;
  }

  private onKeyUp() {
    this.keyFocus = true;
  }

  private onFocus() {
    this.ionFocus.emit();
  }

  private onBlur() {
    this.keyFocus = false;
    this.ionBlur.emit();
  }

  hostData() {
    return {
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
    renderHiddenInput(this.el, this.name, (this.checked ? this.value : ''), this.disabled);

    return [
      <div class="toggle-icon">
        <div class="toggle-inner"/>
      </div>,
      <input
        type="checkbox"
        onChange={this.onChange.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onKeyUp={this.onKeyUp.bind(this)}
        checked={this.checked}
        id={this.inputId}
        name={this.name}
        value={this.value}
        disabled={this.disabled}
        ref={r => this.nativeInput = (r as any)}
      />,
      <slot></slot>
    ];
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
