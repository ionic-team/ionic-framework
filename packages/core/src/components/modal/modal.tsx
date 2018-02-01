import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import {
  Animation,
  AnimationBuilder,
  AnimationController,
  Config,
  DomController,
  FrameworkDelegate,
  OverlayDismissEvent,
  OverlayDismissEventDetail
} from '../../index';

import { DomFrameworkDelegate } from '../../utils/dom-framework-delegate';
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
  @Prop({ context: 'dom' }) dom: DomController;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  @Prop() component: any;
  @Prop() data: any = {};
  @Prop() cssClass: string;
  @Prop() enableBackdropDismiss = true;

  @Prop() modalId: number;
  @Prop() showBackdrop = true;

  @Prop() enterAnimation: AnimationBuilder;
  @Prop() leaveAnimation: AnimationBuilder;
  @Prop() willAnimate = true;
  @Prop({ mutable: true }) delegate: FrameworkDelegate;

  private animation: Animation;
  private usersComponentElement: HTMLElement;

  @Method()
  present() {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    this.ionModalWillPresent.emit();

    this.el.style.zIndex = `${20000 + this.modalId}`;

    // get the user's animation fn if one was provided
    const animationBuilder = this.enterAnimation || this.config.get('modalEnter', this.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);

    const userComponentParent = this.el.querySelector(`.${USER_COMPONENT_MODAL_CONTAINER_CLASS}`);
    if (!this.delegate) {
      this.delegate = new DomFrameworkDelegate();
    }

    const cssClasses = [];
    if (this.cssClass && this.cssClass.length) {
      cssClasses.push(this.cssClass);
    }

    // add the modal by default to the data being passed
    this.data = this.data || {};
    this.data.modal = this.el;
    this.delegate.attachViewToDom(userComponentParent, this.component, this.data, cssClasses)
     .then((mountingData) => {
       this.usersComponentElement = mountingData.element;
     });

     return this.animationCtrl.create(animationBuilder, this.el)
     .then(animation => {
      this.animation = animation;
      if (!this.willAnimate) this.animation = animation.duration(0);
      return playAnimationAsync(animation);
    })
    .then((animation) => {
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
    this.ionModalWillDismiss.emit({data, role});

    if (!this.delegate) {
      this.delegate = new DomFrameworkDelegate();
    }

    // get the user's animation fn if one was provided
    const animationBuilder = this.leaveAnimation || this.config.get('modalLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);


    return this.animationCtrl.create(animationBuilder, this.el)
    .then(animation => {
      this.animation = animation;
      if (!this.willAnimate) {
        this.animation = animation.duration(0);
      }
      return playAnimationAsync(animation);
    })
    .then((animation) => {
      animation.destroy();
      this.ionModalDidDismiss.emit({data, role});
    })
    .then(() => {
      return domControllerAsync(this.dom.write, () => {
        const userComponentParent = this.el.querySelector(`.${USER_COMPONENT_MODAL_CONTAINER_CLASS}`);
        this.delegate.removeViewFromDom(userComponentParent, this.usersComponentElement);
        this.el.parentNode.removeChild(this.el);
      });
    });
  }

  @Method()
  getUserComponentContainer(): HTMLElement {
    return this.el.querySelector(`.${USER_COMPONENT_MODAL_CONTAINER_CLASS}`);
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
      </div>
    ];
  }
}


export interface ModalOptions {
  component: any;
  data?: any;
  showBackdrop?: boolean;
  enableBackdropDismiss?: boolean;
  enterAnimation?: AnimationBuilder;
  exitAnimation?: AnimationBuilder;
  cssClass?: string;
  delegate?: FrameworkDelegate;
}


export interface ModalEvent extends CustomEvent {
  target: HTMLIonModalElement;
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

export const USER_COMPONENT_MODAL_CONTAINER_CLASS = 'modal-wrapper';
