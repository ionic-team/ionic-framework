import { Component, Element, Event, EventEmitter, Listen, Prop } from '@stencil/core';
import { AnimationBuilder, Animation } from '../../index';
import { createThemedClasses } from '../../utils/theme';

import iOSEnterAnimation from './animations/ios.enter';
import iOSLeaveAnimation from './animations/ios.leave';


@Component({
  tag: 'ion-popover',
  styleUrls: {
    // ios: 'popover.ios.scss',
    md: 'popover.md.scss',
    // wp: 'popover.wp.scss'
  },
  host: {
    theme: 'popover'
  }
})
export class Popover {
  @Element() private el: HTMLElement;

  @Event() ionPopoverDidLoad: EventEmitter;
  @Event() ionPopoverWillPresent: EventEmitter;
  @Event() ionPopoverDidPresent: EventEmitter;
  @Event() ionPopoverWillDismiss: EventEmitter;
  @Event() ionPopoverDidDismiss: EventEmitter;
  @Event() ionPopoverDidUnload: EventEmitter;

  @Prop() mode: string;
  @Prop() color: string;
  @Prop() component: string;
  @Prop() componentProps: any = {};
  @Prop() cssClass: string;
  @Prop() enableBackdropDismiss: boolean = true;
  @Prop() enterAnimation: AnimationBuilder;
  @Prop() exitAnimation: AnimationBuilder;
  @Prop() ev: Event;
  @Prop() id: string;
  @Prop() showBackdrop: boolean = true;



  private animation: Animation;

  @Listen('ionDismiss')
  onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  ionViewDidLoad() {
    this.ionPopoverDidLoad.emit({ popover: this });
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
    this.ionPopoverWillPresent.emit({ popover: this });

    // get the user's animation fn if one was provided
    // let animationBuilder = this.enterAnimation
    // ? this.enterAnimation
    // : iOSEnterAnimation;
    //
    // build the animation and kick it off
    // this.animation = animationBuilder(this.el);

    // this.animation.onFinish((a: any) => {
    //   a.destroy();
    //   this.ionPopoverDidPresent.emit({ popover: this });
      resolve();
    // }).play();
  }

  dismiss() {
    // if (this.animation) {
    //   this.animation.destroy();
    //   this.animation = null;
    // }

    return new Promise<void>(resolve => {
      this.ionPopoverWillDismiss.emit({ popover: this });

      // get the user's animation fn if one was provided
      // let animationBuilder = this.exitAnimation;
      //
      // if (!animationBuilder) {
      //   // user did not provide a custom animation fn
      //   // decide from the config which animation to use
      //   // TODO!!
      //   animationBuilder = iOSLeaveAnimation;
      // }

      // build the animation and kick it off
      // this.animation = animationBuilder(this.el);
      // this.animation.onFinish((a: any) => {
      //   a.destroy();
        this.ionPopoverDidDismiss.emit({ popover: this });

        Core.dom.write(() => {
          this.el.parentNode.removeChild(this.el);
        });
        resolve();
      // }).play();
    });
  }

  ionViewDidUnload() {
    this.ionPopoverDidUnload.emit({ popover: this });
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

    let userCssClasses = 'popover-content';
    if (this.cssClass) {
      userCssClasses += ` ${this.cssClass}`;
    }

    const dialogClasses = createThemedClasses(this.mode, this.color, 'popover-wrapper');
    const thisComponentClasses = createThemedClasses(this.mode, this.color, userCssClasses);

    return [
      <div
        onClick={this.backdropClick.bind(this)}
        class={{
          'popover-backdrop': true,
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


export interface PopoverOptions {
  component: string;
  componentProps?: any;
  showBackdrop?: boolean;
  enableBackdropDismiss?: boolean;
  enterAnimation?: AnimationBuilder;
  exitAnimation?: AnimationBuilder;
  cssClass?: string;
  ev: Event;
}


export interface PopoverEvent {
  popover: Popover;
}
