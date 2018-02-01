import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import {
  Animation,
  AnimationBuilder,
  AnimationController,
  Config,
  DomController,
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
  tag: 'ion-loading',
  styleUrls: {
    ios: 'loading.ios.scss',
    md: 'loading.md.scss'
  },
  host: {
    theme: 'loading'
  }
})
export class Loading {
  color: string;
  mode: string;
  loadingId: number;

  private animation: Animation;
  private durationTimeout: any;

  @Element() private el: HTMLElement;

  /**
   * Emitted after the loading has loaded.
   */
  @Event() ionLoadingDidLoad: EventEmitter<LoadingEventDetail>;

  /**
   * Emitted after the loading has presented.
   */
  @Event() ionLoadingDidPresent: EventEmitter<LoadingEventDetail>;

  /**
   * Emitted before the loading has presented.
   */
  @Event() ionLoadingWillPresent: EventEmitter<LoadingEventDetail>;

  /**
   * Emitted before the loading has dismissed.
   */
  @Event() ionLoadingWillDismiss: EventEmitter<LoadingDismissEventDetail>;

  /**
   * Emitted after the loading has dismissed.
   */
  @Event() ionLoadingDidDismiss: EventEmitter<LoadingDismissEventDetail>;

  /**
   * Emitted after the loading has unloaded.
   */
  @Event() ionLoadingDidUnload: EventEmitter<LoadingEventDetail>;

  @Prop() spinner: string;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;
  @Prop({ context: 'config' }) config: Config;
  @Prop({ context: 'dom' }) dom: DomController;

  /**
   * Additional classes to apply for custom CSS
   */
  @Prop() cssClass: string;

  /**
   * Optional text content to display in the loading indicator
   */
  @Prop() content: string;

  /**
   * Dismiss the loading indicator if the page is changed
   */
  @Prop() dismissOnPageChange = false;

  /**
   * Number of milliseconds to wait before dismissing the loading indicator
   */
  @Prop() duration: number;

  /**
   * If true, the background will be translucent. Browser support for backdrop-filter is required for the full effect
   */
  @Prop() translucent = false;

  /**
   * Show the backdrop of not
   */
  @Prop() showBackdrop = true;

  /**
   * Animation to use when loading indicator is presented
   */
  @Prop() enterAnimation: AnimationBuilder;

  /**
   * Animation to use when a loading indicator is dismissed
   */
  @Prop() leaveAnimation: AnimationBuilder;

  /**
   * Toggles whether animation should occur or not
   */
  @Prop() willAnimate = true;

  /**
   * Present a loading overlay after it has been created
   */
  @Method()
  present() {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    this.ionLoadingWillPresent.emit();

    this.el.style.zIndex = `${20000 + this.loadingId}`;

    // get the user's animation fn if one was provided
    const animationBuilder = this.enterAnimation || this.config.get('loadingEnter', this.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);

    // build the animation and kick it off
    return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
      this.animation = animation;
      if (!this.willAnimate) {
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

  /**
   * Dismiss a loading indicator programatically
   */
  @Method()
  dismiss(data?: any, role?: string) {
    clearTimeout(this.durationTimeout);

    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    this.ionLoadingWillDismiss.emit({
      data,
      role
    });

    const animationBuilder = this.leaveAnimation || this.config.get('loadingLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);

    return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
      this.animation = animation;
      if (!this.willAnimate) {
        // if the duration is 0, it won't actually animate I don't think
        // TODO - validate this
        this.animation = animation.duration(0);
      }
      return playAnimationAsync(animation);
    }).then((animation) => {
      animation.destroy();
      this.ionLoadingDidDismiss.emit({
        data,
        role
      });
    }).then(() => {
      return domControllerAsync(this.dom.write, () => {
        this.el.parentNode.removeChild(this.el);
      });
    });
  }

  componentDidLoad() {
    if (!this.spinner) {
      this.spinner = this.config.get('loadingSPinner', this.mode === 'ios' ? 'lines' : 'crescent');
    }
    this.ionLoadingDidLoad.emit();
  }

  componentDidEnter() {
    // blur the currently active element
    const activeElement: any = document.activeElement;
    activeElement && activeElement.blur && activeElement.blur();

    // If there is a duration, dismiss after that amount of time
    if (typeof this.duration === 'number' && this.duration > 10) {
      this.durationTimeout = setTimeout(() => this.dismiss(), this.duration);
    }

    this.ionLoadingDidPresent.emit();
  }

  componentDidUnload() {
    this.ionLoadingDidUnload.emit();
  }

  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  hostData() {
    const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'loading-translucent') : {};

    const hostClasses = {
      ...themedClasses
    };

    return {
      class: hostClasses
    };
  }

  render() {
    if (this.cssClass) {
      this.cssClass.split(' ').forEach(cssClass => {
        if (cssClass.trim() !== '') this.el.classList.add(cssClass);
      });
    }

    const loadingInner: any[] = [];

    if (this.spinner !== 'hide') {
      loadingInner.push(
        <div class='loading-spinner'>
          <ion-spinner name={this.spinner}></ion-spinner>
        </div>
      );
    }

    if (this.content) {
      loadingInner.push(
        <div class='loading-content'>
          {this.content}
        </div>
      );
    }

    return [
      <ion-gesture
        attachTo='parent'
        autoBlockAll
        class={{
          'loading-backdrop': true,
          'hide-backdrop': !this.showBackdrop
        }}
      ></ion-gesture>,
      <div class='loading-wrapper' role='dialog'>
        {loadingInner}
      </div>
    ];
  }
}

export interface LoadingOptions {
  spinner?: string;
  content?: string;
  cssClass?: string;
  showBackdrop?: boolean;
  dismissOnPageChange?: boolean;
  duration?: number;
  translucent?: boolean;
}

export interface LoadingEvent extends CustomEvent {
  target: HTMLIonLoadingElement;
  detail: LoadingEventDetail;
}

export interface LoadingEventDetail {

}

export interface LoadingDismissEventDetail extends OverlayDismissEventDetail {
  // keep this just for the sake of static types and potential future extensions
}

export interface LoadingDismissEvent extends OverlayDismissEvent {
  // keep this just for the sake of static types and potential future extensions
}

export {
  iosEnterAnimation as iosLoadingEnterAnimation,
  iosLeaveAnimation as iosLoadingLeaveAnimation,
  mdEnterAnimation as mdLoadingEnterAnimation,
  mdLeaveAnimation as mdLoadingLeaveAnimation
};
