import { EventEmitter } from '@stencil/core';


export interface BaseInput {

  // Properties
  // ------------------------

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


  // Events
  // ------------------------

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


export interface BooleanInput extends BaseInput {
  /**
   * Returns / Sets the current state of the element when type is checkbox or radio.
   */
  checked: boolean;

  /**
   * The change event is fired when the value of has changed.
   * This is actually more similar to the native "input" event
   * https://developer.mozilla.org/en-US/docs/Web/Events/input
   */
  ionChange: EventEmitter<BooleanInputChangeEvent>;
}


export interface BooleanInputChangeEvent {
  checked: boolean;
}


export interface SelectOptionInput extends BaseInput {
  /**
   * Indicates whether the option is currently selected.
   */
  selected: boolean;

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
}


export interface TextInput extends BaseInput {
  /**
   *
   */
}


export interface TextMultiLineInput extends TextInput {

}


export interface StyleEvent {
  [styleName: string]: boolean;
}


export interface FocusEvent {}


export interface BlurEvent {}

