import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Animation, AnimationBuilder, AnimationController, Config, DomController, FrameworkDelegate, OverlayDismissEvent, OverlayDismissEventDetail } from '../../index';

import { DomFrameworkDelegate } from '../../utils/dom-framework-delegate';
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
  popoverId: number;

  private animation: Animation;
  private usersComponentElement: HTMLElement;

  @Element() private el: HTMLElement;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;
  @Prop({ context: 'config' }) config: Config;
  @Prop({ context: 'dom' }) dom: DomController;
  @Prop({ mutable: true }) delegate: FrameworkDelegate;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
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
   * Animation to use when the popover is presented.
   */
  @Prop() enterAnimation: AnimationBuilder;

  /**
   * Animation to use when the popover is dismissed.
   */
  @Prop() leaveAnimation: AnimationBuilder;

  /**
   * The component to display inside of the popover.
   */
  @Prop() component: string;

  /**
   * The data to pass to the popover component.
   */
  @Prop() data: any = {};

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass: string;

  /**
   * If true, the popover will be dismissed when the backdrop is clicked. Defaults to `true`.
   */
  @Prop() enableBackdropDismiss = true;

  /**
   * The event to pass to the popover animation.
   */
  @Prop() ev: Event;

  /**
   * If true, a backdrop will be displayed behind the popover. Defaults to `true`.
   */
  @Prop() showBackdrop = true;

  /**
   * If true, the popover will be translucent. Defaults to `false`.
   */
  @Prop() translucent = false;

  /**
   * If true, the popover will animate. Defaults to `true`.
   */
  @Prop() willAnimate = true;

  /**
   * Emitted after the popover has loaded.
   */
  @Event() ionPopoverDidLoad: EventEmitter<PopoverEventDetail>;

  /**
   * Emitted after the popover has presented.
   */
  @Event() ionPopoverDidPresent: EventEmitter<PopoverEventDetail>;

  /**
   * Emitted before the popover has presented.
   */
  @Event() ionPopoverWillPresent: EventEmitter<PopoverEventDetail>;

  /**
   * Emitted before the popover has dismissed.
   */
  @Event() ionPopoverWillDismiss: EventEmitter<PopoverDismissEventDetail>;

  /**
   * Emitted after the popover has dismissed.
   */
  @Event() ionPopoverDidDismiss: EventEmitter<PopoverDismissEventDetail>;

  /**
   * Emitted after the popover has unloaded.
   */
  @Event() ionPopoverDidUnload: EventEmitter<PopoverEventDetail>;

  /**
   * Present the popover overlay after it has been created.
   */
  @Method()
  present() {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }
    this.ionPopoverWillPresent.emit();

    this.el.style.zIndex = `${10000 + this.popoverId}`;

    // get the user's animation fn if one was provided
    const animationBuilder = this.enterAnimation || this.config.get('popoverEnter', this.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);

    const userComponentParent = this.el.querySelector(`.${USER_COMPONENT_POPOVER_CONTAINER_CLASS}`);
    if (!this.delegate) {
      this.delegate = new DomFrameworkDelegate();
    }

    const cssClasses: string[] = [];
    if (this.cssClass && this.cssClass.length) {
      cssClasses.push(this.cssClass);
    }

    // add the modal by default to the data being passed
    this.data = this.data || {};
    this.data.modal = this.el;

    return this.delegate.attachViewToDom(userComponentParent, this.component, this.data, cssClasses)
      .then((mountingData) => {
        this.usersComponentElement = mountingData.element;
        return domControllerAsync(this.dom.raf)
        .then(() => this.animationCtrl.create(animationBuilder, this.el, this.ev));
      })
      .then((animation) => {
        this.animation = animation;
        if (!this.willAnimate) this.animation = animation.duration(0);
        return playAnimationAsync(animation);
      })
      .then((animation) => {
        animation.destroy();
        this.componentDidEnter();
      });
  }

  /**
   * Dismiss the popover overlay after it has been presented.
   */
  @Method()
  dismiss(data?: any, role?: string) {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    this.ionPopoverWillDismiss.emit({ data, role });

    if (!this.delegate) {
      this.delegate = new DomFrameworkDelegate();
    }

    const animationBuilder = this.leaveAnimation || this.config.get('popoverLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);

    return this.animationCtrl.create(animationBuilder, this.el)
      .then(animation => {
        this.animation = animation;
        return playAnimationAsync(animation);
      })
      .then((animation) => {
        animation.destroy();
        this.ionPopoverDidDismiss.emit({ data, role });
      })
      .then(() => {
        return domControllerAsync(this.dom.write, () => {
          const userComponentParent = this.el.querySelector(`.${USER_COMPONENT_POPOVER_CONTAINER_CLASS}`);
          this.delegate.removeViewFromDom(userComponentParent, this.usersComponentElement);
          this.el.parentNode.removeChild(this.el);
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
    const backdropClasses = createThemedClasses(this.mode, this.color, 'popover-backdrop'),
      wrapperClasses = createThemedClasses(this.mode, this.color, 'popover-wrapper');

    return [
      <ion-backdrop
        onClick={this.backdropClick.bind(this)}
        class={{
          ...backdropClasses
        }}></ion-backdrop>,
      <div class={wrapperClasses}>
        <div class='popover-arrow' />
        <div class='popover-content'>
          <div class={USER_COMPONENT_POPOVER_CONTAINER_CLASS}>
          </div>
        </div>
      </div>
    ];
  }
}

export interface PopoverOptions {
  component: any;
  data?: any;
  showBackdrop?: boolean;
  enableBackdropDismiss?: boolean;
  translucent?: boolean;
  enterAnimation?: AnimationBuilder;
  leavenimation?: AnimationBuilder;
  cssClass?: string;
  ev: Event;
  delegate?: FrameworkDelegate;
}

export interface PopoverEvent extends CustomEvent {
  target: HTMLIonPopoverElement;
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

export const USER_COMPONENT_POPOVER_CONTAINER_CLASS = 'popover-viewport';
