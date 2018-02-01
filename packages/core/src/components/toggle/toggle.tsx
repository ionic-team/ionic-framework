import { BlurEvent, CheckboxInput, CheckedInputChangeEvent, FocusEvent, StyleEvent } from '../../utils/input-interfaces';
import { Component, Event, EventEmitter, Prop, State, Watch } from '@stencil/core';
import { GestureDetail } from '../../index';
import { hapticSelection } from '../../utils/haptic';
import { debounce } from '../../utils/helpers';


@Component({
  tag: 'ion-toggle',
  styleUrls: {
    ios: 'toggle.ios.scss',
    md: 'toggle.md.scss'
  },
  host: {
    theme: 'toggle'
  }
})
export class Toggle implements CheckboxInput {
  private didLoad: boolean;
  private gestureConfig: any;
  private inputId: string;
  private nativeInput: HTMLInputElement;
  private pivotX: number;


  @State() activated = false;

  @State() keyFocus: boolean;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop({ mutable: true }) name: string;

  /**
   * If true, the toggle is selected. Defaults to `false`.
   */
  @Prop({ mutable: true }) checked = false;

  /*
   * If true, the user cannot interact with the toggle. Default false.
   */
  @Prop({ mutable: true }) disabled = false;

  /**
   * the value of the toggle.
   */
  @Prop() value = 'on';

  /**
   * @output {Event} Emitted when the value property has changed.
   */
  @Event() ionChange: EventEmitter<CheckedInputChangeEvent>;

  /**
   * @output {Event} Emitted when the toggle has focus.
   */
  @Event() ionFocus: EventEmitter<FocusEvent>;

  /**
   * @output {Event} Emitted when the toggle loses focus.
   */
  @Event() ionBlur: EventEmitter<BlurEvent>;

  /**
   * @output {Event} Emitted when the styles change.
   */
  @Event() ionStyle: EventEmitter<StyleEvent>;


  constructor() {
    this.gestureConfig = {
      'onStart': this.onDragStart.bind(this),
      'onMove': this.onDragMove.bind(this),
      'onEnd': this.onDragEnd.bind(this),
      'gestureName': 'toggle',
      'gesturePriority': 30,
      'type': 'pan',
      'direction': 'x',
      'threshold': 0,
      'attachTo': 'parent'
    };
  }

  componentWillLoad() {
    this.ionStyle.emit = debounce(this.ionStyle.emit.bind(this.ionStyle));
    this.inputId = `ion-tg-${toggleIds++}`;
    if (this.name === undefined) {
      this.name = this.inputId;
    }
    this.emitStyle();
  }

  componentDidLoad() {
    this.didLoad = true;

    const parentItem = this.nativeInput.closest('ion-item');
    if (parentItem) {
      const itemLabel = parentItem.querySelector('ion-label');
      if (itemLabel) {
        itemLabel.id = this.inputId + '-lbl';
        this.nativeInput.setAttribute('aria-labelledby', itemLabel.id);
      }
    }
  }

  @Watch('checked')
  checkedChanged(isChecked: boolean) {
    if (this.didLoad) {
      this.ionChange.emit({
        checked: isChecked,
        value: this.value
      });
    }
    this.emitStyle();
  }

  @Watch('disabled')
  emitStyle() {
    this.ionStyle.emit({
      'toggle-disabled': this.disabled,
      'toggle-checked': this.checked,
      'toggle-activated': this.activated
    });
  }

  private onDragStart(detail: GestureDetail) {
    this.pivotX = detail.currentX;
    this.activated = true;
  }

  private onDragMove(detail: GestureDetail) {
    const currentX = detail.currentX;
    if (shouldToggle(this.checked, currentX - this.pivotX, -15)) {
      this.checked = !this.checked;
      this.pivotX = currentX;
      hapticSelection();
    }
  }

  private onDragEnd(detail: GestureDetail) {
    const delta = detail.currentX - this.pivotX;
    if (shouldToggle(this.checked, delta, 4)) {
      this.checked = !this.checked;
      hapticSelection();
    }

    this.activated = false;
    this.nativeInput.focus();
  }

  onChange() {
    this.checked = !this.checked;
  }

  onKeyUp() {
    this.keyFocus = true;
  }

  onFocus() {
    this.ionFocus.emit();
  }

  onBlur() {
    this.keyFocus = false;
    this.ionBlur.emit();
  }

  hostData() {
    return {
      class: {
        'toggle-activated': this.activated,
        'toggle-checked': this.checked,
        'toggle-disabled': this.disabled,
        'toggle-key': this.keyFocus
      }
    };
  }

  render() {
    return [
      <ion-gesture {...this.gestureConfig}
        disabled={this.disabled} tabIndex={-1}>
        <div class='toggle-icon'>
          <div class='toggle-inner'/>
        </div>
        <div class='toggle-cover'/>
      </ion-gesture>,
      <input
        type='checkbox'
        onChange={this.onChange.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onKeyUp={this.onKeyUp.bind(this)}
        checked={this.checked}
        id={this.inputId}
        name={this.name}
        value={this.value}
        disabled={this.disabled}
        ref={r => this.nativeInput = (r as any)}/>
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
