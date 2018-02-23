import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Animation, AnimationBuilder, Config, DomController, FrameworkDelegate, OverlayDismissEvent, OverlayDismissEventDetail } from '../../index';

import { DomFrameworkDelegate } from '../../utils/dom-framework-delegate';
import { domControllerAsync } from '../../utils/helpers';
import { createThemedClasses } from '../../utils/theme';
import { OverlayInterface, BACKDROP, overlayAnimation } from '../../utils/overlays';

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
export class Modal implements OverlayInterface {

  private presented = false;
  private usersComponentElement: HTMLElement;

  animation: Animation;

  @Element() private el: HTMLElement;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: HTMLIonAnimationControllerElement;
  @Prop({ context: 'config' }) config: Config;
  @Prop({ context: 'dom' }) dom: DomController;

  @Prop() overlayId: number;
  @Prop({ mutable: true }) delegate: FrameworkDelegate;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * Animation to use when the modal is presented.
   */
  @Prop() enterAnimation: AnimationBuilder;

  /**
   * Animation to use when the modal is dismissed.
   */
  @Prop() leaveAnimation: AnimationBuilder;

  /**
   * The component to display inside of the modal.
   */
  @Prop() component: any;

  /**
   * The data to pass to the modal component.
   */
  @Prop() data: any = {};

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass: string;

  /**
   * If true, the modal will be dismissed when the backdrop is clicked. Defaults to `true`.
   */
  @Prop() enableBackdropDismiss = true;

  /**
   * If true, a backdrop will be displayed behind the modal. Defaults to `true`.
   */
  @Prop() showBackdrop = true;

  /**
   * If true, the modal will animate. Defaults to `true`.
   */
  @Prop() willAnimate = true;

  /**
   * Emitted after the modal has loaded.
   */
  @Event() ionModalDidLoad: EventEmitter<ModalEventDetail>;

  /**
   * Emitted after the modal has presented.
   */
  @Event() ionModalDidPresent: EventEmitter<ModalEventDetail>;

  /**
   * Emitted before the modal has presented.
   */
  @Event() ionModalWillPresent: EventEmitter<ModalEventDetail>;

  /**
   * Emitted before the modal has dismissed.
   */
  @Event() ionModalWillDismiss: EventEmitter<ModalDismissEventDetail>;

  /**
   * Emitted after the modal has dismissed.
   */
  @Event() ionModalDidDismiss: EventEmitter<ModalDismissEventDetail>;

  /**
   * Emitted after the modal has unloaded.
   */
  @Event() ionModalDidUnload: EventEmitter<ModalEventDetail>;

  componentDidLoad() {
    this.ionModalDidLoad.emit();
  }

  componentDidUnload() {
    this.ionModalDidUnload.emit();
  }

  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  @Listen('ionBackdropTap')
  protected onBackdropTap() {
    this.dismiss(null, BACKDROP).catch();
  }

  /**
   * Present the modal overlay after it has been created.
   */
  @Method()
  present(): Promise<void> {
    if(this.presented) {
      return Promise.reject('overlay already presented');
    }
    this.presented = true;
    this.ionModalWillPresent.emit();

    this.el.style.zIndex = `${20000 + this.overlayId}`;

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

    return this.delegate.attachViewToDom(userComponentParent, this.component, this.data, cssClasses)
     .then((mountingData) => this.usersComponentElement = mountingData.element)
     .then(() => this.playAnimation(animationBuilder))
     .then(() => {
       this.ionModalDidPresent.emit();
    });
  }

  /**
   * Dismiss the modal overlay after it has been presented.
   */
  @Method()
  dismiss(data?: any, role?: string) {
    if(!this.presented) {
      return Promise.reject('overlay is not presented');
    }
    this.presented = false;
    this.ionModalWillDismiss.emit({data, role});

    if (!this.delegate) {
      this.delegate = new DomFrameworkDelegate();
    }

    // get the user's animation fn if one was provided
    const animationBuilder = this.leaveAnimation || this.config.get('modalLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);

    return this.playAnimation(animationBuilder).then(() => {
      this.ionModalDidDismiss.emit({data, role});
      return domControllerAsync(this.dom.write, () => {
        const userComponentParent = this.el.querySelector(`.${USER_COMPONENT_MODAL_CONTAINER_CLASS}`);
        this.delegate.removeViewFromDom(userComponentParent, this.usersComponentElement);
        this.el.parentNode.removeChild(this.el);
      });
    });
  }

  private playAnimation(animationBuilder: AnimationBuilder): Promise<void> {
    return overlayAnimation(this, animationBuilder, this.willAnimate, this.el, undefined);
  }

  @Method()
  getUserComponentContainer(): HTMLElement {
    return this.el.querySelector(`.${USER_COMPONENT_MODAL_CONTAINER_CLASS}`);
  }

  render() {
    const dialogClasses = createThemedClasses(this.mode, this.color, 'modal-wrapper');

    return [
      <ion-backdrop visible={this.showBackdrop} tappable={this.enableBackdropDismiss}/>,
      <div role='dialog' class={dialogClasses}></div>
    ];
  }
}


export interface ModalOptions {
  component: any;
  data?: any;
  showBackdrop?: boolean;
  enableBackdropDismiss?: boolean;
  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
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
