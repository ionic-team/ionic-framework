import { Component, Event, EventEmitter, Listen, Method, Prop, PropDidChange, State } from '@stencil/core';
import { BooleanInputComponent, GestureDetail } from '../../index';
import { hapticSelection } from '../../utils/haptic';


@Component({
  tag: 'ion-toggle',
  styleUrls: {
    ios: 'toggle.ios.scss',
    md: 'toggle.md.scss',
    wp: 'toggle.wp.scss'
  },
  host: {
    theme: 'toggle'
  }
})
export class Toggle implements BooleanInputComponent {
  private toggleId: string;
  private labelId: string;
  private styleTmr: any;
  private gestureConfig: any;
  private pivotX: number;

  hasFocus: boolean = false;

  @State() activated: boolean = false;
  /**
   * @output {Event} Emitted when the value property has changed.
   */
  @Event() ionChange: EventEmitter;

  /**
   * @output {Event} Emitted when the styles change.
   */
  @Event() ionStyle: EventEmitter;

  /**
   * @output {Event} Emitted when the toggle has focus.
   */
  @Event() ionFocus: EventEmitter;

  /**
   * @output {Event} Emitted when the toggle loses focus.
   */
  @Event() ionBlur: EventEmitter;

  /**
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"`, `"md"`, or `"wp"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md' | 'wp';

  /**
   * @input {boolean} If true, the toggle is selected. Defaults to `false`.
   */
  @Prop({ mutable: true }) checked: boolean = false;

  @PropDidChange('checked')
  protected checkedChanged(val: boolean) {
    this.ionChange.emit({ checked: val });
    this.emitStyle();
  }

  /*
   * @input {boolean} If true, the user cannot interact with the toggle. Default false.
   */
  @Prop({ mutable: true }) disabled: boolean = false;

  @PropDidChange('disabled')
  protected disabledChanged() {
    this.emitStyle();
  }

  /**
   * @input {string} the value of the toggle.
   */
  @Prop({ mutable: true }) value: string;

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

  protected ionViewWillLoad() {
    this.emitStyle();
  }

  @Listen('keydown.space')
  onSpace(ev: KeyboardEvent) {
    this.toggle();
    ev.stopPropagation();
    ev.preventDefault();
  }

  @Method()
  toggle() {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.fireFocus();
    }
    return this.checked;
  }

  private onDragStart(detail: GestureDetail) {
    this.pivotX = detail.currentX;
    this.activated = true;
    this.fireFocus();
  }

  private onDragMove(detail: GestureDetail) {
    const currentX = detail.currentX;
    const checked = this.checked;
    if (shouldToggle(checked, currentX - this.pivotX, -15)) {
      this.checked = !checked;
      this.pivotX = currentX;
      hapticSelection();
    }
  }

  private onDragEnd(detail: GestureDetail) {
    const delta = detail.currentX - this.pivotX;
    const checked = this.checked;
    if (shouldToggle(checked, delta, 4)) {
      this.checked = !checked;
      hapticSelection();
    }

    this.activated = false;
    this.fireBlur();
  }

  private emitStyle() {
    clearTimeout(this.styleTmr);

    this.styleTmr = setTimeout(() => {
      this.ionStyle.emit({
        'toggle-disabled': this.disabled,
        'toggle-checked': this.checked,
        'toggle-activated': this.activated,
        'toggle-focus': this.hasFocus
      });
    });
  }

  fireFocus() {
    if (!this.hasFocus) {
      this.hasFocus = true;
      this.ionFocus.emit();
      this.emitStyle();
    }
  }

  fireBlur() {
    if (this.hasFocus) {
      this.hasFocus = false;
      this.ionBlur.emit();
      this.emitStyle();
    }
  }

  protected hostData() {
    return {
      class: {
        'toggle-activated': this.activated,
        'toggle-checked': this.checked,
        'toggle-disabled': this.disabled
      }
    };
  }

  protected render() {
    return (
      <ion-gesture {...this.gestureConfig}
        enabled={!this.disabled}
      >
        <div class='toggle-icon'>
          <div class='toggle-inner'></div>
        </div>
        <div
          class='toggle-cover'
          id={this.toggleId}
          aria-checked={this.checked ? 'true' : false}
          aria-disabled={this.disabled ? 'true' : false}
          aria-labelledby={this.labelId}
          role='checkbox'
          tabIndex={0}
        >
        </div>
      </ion-gesture>
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
