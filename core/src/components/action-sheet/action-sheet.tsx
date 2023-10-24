import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Watch, Component, Element, Event, Host, Method, Prop, h, readTask } from '@stencil/core';
import type { Gesture } from '@utils/gesture';
import { createButtonActiveGesture } from '@utils/gesture/button-active';
import { raf } from '@utils/helpers';
import { createLockController } from '@utils/lock-controller';
import {
  BACKDROP,
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
import { getClassMap } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { AnimationBuilder, CssClassMap, FrameworkDelegate, OverlayInterface } from '../../interface';
import type { OverlayEventDetail } from '../../utils/overlays-interface';

import type { ActionSheetButton } from './action-sheet-interface';
import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-action-sheet',
  styleUrls: {
    ios: 'action-sheet.ios.scss',
    md: 'action-sheet.md.scss',
  },
  scoped: true,
})
export class ActionSheet implements ComponentInterface, OverlayInterface {
  private readonly delegateController = createDelegateController(this);
  private readonly lockController = createLockController();
  private readonly triggerController = createTriggerController();
  private wrapperEl?: HTMLElement;
  private groupEl?: HTMLElement;
  private gesture?: Gesture;

  presented = false;
  lastFocus?: HTMLElement;
  animation?: any;
  backdropEl?: HTMLIonBackdropElement;

  @Element() el!: HTMLIonActionSheetElement;

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
   * Animation to use when the action sheet is presented.
   */
  @Prop() enterAnimation?: AnimationBuilder;

  /**
   * Animation to use when the action sheet is dismissed.
   */
  @Prop() leaveAnimation?: AnimationBuilder;

  /**
   * An array of buttons for the action sheet.
   */
  @Prop() buttons: (ActionSheetButton | string)[] = [];

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass?: string | string[];

  /**
   * If `true`, the action sheet will be dismissed when the backdrop is clicked.
   */
  @Prop() backdropDismiss = true;

  /**
   * Title for the action sheet.
   */
  @Prop() header?: string;

  /**
   * Subtitle for the action sheet.
   */
  @Prop() subHeader?: string;

  /**
   * If `true`, the action sheet will be translucent.
   * Only applies when the mode is `"ios"` and the device supports
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   */
  @Prop() translucent = false;

  /**
   * If `true`, the action sheet will animate.
   */
  @Prop() animated = true;

  /**
   * Additional attributes to pass to the action sheet.
   */
  @Prop() htmlAttributes?: { [key: string]: any };

  /**
   * If `true`, the action sheet will open. If `false`, the action sheet will close.
   * Use this if you need finer grained control over presentation, otherwise
   * just use the actionSheetController or the `trigger` property.
   * Note: `isOpen` will not automatically be set back to `false` when
   * the action sheet dismisses. You will need to do that in your code.
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
   * causes the action sheet to open when clicked.
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
   * Emitted after the action sheet has presented.
   */
  @Event({ eventName: 'ionActionSheetDidPresent' }) didPresent!: EventEmitter<void>;

  /**
   * Emitted before the action sheet has presented.
   */
  @Event({ eventName: 'ionActionSheetWillPresent' }) willPresent!: EventEmitter<void>;

  /**
   * Emitted before the action sheet has dismissed.
   */
  @Event({ eventName: 'ionActionSheetWillDismiss' }) willDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the action sheet has dismissed.
   */
  @Event({ eventName: 'ionActionSheetDidDismiss' }) didDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the action sheet has presented.
   * Shorthand for ionActionSheetWillDismiss.
   */
  @Event({ eventName: 'didPresent' }) didPresentShorthand!: EventEmitter<void>;

  /**
   * Emitted before the action sheet has presented.
   * Shorthand for ionActionSheetWillPresent.
   */
  @Event({ eventName: 'willPresent' }) willPresentShorthand!: EventEmitter<void>;

  /**
   * Emitted before the action sheet has dismissed.
   * Shorthand for ionActionSheetWillDismiss.
   */
  @Event({ eventName: 'willDismiss' }) willDismissShorthand!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the action sheet has dismissed.
   * Shorthand for ionActionSheetDidDismiss.
   */
  @Event({ eventName: 'didDismiss' }) didDismissShorthand!: EventEmitter<OverlayEventDetail>;

  /**
   * Present the action sheet overlay after it has been created.
   */
  @Method()
  async present(): Promise<void> {
    const unlock = await this.lockController.lock();

    await this.delegateController.attachViewToDom();

    await present(this, 'actionSheetEnter', iosEnterAnimation, mdEnterAnimation);

    unlock();
  }

  /**
   * Dismiss the action sheet overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the action sheet.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the action sheet.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   */
  @Method()
  async dismiss(data?: any, role?: string): Promise<boolean> {
    const unlock = await this.lockController.lock();

    const dismissed = await dismiss(this, data, role, 'actionSheetLeave', iosLeaveAnimation, mdLeaveAnimation);

    if (dismissed) {
      this.delegateController.removeViewFromDom();
    }

    unlock();

    return dismissed;
  }

  /**
   * Returns a promise that resolves when the action sheet did dismiss.
   */
  @Method()
  onDidDismiss<T = any>(): Promise<OverlayEventDetail<T>> {
    return eventMethod(this.el, 'ionActionSheetDidDismiss');
  }

  /**
   * Returns a promise that resolves when the action sheet will dismiss.
   *
   */
  @Method()
  onWillDismiss<T = any>(): Promise<OverlayEventDetail<T>> {
    return eventMethod(this.el, 'ionActionSheetWillDismiss');
  }

  private async buttonClick(button: ActionSheetButton) {
    const role = button.role;
    if (isCancel(role)) {
      return this.dismiss(button.data, role);
    }
    const shouldDismiss = await this.callButtonHandler(button);
    if (shouldDismiss) {
      return this.dismiss(button.data, button.role);
    }
    return Promise.resolve();
  }

  private async callButtonHandler(button: ActionSheetButton | undefined) {
    if (button) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      const rtn = await safeCall(button.handler);
      if (rtn === false) {
        // if the return value of the handler is false then do not dismiss
        return false;
      }
    }
    return true;
  }

  private getButtons(): ActionSheetButton[] {
    return this.buttons.map((b) => {
      return typeof b === 'string' ? { text: b } : b;
    });
  }

  private onBackdropTap = () => {
    this.dismiss(undefined, BACKDROP);
  };

  private dispatchCancelHandler = (ev: CustomEvent) => {
    const role = ev.detail.role;
    if (isCancel(role)) {
      const cancelButton = this.getButtons().find((b) => b.role === 'cancel');
      this.callButtonHandler(cancelButton);
    }
  };

  connectedCallback() {
    prepareOverlay(this.el);
    this.triggerChanged();
  }

  disconnectedCallback() {
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
    this.triggerController.removeClickListener();
  }

  componentWillLoad() {
    setOverlayId(this.el);
  }

  componentDidLoad() {
    /**
     * Only create gesture if:
     * 1. A gesture does not already exist
     * 2. App is running in iOS mode
     * 3. A wrapper ref exists
     * 4. A group ref exists
     */
    const { groupEl, wrapperEl } = this;
    if (!this.gesture && getIonMode(this) === 'ios' && wrapperEl && groupEl) {
      readTask(() => {
        const isScrollable = groupEl.scrollHeight > groupEl.clientHeight;
        if (!isScrollable) {
          this.gesture = createButtonActiveGesture(wrapperEl, (refEl: HTMLElement) =>
            refEl.classList.contains('action-sheet-button')
          );
          this.gesture.enable(true);
        }
      });
    }

    /**
     * If action sheet was rendered with isOpen="true"
     * then we should open action sheet immediately.
     */
    if (this.isOpen === true) {
      raf(() => this.present());
    }
  }

  render() {
    const { header, htmlAttributes, overlayIndex } = this;
    const mode = getIonMode(this);
    const allButtons = this.getButtons();
    const cancelButton = allButtons.find((b) => b.role === 'cancel');
    const buttons = allButtons.filter((b) => b.role !== 'cancel');
    const headerID = `action-sheet-${overlayIndex}-header`;

    return (
      <Host
        role="dialog"
        aria-modal="true"
        aria-labelledby={header !== undefined ? headerID : null}
        tabindex="-1"
        {...(htmlAttributes as any)}
        style={{
          zIndex: `${20000 + this.overlayIndex}`,
        }}
        class={{
          [mode]: true,
          ...getClassMap(this.cssClass),
          'overlay-hidden': true,
          'action-sheet-translucent': this.translucent,
        }}
        onIonActionSheetWillDismiss={this.dispatchCancelHandler}
        onIonBackdropTap={this.onBackdropTap}
      >
        <ion-backdrop ref={(el) => (this.backdropEl = el)} tappable={this.backdropDismiss} />

        <div tabindex="0"></div>

        <div class="action-sheet-wrapper ion-overlay-wrapper" ref={(el) => (this.wrapperEl = el)}>
          <div class="action-sheet-container">
            <div class="action-sheet-group" ref={(el) => (this.groupEl = el)}>
              {header !== undefined && (
                <div
                  id={headerID}
                  class={{
                    'action-sheet-title': true,
                    'action-sheet-has-sub-title': this.subHeader !== undefined,
                  }}
                >
                  {header}
                  {this.subHeader && <div class="action-sheet-sub-title">{this.subHeader}</div>}
                </div>
              )}
              {buttons.map((b) => (
                <button
                  {...b.htmlAttributes}
                  type="button"
                  id={b.id}
                  class={buttonClass(b)}
                  onClick={() => this.buttonClick(b)}
                >
                  <span class="action-sheet-button-inner">
                    {b.icon && <ion-icon icon={b.icon} aria-hidden="true" lazy={false} class="action-sheet-icon" />}
                    {b.text}
                  </span>
                  {mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
                </button>
              ))}
            </div>

            {cancelButton && (
              <div class="action-sheet-group action-sheet-group-cancel">
                <button
                  {...cancelButton.htmlAttributes}
                  type="button"
                  class={buttonClass(cancelButton)}
                  onClick={() => this.buttonClick(cancelButton)}
                >
                  <span class="action-sheet-button-inner">
                    {cancelButton.icon && (
                      <ion-icon icon={cancelButton.icon} aria-hidden="true" lazy={false} class="action-sheet-icon" />
                    )}
                    {cancelButton.text}
                  </span>
                  {mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
                </button>
              </div>
            )}
          </div>
        </div>

        <div tabindex="0"></div>
      </Host>
    );
  }
}

const buttonClass = (button: ActionSheetButton): CssClassMap => {
  return {
    'action-sheet-button': true,
    'ion-activatable': true,
    'ion-focusable': true,
    [`action-sheet-${button.role}`]: button.role !== undefined,
    ...getClassMap(button.cssClass),
  };
};
