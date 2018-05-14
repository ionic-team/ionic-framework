import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Animation, AnimationBuilder, Color, ComponentProps, ComponentRef, Config, FrameworkDelegate, Mode } from '../../interface';

import { attachComponent, detachComponent } from '../../utils/framework-delegate';
import { BACKDROP, OverlayEventDetail, OverlayInterface, dismiss, eventMethod, present } from '../../utils/overlays';
import { createThemedClasses, getClassMap } from '../../utils/theme';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';

import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';

@Component({
  tag: 'ion-modal',
  styleUrls: {
    ios: 'modal.ios.scss',
    md: 'modal.md.scss'
  },
  host: {
    theme: 'modal'
  }
})
export class Modal implements OverlayInterface {

  private usersElement?: HTMLElement;

  animation: Animation|undefined;
  presented = false;

  @Element() el!: HTMLElement;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl!: HTMLIonAnimationControllerElement;
  @Prop({ context: 'config' }) config!: Config;

  @Prop() overlayId!: number;
  @Prop() delegate?: FrameworkDelegate;
  @Prop() keyboardClose = true;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode!: Mode;

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
   * If true, the modal will be dismissed when the backdrop is clicked. Defaults to `true`.
   */
  @Prop() enableBackdropDismiss = true;

  /**
   * If true, a backdrop will be displayed behind the modal. Defaults to `true`.
   */
  @Prop() showBackdrop = true;

  /**
   * If true, the modal will animate. Defaults to `true`.
   */
  @Prop() willAnimate = true;

  /**
   * Emitted after the modal has loaded.
   */
  @Event() ionModalDidLoad!: EventEmitter<void>;

  /**
   * Emitted after the modal has unloaded.
   */
  @Event() ionModalDidUnload!: EventEmitter<void>;

  /**
   * Emitted after the modal has presented.
   */
  @Event({eventName: 'ionModalDidPresent'}) didPresent!: EventEmitter<void>;

  /**
   * Emitted before the modal has presented.
   */
  @Event({eventName: 'ionModalWillPresent'}) willPresent!: EventEmitter<void>;

  /**
   * Emitted before the modal has dismissed.
   */
  @Event({eventName: 'ionModalWillDismiss'}) willDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the modal has dismissed.
   */
  @Event({eventName: 'ionModalDidDismiss'}) didDismiss!: EventEmitter<OverlayEventDetail>;

  componentDidLoad() {
    this.ionModalDidLoad.emit();
  }

  componentDidUnload() {
    this.ionModalDidUnload.emit();
  }

  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  @Listen('ionBackdropTap')
  protected onBackdropTap() {
    this.dismiss(null, BACKDROP);
  }

  @Listen('ionModalDidPresent')
  @Listen('ionModalWillPresent')
  @Listen('ionModalWillDismiss')
  @Listen('ionModalDidDismiss')
  protected lifecycle(modalEvent: CustomEvent) {
    const el = this.usersElement;
    const name = LIFECYCLE_MAP[modalEvent.type];
    if (el && name) {
      const event = new CustomEvent(name, {
        bubbles: false,
        cancelable: false,
        detail: modalEvent.detail
      });
      el.dispatchEvent(event);
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
    return present(this, 'modalEnter', iosEnterAnimation, mdEnterAnimation);
  }

  /**
   * Dismiss the modal overlay after it has been presented.
   */
  @Method()
  async dismiss(data?: any, role?: string): Promise<void> {
    await dismiss(this, data, role, 'modalLeave', iosLeaveAnimation, mdLeaveAnimation);
    await detachComponent(this.delegate, this.usersElement);
  }

  /**
   * Returns a promise that resolves when the modal did dismiss. It also accepts a callback
   * that is called in the same circustances.
   *
   * ```
   * const {data, role} = await modal.onDidDismiss();
   * ```
   */
  @Method()
  onDidDismiss(callback?: (detail: OverlayEventDetail) => void): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionModalDidDismiss', callback);
  }

  /**
   * Returns a promise that resolves when the modal will dismiss. It also accepts a callback
   * that is called in the same circustances.
   *
   * ```
   * const {data, role} = await modal.onWillDismiss();
   * ```
   */
  @Method()
  onWillDismiss(callback?: (detail: OverlayEventDetail) => void): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionModalWillDismiss', callback);
  }

  hostData() {
    return {
      'no-router': true,
      class: getClassMap(this.cssClass),
      style: {
        zIndex: 20000 + this.overlayId,
      }
    };
  }

  render() {
    const dialogClasses = createThemedClasses(this.mode, this.color, 'modal-wrapper');

    return [
      <ion-backdrop visible={this.showBackdrop} tappable={this.enableBackdropDismiss}/>,
      <div role="dialog" class={dialogClasses}></div>
    ];
  }
}

const LIFECYCLE_MAP: any = {
  'ionModalDidPresent': 'ionViewDidEnter',
  'ionModalWillPresent': 'ionViewWillEnter',
  'ionModalWillDismiss': 'ionViewWillDismiss',
  'ionModalDidDismiss': 'ionViewDidDismiss',
};

export interface ModalOptions {
  component: ComponentRef;
  componentProps?: ComponentProps;
  showBackdrop?: boolean;
  enableBackdropDismiss?: boolean;
  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
  cssClass?: string | string[];
  delegate?: FrameworkDelegate;
}
