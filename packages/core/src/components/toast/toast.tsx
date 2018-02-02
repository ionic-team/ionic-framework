import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Animation, AnimationBuilder, AnimationController, Config, CssClassMap, DomController, OverlayDismissEvent, OverlayDismissEventDetail } from '../../index';
import { domControllerAsync, playAnimationAsync } from '../../utils/helpers';

import { createThemedClasses } from '../../utils/theme';

import iosEnterAnimation from './animations/ios.enter';
import iosLeaveAnimation from './animations/ios.leave';

import mdEnterAnimation from './animations/md.enter';
import mdLeaveAnimation from './animations/md.leave';

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
export class Toast {
  mode: string;
  color: string;

  private animation: Animation;

  @Element() private el: HTMLElement;

  /**
   * Emitted after the toast has loaded.
   */
  @Event() ionToastDidLoad: EventEmitter<ToastEventDetail>;

  /**
   * Emitted after the toast has presented.
   */
  @Event() ionToastDidPresent: EventEmitter<ToastEventDetail>;

  /**
   * Emitted before the toast has presented.
   */
  @Event() ionToastWillPresent: EventEmitter<ToastEventDetail>;

  /**
   * Emitted before the toast has dismissed.
   */
  @Event() ionToastWillDismiss: EventEmitter<ToastDismissEventDetail>;

  /**
   * Emitted after the toast has dismissed.
   */
  @Event() ionToastDidDismiss: EventEmitter<ToastDismissEventDetail>;

  /**
   * Emitted after the toast has unloaded.
   */
  @Event() ionToastDidUnload: EventEmitter<ToastEventDetail>;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;
  @Prop({ context: 'config' }) config: Config;
  @Prop({ context: 'dom' }) dom: DomController;

  @Prop() message: string;
  @Prop() cssClass: string;
  @Prop() duration: number;
  @Prop() showCloseButton: boolean;
  @Prop() closeButtonText: string;
  @Prop() dismissOnPageChange: boolean;
  @Prop() position: string;
  @Prop() translucent = false;
  @Prop() toastId: number;
  @Prop() willAnimate = true;

  @Prop() enterAnimation: AnimationBuilder;
  @Prop() leaveAnimation: AnimationBuilder;

  @Method()
  present() {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }
    this.ionToastWillPresent.emit();

    // get the user's animation fn if one was provided
    const animationBuilder = this.enterAnimation || this.config.get('toastEnter', this.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);

    // build the animation and kick it off
    return this.animationCtrl.create(animationBuilder, this.el, this.position).then(animation => {
      this.animation = animation;
      if (!this.willAnimate) {
        // if the duration is 0, it won't actually animate I don't think
        // TODO - validate this
        this.animation = animation.duration(0);
      }
      return playAnimationAsync(animation);
    }).then((animation) => {
      animation.destroy();
      this.componentDidEnter();
    });
  }

  @Method()
  dismiss(data?: any, role?: string) {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    this.ionToastWillDismiss.emit({
      data,
      role
    });

    const animationBuilder = this.leaveAnimation || this.config.get('toastLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);

    return this.animationCtrl.create(animationBuilder, this.el, this.position).then(animation => {
      this.animation = animation;
      return playAnimationAsync(animation);
    }).then((animation) => {
      animation.destroy();
      this.ionToastDidDismiss.emit({
        data,
        role
      });
    }).then(() => {
      return domControllerAsync(this.dom.write, () => {
        this.el.parentNode.removeChild(this.el);
      });
    });
  }

  componentDidLoad() {
    this.ionToastDidLoad.emit();
  }

  componentDidEnter() {
    this.ionToastDidPresent.emit();
    if (this.duration) {
      setTimeout(() => {
        this.dismiss();
      }, this.duration);
    }
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

  wrapperClass(): CssClassMap {
    const wrapperClass: string[] = !this.position
      ? ['toast-wrapper', 'toast-bottom']
      : [`toast-wrapper`, `toast-${this.position}`];
    return wrapperClass.reduce((prevValue: any, cssClass: any) => {
      prevValue[cssClass] = true;
      return prevValue;
    }, {});
  }

  hostData() {
    const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'toast-translucent') : {};

    const hostClasses = {
      ...themedClasses
    };

    return {
      class: hostClasses
    };
  }

  render() {
    if (this.cssClass) {
      this.cssClass.split(' ').forEach(cssClass => {
        if (cssClass.trim() !== '') this.el.classList.add(cssClass);
      });
    }

    return (
      <div class={this.wrapperClass()}>
        <div class='toast-container'>
          {this.message
            ? <div class='toast-message'>{this.message}</div>
            : null}
          {this.showCloseButton
            ? <ion-button fill='clear' color='light' class='toast-button' onClick={() => this.dismiss()}>
                {this.closeButtonText || 'Close'}
              </ion-button>
            : null}
        </div>
      </div>
    );
  }

}

export interface ToastOptions {
  message?: string;
  cssClass?: string;
  duration?: number;
  showCloseButton?: boolean;
  closeButtonText?: string;
  dismissOnPageChange?: boolean;
  position?: string;
  translucent?: boolean;
  enterAnimation?: AnimationBuilder;
  exitAnimation?: AnimationBuilder;
}

export interface ToastEvent extends CustomEvent {
  target: HTMLIonToastElement;
  detail: ToastEventDetail;
}

export interface ToastEventDetail {

}

export interface ToastDismissEventDetail extends OverlayDismissEventDetail {
  // keep this just for the sake of static types and potential future extensions
}

export interface ToastDismissEvent extends OverlayDismissEvent {
  // keep this just for the sake of static types and potential future extensions
}

export {
  iosEnterAnimation as iosToastEnterAnimation,
  iosLeaveAnimation as iosToastLeaveAnimation,
  mdEnterAnimation as mdToastEnterAnimation,
  mdLeaveAnimation as mdToastLeaveAnimation
};
