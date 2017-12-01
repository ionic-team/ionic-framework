import { Component, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { Animation, AnimationBuilder, AnimationController, Config } from '../../index';

import { createThemedClasses } from '../../utils/theme';

import iosEnterAnimation from './animations/ios.enter';
import iosLeaveAnimation from './animations/ios.leave';
import mdEnterAnimation from './animations/md.enter';
import mdLeaveAnimation from './animations/md.leave';

@Component({
  tag: 'ion-popover',
  styleUrls: {
    ios: 'popover.ios.scss',
    md: 'popover.md.scss'
  },
  host: {
    theme: 'popover'
  }
})
export class Popover {
  private animation: Animation;

  @Element() private el: HTMLElement;

  /**
   * @output {PopoverEvent} Emitted after the popover has loaded.
   */
  @Event() ionPopoverDidLoad: EventEmitter;

  /**
   * @output {PopoverEvent} Emitted after the popover has presented.
   */
  @Event() ionPopoverDidPresent: EventEmitter;

  /**
   * @output {PopoverEvent} Emitted before the popover has presented.
   */
  @Event() ionPopoverWillPresent: EventEmitter;

  /**
   * @output {PopoverEvent} Emitted before the popover has dismissed.
   */
  @Event() ionPopoverWillDismiss: EventEmitter;

  /**
   * @output {PopoverEvent} Emitted after the popover has dismissed.
   */
  @Event() ionPopoverDidDismiss: EventEmitter;

  /**
   * @output {PopoverEvent} Emitted after the popover has unloaded.
   */
  @Event() ionPopoverDidUnload: EventEmitter;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;
  @Prop({ context: 'config' }) config: Config;

  @Prop() mode: string;
  @Prop() color: string;
  @Prop() component: string;
  @Prop() componentProps: any = {};
  @Prop() cssClass: string;
  @Prop() enableBackdropDismiss: boolean = true;
  @Prop() enterAnimation: AnimationBuilder;
  @Prop() leaveAnimation: AnimationBuilder;
  @Prop() ev: Event;
  @Prop() popoverId: string;
  @Prop() showBackdrop: boolean = true;
  @Prop() translucent: boolean = false;


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
    const animationBuilder = this.enterAnimation || this.config.get('popoverEnter', this.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);


    // build the animation and kick it off
    this.animationCtrl.create(animationBuilder, this.el, this.ev).then(animation => {
      this.animation = animation;

      animation.onFinish((a: any) => {
        a.destroy();
        this.componentDidEnter();
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
      const animationBuilder = this.leaveAnimation || this.config.get('popoverLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);

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

  componentDidLoad() {
    this.ionPopoverDidLoad.emit({ popover: this });
  }

  componentDidEnter() {
    this.ionPopoverDidPresent.emit({ popover: this });
  }

  componentDidUnload() {
    this.ionPopoverDidUnload.emit({ popover: this });
  }

  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  protected backdropClick() {
    if (this.enableBackdropDismiss) {
      // const opts: NavOptions = {
      //   minClickBlockDuration: 400
      // };
      this.dismiss();
    }
  }

  hostData() {
    const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'popover-translucent') : {};

    const hostClasses = {
      ...themedClasses
    };

    return {
      class: hostClasses
    };
  }

  render() {
    const ThisComponent = this.component;
    const wrapperClasses = createThemedClasses(this.mode, this.color, 'popover-wrapper');

    return [
      <ion-backdrop
        onClick={this.backdropClick.bind(this)}
        class='popover-backdrop'
      />,
      <div class={wrapperClasses}>
        <div class='popover-arrow'/>
        <div class='popover-content'>
          <div class='popover-viewport'>
            <ThisComponent
              {...this.componentProps}
              class={this.cssClass}
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
  translucent?: boolean;
  enterAnimation?: AnimationBuilder;
  leavenimation?: AnimationBuilder;
  cssClass?: string;
  ev: Event;
}

export interface PopoverEvent {
  detail: {
    popover: Popover;
  };
}

export const POPOVER_POSITION_PROPERTIES: any = {
  ios: {
    padding: 2,
    unit: '%',
    showArrow: true,
    centerTarget: true
  },
  md: {
    padding: 12,
    unit: 'px',
    showArrow: false,
    centerTarget: false
  }
};

export {
  iosEnterAnimation as iosPopoverEnterAnimation,
  iosLeaveAnimation as iosPopoverLeaveAnimation,
  mdEnterAnimation as mdPopoverEnterAnimation,
  mdLeaveAnimation as mdPopoverLeaveAnimation
};

