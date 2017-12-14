import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import {
  Animation,
  AnimationBuilder,
  AnimationController,
  Config,
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
  @Prop() mode: string;
  @Prop() color: string;
  @Prop() component: any;
  @Prop() data: any = {};
  @Prop() cssClass: string;
  @Prop() enableBackdropDismiss: boolean = true;

  @Prop() modalId: string;
  @Prop() showBackdrop: boolean = true;

  @Prop() enterAnimation: AnimationBuilder;
  @Prop() leaveAnimation: AnimationBuilder;
  @Prop() animate: boolean;
  @Prop({ mutable: true }) delegate: FrameworkDelegate;
  @Prop() delegateModalWrapper: boolean = false;

  private animation: Animation;
  private usersComponentElement: HTMLElement;

  @Method()
  async present() {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    this.ionModalWillPresent.emit();

    this.el.style.zIndex = `${20000 + this.modalId}`;

    // get the user's animation fn if one was provided
    const animationBuilder = this.enterAnimation || this.config.get('modalEnter', this.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);

    const modalWrapper = this.el.querySelector(`.${MODAL_WRAPPER}`);
    if (!this.delegate) {
      this.delegate = new DomFrameworkDelegate();
    }

    const cssClasses = ['ion-page'];
    if (this.cssClass && this.cssClass.length) {
      cssClasses.push(this.cssClass);
    }
    const mountingData = await this.delegate.attachViewToDom(modalWrapper, this.component, this.data, cssClasses);
    this.usersComponentElement = mountingData.element;
    this.animation = await this.animationCtrl.create(animationBuilder, this.el);
    if (!this.animate) {
      // if the duration is 0, it won't actually animate I don't think
      // TODO - validate this
      this.animation = this.animation.duration(0);
    }
    await playAnimationAsync(this.animation);
    this.animation.destroy();
    this.ionModalDidPresent.emit();
  }

  @Method()
  async dismiss(data?: any, role?: string) {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }
    this.ionModalWillDismiss.emit({
      data,
      role
    });

    if (!this.delegate) {
      this.delegate = new DomFrameworkDelegate();
    }

    // get the user's animation fn if one was provided
    const animationBuilder = this.leaveAnimation || this.config.get('modalLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);

    this.animation = await this.animationCtrl.create(animationBuilder, this.el);
    await playAnimationAsync(this.animation);
    this.animation.destroy();


    await domControllerAsync(Context.dom.write, () => {});

    // TODO - Figure out how to make DOM controller work with callbacks that return a promise or are async
    const modalWrapper = this.el.querySelector(`.${MODAL_WRAPPER}`);
    await this.delegate.removeViewFromDom(modalWrapper, this.usersComponentElement);

    this.el.parentElement.removeChild(this.el);

    this.ionModalDidDismiss.emit({
      data,
      role
    });
  }

  @Method()
  getModalWrapperDetails() {
    const dictionary = createThemedClasses(this.mode, this.color, MODAL_WRAPPER);
    return {
      role: 'dialogue',
      classes: Object.keys(dictionary)
    };
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
    const elements: JSX.Element[] = [];
    elements.push(<div
      onClick={this.backdropClick.bind(this)}
      class={{
        'modal-backdrop': true,
        'hide-backdrop': !this.showBackdrop
      }}
    ></div>);
    if (!this.delegateModalWrapper) {
      const details = this.getModalWrapperDetails();
      const clazz = details.classes.join(' ');
      elements.push(<div
        role={details.role}
        class={clazz}
      >
      </div>);
    }

    return elements;
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

const MODAL_WRAPPER = 'modal-wrapper';
