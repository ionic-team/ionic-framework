import { Component, h, Ionic, Listen, Prop } from '../index';
import { AnimationBuilder, Animation, Modal as IModal, ModalEvent } from '../../util/interfaces';
import { createThemedClasses } from '../../util/theme';

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
export class Modal implements IModal {
  $el: HTMLElement;
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
    Ionic.emit(this, 'ionModalDidLoad', { detail: { modal: this } } as ModalEvent);
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

    Ionic.emit(this, 'ionModalWillPresent', { detail: { modal: this } } as ModalEvent);

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
      Ionic.emit(this, 'ionModalDidPresent', { detail: { modal: this } } as ModalEvent);
      resolve();
    }).play();
  }

  dismiss() {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    return new Promise<void>(resolve => {
      Ionic.emit(this, 'ionModalWillDismiss', { detail: { modal: this } } as ModalEvent);

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
        Ionic.emit(this, 'ionModalDidDismiss', { detail: { modal: this } } as ModalEvent);
        Ionic.dom.write(() => {
          this.$el.parentNode.removeChild(this.$el);
        });
        resolve();
      }).play();
    });
  }

  ionViewDidUnload() {
    Ionic.emit(this, 'ionModalDidUnload', { detail: { modal: this } } as ModalEvent);
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
