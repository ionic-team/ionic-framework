import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Watch, Component, Element, Event, Host, Method, Prop, h } from '@stencil/core';

import type {
  ActionSheetButton,
  AnimationBuilder,
  FrameworkDelegate,
  OverlayEventDetail,
  OverlayInterface,
} from '../../interface';
import {
  BACKDROP,
  createDelegateController,
  createTriggerController,
  dismiss,
  eventMethod,
  prepareOverlay,
  present,
} from '../../utils/overlays';

import { iosEnterAnimation } from '../action-sheet/animations/ios.enter';
import { iosLeaveAnimation } from '../action-sheet/animations/ios.leave';
import { mdEnterAnimation } from '../action-sheet/animations/md.enter';
import { mdLeaveAnimation } from '../action-sheet/animations/md.leave';

@Component({
  tag: 'std-action-sheet',
  styleUrl: 'std-action-sheet.scss',
  shadow: true
})
export class StdActionSheet implements ComponentInterface, OverlayInterface {
  private readonly delegateController = createDelegateController(this);
  private readonly triggerController = createTriggerController();
  private currentTransition?: Promise<any>;

  presented = false;
  lastFocus?: HTMLElement;
  animation?: any;

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
    /**
     * When using an inline action sheet
     * and dismissing a action sheet it is possible to
     * quickly present the action sheet while it is
     * dismissing. We need to await any current
     * transition to allow the dismiss to finish
     * before presenting again.
     */
    if (this.currentTransition !== undefined) {
      await this.currentTransition;
    }

    await this.delegateController.attachViewToDom();

    this.currentTransition = present(this, 'actionSheetEnter', iosEnterAnimation, mdEnterAnimation);

    await this.currentTransition;

    this.currentTransition = undefined;
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
    this.currentTransition = dismiss(this, data, role, 'actionSheetLeave', iosLeaveAnimation, mdLeaveAnimation);
    const dismissed = await this.currentTransition;

    if (dismissed) {
      this.delegateController.removeViewFromDom();
    }

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

  connectedCallback() {
    prepareOverlay(this.el);
    this.triggerChanged();
  }

  disconnectedCallback() {
    this.triggerController.removeClickListener();
  }

  private onBackdropTap = () => {
    this.dismiss(undefined, BACKDROP);
  };

  render() {
    const { overlayIndex } = this;

    return (
      <Host
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        style={{
          zIndex: `${20000 + overlayIndex}`,
        }}
        class={{
          'overlay-hidden': true,
        }}
        onIonBackdropTap={this.onBackdropTap}
      >
        <ion-backdrop tappable={this.backdropDismiss} />
        <slot></slot>
      </Host>
    );
  }
}
