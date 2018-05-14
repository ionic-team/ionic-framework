import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Animation, AnimationBuilder, Color, Config, Mode } from '../../interface';

import { OverlayEventDetail, OverlayInterface, dismiss, eventMethod, present } from '../../utils/overlays';
import { createThemedClasses, getClassMap } from '../../utils/theme';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';

import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';

@Component({
  tag: 'ion-toast',
  styleUrls: {
    ios: 'toast.ios.scss',
    md: 'toast.md.scss'
  },
  host: {
    theme: 'toast'
  }
})
export class Toast implements OverlayInterface {

  private durationTimeout: any;

  presented = false;

  @Element() el!: HTMLElement;

  mode!: Mode;
  color?: Color;
  animation: Animation | undefined;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl!: HTMLIonAnimationControllerElement;
  @Prop({ context: 'config' }) config!: Config;
  @Prop() overlayId!: number;
  @Prop() keyboardClose = false;

  /**
   * Animation to use when the toast is presented.
   */
  @Prop() enterAnimation?: AnimationBuilder;

  /**
   * Animation to use when the toast is dismissed.
   */
  @Prop() leaveAnimation?: AnimationBuilder;

  /**
   * Text to display in the close button.
   */
  @Prop() closeButtonText?: string;

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass?: string | string[];

  /**
   * How many milliseconds to wait before hiding the toast. By default, it will show
   * until `dismiss()` is called.
   */
  @Prop() duration?: number;

  /**
   * Message to be shown in the toast.
   */
  @Prop() message?: string;

  /**
   * The position of the toast on the screen. Possible values: "top", "middle", "bottom".
   */
  @Prop() position?: string;

  /**
   * If true, the close button will be displayed. Defaults to `false`.
   */
  @Prop() showCloseButton = false;

  /**
   * If true, the toast will be translucent. Defaults to `false`.
   */
  @Prop() translucent = false;

  /**
   * If true, the toast will animate. Defaults to `true`.
   */
  @Prop() willAnimate = true;

  /**
   * Emitted after the toast has loaded.
   */
  @Event() ionToastDidLoad!: EventEmitter<void>;

  /**
   * Emitted after the toast has presented.
   */
  @Event({eventName: 'ionToastDidPresent'}) didPresent!: EventEmitter<void>;

  /**
   * Emitted before the toast has presented.
   */
  @Event({eventName: 'ionToastWillPresent'}) willPresent!: EventEmitter<void>;

  /**
   * Emitted before the toast has dismissed.
   */
  @Event({eventName: 'ionToastWillDismiss'}) willDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the toast has dismissed.
   */
  @Event({eventName: 'ionToastDidDismiss'}) didDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the toast has unloaded.
   */
  @Event() ionToastDidUnload!: EventEmitter<void>;

  componentDidLoad() {
    this.ionToastDidLoad.emit();
  }

  componentDidUnload() {
    this.ionToastDidUnload.emit();
  }

  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  /**
   * Present the toast overlay after it has been created.
   */
  @Method()
  async present(): Promise<void> {
    await present(this, 'toastEnter', iosEnterAnimation, mdEnterAnimation, this.position);

    if (this.duration) {
      this.durationTimeout = setTimeout(() => this.dismiss(), this.duration);
    }
  }

  /**
   * Dismiss the toast overlay after it has been presented.
   */
  @Method()
  dismiss(data?: any, role?: string): Promise<void> {
    if (this.durationTimeout) {
      clearTimeout(this.durationTimeout);
    }
    return dismiss(this, data, role, 'toastLeave', iosLeaveAnimation, mdLeaveAnimation, this.position);
  }

  /**
   * Returns a promise that resolves when the toast did dismiss. It also accepts a callback
   * that is called in the same circustances.
   *
   * ```
   * const {data, role} = await toast.onDidDismiss();
   * ```
   */
  @Method()
  onDidDismiss(callback?: (detail: OverlayEventDetail) => void): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionToastDidDismiss', callback);
  }

  /**
   * Returns a promise that resolves when the toast will dismiss. It also accepts a callback
   * that is called in the same circustances.
   *
   * ```
   * const {data, role} = await toast.onWillDismiss();
   * ```
   */
  @Method()
  onWillDismiss(callback?: (detail: OverlayEventDetail) => void): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionToastWillDismiss', callback);
  }

  hostData() {
    const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'toast-translucent') : {};

    return {
      class: {
        ...themedClasses,
        ...getClassMap(this.cssClass)
      }
    };
  }

  render() {
    const position = this.position ? this.position : 'bottom';
    const wrapperClass = {
      'toast-wrapper': true,
      [`toast-${position}`]: true
    };
    return (
      <div class={wrapperClass}>
        <div class="toast-container">
          {this.message
            ? <div class="toast-message">{this.message}</div>
            : null}
          {this.showCloseButton
            ? <ion-button fill="clear" color="light" class="toast-button" onClick={() => this.dismiss()}>
                {this.closeButtonText || 'Close'}
              </ion-button>
            : null}
        </div>
      </div>
    );
  }
}
