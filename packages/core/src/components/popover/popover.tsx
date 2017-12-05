import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import {
  Animation,
  AnimationBuilder,
  AnimationController,
  Config,
  OverlayDismissEvent,
  OverlayDismissEventDetail
} from '../../index';
import { domControllerAsync, playAnimationAsync } from '../../utils/helpers';
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
  @Event() ionPopoverDidLoad: EventEmitter<PopoverEventDetail>;

  /**
   * @output {PopoverEvent} Emitted after the popover has presented.
   */
  @Event() ionPopoverDidPresent: EventEmitter<PopoverEventDetail>;

  /**
   * @output {PopoverEvent} Emitted before the popover has presented.
   */
  @Event() ionPopoverWillPresent: EventEmitter<PopoverEventDetail>;

  /**
   * @output {PopoverEvent} Emitted before the popover has dismissed.
   */
  @Event() ionPopoverWillDismiss: EventEmitter<PopoverDismissEventDetail>;

  /**
   * @output {PopoverEvent} Emitted after the popover has dismissed.
   */
  @Event() ionPopoverDidDismiss: EventEmitter<PopoverDismissEventDetail>;

  /**
   * @output {PopoverEvent} Emitted after the popover has unloaded.
   */
  @Event() ionPopoverDidUnload: EventEmitter<PopoverEventDetail>;

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
  @Prop() animate: boolean = true;


  @Method()
  present() {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }
    this.ionPopoverWillPresent.emit();

    // get the user's animation fn if one was provided
    const animationBuilder = this.enterAnimation || this.config.get('popoverEnter', this.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);

    // build the animation and kick it off
    return this.animationCtrl.create(animationBuilder, this.el, this.ev).then(animation => {
      this.animation = animation;
      if (!this.animate) {
        // if the duration is 0, it won't actually animate I don't think
        // TODO - validate this
        this.animation = animation.duration(0);
      }
      return playAnimationAsync(animation);
    }).then((animation) => {
      animation.destroy();
      this.componentDidEnter();
    });
  }


  @Method()
  dismiss(data?: any, role?: string) {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    this.ionPopoverWillDismiss.emit({
      data,
      role
    });

    const animationBuilder = this.leaveAnimation || this.config.get('popoverLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);

    return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
      this.animation = animation;
      return playAnimationAsync(animation);
    }).then((animation) => {
      animation.destroy();
      return domControllerAsync(Context.dom.write, () => {
        this.el.parentNode.removeChild(this.el);
      });
    }).then(() => {
      this.ionPopoverDidDismiss.emit({
        data,
        role
      });
    });
  }

  componentDidLoad() {
    this.ionPopoverDidLoad.emit();
  }

  componentDidEnter() {
    this.ionPopoverDidPresent.emit();
  }

  componentDidUnload() {
    this.ionPopoverDidUnload.emit();
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

export interface PopoverEvent extends CustomEvent {
  detail: PopoverEventDetail;
}

export interface PopoverEventDetail {

}

export interface PopoverDismissEventDetail extends OverlayDismissEventDetail {
  // keep this just for the sake of static types and potential future extensions
}

export interface PopoverDismissEvent extends OverlayDismissEvent {
  // keep this just for the sake of static types and potential future extensions
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

