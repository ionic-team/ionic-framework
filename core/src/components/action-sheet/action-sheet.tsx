import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Method, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { ActionSheetButton, Animation, AnimationBuilder, CssClassMap, OverlayEventDetail, OverlayInterface } from '../../interface';
import { BACKDROP, dismiss, eventMethod, isCancel, present, safeCall } from '../../utils/overlays';
import { getClassMap } from '../../utils/theme';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-action-sheet',
  styleUrls: {
    ios: 'action-sheet.ios.scss',
    md: 'action-sheet.md.scss'
  },
  scoped: true
})
export class ActionSheet implements ComponentInterface, OverlayInterface {

  presented = false;
  animation?: Animation;
  mode = getIonMode(this);

  @Element() el!: HTMLElement;

  /** @internal */
  @Prop() overlayIndex!: number;

  /**
   * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
   */
  @Prop() keyboardClose = true;

  /**
   * Animation to use when the action sheet is presented.
   */
  @Prop() enterAnimation?: AnimationBuilder;

  /**
   * Animation to use when the action sheet is dismissed.
   */
  @Prop() leaveAnimation?: AnimationBuilder;

  /**
   * An array of buttons for the action sheet.
   */
  @Prop() buttons: (ActionSheetButton | string)[] = [];

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass?: string | string[];

  /**
   * If `true`, the action sheet will be dismissed when the backdrop is clicked.
   */
  @Prop() backdropDismiss = true;

  /**
   * Title for the action sheet.
   */
  @Prop() header?: string;

  /**
   * Subtitle for the action sheet.
   */
  @Prop() subHeader?: string;

  /**
   * If `true`, the action sheet will be translucent. Only applies when the mode is `"ios"` and the device supports backdrop-filter.
   */
  @Prop() translucent = false;

  /**
   * If `true`, the action sheet will animate.
   */
  @Prop() animated = true;

  /**
   * Emitted after the alert has presented.
   */
  @Event({ eventName: 'ionActionSheetDidPresent' }) didPresent!: EventEmitter<void>;

  /**
   * Emitted before the alert has presented.
   */
  @Event({ eventName: 'ionActionSheetWillPresent' }) willPresent!: EventEmitter<void>;

  /**
   * Emitted before the alert has dismissed.
   */
  @Event({ eventName: 'ionActionSheetWillDismiss' }) willDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the alert has dismissed.
   */
  @Event({ eventName: 'ionActionSheetDidDismiss' }) didDismiss!: EventEmitter<OverlayEventDetail>;

  @Listen('ionBackdropTap')
  protected onBackdropTap() {
    this.dismiss(undefined, BACKDROP);
  }

  @Listen('ionActionSheetWillDismiss')
  protected dispatchCancelHandler(ev: CustomEvent) {
    const role = ev.detail.role;
    if (isCancel(role)) {
      const cancelButton = this.getButtons().find(b => b.role === 'cancel');
      this.callButtonHandler(cancelButton);
    }
  }

  /**
   * Present the action sheet overlay after it has been created.
   */
  @Method()
  present(): Promise<void> {
    return present(this, 'actionSheetEnter', iosEnterAnimation, mdEnterAnimation);
  }

  /**
   * Dismiss the action sheet overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the action sheet.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the action sheet.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   */
  @Method()
  dismiss(data?: any, role?: string): Promise<boolean> {
    return dismiss(this, data, role, 'actionSheetLeave', iosLeaveAnimation, mdLeaveAnimation);
  }

  /**
   * Returns a promise that resolves when the action sheet did dismiss.
   */
  @Method()
  onDidDismiss(): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionActionSheetDidDismiss');
  }

  /**
   * Returns a promise that resolves when the action sheet will dismiss.
   *
   */
  @Method()
  onWillDismiss(): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionActionSheetWillDismiss');
  }

  private async buttonClick(button: ActionSheetButton) {
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

  private async callButtonHandler(button: ActionSheetButton | undefined) {
    if (button) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      const rtn = await safeCall(button.handler);
      if (rtn === false) {
        // if the return value of the handler is false then do not dismiss
        return false;
      }
    }
    return true;
  }

  private getButtons(): ActionSheetButton[] {
    return this.buttons.map(b => {
      return (typeof b === 'string')
        ? { text: b }
        : b;
    });
  }

  hostData() {
    const mode = getIonMode(this);

    return {
      'role': 'dialog',
      'aria-modal': 'true',
      style: {
        zIndex: 20000 + this.overlayIndex,
      },
      class: {
        [mode]: true,

        ...getClassMap(this.cssClass),
        'action-sheet-translucent': this.translucent
      }
    };
  }

  render() {
    const mode = getIonMode(this);
    const allButtons = this.getButtons();
    const cancelButton = allButtons.find(b => b.role === 'cancel');
    const buttons = allButtons.filter(b => b.role !== 'cancel');

    return [
      <ion-backdrop tappable={this.backdropDismiss}/>,
      <div class="action-sheet-wrapper" role="dialog">
        <div class="action-sheet-container">
          <div class="action-sheet-group">
            {this.header !== undefined &&
              <div class="action-sheet-title">
                {this.header}
                {this.subHeader && <div class="action-sheet-sub-title">{this.subHeader}</div>}
              </div>
            }
            {buttons.map(b =>
              <button type="button" ion-activatable class={buttonClass(b)} onClick={() => this.buttonClick(b)}>
                <span class="action-sheet-button-inner">
                  {b.icon && <ion-icon icon={b.icon} lazy={false} class="action-sheet-icon" />}
                  {b.text}
                </span>
                {mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
              </button>
            )}
          </div>

          {cancelButton &&
            <div class="action-sheet-group action-sheet-group-cancel">
              <button
                type="button"
                class={buttonClass(cancelButton)}
                onClick={() => this.buttonClick(cancelButton)}
              >
                <span class="action-sheet-button-inner">
                  {cancelButton.icon &&
                    <ion-icon
                      icon={cancelButton.icon}
                      lazy={false}
                      class="action-sheet-icon"
                    />}
                  {cancelButton.text}
                </span>
              </button>
            </div>
          }
        </div>
      </div>
    ];
  }
}

const buttonClass = (button: ActionSheetButton): CssClassMap => {
  return {
    'action-sheet-button': true,
    'ion-activatable': true,
    [`action-sheet-${button.role}`]: button.role !== undefined,
    ...getClassMap(button.cssClass),
  };
};
