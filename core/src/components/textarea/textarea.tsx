import { Component, Element, Event, EventEmitter, Prop, Watch } from '@stencil/core';

import { Color, InputChangeEvent, Mode, StyleEvent } from '../../interface';
import { debounceEvent, deferEvent } from '../../utils/helpers';
import { createThemedClasses } from '../../utils/theme';
import { TextareaComponent } from '../input/input-base';


@Component({
  tag: 'ion-textarea',
  styleUrls: {
    ios: 'textarea.ios.scss',
    md: 'textarea.md.scss'
  },
  host: {
    theme: 'textarea'
  }
})
export class Textarea implements TextareaComponent {

  mode!: Mode;
  color?: Color;

  didBlurAfterEdit = false;

  @Element() el!: HTMLElement;

  /**
   * Emitted when the input value has changed.
   */
  @Event() ionChange!: EventEmitter<InputChangeEvent>;

  /**
   * Emitted when a keyboard input ocurred.
   */
  @Event() ionInput!: EventEmitter<KeyboardEvent>;

  /**
   * Emitted when the styles change.
   */
  @Event() ionStyle!: EventEmitter<StyleEvent>;

  /**
   * Emitted when the input loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  /**
   * Emitted when the input has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user. Defaults to `"none"`.
   */
  @Prop() autocapitalize = 'none';

  /**
   * Indicates whether the value of the control can be automatically completed by the browser. Defaults to `"off"`.
   */
  @Prop() autocomplete = 'off';

  /**
   * This Boolean attribute lets you specify that a form control should have input focus when the page loads. Defaults to `false`.
   */
  @Prop() autofocus = false;

  /**
   * If true, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.
   */
  @Prop({ mutable: true }) clearOnEdit = false;

  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke. Default `0`.
   */
  @Prop() debounce = 0;

  @Watch('debounce')
  protected debounceChanged() {
    this.ionChange = debounceEvent(this.ionChange, this.debounce);
  }

  /**
   * If true, the user cannot interact with the textarea. Defaults to `false`.
   */
  @Prop() disabled = false;

  @Watch('disabled')
  protected disabledChanged() {
    this.emitStyle();
  }

  /**
   * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.
   */
  @Prop() maxlength?: number;

  /**
   * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.
   */
  @Prop() minlength?: number;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name?: string;

  /**
   * Instructional text that shows before the input has a value.
   */
  @Prop() placeholder?: string;

  /**
   * If true, the user cannot modify the value. Defaults to `false`.
   */
  @Prop() readonly = false;

  /**
   * If true, the user must fill in a value before submitting a form.
   */
  @Prop() required = false;

  /**
   * If true, the element will have its spelling and grammar checked. Defaults to `false`.
   */
  @Prop() spellcheck = false;

  /**
   * The visible width of the text control, in average character widths. If it is specified, it must be a positive integer.
   */
  @Prop() cols?: number;

  /**
   * The number of visible text lines for the control.
   */
  @Prop() rows?: number;

  /**
   * Indicates how the control wraps text. Possible values are: `"hard"`, `"soft"`, `"off"`.
   */
  @Prop() wrap?: string;

  /**
   * The value of the textarea.
   */
  @Prop({ mutable: true }) value = '';

  /**
   * Update the native input element when the value changes
   */
  @Watch('value')
  protected valueChanged() {
    const inputEl = this.el.querySelector('textarea')!;
    const value = this.value;
    if (inputEl.value !== value) {
      inputEl.value = value;
    }
    this.ionChange.emit({value});
  }

  componentDidLoad() {
    this.ionStyle = deferEvent(this.ionStyle);
    this.debounceChanged();
    this.emitStyle();
  }

  private emitStyle() {
    this.ionStyle.emit({
      'interactive': true,
      'textarea': true,
      'input': true,
      'input-disabled': this.disabled,
      'input-has-value': this.hasValue(),
      'input-has-focus': this.hasFocus()
    });
  }

  private clearTextInput() {
    this.value = '';
  }

  private onInput(ev: KeyboardEvent) {
    this.value = ev.target && (ev.target as HTMLInputElement).value || '';
    this.emitStyle();
    this.ionInput.emit(ev);
  }

  private onFocus() {
    this.focusChange();
    this.emitStyle();

    this.ionFocus.emit();
  }

  private onBlur() {
    this.focusChange();
    this.emitStyle();

    this.ionBlur.emit();
  }


  private onKeyDown() {
    this.checkClearOnEdit();
  }

  /**
   * Check if we need to clear the text input if clearOnEdit is enabled
   */
  private checkClearOnEdit() {
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

  private focusChange() {
    // If clearOnEdit is enabled and the input blurred but has a value, set a flag
    if (this.clearOnEdit && !this.hasFocus() && this.hasValue()) {
      this.didBlurAfterEdit = true;
    }
  }

  private hasFocus(): boolean {
    // check if an input has focus or not
    return this.el && (this.el.querySelector(':focus') === this.el.querySelector('textarea'));
  }

  private hasValue(): boolean {
    return this.value !== '';
  }

  render() {
    const themedClasses = createThemedClasses(this.mode, this.color, 'native-textarea');
    // TODO aria-labelledby={this.item.labelId}

    return (
      <textarea
        autoCapitalize={this.autocapitalize}
        // autoComplete={this.autocomplete}
        autoFocus={this.autofocus}
        disabled={this.disabled}
        maxLength={this.maxlength}
        minLength={this.minlength}
        name={this.name}
        placeholder={this.placeholder}
        readOnly={this.readonly}
        required={this.required}
        spellCheck={this.spellcheck}
        cols={this.cols}
        rows={this.rows}
        wrap={this.wrap}
        class={themedClasses}
        onInput={this.onInput.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onKeyDown={this.onKeyDown.bind(this)}
      >
        {this.value}
      </textarea>
    );
  }
}
