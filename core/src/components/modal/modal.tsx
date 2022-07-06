import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, State, Watch, h, writeTask } from '@stencil/core';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import type {
  Animation,
  AnimationBuilder,
  ComponentProps,
  ComponentRef,
  FrameworkDelegate,
  Gesture,
  ModalAttributes,
  ModalBreakpointChangeEventDetail,
  ModalHandleBehavior,
  OverlayEventDetail,
  OverlayInterface,
} from '../../interface';
import { findIonContent, printIonContentErrorMsg } from '../../utils/content';
import { CoreDelegate, attachComponent, detachComponent } from '../../utils/framework-delegate';
import { raf } from '../../utils/helpers';
import { KEYBOARD_DID_OPEN } from '../../utils/keyboard/keyboard';
import { printIonWarning } from '../../utils/logging';
import { BACKDROP, activeAnimations, dismiss, eventMethod, prepareOverlay, present } from '../../utils/overlays';
import { getClassMap } from '../../utils/theme';
import { deepReady } from '../../utils/transition';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';
import type { MoveSheetToBreakpointOptions } from './gestures/sheet';
import { createSheetGesture } from './gestures/sheet';
import { createSwipeToCloseGesture } from './gestures/swipe-to-close';
import { setCardStatusBarDark, setCardStatusBarDefault } from './utils';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot - Content is placed inside of the `.modal-content` element.
 *
 * @part backdrop - The `ion-backdrop` element.
 * @part content - The wrapper element for the default slot.
 * @part handle - The handle that is displayed at the top of the sheet modal when `handle="true"`.
 */
@Component({
  tag: 'ion-modal',
  styleUrls: {
    ios: 'modal.ios.scss',
    md: 'modal.md.scss',
  },
  shadow: true,
})
export class Modal implements ComponentInterface, OverlayInterface {
  private gesture?: Gesture;
  private modalIndex = modalIds++;
  private modalId?: string;
  private coreDelegate: FrameworkDelegate = CoreDelegate();
  private currentTransition?: Promise<any>;
  private sheetTransition?: Promise<any>;
  private destroyTriggerInteraction?: () => void;
  private isSheetModal = false;
  private currentBreakpoint?: number;
  private wrapperEl?: HTMLElement;
  private backdropEl?: HTMLIonBackdropElement;
  private sortedBreakpoints?: number[];
  private keyboardOpenCallback?: () => void;
  private moveSheetToBreakpoint?: (options: MoveSheetToBreakpointOptions) => Promise<void>;

  private inline = false;
  private workingDelegate?: FrameworkDelegate;

  // Reference to the user's provided modal content
  private usersElement?: HTMLElement;

  // Whether or not modal is being dismissed via gesture
  private gestureAnimationDismissing = false;

  lastFocus?: HTMLElement;
  animation?: Animation;

  @State() presented = false;

  @Element() el!: HTMLIonModalElement;

  /** @internal */
  @Prop() hasController = false;

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
   * The breakpoints to use when creating a sheet modal. Each value in the
   * array must be a decimal between 0 and 1 where 0 indicates the modal is fully
   * closed and 1 indicates the modal is fully open. Values are relative
   * to the height of the modal, not the height of the screen. One of the values in this
   * array must be the value of the `initialBreakpoint` property.
   * For example: [0, .25, .5, 1]
   */
  @Prop() breakpoints?: number[];

  /**
   * A decimal value between 0 and 1 that indicates the
   * initial point the modal will open at when creating a
   * sheet modal. This value must also be listed in the
   * `breakpoints` array.
   */
  @Prop() initialBreakpoint?: number;

  /**
   * A decimal value between 0 and 1 that indicates the
   * point after which the backdrop will begin to fade in
   * when using a sheet modal. Prior to this point, the
   * backdrop will be hidden and the content underneath
   * the sheet can be interacted with. This value is exclusive
   * meaning the backdrop will become active after the value
   * specified.
   */
  @Prop() backdropBreakpoint = 0;

  /**
   * The horizontal line that displays at the top of a sheet modal. It is `true` by default when
   * setting the `breakpoints` and `initialBreakpoint` properties.
   */
  @Prop() handle?: boolean;

  /**
   * The interaction behavior for the sheet modal when the handle is pressed.
   *
   * Defaults to `"none"`, which  means the modal will not change size or position when the handle is pressed.
   * Set to `"cycle"` to let the modal cycle between available breakpoints when pressed.
   *
   * Handle behavior is unavailable when the `handle` property is set to `false` or
   * when the `breakpoints` property is not set (using a fullscreen or card modal).
   */
  @Prop() handleBehavior?: ModalHandleBehavior = 'none';

  /**
   * The component to display inside of the modal.
   * @internal
   */
  @Prop() component?: ComponentRef;

  /**
   * The data to pass to the modal component.
   * @internal
   */
  @Prop() componentProps?: ComponentProps;

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   * @internal
   */
  @Prop() cssClass?: string | string[];

  /**
   * If `true`, the modal will be dismissed when the backdrop is clicked.
   */
  @Prop() backdropDismiss = true;

  /**
   * If `true`, a backdrop will be displayed behind the modal.
   * This property controls whether or not the backdrop
   * darkens the screen when the modal is presented.
   * It does not control whether or not the backdrop
   * is active or present in the DOM.
   */
  @Prop() showBackdrop = true;

  /**
   * If `true`, the modal will animate.
   */
  @Prop() animated = true;

  /**
   * If `true`, the modal can be swiped to dismiss. Only applies in iOS mode.
   * @deprecated - To prevent modals from dismissing, use canDismiss instead.
   */
  @Prop() swipeToClose = false;

  /**
   * The element that presented the modal. This is used for card presentation effects
   * and for stacking multiple modals on top of each other. Only applies in iOS mode.
   */
  @Prop() presentingElement?: HTMLElement;

  /**
   * Additional attributes to pass to the modal.
   */
  @Prop() htmlAttributes?: ModalAttributes;

  /**
   * If `true`, the modal will open. If `false`, the modal will close.
   * Use this if you need finer grained control over presentation, otherwise
   * just use the modalController or the `trigger` property.
   * Note: `isOpen` will not automatically be set back to `false` when
   * the modal dismisses. You will need to do that in your code.
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
   * causes the modal to open when clicked.
   */
  @Prop() trigger: string | undefined;
  @Watch('trigger')
  onTriggerChange() {
    this.configureTriggerInteraction();
  }

  /**
   * If `true`, the component passed into `ion-modal` will
   * automatically be mounted when the modal is created. The
   * component will remain mounted even when the modal is dismissed.
   * However, the component will be destroyed when the modal is
   * destroyed. This property is not reactive and should only be
   * used when initially creating a modal.
   *
   * Note: This feature only applies to inline modals in JavaScript
   * frameworks such as Angular, React, and Vue.
   */
  @Prop() keepContentsMounted = false;

  /**
   * TODO (FW-937)
   * This needs to default to true in the next
   * major release. We default it to undefined
   * so we can force the card modal to be swipeable
   * when using canDismiss.
   */

  /**
   * Determines whether or not a modal can dismiss
   * when calling the `dismiss` method.
   *
   * If the value is `true` or the value's function returns `true`, the modal will close when trying to dismiss.
   * If the value is `false` or the value's function returns `false`, the modal will not close when trying to dismiss.
   */
  @Prop() canDismiss?: undefined | boolean | (() => Promise<boolean>);

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

  /**
   * Emitted after the modal breakpoint has changed.
   */
  @Event() ionBreakpointDidChange!: EventEmitter<ModalBreakpointChangeEventDetail>;

  /**
   * Emitted after the modal has presented.
   * Shorthand for ionModalWillDismiss.
   */
  @Event({ eventName: 'didPresent' }) didPresentShorthand!: EventEmitter<void>;

  /**
   * Emitted before the modal has presented.
   * Shorthand for ionModalWillPresent.
   */
  @Event({ eventName: 'willPresent' }) willPresentShorthand!: EventEmitter<void>;

  /**
   * Emitted before the modal has dismissed.
   * Shorthand for ionModalWillDismiss.
   */
  @Event({ eventName: 'willDismiss' }) willDismissShorthand!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the modal has dismissed.
   * Shorthand for ionModalDidDismiss.
   */
  @Event({ eventName: 'didDismiss' }) didDismissShorthand!: EventEmitter<OverlayEventDetail>;

  @Watch('swipeToClose')
  async swipeToCloseChanged(enable: boolean) {
    if (this.gesture) {
      this.gesture.enable(enable);
    } else if (enable) {
      await this.initSwipeToClose();
    }
  }

  breakpointsChanged(breakpoints: number[] | undefined) {
    if (breakpoints !== undefined) {
      this.sortedBreakpoints = breakpoints.sort((a, b) => a - b);
    }
  }

  connectedCallback() {
    prepareOverlay(this.el);
  }

  componentWillLoad() {
    const { breakpoints, initialBreakpoint, swipeToClose } = this;

    /**
     * If user has custom ID set then we should
     * not assign the default incrementing ID.
     */
    this.modalId = this.el.hasAttribute('id') ? this.el.getAttribute('id')! : `ion-modal-${this.modalIndex}`;
    const isSheetModal = (this.isSheetModal = breakpoints !== undefined && initialBreakpoint !== undefined);

    if (isSheetModal) {
      this.currentBreakpoint = this.initialBreakpoint;
    }

    if (breakpoints !== undefined && initialBreakpoint !== undefined && !breakpoints.includes(initialBreakpoint)) {
      printIonWarning('Your breakpoints array must include the initialBreakpoint value.');
    }

    if (swipeToClose) {
      printIonWarning(
        'swipeToClose has been deprecated in favor of canDismiss.\n\nIf you want a card modal to be swipeable, set canDismiss to `true`. In the next major release of Ionic, swipeToClose will be removed, and all card modals will be swipeable by default.'
      );
    }
  }

  componentDidLoad() {
    /**
     * If modal was rendered with isOpen="true"
     * then we should open modal immediately.
     */
    if (this.isOpen === true) {
      raf(() => this.present());
    }
    this.breakpointsChanged(this.breakpoints);
    this.configureTriggerInteraction();
  }

  private configureTriggerInteraction = () => {
    const { trigger, el, destroyTriggerInteraction } = this;

    if (destroyTriggerInteraction) {
      destroyTriggerInteraction();
    }

    const triggerEl = trigger !== undefined ? document.getElementById(trigger) : null;
    if (!triggerEl) {
      return;
    }

    const configureTriggerInteraction = (trigEl: HTMLElement, modalEl: HTMLIonModalElement) => {
      const openModal = () => {
        modalEl.present();
      };
      trigEl.addEventListener('click', openModal);

      return () => {
        trigEl.removeEventListener('click', openModal);
      };
    };

    this.destroyTriggerInteraction = configureTriggerInteraction(triggerEl, el);
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
    if (this.workingDelegate && !force) {
      return {
        delegate: this.workingDelegate,
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

  /**
   * Determines whether or not the
   * modal is allowed to dismiss based
   * on the state of the canDismiss prop.
   */
  private async checkCanDismiss() {
    const { canDismiss } = this;

    /**
     * TODO (FW-937) - Remove the following check in
     * the next major release of Ionic.
     */
    if (canDismiss === undefined) {
      return true;
    }

    if (typeof canDismiss === 'function') {
      return canDismiss();
    }

    return canDismiss;
  }

  /**
   * Present the modal overlay after it has been created.
   */
  @Method()
  async present(): Promise<void> {
    if (this.presented) {
      return;
    }

    /**
     * When using an inline modal
     * and dismissing a modal it is possible to
     * quickly present the modal while it is
     * dismissing. We need to await any current
     * transition to allow the dismiss to finish
     * before presenting again.
     */
    if (this.currentTransition !== undefined) {
      await this.currentTransition;
    }

    /**
     * If the modal is presented multiple times (inline modals), we
     * need to reset the current breakpoint to the initial breakpoint.
     */
    this.currentBreakpoint = this.initialBreakpoint;

    const data = {
      ...this.componentProps,
      modal: this.el,
    };

    const { inline, delegate } = this.getDelegate(true);
    this.usersElement = await attachComponent(delegate, this.el, this.component, ['ion-page'], data, inline);

    await deepReady(this.usersElement);

    writeTask(() => this.el.classList.add('show-modal'));

    this.currentTransition = present(this, 'modalEnter', iosEnterAnimation, mdEnterAnimation, {
      presentingEl: this.presentingElement,
      currentBreakpoint: this.initialBreakpoint,
      backdropBreakpoint: this.backdropBreakpoint,
    });

    /**
     * TODO (FW-937) - In the next major release of Ionic, all card modals
     * will be swipeable by default. canDismiss will be used to determine if the
     * modal can be dismissed. This check should change to check the presence of
     * presentingElement instead.
     *
     * If we did not do this check, then not using swipeToClose would mean you could
     * not run canDismiss on swipe as there would be no swipe gesture created.
     */
    const hasCardModal = this.swipeToClose || (this.canDismiss !== undefined && this.presentingElement !== undefined);

    /**
     * We need to change the status bar at the
     * start of the animation so that it completes
     * by the time the card animation is done.
     */
    if (hasCardModal && getIonMode(this) === 'ios') {
      setCardStatusBarDark();
    }

    await this.currentTransition;

    if (this.isSheetModal) {
      this.initSheetGesture();
    } else if (hasCardModal) {
      await this.initSwipeToClose();
    }

    /* tslint:disable-next-line */
    if (typeof window !== 'undefined') {
      this.keyboardOpenCallback = () => {
        if (this.gesture) {
          /**
           * When the native keyboard is opened and the webview
           * is resized, the gesture implementation will become unresponsive
           * and enter a free-scroll mode.
           *
           * When the keyboard is opened, we disable the gesture for
           * a single frame and re-enable once the contents have repositioned
           * from the keyboard placement.
           */
          this.gesture.enable(false);
          raf(() => {
            if (this.gesture) {
              this.gesture.enable(true);
            }
          });
        }
      };
      window.addEventListener(KEYBOARD_DID_OPEN, this.keyboardOpenCallback);
    }

    this.currentTransition = undefined;
  }

  private initSwipeToClose() {
    if (getIonMode(this) !== 'ios') {
      return;
    }

    const { el } = this;

    // All of the elements needed for the swipe gesture
    // should be in the DOM and referenced by now, except
    // for the presenting el
    const animationBuilder = this.leaveAnimation || config.get('modalLeave', iosLeaveAnimation);
    const ani = (this.animation = animationBuilder(el, { presentingEl: this.presentingElement }));

    const contentEl = findIonContent(el);
    if (!contentEl) {
      printIonContentErrorMsg(el);
      return;
    }

    this.gesture = createSwipeToCloseGesture(el, ani, () => {
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
    });
    this.gesture.enable(true);
  }

  private initSheetGesture() {
    const { wrapperEl, initialBreakpoint, backdropBreakpoint } = this;

    if (!wrapperEl || initialBreakpoint === undefined) {
      return;
    }

    const animationBuilder = this.enterAnimation || config.get('modalEnter', iosEnterAnimation);
    const ani: Animation = (this.animation = animationBuilder(this.el, {
      presentingEl: this.presentingElement,
      currentBreakpoint: initialBreakpoint,
      backdropBreakpoint,
    }));

    ani.progressStart(true, 1);

    const { gesture, moveSheetToBreakpoint } = createSheetGesture(
      this.el,
      this.backdropEl!,
      wrapperEl,
      initialBreakpoint,
      backdropBreakpoint,
      ani,
      this.sortedBreakpoints,
      () => this.currentBreakpoint ?? 0,
      () => this.sheetOnDismiss(),
      (breakpoint: number) => {
        if (this.currentBreakpoint !== breakpoint) {
          this.currentBreakpoint = breakpoint;
          this.ionBreakpointDidChange.emit({ breakpoint });
        }
      }
    );

    this.gesture = gesture;
    this.moveSheetToBreakpoint = moveSheetToBreakpoint;

    this.gesture.enable(true);
  }

  private sheetOnDismiss() {
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
      this.currentBreakpoint = 0;
      this.ionBreakpointDidChange.emit({ breakpoint: this.currentBreakpoint });
      await this.dismiss(undefined, 'gesture');
      this.gestureAnimationDismissing = false;
    });
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

    /**
     * If a canDismiss handler is responsible
     * for calling the dismiss method, we should
     * not run the canDismiss check again.
     */
    if (role !== 'handler' && !(await this.checkCanDismiss())) {
      return false;
    }

    /**
     * We need to start the status bar change
     * before the animation so that the change
     * finishes when the dismiss animation does.
     * TODO (FW-937)
     */
    const hasCardModal = this.swipeToClose || (this.canDismiss !== undefined && this.presentingElement !== undefined);
    if (hasCardModal && getIonMode(this) === 'ios') {
      setCardStatusBarDefault();
    }

    /* tslint:disable-next-line */
    if (typeof window !== 'undefined' && this.keyboardOpenCallback) {
      window.removeEventListener(KEYBOARD_DID_OPEN, this.keyboardOpenCallback);
    }

    /**
     * When using an inline modal
     * and presenting a modal it is possible to
     * quickly dismiss the modal while it is
     * presenting. We need to await any current
     * transition to allow the present to finish
     * before dismissing again.
     */
    if (this.currentTransition !== undefined) {
      await this.currentTransition;
    }

    const enteringAnimation = activeAnimations.get(this) || [];

    this.currentTransition = dismiss(this, data, role, 'modalLeave', iosLeaveAnimation, mdLeaveAnimation, {
      presentingEl: this.presentingElement,
      currentBreakpoint: this.currentBreakpoint || this.initialBreakpoint,
      backdropBreakpoint: this.backdropBreakpoint,
    });

    const dismissed = await this.currentTransition;

    if (dismissed) {
      const { delegate } = this.getDelegate();
      await detachComponent(delegate, this.usersElement);

      writeTask(() => this.el.classList.remove('show-modal'));

      if (this.animation) {
        this.animation.destroy();
      }
      if (this.gesture) {
        this.gesture.destroy();
      }

      enteringAnimation.forEach((ani) => ani.destroy());
    }
    this.currentBreakpoint = undefined;
    this.currentTransition = undefined;
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

  /**
   * Move a sheet style modal to a specific breakpoint. The breakpoint value must
   * be a value defined in your `breakpoints` array.
   */
  @Method()
  async setCurrentBreakpoint(breakpoint: number): Promise<void> {
    if (!this.isSheetModal) {
      printIonWarning('setCurrentBreakpoint is only supported on sheet modals.');
      return;
    }
    if (!this.breakpoints!.includes(breakpoint)) {
      printIonWarning(
        `Attempted to set invalid breakpoint value ${breakpoint}. Please double check that the breakpoint value is part of your defined breakpoints.`
      );
      return;
    }

    const { currentBreakpoint, moveSheetToBreakpoint, canDismiss, breakpoints } = this;

    if (currentBreakpoint === breakpoint) {
      return;
    }

    if (moveSheetToBreakpoint) {
      this.sheetTransition = moveSheetToBreakpoint({
        breakpoint,
        breakpointOffset: 1 - currentBreakpoint!,
        canDismiss: canDismiss !== undefined && canDismiss !== true && breakpoints![0] === 0,
      });
      await this.sheetTransition;
      this.sheetTransition = undefined;
    }
  }

  /**
   * Returns the current breakpoint of a sheet style modal
   */
  @Method()
  async getCurrentBreakpoint(): Promise<number | undefined> {
    return this.currentBreakpoint;
  }

  private async moveToNextBreakpoint() {
    const { breakpoints, currentBreakpoint } = this;

    if (!breakpoints || currentBreakpoint == null) {
      /**
       * If the modal does not have breakpoints and/or the current
       * breakpoint is not set, we can't move to the next breakpoint.
       */
      return false;
    }

    const allowedBreakpoints = breakpoints.filter((b) => b !== 0);
    const currentBreakpointIndex = allowedBreakpoints.indexOf(currentBreakpoint);
    const nextBreakpointIndex = (currentBreakpointIndex + 1) % allowedBreakpoints.length;
    const nextBreakpoint = allowedBreakpoints[nextBreakpointIndex];

    /**
     * Sets the current breakpoint to the next available breakpoint.
     * If the current breakpoint is the last breakpoint, we set the current
     * breakpoint to the first non-zero breakpoint to avoid dismissing the sheet.
     */
    await this.setCurrentBreakpoint(nextBreakpoint);
    return true;
  }

  private onHandleClick = () => {
    const { sheetTransition, handleBehavior } = this;
    if (handleBehavior !== 'cycle' || sheetTransition !== undefined) {
      /**
       * The sheet modal should not advance to the next breakpoint
       * if the handle behavior is not `cycle` or if the handle
       * is clicked while the sheet is moving to a breakpoint.
       */
      return;
    }
    this.moveToNextBreakpoint();
  };

  private onBackdropTap = () => {
    const { sheetTransition } = this;
    if (sheetTransition !== undefined) {
      /**
       * When the handle is double clicked at the largest breakpoint,
       * it will start to move to the first breakpoint. While transitioning,
       * the backdrop will often receive the second click. We prevent the
       * backdrop from dismissing the modal while moving between breakpoints.
       */
      return;
    }
    this.dismiss(undefined, BACKDROP);
  };

  private onLifecycle = (modalEvent: CustomEvent) => {
    const el = this.usersElement;
    const name = LIFECYCLE_MAP[modalEvent.type];
    if (el && name) {
      const ev = new CustomEvent(name, {
        bubbles: false,
        cancelable: false,
        detail: modalEvent.detail,
      });
      el.dispatchEvent(ev);
    }
  };

  render() {
    const { handle, isSheetModal, presentingElement, htmlAttributes, handleBehavior } = this;

    const showHandle = handle !== false && isSheetModal;
    const mode = getIonMode(this);
    const { modalId } = this;
    const isCardModal = presentingElement !== undefined && mode === 'ios';
    const isHandleCycle = handleBehavior === 'cycle';

    return (
      <Host
        no-router
        aria-modal="true"
        tabindex="-1"
        {...(htmlAttributes as any)}
        style={{
          zIndex: `${20000 + this.overlayIndex}`,
        }}
        class={{
          [mode]: true,
          ['modal-default']: !isCardModal && !isSheetModal,
          [`modal-card`]: isCardModal,
          [`modal-sheet`]: isSheetModal,
          'overlay-hidden': true,
          ...getClassMap(this.cssClass),
        }}
        id={modalId}
        onIonBackdropTap={this.onBackdropTap}
        onIonModalDidPresent={this.onLifecycle}
        onIonModalWillPresent={this.onLifecycle}
        onIonModalWillDismiss={this.onLifecycle}
        onIonModalDidDismiss={this.onLifecycle}
      >
        <ion-backdrop
          ref={(el) => (this.backdropEl = el)}
          visible={this.showBackdrop}
          tappable={this.backdropDismiss}
          part="backdrop"
        />

        {mode === 'ios' && <div class="modal-shadow"></div>}

        <div role="dialog" class="modal-wrapper ion-overlay-wrapper" part="content" ref={(el) => (this.wrapperEl = el)}>
          {showHandle && (
            <button
              class="modal-handle"
              // Prevents the handle from receiving keyboard focus when it does not cycle
              tabIndex={!isHandleCycle ? -1 : 0}
              aria-label="Activate to adjust the size of the dialog overlaying the screen"
              onClick={isHandleCycle ? this.onHandleClick : undefined}
              part="handle"
            ></button>
          )}
          <slot></slot>
        </div>
      </Host>
    );
  }
}

const LIFECYCLE_MAP: any = {
  ionModalDidPresent: 'ionViewDidEnter',
  ionModalWillPresent: 'ionViewWillEnter',
  ionModalWillDismiss: 'ionViewWillLeave',
  ionModalDidDismiss: 'ionViewDidLeave',
};

let modalIds = 0;
