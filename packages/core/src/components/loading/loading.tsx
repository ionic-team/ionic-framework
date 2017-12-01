import { Animation, AnimationBuilder, AnimationController, Config } from '../../index';
import { Component, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
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
  loadingId: string;

  private animation: Animation;
  private durationTimeout: any;

  @Element() private el: HTMLElement;

  /**
   * @output {LoadingEvent} Emitted after the loading has loaded.
   */
  @Event() ionLoadingDidLoad: EventEmitter;

  /**
   * @output {LoadingEvent} Emitted after the loading has presented.
   */
  @Event() ionLoadingDidPresent: EventEmitter;

  /**
   * @output {LoadingEvent} Emitted before the loading has presented.
   */
  @Event() ionLoadingWillPresent: EventEmitter;

  /**
   * @output {LoadingEvent} Emitted before the loading has dismissed.
   */
  @Event() ionLoadingWillDismiss: EventEmitter;

  /**
   * @output {LoadingEvent} Emitted after the loading has dismissed.
   */
  @Event() ionLoadingDidDismiss: EventEmitter;

  /**
   * @output {LoadingEvent} Emitted after the loading has unloaded.
   */
  @Event() ionLoadingDidUnload: EventEmitter;

  @State() private showSpinner: boolean = null;
  @State() private spinner: string;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;
  @Prop({ context: 'config' }) config: Config;

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
  @Prop() dismissOnPageChange: boolean = false;

  /**
   * Number of milliseconds to wait before dismissing the loading indicator
   */
  @Prop() duration: number;

  /**
   * If true, the background will be translucent. Browser support for backdrop-filter is required for the full effect
   */
  @Prop() translucent: boolean = false;

  /**
   * Show the backdrop of not
   */
  @Prop() showBackdrop: boolean = true;

  /**
   * Animation to use when loading indicator is presented
   */
  @Prop() enterAnimation: AnimationBuilder;

  /**
   * Animation to use when a loading indicator is dismissed
   */
  @Prop() leaveAnimation: AnimationBuilder;

  /**
   * Present a loading overlay after it has been created
   */
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

    this.ionLoadingWillPresent.emit({ loading: this });

    // get the user's animation fn if one was provided
    const animationBuilder = this.enterAnimation || this.config.get('loadingEnter', this.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);

    // build the animation and kick it off
    this.animationCtrl.create(animationBuilder, this.el).then(animation => {
      this.animation = animation;

      animation.onFinish((a: any) => {
        a.destroy();
        this.componentDidEnter();
        resolve();

      }).play();
    });
  }

  /**
   * Dismiss a loading indicator programatically
   */
  dismiss() {
    clearTimeout(this.durationTimeout);

    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    return new Promise(resolve => {
      this.ionLoadingWillDismiss.emit({ loading: this });

      // get the user's animation fn if one was provided
      const animationBuilder = this.leaveAnimation || this.config.get('loadingLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);

      // build the animation and kick it off
      this.animationCtrl.create(animationBuilder, this.el).then(animation => {
        this.animation = animation;

        animation.onFinish((a: any) => {
          a.destroy();
          this.ionLoadingDidDismiss.emit({ loading: this });

          Context.dom.write(() => {
            this.el.parentNode.removeChild(this.el);
          });

          resolve();

        }).play();
      });
    });
  }

  componentDidLoad() {
    if (!this.spinner) {
      let defaultSpinner = 'lines';

      if (this.mode === 'md') {
        defaultSpinner = 'crescent';
      }

      this.spinner = this.config.get('loadingSpinner') || defaultSpinner;
    }

    if (this.showSpinner === null || this.showSpinner === undefined) {
      this.showSpinner = !!(this.spinner && this.spinner !== 'hide');
    }
    this.ionLoadingDidLoad.emit({ loading: this });
  }

  componentDidEnter() {
    // blur the currently active element
    const activeElement: any = document.activeElement;
    activeElement && activeElement.blur && activeElement.blur();

    // If there is a duration, dismiss after that amount of time
    if (typeof this.duration === 'number' && this.duration > 10) {
      this.durationTimeout = setTimeout(() => this.dismiss(), this.duration);
    }

    this.ionLoadingDidPresent.emit({ loading: this });
  }

  componentDidUnload() {
    this.ionLoadingDidUnload.emit({ loading: this });
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
    // TODO: cssClass

    const loadingInner: any[] = [];

    if (this.showSpinner) {
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

export interface LoadingEvent extends Event {
  detail: {
    loading: Loading;
  };
}

export {
  iosEnterAnimation as iosLoadingEnterAnimation,
  iosLeaveAnimation as iosLoadingLeaveAnimation,
  mdEnterAnimation as mdLoadingEnterAnimation,
  mdLeaveAnimation as mdLoadingLeaveAnimation
};
