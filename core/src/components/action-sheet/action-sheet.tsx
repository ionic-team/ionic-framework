import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { ActionSheetButton, Animation, AnimationBuilder, Color, Config, CssClassMap, Mode } from '../../interface';
import { BACKDROP, OverlayEventDetail, OverlayInterface, dismiss, eventMethod, isCancel, present } from '../../utils/overlays';
import { createThemedClasses, getClassMap } from '../../utils/theme';
import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';


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

  mode!: Mode;
  color?: Color;

  presented = false;
  animation?: Animation;

  @Element() el!: HTMLElement;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl!: HTMLIonAnimationControllerElement;
  @Prop({ context: 'config' }) config!: Config;
  @Prop() overlayId!: number;
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
  @Prop() buttons!: ActionSheetButton[];

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass?: string | string[];

  /**
   * If true, the action sheet will be dismissed when the backdrop is clicked. Defaults to `true`.
   */
  @Prop() enableBackdropDismiss = true;

  /**
   * Title for the action sheet.
   */
  @Prop() header?: string;

  /**
   * Subtitle for the action sheet.
   */
  @Prop() subHeader?: string;

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
  @Event() ionActionSheetDidLoad!: EventEmitter<void>;

  /**
   * Emitted after the alert has unloaded.
   */
  @Event() ionActionSheetDidUnload!: EventEmitter<void>;

  /**
   * Emitted after the alert has presented.
   */
  @Event({eventName: 'ionActionSheetDidPresent'}) didPresent!: EventEmitter<void>;

  /**
   * Emitted before the alert has presented.
   */
  @Event({eventName: 'ionActionSheetWillPresent'}) willPresent!: EventEmitter<void>;

  /**
   * Emitted before the alert has dismissed.
   */
  @Event({eventName: 'ionActionSheetWillDismiss'}) willDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the alert has dismissed.
   */
  @Event({eventName: 'ionActionSheetDidDismiss'}) didDismiss!: EventEmitter<OverlayEventDetail>;


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
    return present(this, 'actionSheetEnter', iosEnterAnimation, mdEnterAnimation);
  }

  /**
   * Dismiss the action sheet overlay after it has been presented.
   */
  @Method()
  dismiss(data?: any, role?: string): Promise<void> {
    return dismiss(this, data, role, 'actionSheetLeave', iosLeaveAnimation, mdLeaveAnimation);
  }

  /**
   * Returns a promise that resolves when the action-sheet did dismiss. It also accepts a callback
   * that is called in the same circustances.
   *
   * ```
   * const {data, role} = await actionSheet.onDidDismiss();
   * ```
   */
  @Method()
  onDidDismiss(callback?: (detail: OverlayEventDetail) => void): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionActionSheetDidDismiss', callback);
  }

  /**
   * Returns a promise that resolves when the action-sheet will dismiss. It also accepts a callback
   * that is called in the same circustances.
   *
   * ```
   * const {data, role} = await actionSheet.onWillDismiss();
   * ```
   */
  @Method()
  onWillDismiss(callback?: (detail: OverlayEventDetail) => void): Promise<OverlayEventDetail> {
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
      <div class="action-sheet-wrapper" role="dialog">
        <div class="action-sheet-container">
          <div class="action-sheet-group">
            {this.header
              ? <div class="action-sheet-title">
                {this.header}
                {this.subHeader
                ? <div class="action-sheet-sub-title">{this.subHeader}</div>
                : null}
              </div>
              : null}
            {buttons.map(b =>
              <button class={buttonClass(b)} onClick={() => this.buttonClick(b)}>
                <span class="action-sheet-button-inner">
                  {b.icon
                    ? <ion-icon name={b.icon} class="action-sheet-icon" />
                    : null}
                  {b.text}
                </span>
              </button>
            )}
          </div>
          {cancelButton
            ? <div class="action-sheet-group action-sheet-group-cancel">
                <button
                  class={buttonClass(cancelButton)}
                  onClick={() => this.buttonClick(cancelButton)}
                >
                  <span class="action-sheet-button-inner">
                    {cancelButton.icon
                      ? <ion-icon
                          name={cancelButton.icon}
                          class="action-sheet-icon"
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

