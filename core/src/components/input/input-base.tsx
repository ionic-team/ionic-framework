// Shared Interfaces

import { EventEmitter } from '@stencil/core';

export interface InputBaseComponent {
  ionStyle: EventEmitter;
  ionBlur: EventEmitter;
  ionFocus: EventEmitter;

  clearOnEdit: boolean;
  didBlurAfterEdit: boolean;
  styleTmr?: number;

  // Shared Attributes
  autocapitalize?: string;
  autocomplete?: string;
  autofocus?: boolean;
  disabled?: boolean;
  minlength?: number;
  maxlength?: number;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  spellcheck?: boolean;
  value?: string;
}

export interface InputComponent extends InputBaseComponent {
  clearInput: boolean;

  // Input Attributes
  accept?: string;
  autocorrect?: string;
  min?: string;
  max?: string;
  multiple?: boolean;
  pattern?: string;
  results?: number;
  step?: string;
  size?: number;
  type?: string;
}

export interface TextareaComponent extends InputBaseComponent {

  // Textarea Attributes
  cols?: number;
  rows?: number;
  wrap?: string;
}
