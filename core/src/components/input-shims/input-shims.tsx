import { Component, Listen, Prop } from '@stencil/core';
import { Config } from '../..';

import enableHideCaretOnScroll from './hacks/hide-caret';
import enableInputBlurring from './hacks/input-blurring';
import enableScrollAssist from './hacks/scroll-assist';
import enableScrollPadding from './hacks/scroll-padding';

const INPUT_BLURRING = true;
const SCROLL_ASSIST = true;
const SCROLL_PADDING = true;
const HIDE_CARET = true;

@Component({
  tag: 'ion-input-shims',
})
export class InputShims {

  private didLoad = false;
  private hideCaret = false;
  private scrollAssist = false;
  private keyboardHeight = 0;
  private hideCaretMap = new WeakMap<HTMLElement, Function>();
  private scrollAssistMap = new WeakMap<HTMLElement, Function>();

  @Prop({ context: 'config' }) config!: Config;
  @Prop({ context: 'document' }) doc!: Document;

  componentDidLoad() {
    this.keyboardHeight = this.config.getNumber('keyboardHeight', 290);
    this.scrollAssist = this.config.getBoolean('scrollAssist', true);
    this.hideCaret = this.config.getBoolean('hideCaretOnScroll', true);

    const inputBlurring = this.config.getBoolean('inputBlurring', true);
    if (inputBlurring && INPUT_BLURRING) {
      enableInputBlurring(this.doc);
    }

    const scrollPadding = this.config.getBoolean('scrollPadding', true);
    if (scrollPadding && SCROLL_PADDING) {
      enableScrollPadding(this.doc, this.keyboardHeight);
    }

    // Input might be already loaded in the DOM before ion-device-hacks did.
    // At this point we need to look for all the ion-inputs not registered yet
    // and register them.
    const inputs = Array.from(this.doc.querySelectorAll('ion-input'));
    for (const input of inputs) {
      this.registerInput(input);
    }
    this.didLoad = true;
  }

  @Listen('body:ionInputDidLoad')
  protected onInputDidLoad(event: any) {
    if (this.didLoad) {
      this.registerInput(event.target);
    }
  }

  @Listen('body:ionInputDidUnload')
  protected onInputDidUnload(event: any) {
    if (this.didLoad) {
      this.unregisterInput(event.target);
    }
  }

  private registerInput(componentEl: HTMLElement) {
    const inputEl = componentEl.querySelector('input');
    const scrollEl = componentEl.closest('ion-scroll');
    const contentEl = componentEl.closest('ion-content');

    if (!inputEl) {
      return;
    }

    if (HIDE_CARET && scrollEl && this.hideCaret && !this.hideCaretMap.has(componentEl)) {
      const rmFn = enableHideCaretOnScroll(componentEl, inputEl, scrollEl);
      this.hideCaretMap.set(componentEl, rmFn);
    }

    if (SCROLL_ASSIST && contentEl && this.scrollAssist && !this.scrollAssistMap.has(componentEl)) {
      const rmFn = enableScrollAssist(componentEl, inputEl, contentEl, this.keyboardHeight);
      this.scrollAssistMap.set(componentEl, rmFn);
    }
  }

  private unregisterInput(componentEl: HTMLElement) {
    if (HIDE_CARET && this.hideCaret) {
      const fn = this.hideCaretMap.get(componentEl);
      fn && fn();
      this.hideCaretMap.delete(componentEl);
    }

    if (SCROLL_ASSIST && this.scrollAssist) {
      const fn = this.scrollAssistMap.get(componentEl);
      fn && fn();
      this.scrollAssistMap.delete(componentEl);
    }
  }
}
