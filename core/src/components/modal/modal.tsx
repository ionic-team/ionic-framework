import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Method, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Animation, AnimationBuilder, ComponentProps, ComponentRef, FrameworkDelegate, OverlayEventDetail, OverlayInterface } from '../../interface';
import { attachComponent, detachComponent } from '../../utils/framework-delegate';
import { BACKDROP, dismiss, eventMethod, prepareOverlay, present } from '../../utils/overlays';
import { getClassMap } from '../../utils/theme';
import { deepReady } from '../../utils/transition';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosEnterCardAnimation } from './animations/ios.enter.card';
import { iosLeaveAnimation } from './animations/ios.leave';
import { iosLeaveCardAnimation } from './animations/ios.leave.card';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';
import { SwipeToCloseGesture } from './gestures/swipe-to-close';
import { ModalPresentationStyle } from './modal-interface';

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
  private gesture?: SwipeToCloseGesture;

  // Reference to the user's provided modal content
  private usersElement?: HTMLElement;

  // Reference to the wrapper element
  private wrapperEl?: HTMLDivElement;
  // Reference to the backdrop element
  private backdropEl?: HTMLIonBackdropElement;

  private isFirstModal?: boolean;

  presented = false;
  animation: Animation | undefined;
  mode = getIonMode(this);

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
   * If `true`, the modal will support a swipe and pan drag gesture to close. Only supported on iOS as Android
   * does not use this type of interaction.
   */
  @Prop() swipeToClose = false;

  /**
   * The element that presented the modal. This is used for card presentation effects
   * and for stacking multiple modals on top of each other.
   */
  @Prop() presentingEl?: HTMLElement;

  /**
   * The style of presentation to use. `fullscreen` is the classic option that has the modal
   * take up the full screen on mobile displays. A newer option, `card` is available for iOS only that displays
   * the modal in a stacked fashion while also zooming the previous page out slightly underneath. The
   * `card` style is the new default modal presentation style starting with iOS 13. Android does not use
   * this type of modal so this option does not effect Android.
   */
  @Prop() presentationStyle: ModalPresentationStyle = 'fullscreen';

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

  constructor() {
    prepareOverlay(this.el);
  }

  async componentDidLoad() {
    this.wrapperEl = this.el.querySelector('.modal-wrapper') as HTMLDivElement || undefined;
    this.backdropEl = this.el.querySelector('ion-backdrop') as HTMLIonBackdropElement || undefined;

    const mode = getIonMode(this);

    if (this.swipeToClose && mode === 'ios') {
      // All of the elements needed for the swipe gesture
      // should be in the DOM and referenced by now, except
      // for the presenting el
      this.gesture = new SwipeToCloseGesture(
        this.el,
        this.backdropEl,
        this.wrapperEl,
        undefined,
        (velocityY: number) => this.swipeDismiss(velocityY)
      );
    }
  }

  /**
   * Present the modal overlay after it has been created.
   */
  @Method()
  async present(): Promise<void> {
    if (this.presented) {
      return;
    }

    // Check whether this modal is the first/only modal open. If not,
    // we changed the presentation and dismiss behavior when using
    // the card presentation style
    const openModals = getOverlays(document, 'ion-modal');
    this.isFirstModal = openModals.length - 2 < 0;

    if (this.swipeToClose && this.presentingEl && this.gesture) {
      this.gesture!.setPresentingEl(this.presentingEl);
    }

    const iosAnim = this.buildIOSEnterAnimation(this.isFirstModal ? this.presentingEl : undefined);
    const mdAnim = this.buildMDEnterAnimation(this.presentingEl);

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
    return present(this, 'modalEnter', iosAnim, mdAnim);
  }

  private buildIOSEnterAnimation(presentingEl?: HTMLElement) {
    switch (this.presentationStyle) {
      case 'fullscreen':
        return iosEnterAnimation;
      case 'card':
        return (animation: Animation, baseEl: HTMLElement) => iosEnterCardAnimation(animation, baseEl, presentingEl);
    }
  }

  private buildMDEnterAnimation(_presentingEl?: HTMLElement) {
    return mdEnterAnimation;
  }

  /**
   * Dismiss the modal overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the modal. For example, 'cancel' or 'backdrop'.
   */
  @Method()
  async dismiss(data?: any, role?: string): Promise<boolean> {
    const iosAnim = this.buildIOSLeaveAnimation(this.isFirstModal ? this.presentingEl : undefined);
    const mdAnim = this.buildMDLeaveAnimation(this.presentingEl);

    const dismissed = await dismiss(this, data, role, 'modalLeave', iosAnim, mdAnim);
    if (dismissed) {
      await detachComponent(this.delegate, this.usersElement);
    }
    return dismissed;
  }

  /**
   * Returns a promise that resolves when the modal did dismiss.
   */
  @Method()
  onDidDismiss(): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionModalDidDismiss');
  }

  /**
   * Returns a promise that resolves when the modal will dismiss.
   */
  @Method()
  onWillDismiss(): Promise<OverlayEventDetail> {
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


private buildIOSLeaveAnimation(presentingEl?: HTMLElement) {
switch (this.presentationStyle) {
case 'fullscreen':
return iosLeaveAnimation;
case 'card':
return (animation: Animation, baseEl: HTMLElement) => iosLeaveCardAnimation(animation, baseEl, presentingEl);
}
}

private buildMDLeaveAnimation(_presentingEl?: HTMLElement) {
return mdLeaveAnimation;
}

private buildSwipeLeaveAnimation(velocityY: number) {
switch (this.presentationStyle) {
case 'fullscreen':
return (animation: Animation, baseEl: HTMLElement) =>
iosLeaveAnimation(animation,
baseEl,
this.gesture!.getY(),
this.gesture!.getBackdropOpacity(),
velocityY);
case 'card':
return (animation: Animation, baseEl: HTMLElement) =>
iosLeaveCardAnimation(animation,
baseEl,
this.presentingEl,
this.gesture!.getY(),
this.gesture!.getBackdropOpacity(),
this.gesture!.getPresentingScale(),
velocityY);
}
}

private async swipeDismiss(velocityY: number) {
const leaveAnim = this.buildSwipeLeaveAnimation(velocityY);
const dismissed = await dismiss(this, null, undefined, 'modalLeave', leaveAnim, leaveAnim);
if (dismissed) {
await detachComponent(this.delegate, this.usersElement);
}
return dismissed;
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
    const mode = getIonMode(this);

    return (
      <Host
        no-router
        aria-modal="true"
        class={{
          [mode]: true,
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
        <div
          role="dialog"
class={{
[`modal-wrapper`]: true,
[`modal-card`]: this.presentationStyle === 'card',
[mode]: true,
}}
        >
        </div>
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
