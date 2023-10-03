import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { State, Watch, Component, Element, Event, h, Host, Method, Prop } from '@stencil/core';
import { ENABLE_HTML_CONTENT_DEFAULT, getMode } from '@utils/config';
import { raf } from '@utils/helpers';
import { createLockController } from '@utils/lock-controller';
import { printIonWarning } from '@utils/logging';
import {
  createDelegateController,
  createTriggerController,
  dismiss,
  eventMethod,
  isCancel,
  prepareOverlay,
  present,
  safeCall,
  setOverlayId,
} from '@utils/overlays';
import { sanitizeDOMString } from '@utils/sanitization';
import { createColorClasses, getClassMap } from '@utils/theme';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import type { AnimationBuilder, Color, CssClassMap, OverlayInterface, FrameworkDelegate } from '../../interface';
import type { OverlayEventDetail } from '../../utils/overlays-interface';
import type { IonicSafeString } from '../../utils/sanitization';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';
import { getAnimationPosition } from './animations/utils';
import type {
  ToastButton,
  ToastPosition,
  ToastLayout,
  ToastPresentOptions,
  ToastDismissOptions,
  ToastAnimationPosition,
} from './toast-interface';

// TODO(FW-2832): types

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part button - Any button element that is displayed inside of the toast.
 * @part button cancel - Any button element with role "cancel" that is displayed inside of the toast.
 * @part container - The element that wraps all child elements.
 * @part header - The header text of the toast.
 * @part message - The body text of the toast.
 * @part icon - The icon that appears next to the toast content.
 */
@Component({
  tag: 'ion-toast',
  styleUrls: {
    ios: 'toast.ios.scss',
    md: 'toast.md.scss',
  },
  shadow: true,
})
export class Toast implements ComponentInterface, OverlayInterface {
  private readonly delegateController = createDelegateController(this);
  private readonly lockController = createLockController();
  private readonly triggerController = createTriggerController();
  private customHTMLEnabled = config.get('innerHTMLTemplatesEnabled', ENABLE_HTML_CONTENT_DEFAULT);
  private durationTimeout?: ReturnType<typeof setTimeout>;

  /**
   * Holds the position of the toast calculated in the present
   * animation, to be passed along to the dismiss animation so
   * we don't have to calculate the position twice.
   */
  private lastPresentedPosition?: ToastAnimationPosition;

  presented = false;

  /**
   * When `true`, content inside of .toast-content
   * will have aria-hidden elements removed causing
   * screen readers to announce the remaining content.
   */
  @State() revealContentToScreenReader = false;

  @Element() el!: HTMLIonToastElement;

  /**
   * @internal
   */
  @Prop() overlayIndex!: number;

  /** @internal */
  @Prop() delegate?: FrameworkDelegate;

  /** @internal */
  @Prop() hasController = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * Animation to use when the toast is presented.
   */
  @Prop() enterAnimation?: AnimationBuilder;

  /**
   * Animation to use when the toast is dismissed.
   */
  @Prop() leaveAnimation?: AnimationBuilder;

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass?: string | string[];

  /**
   * How many milliseconds to wait before hiding the toast. By default, it will show
   * until `dismiss()` is called.
   */
  @Prop() duration = config.getNumber('toastDuration', 0);

  /**
   * Header to be shown in the toast.
   */
  @Prop() header?: string;

  /**
   * Defines how the message and buttons are laid out in the toast.
   * 'baseline': The message and the buttons will appear on the same line.
   * Message text may wrap within the message container.
   * 'stacked': The buttons containers and message will stack on top
   * of each other. Use this if you have long text in your buttons.
   */
  @Prop() layout: ToastLayout = 'baseline';

  /**
   * Message to be shown in the toast.
   * This property accepts custom HTML as a string.
   * Content is parsed as plaintext by default.
   * `innerHTMLTemplatesEnabled` must be set to `true` in the Ionic config
   * before custom HTML can be used.
   */
  @Prop() message?: string | IonicSafeString;

  /**
   * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
   */
  @Prop() keyboardClose = false;

  /**
   * The starting position of the toast on the screen. Can be tweaked further
   * using the `positionAnchor` property.
   */
  @Prop() position: ToastPosition = 'bottom';

  /**
   * The element to anchor the toast's position to. Can be set as a direct reference
   * or the ID of the element. With `position="bottom"`, the toast will sit above the
   * chosen element. With `position="top"`, the toast will sit below the chosen element.
   * With `position="middle"`, the value of `positionAnchor` is ignored.
   */
  @Prop() positionAnchor?: HTMLElement | string;

  /**
   * An array of buttons for the toast.
   */
  @Prop() buttons?: (ToastButton | string)[];

  /**
   * If `true`, the toast will be translucent.
   * Only applies when the mode is `"ios"` and the device supports
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   */
  @Prop() translucent = false;

  /**
   * If `true`, the toast will animate.
   */
  @Prop() animated = true;

  /**
   * The name of the icon to display, or the path to a valid SVG file. See `ion-icon`.
   * https://ionic.io/ionicons
   */
  @Prop() icon?: string;

  /**
   * Additional attributes to pass to the toast.
   */
  @Prop() htmlAttributes?: { [key: string]: any };

  /**
   * If `true`, the toast will open. If `false`, the toast will close.
   * Use this if you need finer grained control over presentation, otherwise
   * just use the toastController or the `trigger` property.
   * Note: `isOpen` will not automatically be set back to `false` when
   * the toast dismisses. You will need to do that in your code.
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
   * An ID corresponding to the trigger element that
   * causes the toast to open when clicked.
   */
  @Prop() trigger: string | undefined;
  @Watch('trigger')
  triggerChanged() {
    const { trigger, el, triggerController } = this;
    if (trigger) {
      triggerController.addClickListener(el, trigger);
    }
  }

  /**
   * Emitted after the toast has presented.
   */
  @Event({ eventName: 'ionToastDidPresent' }) didPresent!: EventEmitter<void>;

  /**
   * Emitted before the toast has presented.
   */
  @Event({ eventName: 'ionToastWillPresent' }) willPresent!: EventEmitter<void>;

  /**
   * Emitted before the toast has dismissed.
   */
  @Event({ eventName: 'ionToastWillDismiss' }) willDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the toast has dismissed.
   */
  @Event({ eventName: 'ionToastDidDismiss' }) didDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the toast has presented.
   * Shorthand for ionToastWillDismiss.
   */
  @Event({ eventName: 'didPresent' }) didPresentShorthand!: EventEmitter<void>;

  /**
   * Emitted before the toast has presented.
   * Shorthand for ionToastWillPresent.
   */
  @Event({ eventName: 'willPresent' }) willPresentShorthand!: EventEmitter<void>;

  /**
   * Emitted before the toast has dismissed.
   * Shorthand for ionToastWillDismiss.
   */
  @Event({ eventName: 'willDismiss' }) willDismissShorthand!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the toast has dismissed.
   * Shorthand for ionToastDidDismiss.
   */
  @Event({ eventName: 'didDismiss' }) didDismissShorthand!: EventEmitter<OverlayEventDetail>;

  connectedCallback() {
    prepareOverlay(this.el);
    this.triggerChanged();
  }

  disconnectedCallback() {
    this.triggerController.removeClickListener();
  }

  componentWillLoad() {
    setOverlayId(this.el);
  }

  componentDidLoad() {
    /**
     * If toast was rendered with isOpen="true"
     * then we should open toast immediately.
     */
    if (this.isOpen === true) {
      raf(() => this.present());
    }
  }

  /**
   * Present the toast overlay after it has been created.
   */
  @Method()
  async present(): Promise<void> {
    const unlock = await this.lockController.lock();

    await this.delegateController.attachViewToDom();

    const { el, position } = this;
    const anchor = this.getAnchorElement();
    const animationPosition = getAnimationPosition(position, anchor, getMode(), el);

    /**
     * Cache the calculated position of the toast, so we can re-use it
     * in the dismiss animation.
     */
    this.lastPresentedPosition = animationPosition;

    await present<ToastPresentOptions>(this, 'toastEnter', iosEnterAnimation, mdEnterAnimation, {
      position,
      top: animationPosition.top,
      bottom: animationPosition.bottom,
    });

    /**
     * Content is revealed to screen readers after
     * the transition to avoid jank since this
     * state updates will cause a re-render.
     */
    this.revealContentToScreenReader = true;

    if (this.duration > 0) {
      this.durationTimeout = setTimeout(() => this.dismiss(undefined, 'timeout'), this.duration);
    }

    unlock();
  }

  /**
   * Dismiss the toast overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the toast.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the toast.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   */
  @Method()
  async dismiss(data?: any, role?: string): Promise<boolean> {
    const unlock = await this.lockController.lock();

    const { durationTimeout, position, lastPresentedPosition } = this;

    if (durationTimeout) {
      clearTimeout(durationTimeout);
    }

    const dismissed = await dismiss<ToastDismissOptions>(
      this,
      data,
      role,
      'toastLeave',
      iosLeaveAnimation,
      mdLeaveAnimation,
      /**
       * Fetch the cached position that was calculated back in the present
       * animation. We always want to animate the dismiss from the same
       * position the present stopped at, so the animation looks continuous.
       */
      {
        position,
        top: lastPresentedPosition?.top ?? '',
        bottom: lastPresentedPosition?.bottom ?? '',
      }
    );

    if (dismissed) {
      this.delegateController.removeViewFromDom();
      this.revealContentToScreenReader = false;
    }

    unlock();

    return dismissed;
  }

  /**
   * Returns a promise that resolves when the toast did dismiss.
   */
  @Method()
  onDidDismiss<T = any>(): Promise<OverlayEventDetail<T>> {
    return eventMethod(this.el, 'ionToastDidDismiss');
  }

  /**
   * Returns a promise that resolves when the toast will dismiss.
   */
  @Method()
  onWillDismiss<T = any>(): Promise<OverlayEventDetail<T>> {
    return eventMethod(this.el, 'ionToastWillDismiss');
  }

  private getButtons(): ToastButton[] {
    const buttons = this.buttons
      ? this.buttons.map((b) => {
          return typeof b === 'string' ? { text: b } : b;
        })
      : [];

    return buttons;
  }

  /**
   * Returns the element specified by the positionAnchor prop,
   * or undefined if prop's value is an ID string and the element
   * is not found in the DOM.
   */
  private getAnchorElement(): HTMLElement | undefined {
    const { position, positionAnchor, el } = this;

    if (position === 'middle' && positionAnchor !== undefined) {
      printIonWarning('The positionAnchor property is ignored when using position="middle".', this.el);
      return undefined;
    }

    if (typeof positionAnchor === 'string') {
      /**
       * If the anchor is defined as an ID, find the element.
       * We do this on every present so the toast doesn't need
       * to account for the surrounding DOM changing since the
       * last time it was presented.
       */
      const foundEl = document.getElementById(positionAnchor);
      if (foundEl === null) {
        printIonWarning(`An anchor element with an ID of "${positionAnchor}" was not found in the DOM.`, el);
        return undefined;
      }

      return foundEl;
    }

    if (positionAnchor instanceof HTMLElement) {
      return positionAnchor;
    }

    printIonWarning('Invalid positionAnchor value:', positionAnchor, el);
    return undefined;
  }

  private async buttonClick(button: ToastButton) {
    const role = button.role;
    if (isCancel(role)) {
      return this.dismiss(undefined, role);
    }
    const shouldDismiss = await this.callButtonHandler(button);
    if (shouldDismiss) {
      return this.dismiss(undefined, role);
    }
    return Promise.resolve();
  }

  private async callButtonHandler(button: ToastButton | undefined) {
    if (button?.handler) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      try {
        const rtn = await safeCall(button.handler);
        if (rtn === false) {
          // if the return value of the handler is false then do not dismiss
          return false;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  }

  private dispatchCancelHandler = (ev: CustomEvent) => {
    const role = ev.detail.role;
    if (isCancel(role)) {
      const cancelButton = this.getButtons().find((b) => b.role === 'cancel');
      this.callButtonHandler(cancelButton);
    }
  };

  renderButtons(buttons: ToastButton[], side: 'start' | 'end') {
    if (buttons.length === 0) {
      return;
    }

    const mode = getIonMode(this);
    const buttonGroupsClasses = {
      'toast-button-group': true,
      [`toast-button-group-${side}`]: true,
    };
    return (
      <div class={buttonGroupsClasses}>
        {buttons.map((b) => (
          <button
            {...b.htmlAttributes}
            type="button"
            class={buttonClass(b)}
            tabIndex={0}
            onClick={() => this.buttonClick(b)}
            part={buttonPart(b)}
          >
            <div class="toast-button-inner">
              {b.icon && (
                <ion-icon
                  aria-hidden="true"
                  icon={b.icon}
                  slot={b.text === undefined ? 'icon-only' : undefined}
                  class="toast-button-icon"
                />
              )}
              {b.text}
            </div>
            {mode === 'md' && (
              <ion-ripple-effect
                type={b.icon !== undefined && b.text === undefined ? 'unbounded' : 'bounded'}
              ></ion-ripple-effect>
            )}
          </button>
        ))}
      </div>
    );
  }

  /**
   * Render the `message` property.
   * @param key - A key to give the element a stable identity. This is used to improve compatibility with screen readers.
   * @param ariaHidden - If "true" then content will be hidden from screen readers.
   */
  private renderToastMessage(key: string, ariaHidden: 'true' | null = null) {
    const { customHTMLEnabled, message } = this;
    if (customHTMLEnabled) {
      return (
        <div
          key={key}
          aria-hidden={ariaHidden}
          class="toast-message"
          part="message"
          innerHTML={sanitizeDOMString(message)}
        ></div>
      );
    }

    return (
      <div key={key} aria-hidden={ariaHidden} class="toast-message" part="message">
        {message}
      </div>
    );
  }

  /**
   * Render the `header` property.
   * @param key - A key to give the element a stable identity. This is used to improve compatibility with screen readers.
   * @param ariaHidden - If "true" then content will be hidden from screen readers.
   */
  private renderHeader(key: string, ariaHidden: 'true' | null = null) {
    return (
      <div key={key} class="toast-header" aria-hidden={ariaHidden} part="header">
        {this.header}
      </div>
    );
  }

  render() {
    const { layout, el, revealContentToScreenReader, header, message } = this;
    const allButtons = this.getButtons();
    const startButtons = allButtons.filter((b) => b.side === 'start');
    const endButtons = allButtons.filter((b) => b.side !== 'start');
    const mode = getIonMode(this);
    const wrapperClass = {
      'toast-wrapper': true,
      [`toast-${this.position}`]: true,
      [`toast-layout-${layout}`]: true,
    };

    /**
     * Stacked buttons are only meant to be
     *  used with one type of button.
     */
    if (layout === 'stacked' && startButtons.length > 0 && endButtons.length > 0) {
      printIonWarning(
        'This toast is using start and end buttons with the stacked toast layout. We recommend following the best practice of using either start or end buttons with the stacked toast layout.',
        el
      );
    }

    return (
      <Host
        tabindex="-1"
        {...(this.htmlAttributes as any)}
        style={{
          zIndex: `${60000 + this.overlayIndex}`,
        }}
        class={createColorClasses(this.color, {
          [mode]: true,
          ...getClassMap(this.cssClass),
          'overlay-hidden': true,
          'toast-translucent': this.translucent,
        })}
        onIonToastWillDismiss={this.dispatchCancelHandler}
      >
        <div class={wrapperClass}>
          <div class="toast-container" part="container">
            {this.renderButtons(startButtons, 'start')}

            {this.icon !== undefined && (
              <ion-icon class="toast-icon" part="icon" icon={this.icon} lazy={false} aria-hidden="true"></ion-icon>
            )}

            {/*
              This creates a live region where screen readers
              only announce the header and the message. Elements
              such as icons and buttons should not be announced.
              aria-live and aria-atomic here are redundant, but we
              add them to maximize browser compatibility.

              Toasts are meant to be subtle notifications that do
              not interrupt the user which is why this has
              a "status" role and a "polite" presentation.
            */}
            <div class="toast-content" role="status" aria-atomic="true" aria-live="polite">
              {/*
                This logic below is done to improve consistency
                across platforms when showing and updating live regions.

                TalkBack and VoiceOver announce the live region content
                when the toast is shown, but NVDA does not. As a result,
                we need to trigger a DOM update so NVDA detects changes and
                announces an update to the live region. We do this after
                the toast is fully visible to avoid jank during the presenting
                animation.

                The "key" attribute is used here to force Stencil to render
                new nodes and not re-use nodes. Otherwise, NVDA would not
                detect any changes to the live region.

                The "old" content is hidden using aria-hidden otherwise
                VoiceOver will announce the toast content twice when presenting.
              */}
              {!revealContentToScreenReader && header !== undefined && this.renderHeader('oldHeader', 'true')}
              {!revealContentToScreenReader && message !== undefined && this.renderToastMessage('oldMessage', 'true')}
              {revealContentToScreenReader && header !== undefined && this.renderHeader('header')}
              {revealContentToScreenReader && message !== undefined && this.renderToastMessage('header')}
            </div>

            {this.renderButtons(endButtons, 'end')}
          </div>
        </div>
      </Host>
    );
  }
}

const buttonClass = (button: ToastButton): CssClassMap => {
  return {
    'toast-button': true,
    'toast-button-icon-only': button.icon !== undefined && button.text === undefined,
    [`toast-button-${button.role}`]: button.role !== undefined,
    'ion-focusable': true,
    'ion-activatable': true,
    ...getClassMap(button.cssClass),
  };
};

const buttonPart = (button: ToastButton): string => {
  return isCancel(button.role) ? 'button cancel' : 'button';
};
