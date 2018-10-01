import { Component, ComponentInterface, Element, Event, EventEmitter, Method, Prop } from '@stencil/core';

import { Animation, AnimationBuilder, Config, Mode, OverlayEventDetail, OverlayInterface } from '../../interface';
import { dismiss, eventMethod, present } from '../../utils/overlays';
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
  }
})
export class Toast implements ComponentInterface, OverlayInterface {

  private durationTimeout: any;

  presented = false;

  @Element() el!: HTMLElement;

  animation: Animation | undefined;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl!: HTMLIonAnimationControllerElement;
  @Prop({ context: 'config' }) config!: Config;
  @Prop() overlayIndex!: number;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

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
  @Prop() duration = 0;

  /**
   * Message to be shown in the toast.
   */
  @Prop() message?: string;

  /**
   * If true, the keyboard will be automatically dismissed when the overlay is presented.
   */
  @Prop() keyboardClose = false;

  /**
   * The position of the toast on the screen. Possible values: "top", "middle", "bottom".
   */
  @Prop() position: 'top' | 'bottom' | 'middle' = 'bottom';

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
  @Prop() animated = true;

  /**
   * Emitted after the toast has loaded.
   */
  @Event() ionToastDidLoad!: EventEmitter<void>;

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
   * Emitted after the toast has unloaded.
   */
  @Event() ionToastDidUnload!: EventEmitter<void>;

  componentDidLoad() {
    this.ionToastDidLoad.emit();
  }

  componentDidUnload() {
    this.ionToastDidUnload.emit();
  }

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

  hostData() {
    const themedClasses = this.translucent ? createThemedClasses(this.mode, 'toast-translucent') : {};

    return {
      style: {
        zIndex: 60000 + this.overlayIndex,
      },
      class: {
        ...themedClasses,
        ...createThemedClasses(this.mode, 'toast'),
        ...getClassMap(this.cssClass)
      }
    };
  }

  render() {
    const wrapperClass = {
      'toast-wrapper': true,
      [`toast-${this.position}`]: true
    };
    return (
      <div class={wrapperClass}>
        <div class="toast-container">
          {this.message !== undefined &&
            <div class="toast-message">{this.message}</div>
          }
          {this.showCloseButton &&
            <ion-button fill="clear" ion-activatable class="toast-button" onClick={() => this.dismiss(undefined, 'cancel')}>
              {this.closeButtonText || 'Close'}
            </ion-button>
          }
        </div>
      </div>
    );
  }
}
