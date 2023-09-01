import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, State, Watch, h, writeTask } from '@stencil/core';
import { findIonContent, printIonContentErrorMsg } from '@utils/content';
import { CoreDelegate, attachComponent, detachComponent } from '@utils/framework-delegate';
import { raf, inheritAttributes, hasLazyBuild } from '@utils/helpers';
import type { Attributes } from '@utils/helpers';
import { createLockController } from '@utils/lock-controller';
import { printIonWarning } from '@utils/logging';
import { Style as StatusBarStyle, StatusBar } from '@utils/native/status-bar';
import {
  GESTURE,
  BACKDROP,
  activeAnimations,
  dismiss,
  eventMethod,
  prepareOverlay,
  present,
  createTriggerController,
  setOverlayId,
} from '@utils/overlays';
import { getClassMap } from '@utils/theme';
import { deepReady, waitForMount } from '@utils/transition';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import type {
  Animation,
  AnimationBuilder,
  ComponentProps,
  ComponentRef,
  FrameworkDelegate,
  Gesture,
  OverlayInterface,
} from '../../interface';
import { KEYBOARD_DID_OPEN } from '../../utils/keyboard/keyboard';
import type { OverlayEventDetail } from '../../utils/overlays-interface';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';
import type { MoveSheetToBreakpointOptions } from './gestures/sheet';
import { createSheetGesture } from './gestures/sheet';
import { createSwipeToCloseGesture } from './gestures/swipe-to-close';
import type { ModalBreakpointChangeEventDetail, ModalHandleBehavior } from './modal-interface';
import { setCardStatusBarDark, setCardStatusBarDefault } from './utils';

// TODO(FW-2832): types

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
  private readonly lockController = createLockController();
  private readonly triggerController = createTriggerController();
  private gesture?: Gesture;
  private coreDelegate: FrameworkDelegate = CoreDelegate();
  private sheetTransition?: Promise<any>;
  private isSheetModal = false;
  private currentBreakpoint?: number;
  private wrapperEl?: HTMLElement;
  private backdropEl?: HTMLIonBackdropElement;
  private sortedBreakpoints?: number[];
  private keyboardOpenCallback?: () => void;
  private moveSheetToBreakpoint?: (options: MoveSheetToBreakpointOptions) => Promise<void>;
  private inheritedAttributes: Attributes = {};
  private statusBarStyle?: StatusBarStyle;

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
   * The element that presented the modal. This is used for card presentation effects
   * and for stacking multiple modals on top of each other. Only applies in iOS mode.
   */
  @Prop() presentingElement?: HTMLElement;

  /**
   * Additional attributes to pass to the modal.
   */
  @Prop() htmlAttributes?: { [key: string]: any };

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
  triggerChanged() {
    const { trigger, el, triggerController } = this;
    if (trigger) {
      triggerController.addClickListener(el, trigger);
    }
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
   * Determines whether or not a modal can dismiss
   * when calling the `dismiss` method.
   *
   * If the value is `true` or the value's function returns `true`, the modal will close when trying to dismiss.
   * If the value is `false` or the value's function returns `false`, the modal will not close when trying to dismiss.
   */
  @Prop() canDismiss: boolean | ((data?: any, role?: string) => Promise<boolean>) = true;

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
   * Shorthand for ionModalDidPresent.
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

  /**
   * Emitted before the modal has presented, but after the component
   * has been mounted in the DOM.
   * This event exists so iOS can run the entering
   * transition properly
   *
   * @internal
   */
  @Event() ionMount!: EventEmitter<void>;

  breakpointsChanged(breakpoints: number[] | undefined) {
    if (breakpoints !== undefined) {
      this.sortedBreakpoints = breakpoints.sort((a, b) => a - b);
    }
  }

  connectedCallback() {
    const { el } = this;
    prepareOverlay(el);
    this.triggerChanged();
  }

  disconnectedCallback() {
    this.triggerController.removeClickListener();
  }

  componentWillLoad() {
    const { breakpoints, initialBreakpoint, el } = this;
    const isSheetModal = (this.isSheetModal = breakpoints !== undefined && initialBreakpoint !== undefined);

    this.inheritedAttributes = inheritAttributes(el, ['aria-label', 'role']);

    if (isSheetModal) {
      this.currentBreakpoint = this.initialBreakpoint;
    }

    if (breakpoints !== undefined && initialBreakpoint !== undefined && !breakpoints.includes(initialBreakpoint)) {
      printIonWarning('Your breakpoints array must include the initialBreakpoint value.');
    }

    setOverlayId(el);
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
  }

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
  private async checkCanDismiss(data?: any, role?: string) {
    const { canDismiss } = this;

    if (typeof canDismiss === 'function') {
      return canDismiss(data, role);
    }

    return canDismiss;
  }

  /**
   * Present the modal overlay after it has been created.
   */
  @Method()
  async present(): Promise<void> {
    const unlock = await this.lockController.lock();

    if (this.presented) {
      unlock();
      return;
    }

    const { presentingElement, el } = this;

    /**
     * If the modal is presented multiple times (inline modals), we
     * need to reset the current breakpoint to the initial breakpoint.
     */
    this.currentBreakpoint = this.initialBreakpoint;

    const { inline, delegate } = this.getDelegate(true);

    /**
     * Emit ionMount so JS Frameworks have an opportunity
     * to add the child component to the DOM. The child
     * component will be assigned to this.usersElement below.
     */
    this.ionMount.emit();

    this.usersElement = await attachComponent(delegate, el, this.component, ['ion-page'], this.componentProps, inline);

    /**
     * When using the lazy loaded build of Stencil, we need to wait
     * for every Stencil component instance to be ready before presenting
     * otherwise there can be a flash of unstyled content. With the
     * custom elements bundle we need to wait for the JS framework
     * mount the inner contents of the overlay otherwise WebKit may
     * get the transition incorrect.
     */
    if (hasLazyBuild(el)) {
      await deepReady(this.usersElement);
      /**
       * If keepContentsMounted="true" then the
       * JS Framework has already mounted the inner
       * contents so there is no need to wait.
       * Otherwise, we need to wait for the JS
       * Framework to mount the inner contents
       * of this component.
       */
    } else if (!this.keepContentsMounted) {
      await waitForMount();
    }

    writeTask(() => this.el.classList.add('show-modal'));

    await present<ModalPresentOptions>(this, 'modalEnter', iosEnterAnimation, mdEnterAnimation, {
      presentingEl: presentingElement,
      currentBreakpoint: this.initialBreakpoint,
      backdropBreakpoint: this.backdropBreakpoint,
    });

    /* tslint:disable-next-line */
    if (typeof window !== 'undefined') {
      /**
       * This needs to be setup before any
       * non-transition async work so it can be dereferenced
       * in the dismiss method. The dismiss method
       * only waits for the entering transition
       * to finish. It does not wait for all of the `present`
       * method to resolve.
       */
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

    const hasCardModal = presentingElement !== undefined;

    /**
     * We need to change the status bar at the
     * start of the animation so that it completes
     * by the time the card animation is done.
     */
    if (hasCardModal && getIonMode(this) === 'ios') {
      // Cache the original status bar color before the modal is presented
      this.statusBarStyle = await StatusBar.getStyle();
      setCardStatusBarDark();
    }

    if (this.isSheetModal) {
      this.initSheetGesture();
    } else if (hasCardModal) {
      this.initSwipeToClose();
    }

    unlock();
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

    const statusBarStyle = this.statusBarStyle ?? StatusBarStyle.Default;

    this.gesture = createSwipeToCloseGesture(el, ani, statusBarStyle, () => {
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

      /**
       * Reset the status bar style as the dismiss animation
       * starts otherwise the status bar will be the wrong
       * color for the duration of the dismiss animation.
       * The dismiss method does this as well, but
       * in this case it's only called once the animation
       * has finished.
       */
      setCardStatusBarDefault(this.statusBarStyle);
      this.animation!.onFinish(async () => {
        await this.dismiss(undefined, GESTURE);
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
      await this.dismiss(undefined, GESTURE);
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
    if (this.gestureAnimationDismissing && role !== GESTURE) {
      return false;
    }

    /**
     * Because the canDismiss check below is async,
     * we need to claim a lock before the check happens,
     * in case the dismiss transition does run.
     */
    const unlock = await this.lockController.lock();

    /**
     * If a canDismiss handler is responsible
     * for calling the dismiss method, we should
     * not run the canDismiss check again.
     */
    if (role !== 'handler' && !(await this.checkCanDismiss(data, role))) {
      unlock();
      return false;
    }

    const { presentingElement } = this;

    /**
     * We need to start the status bar change
     * before the animation so that the change
     * finishes when the dismiss animation does.
     */
    const hasCardModal = presentingElement !== undefined;
    if (hasCardModal && getIonMode(this) === 'ios') {
      setCardStatusBarDefault(this.statusBarStyle);
    }

    /* tslint:disable-next-line */
    if (typeof window !== 'undefined' && this.keyboardOpenCallback) {
      window.removeEventListener(KEYBOARD_DID_OPEN, this.keyboardOpenCallback);
      this.keyboardOpenCallback = undefined;
    }

    const enteringAnimation = activeAnimations.get(this) || [];

    const dismissed = await dismiss<ModalDismissOptions>(
      this,
      data,
      role,
      'modalLeave',
      iosLeaveAnimation,
      mdLeaveAnimation,
      {
        presentingEl: presentingElement,
        currentBreakpoint: this.currentBreakpoint ?? this.initialBreakpoint,
        backdropBreakpoint: this.backdropBreakpoint,
      }
    );

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
    this.animation = undefined;

    unlock();

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

    const { currentBreakpoint, moveSheetToBreakpoint, canDismiss, breakpoints, animated } = this;

    if (currentBreakpoint === breakpoint) {
      return;
    }

    if (moveSheetToBreakpoint) {
      this.sheetTransition = moveSheetToBreakpoint({
        breakpoint,
        breakpointOffset: 1 - currentBreakpoint!,
        canDismiss: canDismiss !== undefined && canDismiss !== true && breakpoints![0] === 0,
        animated,
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
    const { handle, isSheetModal, presentingElement, htmlAttributes, handleBehavior, inheritedAttributes } = this;

    const showHandle = handle !== false && isSheetModal;
    const mode = getIonMode(this);
    const isCardModal = presentingElement !== undefined && mode === 'ios';
    const isHandleCycle = handleBehavior === 'cycle';

    return (
      <Host
        no-router
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

        <div
          /*
            role and aria-modal must be used on the
            same element. They must also be set inside the
            shadow DOM otherwise ion-button will not be highlighted
            when using VoiceOver: https://bugs.webkit.org/show_bug.cgi?id=247134
          */
          role="dialog"
          {...inheritedAttributes}
          aria-modal="true"
          class="modal-wrapper ion-overlay-wrapper"
          part="content"
          ref={(el) => (this.wrapperEl = el)}
        >
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

interface ModalOverlayOptions {
  /**
   * The element that presented the modal.
   */
  presentingEl?: HTMLElement;
  /**
   * The current breakpoint of the sheet modal.
   */
  currentBreakpoint?: number;
  /**
   * The point after which the backdrop will being
   * to fade in when using a sheet modal.
   */
  backdropBreakpoint: number;
}

type ModalPresentOptions = ModalOverlayOptions;
type ModalDismissOptions = ModalOverlayOptions;
