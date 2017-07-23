import { Component, Listen, Prop } from '@stencil/core';
import { AnimationBuilder, Animation } from '../../index';
import { createThemedClasses } from '../../utils/theme';

import iOSEnterAnimation from './animations/ios.enter';
import iOSLeaveAnimation from './animations/ios.leave';


@Component({
  tag: 'ion-modal',
  styleUrls: {
    ios: 'modal.ios.scss',
    md: 'modal.md.scss',
    wp: 'modal.wp.scss'
  }
})
export class Modal {
  $el: HTMLElement;
  $emit: Function;
  animation: Animation;

  @Prop() mode: string;
  @Prop() color: string;
  @Prop() component: string;
  @Prop() componentProps: any = {};
  @Prop() cssClass: string;
  @Prop() enableBackdropDismiss: boolean = true;
  @Prop() enterAnimation: AnimationBuilder;
  @Prop() exitAnimation: AnimationBuilder;
  @Prop() id: string;
  @Prop() showBackdrop: boolean = true;

  @Listen('ionDismiss')
  onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  ionViewDidLoad() {
    this.$emit('ionModalDidLoad', { modal: this } as ModalEvent);
  }

  present() {
    return new Promise<void>(resolve => {
      this._present(resolve);
    });
  }

  private _present(resolve: Function) {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    this.$emit('ionModalWillPresent', { modal: this } as ModalEvent);

    // get the user's animation fn if one was provided
    let animationBuilder = this.enterAnimation;

    if (!animationBuilder) {
      // user did not provide a custom animation fn
      // decide from the config which animation to use
      // TODO!!
      animationBuilder = iOSEnterAnimation;
    }

    // build the animation and kick it off
    this.animation = animationBuilder(this.$el);

    this.animation.onFinish((a: any) => {
      a.destroy();
      this.$emit('ionModalDidPresent', { modal: this } as ModalEvent);
      resolve();
    }).play();
  }

  dismiss() {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    return new Promise<void>(resolve => {
      this.$emit('ionModalWillDismiss', { modal: this } as ModalEvent);

      // get the user's animation fn if one was provided
      let animationBuilder = this.exitAnimation;

      if (!animationBuilder) {
        // user did not provide a custom animation fn
        // decide from the config which animation to use
        // TODO!!
        animationBuilder = iOSLeaveAnimation;
      }

      // build the animation and kick it off
      this.animation = animationBuilder(this.$el);
      this.animation.onFinish((a: any) => {
        a.destroy();
        this.$emit('ionModalDidDismiss', { modal: this } as ModalEvent);
        Ionic.dom.write(() => {
          this.$el.parentNode.removeChild(this.$el);
        });
        resolve();
      }).play();
    });
  }

  ionViewDidUnload() {
    this.$emit('ionModalDidUnload', { modal: this } as ModalEvent);
  }

  backdropClick() {
    if (this.enableBackdropDismiss) {
      // const opts: NavOptions = {
      //   minClickBlockDuration: 400
      // };
      this.dismiss();
    }
  }

  render() {
    const ThisComponent = this.component;

    let userCssClasses = 'modal-content';
    if (this.cssClass) {
      userCssClasses += ` ${this.cssClass}`;
    }

    const dialogClasses = createThemedClasses(this.mode, this.color, 'modal-wrapper');
    const thisComponentClasses = createThemedClasses(this.mode, this.color, userCssClasses);

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
          props={this.componentProps}
          class={thisComponentClasses}
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


export interface ModalEvent {
  modal: Modal;
}
