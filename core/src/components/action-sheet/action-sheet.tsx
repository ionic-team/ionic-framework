import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Animation, AnimationBuilder, Config, CssClassMap } from '../../index';

import { createThemedClasses, getClassMap } from '../../utils/theme';
import { BACKDROP, OverlayEventDetail, OverlayInterface, dismiss, eventMethod, isCancel, present } from '../../utils/overlays';

import iosEnterAnimation from './animations/ios.enter';
import iosLeaveAnimation from './animations/ios.leave';

import mdEnterAnimation from './animations/md.enter';
import mdLeaveAnimation from './animations/md.leave';

@Component({
  tag: 'ion-action-sheet',
  styleUrls: {
    ios: 'action-sheet.ios.scss',
    md: 'action-sheet.md.scss'
  },
  host: {
    theme: 'action-sheet'
  }
})
export class ActionSheet implements OverlayInterface {

  presented = false;
  mode: string;
  color: string;
  animation: Animation|undefined;

  @Element() el: HTMLElement;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: HTMLIonAnimationControllerElement;
  @Prop({ context: 'config' }) config: Config;
  @Prop() overlayId: number;

  /**
   * Animation to use when the action sheet is presented.
   */
  @Prop() enterAnimation: AnimationBuilder;

  /**
   * Animation to use when the action sheet is dismissed.
   */
  @Prop() leaveAnimation: AnimationBuilder;

  /**
   * An array of buttons for the action sheet.
   */
  @Prop() buttons: ActionSheetButton[];

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass: string;

  /**
   * If true, the action sheet will be dismissed when the backdrop is clicked. Defaults to `true`.
   */
  @Prop() enableBackdropDismiss = true;

  /**
   * Subtitle for the action sheet.
   */
  @Prop() subTitle: string;

  /**
   * Title for the action sheet.
   */
  @Prop() title: string;

  /**
   * If true, the action sheet will be translucent. Defaults to `false`.
   */
  @Prop() translucent = false;

  /**
   * If true, the action sheet will animate. Defaults to `true`.
   */
  @Prop() willAnimate = true;

  /**
   * Emitted after the alert has loaded.
   */
  @Event() ionActionSheetDidLoad: EventEmitter;

  /**
   * Emitted after the alert has unloaded.
   */
  @Event() ionActionSheetDidUnload: EventEmitter;

  /**
   * Emitted after the alert has presented.
   */
  @Event({eventName: 'ionActionSheetDidPresent'}) didPresent: EventEmitter;

  /**
   * Emitted before the alert has presented.
   */
  @Event({eventName: 'ionActionSheetWillPresent'}) willPresent: EventEmitter;

  /**
   * Emitted before the alert has dismissed.
   */
  @Event({eventName: 'ionActionSheetWillDismiss'}) willDismiss: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the alert has dismissed.
   */
  @Event({eventName: 'ionActionSheetDidDismiss'}) didDismiss: EventEmitter<OverlayEventDetail>;


  componentDidLoad() {
    this.ionActionSheetDidLoad.emit();
  }

  componentDidUnload() {
    this.ionActionSheetDidUnload.emit();
  }

  @Listen('ionBackdropTap')
  protected onBackdropTap() {
    this.dismiss(null, BACKDROP);
  }

  @Listen('ionActionSheetWillDismiss')
  protected dispatchCancelHandler(ev: CustomEvent) {
    const role = ev.detail.role;
    if (isCancel(role)) {
      const cancelButton = this.buttons.find(b => b.role === 'cancel');
      this.callButtonHandler(cancelButton);
    }
  }

  /**
   * Present the action sheet overlay after it has been created.
   */
  @Method()
  present(): Promise<void> {
    return present(this, 'actionSheetEnter', iosEnterAnimation, mdEnterAnimation, undefined);
  }

  /**
   * Dismiss the action sheet overlay after it has been presented.
   */
  @Method()
  dismiss(data?: any, role?: string): Promise<void> {
    return dismiss(this, data, role, 'actionSheetLeave', iosLeaveAnimation, mdLeaveAnimation, undefined);
  }

  @Method()
  onDidDismiss(callback: (data?: any, role?: string) => void): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionActionSheetDidDismiss', callback);
  }

  @Method()
  onWillDismiss(callback: (data?: any, role?: string) => void): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionActionSheetWillDismiss', callback);
  }

  protected buttonClick(button: ActionSheetButton) {
    const role = button.role;
    if (isCancel(role)) {
      this.dismiss(undefined, role);
      return;
    }
    const shouldDismiss = this.callButtonHandler(button);
    if (shouldDismiss) {
      this.dismiss(undefined, button.role);
    }
  }

  private callButtonHandler(button: ActionSheetButton|undefined): boolean {
    if (button && button.handler) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      if (button.handler() === false) {
        // if the return value of the handler is false then do not dismiss
        return false;
      }
    }
    return true;
  }

  hostData() {
    const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'action-sheet-translucent') : {};

    return {
      style: {
        zIndex: 20000 + this.overlayId,
      },
      class: {
        ...themedClasses,
        ...getClassMap(this.cssClass)
      }
    };
  }

  render() {
    const allButtons = this.buttons.map(b => {
      if (typeof b === 'string') {
        b = { text: b };
      }
      if (!b.cssClass) {
        b.cssClass = '';
      }
      return b;
    });
    const cancelButton = allButtons.find(b => b.role === 'cancel');
    const buttons = allButtons.filter(b => b.role !== 'cancel');

    return [
      <ion-backdrop tappable={this.enableBackdropDismiss}/>,
      <div class='action-sheet-wrapper' role='dialog'>
        <div class='action-sheet-container'>
          <div class='action-sheet-group'>
            {this.title
              ? <div class='action-sheet-title'>
                {this.title}
                {this.subTitle
                ? <div class='action-sheet-sub-title'>{this.subTitle}</div>
                : null}
              </div>
              : null}
            {buttons.map(b =>
              <button class={buttonClass(b)} onClick={() => this.buttonClick(b)}>
                <span class='action-sheet-button-inner'>
                  {b.icon
                    ? <ion-icon name={b.icon} class='action-sheet-icon' />
                    : null}
                  {b.text}
                </span>
              </button>
            )}
          </div>
          {cancelButton
            ? <div class='action-sheet-group action-sheet-group-cancel'>
                <button
                  class={buttonClass(cancelButton)}
                  onClick={() => this.buttonClick(cancelButton)}
                >
                  <span class='action-sheet-button-inner'>
                    {cancelButton.icon
                      ? <ion-icon
                          name={cancelButton.icon}
                          class='action-sheet-icon'
                        />
                      : null}
                    {cancelButton.text}
                  </span>
                </button>

              </div>
            : null}
        </div>
      </div>
    ];
  }
}

function buttonClass(button: ActionSheetButton): CssClassMap {
  const buttonClasses: any = {
    'action-sheet-button': true,
    ...getClassMap(button.cssClass),
  };
  if (button.role) {
    buttonClasses[`action-sheet-${button.role}`] = true;
  }
  return buttonClasses;
}

export interface ActionSheetOptions {
  title?: string;
  subTitle?: string;
  cssClass?: string;
  buttons?: (ActionSheetButton | string)[];
  enableBackdropDismiss?: boolean;
  translucent?: boolean;
}

export interface ActionSheetButton {
  text?: string;
  role?: 'cancel' | 'destructive' | 'selected' | string;
  icon?: string;
  cssClass?: string;
  handler?: () => boolean | void;
}

