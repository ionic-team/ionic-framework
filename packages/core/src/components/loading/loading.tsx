import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Animation, AnimationBuilder, AnimationController, Config, DomController, OverlayDismissEvent, OverlayDismissEventDetail } from '../../index';
import { domControllerAsync, playAnimationAsync } from '../../utils/helpers';
import { createThemedClasses, getClassMap } from '../../utils/theme';

import iosEnterAnimation from './animations/ios.enter';
import iosLeaveAnimation from './animations/ios.leave';
import mdEnterAnimation from './animations/md.enter';
import mdLeaveAnimation from './animations/md.leave';
import { OverlayInterface, BACKDROP } from '../../utils/overlays';

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

export class Loading implements OverlayInterface {
  color: string;
  mode: string;

  private presented = false;
  private animation: Animation;
  private durationTimeout: any;

  @Element() private el: HTMLElement;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;
  @Prop({ context: 'config' }) config: Config;
  @Prop({ context: 'dom' }) dom: DomController;
  @Prop() overlayId: number;

  /**
   * Animation to use when the loading indicator is presented.
   */
  @Prop() enterAnimation: AnimationBuilder;

  /**
   * Animation to use when the loading indicator is dismissed.
   */
  @Prop() leaveAnimation: AnimationBuilder;

  /**
   * Optional text content to display in the loading indicator.
   */
  @Prop() content: string;

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass: string;

  /**
   * If true, the loading indicator will dismiss when the page changes. Defaults to `false`.
   */
  @Prop() dismissOnPageChange = false;

  /**
   * Number of milliseconds to wait before dismissing the loading indicator.
   */
  @Prop() duration: number;

  /**
   * If true, the loading indicator will be dismissed when the backdrop is clicked. Defaults to `false`.
   */
  @Prop() enableBackdropDismiss = false;

  /**
   * If true, a backdrop will be displayed behind the loading indicator. Defaults to `true`.
   */
  @Prop() showBackdrop = true;

  /**
   * The name of the spinner to display. Possible values are: `"lines"`, `"lines-sm"`, `"dots"`,
   * `"bubbles"`, `"circles"`, `"crescent"`.
   */
  @Prop() spinner: string;

  /**
   * If true, the loading indicator will be translucent. Defaults to `false`.
   */
  @Prop() translucent = false;

  /**
   * If true, the loading indicator will animate. Defaults to `true`.
   */
  @Prop() willAnimate = true;

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

  componentDidLoad() {
    if (!this.spinner) {
      this.spinner = this.config.get('loadingSpinner', this.mode === 'ios' ? 'lines' : 'crescent');
    }
    this.ionLoadingDidLoad.emit();
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

  @Listen('ionBackdropTap')
  protected onBackdropTap() {
    this.dismiss(null, BACKDROP).catch();
  }

  /**
   * Present the loading overlay after it has been created.
   */
  @Method()
  present(): Promise<void> {
    if(this.presented) {
      return Promise.reject('overlay already presented');
    }
    this.presented = true;
    this.ionLoadingWillPresent.emit();

    this.el.style.zIndex = `${20000 + this.overlayId}`;

    // get the user's animation fn if one was provided
    const animationBuilder = this.enterAnimation || this.config.get('loadingEnter', this.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);

    // build the animation and kick it off
    return this.playAnimation(animationBuilder).then(() => {
      // blur the currently active element
      const activeElement: any = document.activeElement;
      activeElement && activeElement.blur && activeElement.blur();

      // If there is a duration, dismiss after that amount of time
      if (typeof this.duration === 'number' && this.duration > 10) {
        this.durationTimeout = setTimeout(() => this.dismiss(), this.duration);
      }
      this.ionLoadingDidPresent.emit();
    });
  }

  /**
   * Dismiss the loading overlay after it has been presented.
   */
  @Method()
  dismiss(data?: any, role?: string) {
    if(!this.presented) {
      return Promise.reject('overlay is not presented');
    }
    this.presented = false;
    clearTimeout(this.durationTimeout);

    this.ionLoadingWillDismiss.emit({data, role});

    const animationBuilder = this.leaveAnimation || this.config.get('loadingLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);

    return this.playAnimation(animationBuilder).then(() => {
      this.ionLoadingDidDismiss.emit({data, role});
      return domControllerAsync(this.dom.write, () => {
        this.el.parentNode.removeChild(this.el);
      });
    });
  }

  private playAnimation(animationBuilder: AnimationBuilder) {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
      this.animation = animation;
      if (!this.willAnimate) {
        // if the duration is 0, it won't actually animate I don't think
        // TODO - validate this
        animation.duration(0);
      }
      return playAnimationAsync(animation);
    }).then(animation => {
      animation.destroy();
      this.animation = null;
    });
  }

  hostData() {
    const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'loading-translucent') : {};

    return {
      class: {
        ...themedClasses,
        ...getClassMap(this.cssClass)
      }
    };
  }

  render() {
    if (this.cssClass) {
      this.cssClass.split(' ').forEach(cssClass => {
        if (cssClass.trim() !== '') this.el.classList.add(cssClass);
      });
    }

    const loadingInner: JSX.Element[] = [];

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
      <ion-backdrop visible={this.showBackdrop} tappable={false} />,
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
