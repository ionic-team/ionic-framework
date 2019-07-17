import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Method, Prop, h } from '@stencil/core';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { Animation, AnimationBuilder, OverlayEventDetail, OverlayInterface, SpinnerTypes } from '../../interface';
import { BACKDROP, dismiss, eventMethod, present } from '../../utils/overlays';
import { sanitizeDOMString } from '../../utils/sanitization';
import { getClassMap } from '../../utils/theme';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-loading',
  styleUrls: {
    ios: 'loading.ios.scss',
    md: 'loading.md.scss'
  },
  scoped: true
})
export class Loading implements ComponentInterface, OverlayInterface {
  private durationTimeout: any;

  presented = false;
  animation?: Animation;
  mode = getIonMode(this);

  @Element() el!: HTMLElement;

  /** @internal */
  @Prop() overlayIndex!: number;

  /**
   * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
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
   * If `true`, the loading indicator will be dismissed when the backdrop is clicked.
   */
  @Prop() backdropDismiss = false;

  /**
   * If `true`, a backdrop will be displayed behind the loading indicator.
   */
  @Prop() showBackdrop = true;

  /**
   * The name of the spinner to display.
   */
  @Prop({ mutable: true }) spinner?: SpinnerTypes | null;

  /**
   * If `true`, the loading indicator will be translucent.
   */
  @Prop() translucent = false;

  /**
   * If `true`, the loading indicator will animate.
   */
  @Prop() animated = true;

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
      const mode = getIonMode(this);
      this.spinner = config.get(
        'loadingSpinner',
        config.get('spinner', mode === 'ios' ? 'lines' : 'crescent')
      );
    }
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
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the loading.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the loading.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
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

  private onBackdropTap = () => {
    this.dismiss(undefined, BACKDROP);
  }

  render() {
    const { message, spinner } = this;
    const mode = getIonMode(this);
    return (
      <Host
        onIonBackdropTap={this.onBackdropTap}
        style={{
          zIndex: `${40000 + this.overlayIndex}`
        }}
        class={{
          ...getClassMap(this.cssClass),
          [mode]: true,
          'loading-translucent': this.translucent
        }}
      >
        <ion-backdrop visible={this.showBackdrop} tappable={this.backdropDismiss} />
        <div class="loading-wrapper" role="dialog">
          {spinner && (
            <div class="loading-spinner">
              <ion-spinner name={spinner} />
            </div>
          )}

          {message && <div class="loading-content" innerHTML={sanitizeDOMString(message)}></div>}
        </div>
      </Host>
    );
  }
}
