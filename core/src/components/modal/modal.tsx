import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Method, Prop, h, writeTask } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Animation, AnimationBuilder, ComponentProps, ComponentRef, FrameworkDelegate, OverlayEventDetail, OverlayInterface } from '../../interface';
import { attachComponent, detachComponent } from '../../utils/framework-delegate';
import { BACKDROP, dismiss, eventMethod, present } from '../../utils/overlays';
import { getClassMap } from '../../utils/theme';
import { deepReady } from '../../utils/transition';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';
import { swipeLeaveAnimation } from './animations/swipe.leave';
import { GestureDetail } from '../../utils/gesture';


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

  // private y?: number;

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
    if (this.swipeToClose) {
      this.enableSwipeToClose();
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
    return present(this, 'modalEnter', iosEnterAnimation, mdEnterAnimation);
  }

  /**
   * Dismiss the modal overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the modal. For example, 'cancel' or 'backdrop'.
   */
  @Method()
  async dismiss(data?: any, role?: string): Promise<boolean> {
    const dismissed = await dismiss(this, data, role, 'modalLeave', iosLeaveAnimation, mdLeaveAnimation);
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
    this.swipeEnableTransition();
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

  private swipeToCloseCanStart(detail: GestureDetail) {
    console.log('Can start', detail);
    return true;
  }

  private swipeToCloseOnStart(detail: GestureDetail) {
    console.log('On start', detail);
    this.swipeDisableTransition();
  }

  private swipeToCloseOnMove(detail: GestureDetail) {
    console.log('On move', detail);

    const wrapper = this.el.querySelector('.modal-wrapper') as HTMLDivElement;

    const y = detail.deltaY;

    writeTask(() => {
      wrapper.style.transform = `translateY(${y}px)`;
    });
  }

  private swipeToCloseOnEnd(detail: GestureDetail) {
    console.log('On end', detail);

    const viewportHeight = window.innerHeight;

    this.swipeEnableTransition();

    if (detail.velocityY < -0.6) {
      console.log('Slide open');
      this.swipeOpen();
    } else if (detail.velocityY > 0.6) {
      console.log('Slide close');
      this.swipeDismiss();
    } else if (detail.currentY <= viewportHeight / 2) {
      console.log('Slide open');
      this.swipeOpen();
    } else {
      console.log('Slide close');
      // this.slideClose();
      this.swipeDismiss();
    }
  }

  private swipeDisableTransition() {
    console.log('Disabling transition');
  }

  private swipeEnableTransition() {
    console.log('Enabling transition');
  }

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
