import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Animation, AnimationBuilder, Color, Config, Mode } from '../../interface';
import { BACKDROP, OverlayEventDetail, OverlayInterface, dismiss, eventMethod, present } from '../../utils/overlays';
import { createThemedClasses, getClassMap } from '../../utils/theme';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';

import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';

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

  private durationTimeout: any;

  presented = false;
  animation?: Animation;
  color?: Color;
  mode!: Mode;

  @Element() el!: HTMLElement;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl!: HTMLIonAnimationControllerElement;
  @Prop({ context: 'config' }) config!: Config;
  @Prop() overlayId!: number;
  @Prop() keyboardClose = true;

  /**
   * Animation to use when the loading indicator is presented.
   */
  @Prop() enterAnimation?: AnimationBuilder;

  /**
   * Animation to use when the loading indicator is dismissed.
   */
  @Prop() leaveAnimation?: AnimationBuilder;

  /**
   * Optional text content to display in the loading indicator.
   */
  @Prop() content?: string;

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass?: string | string[];

  /**
   * If true, the loading indicator will dismiss when the page changes. Defaults to `false`.
   */
  @Prop() dismissOnPageChange = false;

  /**
   * Number of milliseconds to wait before dismissing the loading indicator.
   */
  @Prop() duration?: number;

  /**
   * If true, the loading indicator will be dismissed when the backdrop is clicked. Defaults to `false`.
   */
  @Prop() enableBackdropDismiss = false;

  /**
   * If true, a backdrop will be displayed behind the loading indicator. Defaults to `true`.
   */
  @Prop() showBackdrop = true;

  /**
   * The name of the spinner to display. Possible values are: `"lines"`, `"lines-small"`, `"dots"`,
   * `"bubbles"`, `"circles"`, `"crescent"`.
   */
  @Prop() spinner?: string;

  /**
   * If true, the loading indicator will be translucent. Defaults to `false`.
   */
  @Prop() translucent = false;

  /**
   * If true, the loading indicator will animate. Defaults to `true`.
   */
  @Prop() willAnimate = true;

  /**
   * Emitted after the loading has unloaded.
   */
  @Event() ionLoadingDidUnload!: EventEmitter<void>;

  /**
   * Emitted after the loading has loaded.
   */
  @Event() ionLoadingDidLoad!: EventEmitter<void>;

  /**
   * Emitted after the loading has presented.
   */
  @Event({eventName: 'ionLoadingDidPresent'}) didPresent!: EventEmitter<void>;

  /**
   * Emitted before the loading has presented.
   */
  @Event({eventName: 'ionLoadingWillPresent'}) willPresent!: EventEmitter<void>;

  /**
   * Emitted before the loading has dismissed.
   */
  @Event({eventName: 'ionLoadingWillDismiss'}) willDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the loading has dismissed.
   */
  @Event({eventName: 'ionLoadingDidDismiss'}) didDismiss!: EventEmitter<OverlayEventDetail>;

  componentWillLoad() {
    if (!this.spinner) {
      this.spinner = this.config.get('loadingSpinner', this.mode === 'ios' ? 'lines' : 'crescent');
    }
  }
  componentDidLoad() {
    this.ionLoadingDidLoad.emit();
  }

  componentDidUnload() {
    this.ionLoadingDidUnload.emit();
  }

  @Listen('ionBackdropTap')
  protected onBackdropTap() {
    this.dismiss(null, BACKDROP);
  }

  /**
   * Present the loading overlay after it has been created.
   */
  @Method()
  async present(): Promise<void> {
    await present(this, 'loadingEnter', iosEnterAnimation, mdEnterAnimation, undefined);

    if (this.duration) {
      this.durationTimeout = setTimeout(() => this.dismiss(), this.duration + 10);
    }
  }

  /**
   * Dismiss the loading overlay after it has been presented.
   */
  @Method()
  dismiss(data?: any, role?: string): Promise<void> {
    if (this.durationTimeout) {
      clearTimeout(this.durationTimeout);
    }
    return dismiss(this, data, role, 'loadingLeave', iosLeaveAnimation, mdLeaveAnimation);
  }

  /**
   * Returns a promise that resolves when the loading did dismiss. It also accepts a callback
   * that is called in the same circustances.
   *
   * ```
   * const {data, role} = await loading.onDidDismiss();
   * ```
   */
  @Method()
  onDidDismiss(callback?: (detail: OverlayEventDetail) => void): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionLoadingDidDismiss', callback);
  }

  /**
   * Returns a promise that resolves when the loading will dismiss. It also accepts a callback
   * that is called in the same circustances.
   *
   * ```
   * const {data, role} = await loading.onWillDismiss();
   * ```
   */
  @Method()
  onWillDismiss(callback?: (detail: OverlayEventDetail) => void): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionLoadingWillDismiss', callback);
  }

  hostData() {
    const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'loading-translucent') : {};

    return {
      style: {
        zIndex: 20000 + this.overlayId,
      },
      class: {
        ...themedClasses,
        ...getClassMap(this.cssClass)
      }
    };
  }

  render() {
    return [
      <ion-backdrop visible={this.showBackdrop} tappable={false} />,
      <div class="loading-wrapper" role="dialog">

        { this.spinner !== 'hide' &&
        <div class="loading-spinner">
          <ion-spinner name={this.spinner}></ion-spinner>
        </div>}

        { this.content && <div class="loading-content">{this.content}</div>}
      </div>
    ];
  }
}
