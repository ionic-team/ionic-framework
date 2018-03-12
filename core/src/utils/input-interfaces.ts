import { EventEmitter } from '@stencil/core';


export interface BaseInput {

  /**
   * Indicates that the user cannot interact with the control.
   */
  disabled: boolean;

  /**
   * Returns / Sets the element's readonly attribute, indicating that
   * the user cannot modify the value of the control. HTML5. This is
   * ignored if the value of the type attribute is hidden, range, color,
   * checkbox, radio, file, or a button type.
   */
  readOnly?: boolean;

  /**
   * Reflects the value of the form control.
   */
  value: string;

}


export interface CheckboxInput extends BaseInput {
  /**
   * Returns / Sets the current state of the element when type is checkbox or radio.
   */
  checked: boolean;

  name: string;

  /**
   * The change event is fired when the value of has changed.
   */
  ionChange: EventEmitter<CheckedInputChangeEvent>;

  /**
   * Removes focus from input; keystrokes will subsequently go nowhere.
   */
  ionBlur: EventEmitter<BlurEvent>;

  /**
   * Focus on the input element; keystrokes will subsequently go to this element.
   */
  ionFocus: EventEmitter<FocusEvent>;

  /**
   * Emitted when the styles change. This is useful for parent
   * components to know how to style themselves depending on the
   * child input. For example, a disabled ion-toggle may give
   * its wrapping ion-item a different style.
   */
  ionStyle: EventEmitter<StyleEvent>;
}


export interface RadioButtonInput extends BaseInput {
  /**
   * Returns / Sets the current state of the element when type is checkbox or radio.
   */
  checked: boolean;

  name: string;

  /**
   * A single radio button fires an ionSelect event, whereas
   * a radio group fires an ionChange event. It would be more common
   * to attach listeners to the radio group, not individual radio buttons.
   */
  ionSelect: EventEmitter<CheckedInputChangeEvent>;

  /**
   * Removes focus from input; keystrokes will subsequently go nowhere.
   */
  ionBlur: EventEmitter<BlurEvent>;

  /**
   * Focus on the input element; keystrokes will subsequently go to this element.
   */
  ionFocus: EventEmitter<FocusEvent>;
}


export interface InputChangeEvent {
  value: string;
}


export interface CheckedInputChangeEvent extends InputChangeEvent {
  checked: boolean;
}


export interface SelectInput extends BaseInput {
  /**
   * Indicates whether the option is currently selected.
   */
  selected: boolean;

  /**
   * A long reflecting the index of the first selected <option> element.
   * The value -1 indicates no element is selected.
   */
  selectedIndex: number;

  /**
   * Reflecting the multiple HTML attribute, which indicates
   * whether multiple items can be selected.
   */
  multiple: boolean;

  name: string;

  /**
   * The change event is fired when the value of has changed.
   * This is actually more similar to the native "input" event
   * https://developer.mozilla.org/en-US/docs/Web/Events/input
   */
  ionChange: EventEmitter<CheckedInputChangeEvent>;

  /**
   * Removes focus from input; keystrokes will subsequently go nowhere.
   */
  ionBlur: EventEmitter<BlurEvent>;

  /**
   * Focus on the input element; keystrokes will subsequently go to this element.
   */
  ionFocus: EventEmitter<FocusEvent>;

  /**
   * Emitted when the styles change. This is useful for parent
   * components to know how to style themselves depending on the
   * child input. For example, a disabled ion-toggle may give
   * its wrapping ion-item a different style.
   */
  ionStyle: EventEmitter<StyleEvent>;
}


export interface SelectInputChangeEvent {
  value: string|string[];
  text: string;
}


export interface RadioGroupInput extends BaseInput {
  ionChange: EventEmitter<InputChangeEvent>;
}


export interface TextInput extends BaseInput {
  /**
   * The change event is fired when the value of has changed.
   * This is actually more similar to the native "input" event
   * https://developer.mozilla.org/en-US/docs/Web/Events/input
   */
  ionChange: EventEmitter<CheckedInputChangeEvent>;

  /**
   * Removes focus from input; keystrokes will subsequently go nowhere.
   */
  ionBlur: EventEmitter<BlurEvent>;

  /**
   * Focus on the input element; keystrokes will subsequently go to this element.
   */
  ionFocus: EventEmitter<FocusEvent>;

  /**
   * Emitted when the styles change. This is useful for parent
   * components to know how to style themselves depending on the
   * child input. For example, a disabled ion-toggle may give
   * its wrapping ion-item a different style.
   */
  ionStyle: EventEmitter<StyleEvent>;
}


export interface TextMultiLineInput extends TextInput {
  /**
   * The change event is fired when the value of has changed.
   * This is actually more similar to the native "input" event
   * https://developer.mozilla.org/en-US/docs/Web/Events/input
   */
  ionChange: EventEmitter<CheckedInputChangeEvent>;

  /**
   * Removes focus from input; keystrokes will subsequently go nowhere.
   */
  ionBlur: EventEmitter<BlurEvent>;

  /**
   * Focus on the input element; keystrokes will subsequently go to this element.
   */
  ionFocus: EventEmitter<FocusEvent>;

  /**
   * Emitted when the styles change. This is useful for parent
   * components to know how to style themselves depending on the
   * child input. For example, a disabled ion-toggle may give
   * its wrapping ion-item a different style.
   */
  ionStyle: EventEmitter<StyleEvent>;
}


export interface StyleEvent {
  [styleName: string]: boolean;
}


export interface FocusEvent {}


export interface BlurEvent {}

