import { EventEmitter } from '@stencil/core';
import { Config } from '../..';

export interface KeyboardController {
  config?: Config;
  dom?: any; // TODO, make dom controller
  keyboardWillShow?: EventEmitter;
  keyboardDidShow?: EventEmitter;
  keyboardWillHide?: EventEmitter;
  keyboardDidHide?: EventEmitter;

  isOpen?(): boolean;
  onClose?(callback: Function, pollingInterval: number, maxPollingchecks: number): Promise<any>;
}