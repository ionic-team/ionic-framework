import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Watch, Component, Element, Event, Host, Method, Prop, h } from '@stencil/core';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import type {
  AnimationBuilder,
  FrameworkDelegate,
  LoadingAttributes,
  OverlayEventDetail,
  OverlayInterface,
  SpinnerTypes,
} from '../../interface';
import { CoreDelegate, detachComponent } from '../../utils/framework-delegate';
import { raf } from '../../utils/helpers';
import { BACKDROP, dismiss, eventMethod, prepareOverlay, present } from '../../utils/overlays';
import type { IonicSafeString } from '../../utils/sanitization';
import { sanitizeDOMString } from '../../utils/sanitization';
import { getClassMap } from '../../utils/theme';
import { deepReady } from '../../utils/transition';

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
    md: 'loading.md.scss',
  },
  scoped: true,
})
export class Loading implements ComponentInterface, OverlayInterface {
  private durationTimeout: any;
  private coreDelegate: FrameworkDelegate = CoreDelegate();
  private currentTransition?: Promise<any>;
  private inline = false;
  private workingDelegate?: FrameworkDelegate;
  // Reference to the user's provided loading content
  private usersElement?: HTMLElement;

  presented = false;
  lastFocus?: HTMLElement;

  @Element() el!: HTMLIonLoadingElement;

  /** @internal */
  @Prop() overlayIndex!: number;

  /** @internal */
  @Prop() delegate?: FrameworkDelegate;

  /** @internal */
  @Prop() hasController = false;

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
  @Prop() message?: string | IonicSafeString;

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
   * Only applies when the mode is `"ios"` and the device supports
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   */
  @Prop() translucent = false;

  /**
   * If `true`, the loading indicator will animate.
   */
  @Prop() animated = true;

  /**
   * Additional attributes to pass to the loader.
   */
  @Prop() htmlAttributes?: LoadingAttributes;

  /**
   * If `true`, the loading indicator will open. If `false`, the loading indicator will close.
   * Use this if you need finer grained control over presentation, otherwise
   * just use the loadingController or the `trigger` property.
   * Note: `isOpen` will not automatically be set back to `false` when
   * the loading indicator dismisses. You will need to do that in your code.
   */
  @Prop() isOpen = false;
  @Watch('isOpen')
  onIsOpenChange(newValue: boolean, oldValue: boolean) {
    if (newValue === true && oldValue === false) {
      this.present();
    } else if (newValue === false && oldValue === true) {
      this.dismiss();
    }
  }

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

  connectedCallback() {
    prepareOverlay(this.el);
  }

  componentWillLoad() {
    if (this.spinner === undefined) {
      const mode = getIonMode(this);
      this.spinner = config.get('loadingSpinner', config.get('spinner', mode === 'ios' ? 'lines' : 'crescent'));
    }
  }

  componentDidLoad() {
    /**
     * If loading indicator was rendered with isOpen="true"
     * then we should open loading indicator immediately.
     */
    if (this.isOpen === true) {
      raf(() => this.present());
    }
  }

  /**
   * Present the loading overlay after it has been created.
   */
  @Method()
  async present(): Promise<void> {
    /**
     * When using an inline loading indicator
     * and dismissing a loading indicator it is possible to
     * quickly present the loading indicator while it is
     * dismissing. We need to await any current
     * transition to allow the dismiss to finish
     * before presenting again.
     */
    if (this.currentTransition !== undefined) {
      await this.currentTransition;
    }

    const { delegate } = this.getDelegate(true);

    if (delegate) {
      this.usersElement = await delegate.attachViewToDom(this.el, undefined);
      await deepReady(this.usersElement);
    }

    this.currentTransition = present(this, 'loadingEnter', iosEnterAnimation, mdEnterAnimation, undefined);

    await this.currentTransition;

    if (this.duration > 0) {
      this.durationTimeout = setTimeout(() => this.dismiss(), this.duration + 10);
    }

    this.currentTransition = undefined;
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
  async dismiss(data?: any, role?: string): Promise<boolean> {
    if (this.durationTimeout) {
      clearTimeout(this.durationTimeout);
    }
    this.currentTransition = dismiss(this, data, role, 'loadingLeave', iosLeaveAnimation, mdLeaveAnimation);

    const dismissed = await this.currentTransition;

    if (dismissed) {
      const { delegate } = this.getDelegate();
      await detachComponent(delegate, this.usersElement);
    }

    return dismissed;
  }

  /**
   * Returns a promise that resolves when the loading did dismiss.
   */
  @Method()
  onDidDismiss<T = any>(): Promise<OverlayEventDetail<T>> {
    return eventMethod(this.el, 'ionLoadingDidDismiss');
  }

  /**
   * Returns a promise that resolves when the loading will dismiss.
   */
  @Method()
  onWillDismiss<T = any>(): Promise<OverlayEventDetail<T>> {
    return eventMethod(this.el, 'ionLoadingWillDismiss');
  }

  private onBackdropTap = () => {
    this.dismiss(undefined, BACKDROP);
  };

  /**
   * Determines whether or not an overlay
   * is being used inline or via a controller/JS
   * and returns the correct delegate.
   * By default, subsequent calls to getDelegate
   * will use a cached version of the delegate.
   * This is useful for calling dismiss after
   * present so that the correct delegate is given.
   */
  private getDelegate(force = false) {
    const { workingDelegate } = this;
    if (workingDelegate && !force) {
      return {
        delegate: workingDelegate,
        inline: this.inline,
      };
    }
    /**
     * If using overlay inline
     * we potentially need to use the coreDelegate
     * so that this works in vanilla JS apps.
     * If a developer has presented this component
     * via a controller, then we can assume
     * the component is already in the
     * correct place.
     */
    const parentEl = this.el.parentNode as HTMLElement | null;
    const inline = (this.inline = parentEl !== null && !this.hasController);
    const delegate = (this.workingDelegate = inline ? this.delegate || this.coreDelegate : this.delegate);

    return { inline, delegate };
  }

  render() {
    const { message, spinner, htmlAttributes } = this;
    const mode = getIonMode(this);
    return (
      <Host
        tabindex="-1"
        {...(htmlAttributes as any)}
        style={{
          zIndex: `${40000 + this.overlayIndex}`,
        }}
        onIonBackdropTap={this.onBackdropTap}
        class={{
          ...getClassMap(this.cssClass),
          [mode]: true,
          'overlay-hidden': true,
          'loading-translucent': this.translucent,
        }}
      >
        <ion-backdrop visible={this.showBackdrop} tappable={this.backdropDismiss} />

        <div tabindex="0"></div>

        <div class="loading-wrapper ion-overlay-wrapper" role="dialog">
          {spinner && (
            <div class="loading-spinner">
              <ion-spinner name={spinner} aria-hidden="true" />
            </div>
          )}

          {message && <div class="loading-content" innerHTML={sanitizeDOMString(message)}></div>}
        </div>

        <div tabindex="0"></div>
      </Host>
    );
  }
}
