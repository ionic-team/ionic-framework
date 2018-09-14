import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';

import { Animation, AnimationBuilder, Config, Mode, OverlayEventDetail, OverlayInterface } from '../../interface';
import { BACKDROP, dismiss, eventMethod, present } from '../../utils/overlays';
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
  }
})
export class Loading implements ComponentInterface, OverlayInterface {
  private durationTimeout: any;

  presented = false;
  animation?: Animation;

  @Element() el!: HTMLElement;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl!: HTMLIonAnimationControllerElement;
  @Prop({ context: 'config' }) config!: Config;
  @Prop() overlayIndex!: number;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * If true, the keyboard will be automatically dismissed when the overlay is presented.
   */
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
  @Prop() message?: string;

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass?: string | string[];

  /**
   * Number of milliseconds to wait before dismissing the loading indicator.
   */
  @Prop() duration = 0;

  /**
   * If true, the loading indicator will be dismissed when the backdrop is clicked. Defaults to `false`.
   */
  @Prop() backdropDismiss = false;

  /**
   * If true, a backdrop will be displayed behind the loading indicator. Defaults to `true`.
   */
  @Prop() showBackdrop = true;

  /**
   * The name of the spinner to display. Possible values are: `"lines"`, `"lines-small"`, `"dots"`,
   * `"bubbles"`, `"circles"`, `"crescent"`.
   */
  @Prop({ mutable: true }) spinner?: string;

  /**
   * If true, the loading indicator will be translucent. Defaults to `false`.
   */
  @Prop() translucent = false;

  /**
   * If true, the loading indicator will animate. Defaults to `true`.
   */
  @Prop() animated = true;

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
  @Event({ eventName: 'ionLoadingDidPresent' }) didPresent!: EventEmitter<void>;

  /**
   * Emitted before the loading has presented.
   */
  @Event({ eventName: 'ionLoadingWillPresent' }) willPresent!: EventEmitter<void>;

  /**
   * Emitted before the loading has dismissed.
   */
  @Event({ eventName: 'ionLoadingWillDismiss' }) willDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the loading has dismissed.
   */
  @Event({ eventName: 'ionLoadingDidDismiss' }) didDismiss!: EventEmitter<OverlayEventDetail>;

  componentWillLoad() {
    if (this.spinner === undefined) {
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
    this.dismiss(undefined, BACKDROP);
  }

  /**
   * Present the loading overlay after it has been created.
   */
  @Method()
  async present(): Promise<void> {
    await present(this, 'loadingEnter', iosEnterAnimation, mdEnterAnimation, undefined);

    if (this.duration > 0) {
      this.durationTimeout = setTimeout(
        () => this.dismiss(),
        this.duration + 10
      );
    }
  }

  /**
   * Dismiss the loading overlay after it has been presented.
   */
  @Method()
  dismiss(data?: any, role?: string): Promise<boolean> {
    if (this.durationTimeout) {
      clearTimeout(this.durationTimeout);
    }
    return dismiss(this, data, role, 'loadingLeave', iosLeaveAnimation, mdLeaveAnimation);
  }

  /**
   * Returns a promise that resolves when the loading did dismiss.
   */
  @Method()
  onDidDismiss(): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionLoadingDidDismiss');
  }

  /**
   * Returns a promise that resolves when the loading will dismiss.
   */
  @Method()
  onWillDismiss(): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionLoadingWillDismiss');
  }

  hostData() {
    const themedClasses = this.translucent
      ? createThemedClasses(this.mode, 'loading-translucent')
      : {};

    return {
      style: {
        zIndex: 40000 + this.overlayIndex
      },
      class: {
        ...createThemedClasses(this.mode, 'loading'),
        ...themedClasses,
        ...getClassMap(this.cssClass)
      }
    };
  }

  render() {
    return [
      <ion-backdrop visible={this.showBackdrop} tappable={false} />,
      <div class="loading-wrapper" role="dialog">
        {this.spinner !== 'hide' && (
          <div class="loading-spinner">
            <ion-spinner name={this.spinner} />
          </div>
        )}

        {this.message && <div class="loading-content">{this.message}</div>}
      </div>
    ];
  }
}
