import { Component, Element, Event, EventEmitter, Listen, Prop } from '@stencil/core';
import { Animation, AnimationBuilder, AnimationController, Config } from '../../index';
import { createThemedClasses } from '../../utils/theme';

import iOSEnterAnimation from './animations/ios.enter';
import iOSLeaveAnimation from './animations/ios.leave';

import MdEnterAnimation from './animations/md.enter';
import MdLeaveAnimation from './animations/md.leave';
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
  @Event() ionModalDidLoad: EventEmitter;

  /**
   * @output {ModalEvent} Emitted after the modal has presented.
   */
  @Event() ionModalDidPresent: EventEmitter;

  /**
   * @output {ModalEvent} Emitted before the modal has presented.
   */
  @Event() ionModalWillPresent: EventEmitter;

  /**
   * @output {ModalEvent} Emitted before the modal has dismissed.
   */
  @Event() ionModalWillDismiss: EventEmitter;

  /**
   * @output {ModalEvent} Emitted after the modal has dismissed.
   */
  @Event() ionModalDidDismiss: EventEmitter;

  /**
   * @output {ModalEvent} Emitted after the modal has unloaded.
   */
  @Event() ionModalDidUnload: EventEmitter;

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
    const animationBuilder = this.enterAnimation || this.config.get('modalEnter', this.mode === 'ios' ? iOSEnterAnimation : MdEnterAnimation);

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
      const animationBuilder = this.leaveAnimation || this.config.get('modalExit', this.mode === 'ios' ? iOSLeaveAnimation : MdLeaveAnimation);

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

  componentDidLoad() {
    this.ionModalDidLoad.emit({ modal: this });
  }

  componentDidUnload() {
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


export interface ModalEvent extends Event {
  detail: {
    modal: Modal;
  };
}

export { iOSEnterAnimation, iOSLeaveAnimation, MdEnterAnimation, MdLeaveAnimation };
