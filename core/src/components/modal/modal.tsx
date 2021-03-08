import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Method, Prop, Watch, h, writeTask } from '@stencil/core';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { Animation, AnimationBuilder, ComponentProps, ComponentRef, FrameworkDelegate, Gesture, OverlayEventDetail, OverlayInterface } from '../../interface';
import { attachComponent, detachComponent } from '../../utils/framework-delegate';
import { BACKDROP, activeAnimations, dismiss, eventMethod, prepareOverlay, present } from '../../utils/overlays';
import { getClassMap } from '../../utils/theme';
import { deepReady } from '../../utils/transition';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';
import { SheetDefaults, createSheetGesture } from './gestures/sheet';
import { createSwipeToCloseGesture } from './gestures/swipe-to-close';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-modal',
  styleUrls: {
    ios: 'modal.ios.scss',
    md: 'modal.md.scss'
  },
  scoped: true
})
export class Modal implements ComponentInterface, OverlayInterface {
  private gesture?: Gesture;

  // Reference to the user's provided modal content
  private usersElement?: HTMLElement;

  // Whether or not modal is being dismissed via gesture
  private gestureAnimationDismissing = false;
  presented = false;
  lastFocus?: HTMLElement;
  animation?: Animation;
  maxBreakpoint?: number;

  @Element() el!: HTMLIonModalElement;

  /** @internal */
  @Prop() overlayIndex!: number;

  /** @internal */
  @Prop() delegate?: FrameworkDelegate;

  /**
   * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
   */
  @Prop() keyboardClose = true;

  /**
   * Animation to use when the modal is presented.
   */
  @Prop() enterAnimation?: AnimationBuilder;

  /**
   * Animation to use when the modal is dismissed.
   */
  @Prop() leaveAnimation?: AnimationBuilder;

  /**
   * The breakpoints to use for the sheet type modal gesture. This is used when
   * dragging the modal up or down to stop at a certain height. Should be passed in
   * as a decimal percentage of the modal's height, between 0 and 1.
   * For example: [0, .25, .5, 1]
   */
  @Prop() breakpoints?: number[] = [0, 1];

  /**
   * The initial breakpoint to open the sheet modal. This must be included in the
   * breakpoints passed in or it will not stop at the initial breakpoint after opening.
   * Should be a decimal value between 0 and 1. Defaults to `1`.
   */
  @Prop() initialBreakpoint = 1;

  /**
   * The horizontal line that displays at the top of a modal. It is `true` by default for
   * a modal with type `'sheet'`.
   */
  @Prop() handle?: boolean;

  /**
   * The component to display inside of the modal.
   */
  @Prop() component!: ComponentRef;

  /**
   * The data to pass to the modal component.
   */
  @Prop() componentProps?: ComponentProps;

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass?: string | string[];

  /**
   * If `true`, the modal will be dismissed when the backdrop is clicked.
   */
  @Prop() backdropDismiss = true;

  /**
   * If `true`, a backdrop will be displayed behind the modal.
   */
  @Prop() showBackdrop = true;

  /**
   * If `true`, the modal will animate.
   */
  @Prop() animated = true;

  /**
   * If `true`, the modal can be swiped to dismiss. Only applies in iOS mode.
   */
  @Prop() swipeToClose = false;

  /**
   * The type of modal to present.
   * TODO we could probably remove this and look for the breakpoints
   */
  @Prop() type: 'default' | 'sheet' | 'card' = 'default';

  /**
   * The element that presented the modal. This is used for card presentation effects
   * and for stacking multiple modals on top of each other. Only applies in iOS mode.
   */
  @Prop() presentingElement?: HTMLElement;

  /**
   * Emitted after the modal has presented.
   */
  @Event({ eventName: 'ionModalDidPresent' }) didPresent!: EventEmitter<void>;

  /**
   * Emitted before the modal has presented.
   */
  @Event({ eventName: 'ionModalWillPresent' }) willPresent!: EventEmitter<void>;

  /**
   * Emitted before the modal has dismissed.
   */
  @Event({ eventName: 'ionModalWillDismiss' }) willDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the modal has dismissed.
   */
  @Event({ eventName: 'ionModalDidDismiss' }) didDismiss!: EventEmitter<OverlayEventDetail>;

  @Watch('swipeToClose')
  swipeToCloseChanged(enable: boolean) {
    if (this.gesture) {
      this.gesture.enable(enable);
    } else if (enable) {
      this.initSwipeToClose();
    }
  }

  connectedCallback() {
    prepareOverlay(this.el);
  }

  /**
   * Present the modal overlay after it has been created.
   */
  @Method()
  async present(): Promise<void> {
    if (this.presented) {
      return;
    }
    const container = this.el.querySelector(`.modal-wrapper`);
    if (!container) {
      throw new Error('container is undefined');
    }
    const componentProps = {
      ...this.componentProps,
      modal: this.el
    };
    this.usersElement = await attachComponent(this.delegate, container, this.component, ['ion-page'], componentProps);
    await deepReady(this.usersElement);

    writeTask(() => this.el.classList.add('show-modal'));

    this.animation = await present(this, 'modalEnter', iosEnterAnimation, mdEnterAnimation, this.presentingElement);

    if (this.type === 'sheet') {
      this.initSheetGesture();
    } else if (this.swipeToClose) {
      this.initSwipeToClose();
    }

    // After the sheet has been initialized, we need to transform the
    // modal to the initial breakpoint
    if (this.type === 'sheet') {
      const { animation } = this;
      const wrapperAnimation = animation!.childAnimations.find(ani => ani.id === 'wrapperAnimation')!;
      const backdropAnimation = animation!.childAnimations.find(ani => ani.id === 'backdropAnimation')!;

      wrapperAnimation.keyframes(SheetDefaults.WRAPPER_KEYFRAMES);
      backdropAnimation.keyframes(SheetDefaults.BACKDROP_KEYFRAMES);

      this.animation!.progressStart(true, 1 - this.initialBreakpoint);
    }
  }

  private initSwipeToClose() {
    if (getIonMode(this) !== 'ios') { return; }

    // All of the elements needed for the swipe gesture
    // should be in the DOM and referenced by now, except
    // for the presenting el
    const animationBuilder = this.leaveAnimation || config.get('modalLeave', iosLeaveAnimation);
    const ani = this.animation = animationBuilder(this.el, this.presentingElement);
    this.gesture = createSwipeToCloseGesture(
      this.el,
      ani,
      () => {
        /**
         * While the gesture animation is finishing
         * it is possible for a user to tap the backdrop.
         * This would result in the dismiss animation
         * being played again. Typically this is avoided
         * by setting `presented = false` on the overlay
         * component; however, we cannot do that here as
         * that would prevent the element from being
         * removed from the DOM.
         */
        this.gestureAnimationDismissing = true;
        this.animation!.onFinish(async () => {
          await this.dismiss(undefined, 'gesture');
          this.gestureAnimationDismissing = false;
        });
      },

    );
    this.gesture.enable(true);
  }

  private initSheetGesture() {
    if (getIonMode(this) !== 'ios') { return; }

    const ani = this.animation!;
    const sortBreakpoints = (this.breakpoints?.sort((a, b) => a - b)) || [];

    this.gesture = createSheetGesture(
      this.el,
      ani,
      sortBreakpoints,
      () => {
        /**
         * While the gesture animation is finishing
         * it is possible for a user to tap the backdrop.
         * This would result in the dismiss animation
         * being played again. Typically this is avoided
         * by setting `presented = false` on the overlay
         * component; however, we cannot do that here as
         * that would prevent the element from being
         * removed from the DOM.
         */
        this.gestureAnimationDismissing = true;
        this.animation!.onFinish(async () => {
          await this.dismiss(undefined, 'gesture');
          this.gestureAnimationDismissing = false;
        });
      }
    );
    this.gesture.enable(true);
  }

  /**
   * Dismiss the modal overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the modal. For example, 'cancel' or 'backdrop'.
   */
  @Method()
  async dismiss(data?: any, role?: string): Promise<boolean> {
    if (this.gestureAnimationDismissing && role !== 'gesture') {
      return false;
    }

    const enteringAnimation = activeAnimations.get(this) || [];
    const dismissed = await dismiss(this, data, role, 'modalLeave', iosLeaveAnimation, mdLeaveAnimation, this.presentingElement);

    if (dismissed) {
      await detachComponent(this.delegate, this.usersElement);
      if (this.animation) {
        this.animation.destroy();
      }

      enteringAnimation.forEach(ani => ani.destroy());
    }

    this.animation = undefined;

    return dismissed;
  }

  /**
   * Returns a promise that resolves when the modal did dismiss.
   */
  @Method()
  onDidDismiss<T = any>(): Promise<OverlayEventDetail<T>> {
    return eventMethod(this.el, 'ionModalDidDismiss');
  }

  /**
   * Returns a promise that resolves when the modal will dismiss.
   */
  @Method()
  onWillDismiss<T = any>(): Promise<OverlayEventDetail<T>> {
    return eventMethod(this.el, 'ionModalWillDismiss');
  }

  private onBackdropTap = () => {
    this.dismiss(undefined, BACKDROP);
  }

  private onDismiss = (ev: UIEvent) => {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  private onLifecycle = (modalEvent: CustomEvent) => {
    const el = this.usersElement;
    const name = LIFECYCLE_MAP[modalEvent.type];
    if (el && name) {
      const ev = new CustomEvent(name, {
        bubbles: false,
        cancelable: false,
        detail: modalEvent.detail
      });
      el.dispatchEvent(ev);
    }
  }

  render() {
    const { handle, type } = this;

    const showHandle = handle || type === 'sheet';

    const mode = getIonMode(this);

    return (
      <Host
        no-router
        aria-modal="true"
        tabindex="-1"
        class={{
          [mode]: true,
          [`modal-card`]: this.presentingElement !== undefined && mode === 'ios',
          [`modal-${type}`]: true,
          ...getClassMap(this.cssClass)
        }}
        style={{
          zIndex: `${20000 + this.overlayIndex}`,
        }}
        onIonBackdropTap={this.onBackdropTap}
        onIonDismiss={this.onDismiss}
        onIonModalDidPresent={this.onLifecycle}
        onIonModalWillPresent={this.onLifecycle}
        onIonModalWillDismiss={this.onLifecycle}
        onIonModalDidDismiss={this.onLifecycle}
      >
        <ion-backdrop visible={this.showBackdrop} tappable={this.backdropDismiss}/>

        {mode === 'ios' && <div class="modal-shadow"></div>}

        <div tabindex="0"></div>

        <div
          role="dialog"
          class="modal-wrapper ion-overlay-wrapper"
        >
          {showHandle && <div class="modal-handle"></div>}
        </div>

        <div tabindex="0"></div>
      </Host>
    );
  }
}

const LIFECYCLE_MAP: any = {
  'ionModalDidPresent': 'ionViewDidEnter',
  'ionModalWillPresent': 'ionViewWillEnter',
  'ionModalWillDismiss': 'ionViewWillLeave',
  'ionModalDidDismiss': 'ionViewDidLeave',
};
