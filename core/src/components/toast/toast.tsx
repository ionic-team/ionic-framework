import { Component, ComponentInterface, Element, Event, EventEmitter, Method, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Animation, AnimationBuilder, Color, CssClassMap, OverlayEventDetail, OverlayInterface, ToastButton } from '../../interface';
import { dismiss, eventMethod, isCancel, present, safeCall } from '../../utils/overlays';
import { sanitizeDOMString } from '../../utils/sanitization';
import { createColorClasses, getClassMap } from '../../utils/theme';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-toast',
  styleUrls: {
    ios: 'toast.ios.scss',
    md: 'toast.md.scss'
  },
  shadow: true
})
export class Toast implements ComponentInterface, OverlayInterface {

  private durationTimeout: any;

  presented = false;
  animation?: Animation;
  mode = getIonMode(this);

  @Element() el!: HTMLElement;

  /**
   * @internal
   */
  @Prop() overlayIndex!: number;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * Animation to use when the toast is presented.
   */
  @Prop() enterAnimation?: AnimationBuilder;

  /**
   * Animation to use when the toast is dismissed.
   */
  @Prop() leaveAnimation?: AnimationBuilder;

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass?: string | string[];

  /**
   * How many milliseconds to wait before hiding the toast. By default, it will show
   * until `dismiss()` is called.
   */
  @Prop() duration = 0;

  /**
   * Header to be shown in the toast.
   */
  @Prop() header?: string;

  /**
   * Message to be shown in the toast.
   */
  @Prop() message?: string;

  /**
   * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
   */
  @Prop() keyboardClose = false;

  /**
   * The position of the toast on the screen.
   */
  @Prop() position: 'top' | 'bottom' | 'middle' = 'bottom';

  /**
   * If `true`, the close button will be displayed.
   */
  @Prop() showCloseButton = false;

  /**
   * Text to display in the close button.
   */
  @Prop() closeButtonText?: string;

  /**
   * An array of buttons for the toast.
   */
  @Prop() buttons?: (ToastButton | string)[];

  /**
   * If `true`, the toast will be translucent.
   */
  @Prop() translucent = false;

  /**
   * If `true`, the toast will animate.
   */
  @Prop() animated = true;

  /**
   * Emitted after the toast has presented.
   */
  @Event({ eventName: 'ionToastDidPresent' }) didPresent!: EventEmitter<void>;

  /**
   * Emitted before the toast has presented.
   */
  @Event({ eventName: 'ionToastWillPresent' }) willPresent!: EventEmitter<void>;

  /**
   * Emitted before the toast has dismissed.
   */
  @Event({ eventName: 'ionToastWillDismiss' }) willDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the toast has dismissed.
   */
  @Event({ eventName: 'ionToastDidDismiss' }) didDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Present the toast overlay after it has been created.
   */
  @Method()
  async present(): Promise<void> {
    await present(this, 'toastEnter', iosEnterAnimation, mdEnterAnimation, this.position);

    if (this.duration > 0) {
      this.durationTimeout = setTimeout(() => this.dismiss(undefined, 'timeout'), this.duration);
    }
  }

  /**
   * Dismiss the toast overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the toast.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the toast.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   */
  @Method()
  dismiss(data?: any, role?: string): Promise<boolean> {
    if (this.durationTimeout) {
      clearTimeout(this.durationTimeout);
    }
    return dismiss(this, data, role, 'toastLeave', iosLeaveAnimation, mdLeaveAnimation, this.position);
  }

  /**
   * Returns a promise that resolves when the toast did dismiss.
   */
  @Method()
  onDidDismiss(): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionToastDidDismiss');
  }

  /**
   * Returns a promise that resolves when the toast will dismiss.
   */
  @Method()
  onWillDismiss(): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionToastWillDismiss');
  }

  private getButtons(): ToastButton[] {
    const buttons = this.buttons
      ? this.buttons.map(b => {
        return (typeof b === 'string')
          ? { text: b }
          : b;
      })
      : [];

    if (this.showCloseButton) {
      buttons.push({
        text: this.closeButtonText || 'Close',
        handler: () => this.dismiss(undefined, 'cancel')
      });
    }

    return buttons;
  }

  private async buttonClick(button: ToastButton) {
    const role = button.role;
    if (isCancel(role)) {
      return this.dismiss(undefined, role);
    }
    const shouldDismiss = await this.callButtonHandler(button);
    if (shouldDismiss) {
      return this.dismiss(undefined, button.role);
    }
    return Promise.resolve();
  }

  private async callButtonHandler(button: ToastButton | undefined) {
    if (button && button.handler) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      try {
        const rtn = await safeCall(button.handler);
        if (rtn === false) {
          // if the return value of the handler is false then do not dismiss
          return false;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  }

  hostData() {
    const mode = getIonMode(this);
    return {
      style: {
        zIndex: 60000 + this.overlayIndex,
      },
      class: {
        [mode]: true,

        ...createColorClasses(this.color),
        ...getClassMap(this.cssClass),
        'toast-translucent': this.translucent
      }
    };
  }

  renderButtons(buttons: ToastButton[], side: 'start' | 'end') {
    if (buttons.length === 0) {
      return;
    }

    const mode = getIonMode(this);
    const buttonGroupsClasses = {
      'toast-button-group': true,
      [`toast-button-group-${side}`]: true
    };
    return (
      <div class={buttonGroupsClasses}>
        {buttons.map(b =>
          <button type="button" class={buttonClass(b)} tabIndex={0} onClick={() => this.buttonClick(b)}>
            <div class="toast-button-inner">
              {b.icon &&
                <ion-icon
                  name={b.icon}
                  slot={b.text === undefined ? 'icon-only' : undefined}
                  class="toast-icon"
                />}
              {b.text}
            </div>
            {mode === 'md' && <ion-ripple-effect type={b.icon !== undefined && b.text === undefined ? 'unbounded' : 'bounded'}></ion-ripple-effect>}
          </button>
        )}
      </div>
    );
  }

  render() {
    const allButtons = this.getButtons();
    const startButtons = allButtons.filter(b => b.side === 'start');
    const endButtons = allButtons.filter(b => b.side !== 'start');

    const wrapperClass = {
      'toast-wrapper': true,
      [`toast-${this.position}`]: true
    };

    return (
      <div class={wrapperClass}>
        <div class="toast-container">
          {this.renderButtons(startButtons, 'start')}

          <div class="toast-content">
            {this.header !== undefined &&
              <div class="toast-header">{this.header}</div>
            }
            {this.message !== undefined &&
              <div class="toast-message" innerHTML={sanitizeDOMString(this.message)}></div>
            }
          </div>

          {this.renderButtons(endButtons, 'end')}
        </div>
      </div>
    );
  }
}

const buttonClass = (button: ToastButton): CssClassMap => {
  return {
    'toast-button': true,
    'toast-button-icon-only': button.icon !== undefined && button.text === undefined,
    [`toast-button-${button.role}`]: button.role !== undefined,
    'ion-focusable': true,
    'ion-activatable': true,
    ...getClassMap(button.cssClass)
  };
};
