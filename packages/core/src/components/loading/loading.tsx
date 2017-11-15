import { Animation, AnimationBuilder, AnimationController, Config } from '../../index';
import { Component, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';

import iOSEnterAnimation from './animations/ios.enter';
import iOSLeaveAnimation from './animations/ios.leave';


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
  private animation: Animation;
  private durationTimeout: any;
  private mode: string;

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
  @Prop() cssClass: string;
  @Prop() content: string;
  @Prop() dismissOnPageChange: boolean = false;
  @Prop() duration: number;
  @Prop() enterAnimation: AnimationBuilder;
  @Prop() exitAnimation: AnimationBuilder;
  @Prop() loadingId: string;
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

    this.ionLoadingWillPresent.emit({ loading: this });

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
    clearTimeout(this.durationTimeout);

    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    return new Promise(resolve => {
      this.ionLoadingWillDismiss.emit({ loading: this });

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
          this.ionLoadingDidDismiss.emit({ loading: this });

          Context.dom.write(() => {
            this.el.parentNode.removeChild(this.el);
          });

          resolve();

        }).play();
      });
    });
  }

  protected ionViewDidUnload() {
    this.ionLoadingDidUnload.emit({ loading: this });
  }

  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  protected ionViewDidLoad() {
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

  protected ionViewDidEnter() {
    // blur the currently active element
    const activeElement: any = document.activeElement;
    activeElement && activeElement.blur && activeElement.blur();

    // If there is a duration, dismiss after that amount of time
    if (typeof this.duration === 'number' && this.duration > 10) {
      this.durationTimeout = setTimeout(() => this.dismiss(), this.duration);
    }

    this.ionLoadingDidPresent.emit({ loading: this });
  }

  protected render() {
    let userCssClass = 'loading-content';
    if (this.cssClass) {
      userCssClass += ' ' + this.cssClass;
    }

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
}


export interface LoadingEvent extends Event {
  detail: {
    loading: Loading;
  };
}
