import { Component, Element, Event, EventEmitter, Listen, Prop } from '@stencil/core';
import { AnimationBuilder, Animation, AnimationController, Config } from '../../index';

import { createThemedClasses } from '../../utils/theme';

import iOSEnterAnimation from './animations/ios.enter';
import iOSLeaveAnimation from './animations/ios.leave';

@Component({
  tag: 'ion-popover',
  styleUrls: {
    ios: 'popover.ios.scss',
    md: 'popover.md.scss',
    wp: 'popover.wp.scss'
  },
  host: {
    theme: 'popover'
  }
})
export class Popover {
  private animation: Animation;

  @Element() private el: HTMLElement;

  @Event() private ionPopoverDidLoad: EventEmitter;
  @Event() private ionPopoverDidPresent: EventEmitter;
  @Event() private ionPopoverWillPresent: EventEmitter;
  @Event() private ionPopoverWillDismiss: EventEmitter;
  @Event() private ionPopoverDidDismiss: EventEmitter;
  @Event() private ionPopoverDidUnload: EventEmitter;

  @Prop({ connect: 'ion-animation' }) animationCtrl: AnimationController;
  @Prop({ context: 'config' }) config: Config;

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
    let animationBuilder = this.enterAnimation;

    if (!animationBuilder) {
      // user did not provide a custom animation fn
      // decide from the config which animation to use
      animationBuilder = iOSEnterAnimation;
    }

    // build the animation and kick it off
    this.animationCtrl.create(animationBuilder, this.el).then(animation => {
      this.animation = animation;

      animation.onFinish((a: any) => {
        a.destroy();
        this.ionViewDidEnter();
        resolve();
      }).play();
    });
  }

  dismiss() {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }
    return new Promise(resolve => {
      this.ionPopoverWillDismiss.emit({ popover: this });

      // get the user's animation fn if one was provided
      let animationBuilder = this.exitAnimation;
      if (!animationBuilder) {
        // user did not provide a custom animation fn
        // decide from the config which animation to use
        animationBuilder = iOSLeaveAnimation;
      }

      // build the animation and kick it off
      this.animationCtrl.create(animationBuilder, this.el).then(animation => {
        this.animation = animation;

        animation.onFinish((a: any) => {
          a.destroy();
          this.ionPopoverDidDismiss.emit({ popover: this });

          Context.dom.write(() => {
            this.el.parentNode.removeChild(this.el);
          });

          resolve();
        }).play();
      });
    });
  }

  protected ionViewDidUnload() {
    this.ionPopoverDidUnload.emit({ popover: this });
  }

  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  protected ionViewDidLoad() {
    this.ionPopoverDidLoad.emit({ popover: this });
  }

  protected ionViewDidEnter() {
    this.ionPopoverDidPresent.emit({ popover: this });
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

    let userCssClasses = 'popover-content';
    if (this.cssClass) {
      userCssClasses += ` ${this.cssClass}`;
    }

    const dialogClasses = createThemedClasses(
      this.mode,
      this.color,
      'popover-wrapper'
    );
    const thisComponentClasses = createThemedClasses(
      this.mode,
      this.color,
      userCssClasses
    );

    return [
      <ion-backdrop
        onClick={this.backdropClick.bind(this)}
        class="popover-backdrop"
      />,
      <div class={dialogClasses}>
        <div class="popover-arrow" />
        <div class="popover-content">
          <div class="popover-viewport">
            <ThisComponent
              props={this.componentProps}
              class={thisComponentClasses}
            />
          </div>
        </div>
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
  detail: {
    popover: Popover;
  };
}
