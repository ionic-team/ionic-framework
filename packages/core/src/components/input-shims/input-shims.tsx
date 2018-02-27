import { Component, Listen, Prop } from "@stencil/core";
import { App, Config } from "../..";

import enableHideCaretOnScroll from "./hacks/hide-caret";
import enableInputBlurring from "./hacks/input-blurring";

@Component({
  tag: 'ion-input-shims',
})
export class InputShims {

  private didLoad = false;
  private hideCaret = false;
  private keyboardHeight = 0;
  private hideCaretMap = new WeakMap<HTMLElement, Function>();

  @Prop({context: 'config'}) config: Config;
  @Prop() app: App;

  componentDidLoad() {
    this.keyboardHeight = this.config.getNumber('keyboardHeight', 200);
    this.hideCaret = this.config.getBoolean('hideCaretOnScroll', true);

    const inputBlurring = this.config.getBoolean('inputBlurring', true);
    if (inputBlurring) {
      enableInputBlurring(this.app);
    }

    // Input might be already loaded in the DOM before ion-device-hacks did.
    // At this point we need to look for all the ion-inputs not registered yet
    // and register them.
    const inputs = Array.from(document.querySelectorAll('ion-input'));
    for (let input of inputs) {
      this.registerInput(input);
    }
    this.didLoad = true;
  }

  @Listen('body:ionInputDidLoad')
  protected onInputDidLoad(event: CustomEvent<HTMLElement>) {
    // TODO: remove if fixed: https://github.com/ionic-team/stencil/issues/576
    if (this.didLoad) {
      this.registerInput(event.detail);
    }
  }

  @Listen('body:ionInputDidUnload')
  protected onInputDidUnload(event: CustomEvent<HTMLElement>) {
    // TODO: remove if fixed: https://github.com/ionic-team/stencil/issues/576
    if (this.didLoad) {
      this.unregisterInput(event.detail);
    }
  }

  private registerInput(componentEl: HTMLElement) {
    if (this.hideCaret && !this.hideCaretMap.has(componentEl)) {
      const rmFn = enableHideCaretOnScroll(
        componentEl,
        componentEl.querySelector('input'),
        componentEl.closest('ion-scroll'),
        this.keyboardHeight
      );
      this.hideCaretMap.set(componentEl, rmFn);
    }
  }

  private unregisterInput(componentEl: HTMLElement) {
    if (this.hideCaret) {
      const fn = this.hideCaretMap.get(componentEl);
      fn && fn();
    }
  }
}
