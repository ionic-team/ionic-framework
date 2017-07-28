import { Component, Element, Event, EventEmitter, Prop, PropDidChange } from '@stencil/core';

import { createThemedClasses } from '../../utils/theme';


@Component({
  tag: 'ion-input',
  styleUrls: {
    ios: 'input.ios.scss',
    md: 'input.md.scss',
    wp: 'input.wp.scss'
  },
  host: {
    theme: 'input'
  }
})
export class Input {
  mode: any;
  color: any;
  styleTmr: any;
  didBlurAfterEdit: boolean;

  @Element() el: HTMLElement;

  /**
   * @output {event} Emitted when the styles change.
   */
  @Event() ionStyle: EventEmitter;

  /**
   * @output {event} Emitted when the input no longer has focus.
   */
  @Event() ionBlur: EventEmitter;

  /**
   * @output {event} Emitted when the input has focus.
   */
  @Event() ionFocus: EventEmitter;

  /**
   * @input {string} Indicates whether the value of the control can be automatically completed by the browser. Defaults to `"off"`.
   */
  @Prop() autocomplete: string = 'off';

  /**
   * @input {string} Whether autocorrection should be enabled when the user is entering/editing the text value. Defaults to `"off"`.
   */
  @Prop() autocorrect: string = 'off';

  /**
   * @input {string} This Boolean attribute lets you specify that a form control should have input focus when the page loads. Defaults to `false`.
   */
  @Prop() autofocus: boolean;

  /**
   * @input {boolean} If true and the type is `checkbox` or `radio`, the control is selected by default. Defaults to `false`.
   */
  @Prop() checked: boolean = false;

  /**
   * @hidden
   */
  @PropDidChange('checked')
  setChecked() {
    this.emitStyle();
  }


  /**
   * @input {boolean} If true, a clear icon will appear in the input when there is a value. Clicking it clears the input. Defaults to `false`.
   */
  @Prop() clearInput: boolean = false;

  /**
   * @input {boolean} If true, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types. Defaults to `false`.
   */
  @Prop({state: true}) clearOnEdit: boolean;

  /**
   * @input {boolean} If true, the user cannot interact with this element. Defaults to `false`.
   */
  @Prop() disabled: boolean = false;

  /**
   * @hidden
   */
  @PropDidChange('disabled')
  setDisabled() {
    this.emitStyle();
  }

  /**
   * @input {any} The minimum value, which must not be greater than its maximum (max attribute) value.
   */
  @Prop() min: string;

  /**
   * @input {any} The maximum value, which must not be less than its minimum (min attribute) value.
   */
  @Prop() max: string;

  /**
   * @input {string} Instructional text that shows before the input has a value.
   */
  @Prop() placeholder: string;

  /**
   * @input {boolean} If true, the user cannot modify the value. Defaults to `false`.
   */
  @Prop() readonly: boolean = false;

  /**
   * @input {string} If true, the element will have its spelling and grammar checked. Defaults to `false`.
   */
  @Prop() spellcheck: boolean = false;

  /**
   * @input {any} Works with the min and max attributes to limit the increments at which a value can be set.
   */
  @Prop() step: string;

  /**
   * @input {string} The type of control to display. The default type is text. Possible values are: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, or `"url"`.
   */
  @Prop() type: string = 'text';

  /**
   * @input {string} The text value of the input.
   */
  @Prop({ state: true }) value: string;


  ionViewDidLoad() {
    this.emitStyle();

    // By default, password inputs clear after focus when they have content
    if (this.type === 'password' && this.clearOnEdit !== false) {
      this.clearOnEdit = true;
    }
  }

  private emitStyle() {
    clearTimeout(this.styleTmr);

    let styles = {
      'input': true,
      'input-checked': this.checked,
      'input-disabled': this.disabled,
      'input-has-value': this.hasValue(),
      'input-has-focus': this.hasFocus()
    };

    this.styleTmr = setTimeout(() => {
      this.ionStyle.emit(styles);
    });
  }

  /**
   * @hidden
   */
  hasValue(): boolean {
    return (this.value !== null && this.value !== undefined && this.value !== '');
  }


  /**
   * @hidden
   */
  inputBlurred(ev: any) {
    this.ionBlur.emit(ev);

    this.focusChange(this.hasFocus());
    this.emitStyle();
  }


  /**
   * @hidden
   */
  inputChanged(ev: any) {
    this.value = ev.target && ev.target.value;
    this.emitStyle();
  }


  /**
   * @hidden
   */
  inputFocused(ev: any) {
    this.ionFocus.emit(ev);

    this.focusChange(this.hasFocus());
    this.emitStyle();
  }


  /**
   * @hidden
   */
  hasFocus(): boolean {
    // check if an input has focus or not
    return this.el && (this.el.querySelector(':focus') === this.el.querySelector('input'));
  }


  /**
   * @hidden
   */
  focusChange(inputHasFocus: boolean) {
    // If clearOnEdit is enabled and the input blurred but has a value, set a flag
    if (this.clearOnEdit && !inputHasFocus && this.hasValue()) {
      this.didBlurAfterEdit = true;
    }
  }


  /**
   * @hidden
   */
  inputKeydown() {
    this.checkClearOnEdit();
  }


  /**
  * Check if we need to clear the text input if clearOnEdit is enabled
  * @hidden
  */
  checkClearOnEdit() {
    if (!this.clearOnEdit) {
      return;
    }

    // Did the input value change after it was blurred and edited?
    if (this.didBlurAfterEdit && this.hasValue()) {
      // Clear the input
      this.clearTextInput();
    }

    // Reset the flag
    this.didBlurAfterEdit = false;
  }


  /**
   * @hidden
   */
  clearTextInput() {
    console.debug('Should clear input', this.el);
    this.value = '';
  }


  render() {
    const themedClasses = createThemedClasses(this.mode, this.color, 'text-input');
    // TODO aria-labelledby={this.item.labelId}

    // OLD RENDER
    // '<input [(ngModel)]="_value" [type]="type" (blur)="inputBlurred($event)" (focus)="inputFocused($event)" [placeholder]="placeholder" [disabled]="disabled" [readonly]="readonly" class="text-input" [ngClass]="\'text-input-\' + _mode" *ngIf="_type!==\'textarea\'"  #input>' +
    // '<textarea [(ngModel)]="_value" (blur)="inputBlurred($event)" (focus)="inputFocused($event)" [placeholder]="placeholder" [disabled]="disabled" [readonly]="readonly" class="text-input" [ngClass]="\'text-input-\' + _mode" *ngIf="_type===\'textarea\'" #textarea></textarea>' +
    // '<input [type]="type" aria-hidden="true" next-input *ngIf="_useAssist">' +
    // '<ion-button clear [hidden]="!clearInput" type="button" class="text-input-clear-icon" (click)="clearTextInput()" (mousedown)="clearTextInput()"></ion-button>' +
    // '<div (touchstart)="pointerStart($event)" (touchend)="pointerEnd($event)" (mousedown)="pointerStart($event)" (mouseup)="pointerEnd($event)" class="input-cover" tappable *ngIf="_useAssist"></div>',

    return (
      <input
        aria-disabled={this.disabled ? 'true' : false}
        autoComplete={this.autocomplete}
        autoCorrect={this.autocorrect}
        autoFocus={this.autofocus}
        checked={this.checked}
        disabled={this.disabled}
        min={this.min}
        max={this.max}
        placeholder={this.placeholder}
        readOnly={this.readonly}
        spellCheck={this.spellcheck}
        step={this.step}
        type={this.type}
        value={this.value}
        class={themedClasses}
        onBlur={this.inputBlurred.bind(this)}
        onInput={this.inputChanged.bind(this)}
        onFocus={this.inputFocused.bind(this)}
        onKeyDown={this.inputKeydown.bind(this)}
      />
    )
  }
}
