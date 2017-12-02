import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import {
  Animation,
  AnimationBuilder,
  AnimationController,
  Config,
  OverlayDismissEvent,
  OverlayDismissEventDetail
} from '../../index';
import { domControllerAsync, playAnimationAsync } from '../../utils/helpers';
import { createThemedClasses } from '../../utils/theme';

import iosEnterAnimation from './animations/ios.enter';
import iosLeaveAnimation from './animations/ios.leave';

import mdEnterAnimation from './animations/md.enter';
import mdLeaveAnimation from './animations/md.leave';
@Component({
  tag: 'ion-modal',
  styleUrls: {
    ios: 'modal.ios.scss',
    md: 'modal.md.scss'
  },
  host: {
    theme: 'modal'
  }
})
export class Modal {
  @Element() private el: HTMLElement;

  /**
   * @output {ModalEvent} Emitted after the modal has loaded.
   */
  @Event() ionModalDidLoad: EventEmitter<ModalEventDetail>;

  /**
   * @output {ModalEvent} Emitted after the modal has presented.
   */
  @Event() ionModalDidPresent: EventEmitter<ModalEventDetail>;

  /**
   * @output {ModalEvent} Emitted before the modal has presented.
   */
  @Event() ionModalWillPresent: EventEmitter<ModalEventDetail>;

  /**
   * @output {ModalEvent} Emitted before the modal has dismissed.
   */
  @Event() ionModalWillDismiss: EventEmitter<ModalDismissEventDetail>;

  /**
   * @output {ModalEvent} Emitted after the modal has dismissed.
   */
  @Event() ionModalDidDismiss: EventEmitter<ModalDismissEventDetail>;

  /**
   * @output {ModalEvent} Emitted after the modal has unloaded.
   */
  @Event() ionModalDidUnload: EventEmitter<ModalEventDetail>;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;
  @Prop({ context: 'config' }) config: Config;
  @Prop() mode: string;
  @Prop() color: string;
  @Prop() component: string;
  @Prop() componentProps: any = {};
  @Prop() cssClass: string;
  @Prop() enableBackdropDismiss: boolean = true;

  @Prop() modalId: string;
  @Prop() showBackdrop: boolean = true;

  @Prop() enterAnimation: AnimationBuilder;
  @Prop() leaveAnimation: AnimationBuilder;
  @Prop() animate: boolean;

  private animation: Animation;


  @Method()
  present() {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    this.ionModalWillPresent.emit();

    // get the user's animation fn if one was provided
    const animationBuilder = this.enterAnimation || this.config.get('modalEnter', this.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);

    // build the animation and kick it off
    // build the animation and kick it off
    return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
      this.animation = animation;
      if (!this.animate) {
        // if the duration is 0, it won't actually animate I don't think
        // TODO - validate this
        this.animation = animation.duration(0);
      }
      return playAnimationAsync(animation);
    }).then((animation) => {
      animation.destroy();
      this.ionModalDidPresent.emit();
    });
  }

  @Method()
  dismiss(data?: any, role?: string) {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }
    this.ionModalWillDismiss.emit({
      data,
      role
    });

    // get the user's animation fn if one was provided
    const animationBuilder = this.leaveAnimation || this.config.get('modalLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);

    return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
      this.animation = animation;
      return playAnimationAsync(animation);
    }).then((animation) => {
      animation.destroy();
      return domControllerAsync(Context.dom.write, () => {
        this.el.parentNode.removeChild(this.el);
      });
    }).then(() => {
      this.ionModalDidDismiss.emit({
        data,
        role
      });
    });
  }

  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  componentDidLoad() {
    this.ionModalDidLoad.emit();
  }

  componentDidUnload() {
    this.ionModalDidUnload.emit();
  }

  protected backdropClick() {
    if (this.enableBackdropDismiss) {
      // const opts: NavOptions = {
      //   minClickBlockDuration: 400
      // };
      this.dismiss();
    }
  }

  render() {
    const ThisComponent = this.component;

    let userCssClasses = 'ion-page';
    if (this.cssClass) {
      userCssClasses += ` ${this.cssClass}`;
    }

    const dialogClasses = createThemedClasses(this.mode, this.color, 'modal-wrapper');

    return [
      <div
        onClick={this.backdropClick.bind(this)}
        class={{
          'modal-backdrop': true,
          'hide-backdrop': !this.showBackdrop
        }}
      ></div>,
      <div
        role='dialog'
        class={dialogClasses}
      >
        <ThisComponent
          {...this.componentProps}
          class={userCssClasses}
        >
        </ThisComponent>
      </div>
    ];
  }
}


export interface ModalOptions {
  component: string;
  componentProps?: any;
  showBackdrop?: boolean;
  enableBackdropDismiss?: boolean;
  enterAnimation?: AnimationBuilder;
  exitAnimation?: AnimationBuilder;
  cssClass?: string;
}


export interface ModalEvent extends CustomEvent {
  detail: ModalEventDetail;
}

export interface ModalEventDetail {

}

export interface ModalDismissEventDetail extends OverlayDismissEventDetail {
  // keep this just for the sake of static types and potential future extensions
}

export interface ModalDismissEvent extends OverlayDismissEvent {
  // keep this just for the sake of static types and potential future extensions
}

export {
  iosEnterAnimation as iosModalEnterAnimation,
  iosLeaveAnimation as iosModalLeaveAnimation,
  mdEnterAnimation as mdModalEnterAnimation,
  mdLeaveAnimation as mdModalLeaveAnimation
};
