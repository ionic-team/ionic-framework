import { Component, Element, Event, EventEmitter, Listen, Prop } from '@stencil/core';
import { AnimationBuilder, AnimationController, Animation } from '../../index';
import { createThemedClasses } from '../../utils/theme';

import iOSEnterAnimation from './animations/ios.enter';
import iOSLeaveAnimation from './animations/ios.leave';


@Component({
  tag: 'ion-modal',
  styleUrls: {
    ios: 'modal.ios.scss',
    md: 'modal.md.scss',
    wp: 'modal.wp.scss'
  },
  host: {
    theme: 'modal'
  }
})
export class Modal {
  @Element() private el: HTMLElement;

  @Event() ionModalDidLoad: EventEmitter;
  @Event() ionModalWillPresent: EventEmitter;
  @Event() ionModalDidPresent: EventEmitter;
  @Event() ionModalWillDismiss: EventEmitter;
  @Event() ionModalDidDismiss: EventEmitter;
  @Event() ionModalDidUnload: EventEmitter;

  @Prop({ connect: 'ion-animation' }) animationCtrl: AnimationController;
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

  private animation: Animation;


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

    this.ionModalWillPresent.emit({ modal: this });

    // get the user's animation fn if one was provided
    let animationBuilder = this.enterAnimation;

    if (!animationBuilder) {
      // user did not provide a custom animation fn
      // decide from the config which animation to use
      // TODO!!
      animationBuilder = iOSEnterAnimation;
    }

    // build the animation and kick it off
    this.animationCtrl.create(animationBuilder, this.el).then(animation => {
      this.animation = animation;

      animation.onFinish((a: any) => {
        a.destroy();
        this.ionModalDidPresent.emit({ modal: this });
        resolve();
      }).play();
    });
  }

  dismiss() {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    return new Promise<void>(resolve => {
      this.ionModalWillDismiss.emit({ modal: this });

      // get the user's animation fn if one was provided
      let animationBuilder = this.exitAnimation;

      if (!animationBuilder) {
        // user did not provide a custom animation fn
        // decide from the config which animation to use
        // TODO!!
        animationBuilder = iOSLeaveAnimation;
      }

      // build the animation and kick it off
      this.animationCtrl.create(animationBuilder, this.el).then(animation => {
        this.animation = animation;

        animation.onFinish((a: any) => {
          a.destroy();
          this.ionModalDidDismiss.emit({ modal: this });

          Context.dom.write(() => {
            this.el.parentNode.removeChild(this.el);
          });
          resolve();
        }).play();
      });
    });
  }

  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  protected ionViewDidLoad() {
    this.ionModalDidLoad.emit({ modal: this });
  }

  protected ionViewDidUnload() {
    this.ionModalDidUnload.emit({ modal: this });
  }

  protected backdropClick() {
    if (this.enableBackdropDismiss) {
      // const opts: NavOptions = {
      //   minClickBlockDuration: 400
      // };
      this.dismiss();
    }
  }

  protected render() {
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


export interface ModalEvent extends Event {
  detail: {
    modal: Modal;
  }
}
