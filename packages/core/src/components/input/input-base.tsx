// Shared Interfaces

import { EventEmitter } from '@stencil/core';

export interface InputBaseComponent {
  ionStyle: EventEmitter;
  ionBlur: EventEmitter;
  ionFocus: EventEmitter;

  clearOnEdit: boolean;
  didBlurAfterEdit: boolean;
  styleTmr: number;

  // Shared Attributes
  autocapitalize: string;
  autocomplete: string;
  autofocus: boolean;
  disabled: boolean;
  minlength: number;
  maxlength: number;
  name: string;
  placeholder: string;
  readonly: boolean;
  required: boolean;
  spellcheck: boolean;
  value: string;

  // Shared Methods
  inputBlurred: (ev: any) => void;
  inputChanged: (ev: any) => void;
  inputFocused: (ev: any) => void;
  inputKeydown: (ev: any) => void;

  disabledChanged: (ev: any) => void;
  valueChanged: (ev: any) => void;
}

export interface InputComponent extends InputBaseComponent {
  clearInput: boolean;

  // Input Attributes
  accept: string;
  autocorrect: string;
  inputmode: string;
  min: string;
  max: string;
  multiple: boolean;
  pattern: string;
  results: number;
  step: string;
  size: number;
  type: string;

  checkedChanged: (ev: any) => void;
}

export interface TextareaComponent extends InputBaseComponent {

  // Textarea Attributes
  cols: number;
  rows: number;
  wrap: string;
}
