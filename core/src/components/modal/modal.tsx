import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Method, Prop, h, writeTask } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Animation, AnimationBuilder, ComponentProps, ComponentRef, FrameworkDelegate, OverlayEventDetail, OverlayInterface } from '../../interface';
import { attachComponent, detachComponent } from '../../utils/framework-delegate';
import { GestureDetail } from '../../utils/gesture';
import { BACKDROP, dismiss, eventMethod, present } from '../../utils/overlays';
import { getClassMap } from '../../utils/theme';
import { deepReady } from '../../utils/transition';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosEnterCardAnimation } from './animations/ios.enter.card';
import { iosLeaveAnimation } from './animations/ios.leave';
import { iosLeaveCardAnimation } from './animations/ios.leave.card';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';
import { swipeLeaveAnimation } from './animations/swipe.leave';
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

  private usersElement?: HTMLElement;

  // The element that presented this modal. Used for scale card effects
  private presentingEl?: HTMLElement;
  private wrapperEl?: HTMLDivElement;
  private backdropEl?: HTMLIonBackdropElement;
  private backdropOpacity = 0;
  private presentingScale = 0.92;
  // The minimum y position for the open card style modal
  private minY = 44;
  // private y = 0;

  presented = false;
  animation: Animation | undefined;
  mode = getIonMode(this);

  @Element() el!: HTMLElement;

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
   * If `true`, the modal will support a swipe and pan drag gesture to close
   */
  @Prop() swipeToClose = false;

  /**
   * The style of presentation to use. `fullscreen` is the classic option that has the modal
   * take up the full screen on mobile displays. A newer option, `card` is available that displays
   * the modal in a stacked fashion while also zooming the previous page out slightly underneath. The
   * `card` style is becoming a default starting with iOS 13.
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

  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  @Listen('ionBackdropTap')
  protected onBackdropTap() {
    this.dismiss(undefined, BACKDROP);
  }

  @Listen('ionModalDidPresent')
  @Listen('ionModalWillPresent')
  @Listen('ionModalWillDismiss')
  @Listen('ionModalDidDismiss')
  protected lifecycle(modalEvent: CustomEvent) {
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

  async componentDidLoad() {
    this.wrapperEl = this.el.querySelector('.modal-wrapper') as HTMLDivElement || undefined;
    this.backdropEl = this.el.querySelector('ion-backdrop') as HTMLIonBackdropElement || undefined;

    if (this.swipeToClose) {
      this.enableSwipeToClose();
    }
  }

  /**
   * Present the modal overlay after it has been created.
   */
  @Method()
  async present(presentingEl?: HTMLElement): Promise<void> {
    if (this.presented) {
      return;
    }

    this.presentingEl = presentingEl;

    const iosAnim = this.buildIOSEnterAnimation(presentingEl);
    const mdAnim = this.buildMDEnterAnimation(presentingEl);

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

  /**
   * Dismiss the modal overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the modal. For example, 'cancel' or 'backdrop'.
   */
  @Method()
  async dismiss(data?: any, role?: string): Promise<boolean> {
    const iosAnim = this.buildIOSLeaveAnimation(this.presentingEl);
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

  private async swipeDismiss() {
    const dismissed = await dismiss(this, null, undefined, 'modalLeave', swipeLeaveAnimation, swipeLeaveAnimation);
    if (dismissed) {
      await detachComponent(this.delegate, this.usersElement);
    }
    return dismissed;
  }

  private async swipeOpen() {
    requestAnimationFrame(() => {
      this.swipeSlideTo(this.minY);
    });
  }

  private async enableSwipeToClose() {
    const gesture = (await import('../../utils/gesture')).createGesture({
      el: this.el,
      gestureName: 'modalSwipeToClose',
      gesturePriority: 110,
      threshold: 0,
      direction: 'y',
      passive: true,
      canStart: detail => this.swipeToCloseCanStart(detail),
      onStart: detail => this.swipeToCloseOnStart(detail),
      onMove: detail => this.swipeToCloseOnMove(detail),
      onEnd: detail => this.swipeToCloseOnEnd(detail)
    });

    gesture.setDisabled(false);
  }

  private swipeToCloseCanStart(_detail: GestureDetail) {
    return true;
  }

  private swipeToCloseOnStart(_detail: GestureDetail) {
    this.swipeDisableTransition();
    this.backdropOpacity = parseFloat(this.backdropEl!.style.opacity!);
  }

  private swipeToCloseOnMove(detail: GestureDetail) {
    const y = this.minY + detail.deltaY;

    this.swipeSlideTo(y);
  }

  private swipeToCloseOnEnd(detail: GestureDetail) {
    console.log('On end', detail);

    const viewportHeight = window.innerHeight;

    this.swipeEnableTransition();

    if (detail.velocityY < -0.6) {
      this.swipeOpen();
    } else if (detail.velocityY > 0.6) {
      this.swipeDismiss();
    } else if (detail.currentY <= viewportHeight / 2) {
      this.swipeOpen();
    } else {
      this.swipeDismiss();
    }
  }

  private swipeDisableTransition() {
    this.wrapperEl!.style.transition = '';
  }

  private swipeEnableTransition() {
    this.wrapperEl!.style.transition = `400ms transform cubic-bezier(0.23, 1, 0.32, 1)`;
  }

  private swipeSlideTo(y: number) {
    const viewportHeight = (this.el.ownerDocument as any).defaultView.innerHeight;

    const dy = y - this.minY;

    const yRatio = dy / viewportHeight;

    console.log(y, yRatio);

    const backdropOpacity = this.backdropOpacity - this.backdropOpacity * yRatio;
    // const presentingScale = this.presentingScale - this.presentingScale * yRatio;
    const presentingScale = this.presentingScale - (this.presentingScale * -yRatio) * 0.3;
    console.log('Presenting scale', presentingScale);

    this.swipeSetPresentingScale(presentingScale);
    this.swipeSetBackdropOpacity(backdropOpacity);
    // this.y = y;
    writeTask(() => {
      this.wrapperEl!.style.transform = `translateY(${y}px)`;
    });
  }

  private swipeSetBackdropOpacity(opacity: number) {
    writeTask(() => {
      this.backdropEl!.style.opacity = `${opacity}`;
    });
  }

  private swipeSetPresentingScale(scale: number) {
    if (!this.presentingEl) {
      return;
    }

    writeTask(() => {
      this.presentingEl!.style.transform = `translateY(-5px) scale(${scale})`;
    });
  }

  /*
  private swipeSlideBy(dy: number) {
    this.swipeSlideTo(this.y + dy);
  }
  */

  hostData() {
    const mode = getIonMode(this);
    return {
      'no-router': true,
      'aria-modal': 'true',
      class: {
        [mode]: true,
        ...getClassMap(this.cssClass)
      },
      style: {
        zIndex: 20000 + this.overlayIndex,
      }
    };
  }

  render() {
    const mode = getIonMode(this);
    const dialogClasses = {
      [`modal-wrapper`]: true,
      [`modal-card`]: this.presentationStyle === 'card',
      [mode]: true,
    };

    return [
      <ion-backdrop visible={this.showBackdrop} tappable={this.backdropDismiss}/>,
      <div role="dialog" class={dialogClasses}></div>
    ];
  }
}

const LIFECYCLE_MAP: any = {
  'ionModalDidPresent': 'ionViewDidEnter',
  'ionModalWillPresent': 'ionViewWillEnter',
  'ionModalWillDismiss': 'ionViewWillLeave',
  'ionModalDidDismiss': 'ionViewDidLeave',
};
