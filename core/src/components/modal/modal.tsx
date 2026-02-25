import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Listen, Method, Prop, State, Watch, h, writeTask } from '@stencil/core';
import { findIonContent, printIonContentErrorMsg } from '@utils/content';
import { CoreDelegate, attachComponent, detachComponent } from '@utils/framework-delegate';
import { raf, inheritAttributes, hasLazyBuild, getElementRoot } from '@utils/helpers';
import type { Attributes } from '@utils/helpers';
import { createLockController } from '@utils/lock-controller';
import { printIonWarning } from '@utils/logging';
import { Style as StatusBarStyle, StatusBar } from '@utils/native/status-bar';
import {
  GESTURE,
  BACKDROP,
  dismiss,
  eventMethod,
  prepareOverlay,
  present,
  createTriggerController,
  setOverlayId,
  FOCUS_TRAP_DISABLE_CLASS,
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
import { portraitToLandscapeTransition, landscapeToPortraitTransition } from './animations/ios.transition';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';
import type { MoveSheetToBreakpointOptions } from './gestures/sheet';
import { createSheetGesture } from './gestures/sheet';
import { createSwipeToCloseGesture, SwipeToCloseDefaults } from './gestures/swipe-to-close';
import type { ModalBreakpointChangeEventDetail, ModalHandleBehavior } from './modal-interface';
import {
  getInitialSafeAreaConfig,
  getPositionBasedSafeAreaConfig,
  applySafeAreaOverrides,
  clearSafeAreaOverrides,
  getRootSafeAreaTop,
  type ModalSafeAreaContext,
} from './safe-area-utils';
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
  @State() private isSheetModal = false;
  private currentBreakpoint?: number;
  private wrapperEl?: HTMLElement;
  private backdropEl?: HTMLIonBackdropElement;
  private dragHandleEl?: HTMLButtonElement;
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

  // View transition properties for handling portrait/landscape switches
  private currentViewIsPortrait?: boolean;
  private viewTransitionAnimation?: Animation;
  private resizeTimeout?: any;

  // Mutation observer to watch for parent removal
  private parentRemovalObserver?: MutationObserver;
  // Cached original parent from before modal is moved to body during presentation
  private cachedOriginalParent?: HTMLElement;
  // Cached ion-page ancestor for child route passthrough
  private cachedPageParent?: HTMLElement | null;

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
   * Controls whether scrolling or dragging within the sheet modal expands
   * it to a larger breakpoint. This only takes effect when `breakpoints`
   * and `initialBreakpoint` are set.
   *
   * If `true`, scrolling or dragging anywhere in the modal will first expand
   * it to the next breakpoint. Once fully expanded, scrolling will affect the
   * content.
   * If `false`, scrolling will always affect the content. The modal will
   * only expand when dragging the header or handle. The modal will close when
   * dragging the header or handle. It can also be closed when dragging the
   * content, but only if the content is scrolled to the top.
   */
  @Prop() expandToScroll = true;

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

  @Listen('resize', { target: 'window' })
  onWindowResize() {
    if (!this.presented) return;

    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      const context = this.getSafeAreaContext();

      // iOS card modals: handle portrait/landscape view transitions
      if (context.isCardModal && !this.enterAnimation && !this.leaveAnimation) {
        this.handleViewTransition();
      }

      // Sheet modals: re-compute the internal offset property since safe-area
      // values may change on device rotation (e.g., portrait notch vs landscape).
      if (context.isSheetModal) {
        this.updateSheetOffsetTop();
      }

      // Regular (non-sheet, non-card) modals: update safe-area overrides
      // since the viewport may have crossed the centered-dialog breakpoint.
      if (!context.isSheetModal && !context.isCardModal) {
        this.updateSafeAreaOverrides();

        // Re-evaluate fullscreen safe-area padding: clear first, then re-apply
        if (this.wrapperEl) {
          this.wrapperEl.style.removeProperty('height');
          this.wrapperEl.style.removeProperty('padding-bottom');
        }
        this.applyFullscreenSafeArea();
      }
    }, 50); // Debounce to avoid excessive calls during active resizing
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
   * If `true`, focus will not be allowed to move outside of this overlay.
   * If `false`, focus will be allowed to move outside of the overlay.
   *
   * In most scenarios this property should remain set to `true`. Setting
   * this property to `false` can cause severe accessibility issues as users
   * relying on assistive technologies may be able to move focus into
   * a confusing state. We recommend only setting this to `false` when
   * absolutely necessary.
   *
   * Developers may want to consider disabling focus trapping if this
   * overlay presents a non-Ionic overlay from a 3rd party library.
   * Developers would disable focus trapping on the Ionic overlay
   * when presenting the 3rd party overlay and then re-enable
   * focus trapping when dismissing the 3rd party overlay and moving
   * focus back to the Ionic overlay.
   */
  @Prop() focusTrap = true;

  /**
   * Determines whether or not a modal can dismiss
   * when calling the `dismiss` method.
   *
   * If the value is `true` or the value's function returns `true`, the modal will close when trying to dismiss.
   * If the value is `false` or the value's function returns `false`, the modal will not close when trying to dismiss.
   *
   * See https://ionicframework.com/docs/troubleshooting/runtime#accessing-this
   * if you need to access `this` from within the callback.
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
    this.cleanupViewTransitionListener();
    this.cleanupParentRemovalObserver();
    // Also called in dismiss() — intentional dual cleanup covers both
    // dismiss-then-remove and direct DOM removal without dismiss.
    this.cleanupSafeAreaOverrides();
  }

  componentWillLoad() {
    const { breakpoints, initialBreakpoint, el, htmlAttributes } = this;
    const isSheetModal = (this.isSheetModal = breakpoints !== undefined && initialBreakpoint !== undefined);

    const attributesToInherit = ['aria-label', 'role'];
    this.inheritedAttributes = inheritAttributes(el, attributesToInherit);

    // Cache original parent before modal gets moved to body during presentation
    if (el.parentNode) {
      this.cachedOriginalParent = el.parentNode as HTMLElement;
    }

    /**
     * When using a controller modal you can set attributes
     * using the htmlAttributes property. Since the above attributes
     * need to be inherited inside of the modal, we need to look
     * and see if these attributes are being set via htmlAttributes.
     *
     * We could alternatively move this to componentDidLoad to simplify the work
     * here, but we'd then need to make inheritedAttributes a State variable,
     * thus causing another render to always happen after the first render.
     */
    if (htmlAttributes !== undefined) {
      attributesToInherit.forEach((attribute) => {
        const attributeValue = htmlAttributes[attribute];
        if (attributeValue) {
          /**
           * If an attribute we need to inherit was
           * set using htmlAttributes then add it to
           * inheritedAttributes and remove it from htmlAttributes.
           * This ensures the attribute is inherited and not
           * set on the host.
           *
           * In this case, if an inherited attribute is set
           * on the host element and using htmlAttributes then
           * htmlAttributes wins, but that's not a pattern that we recommend.
           * The only time you'd need htmlAttributes is when using modalController.
           */
          this.inheritedAttributes = {
            ...this.inheritedAttributes,
            [attribute]: htmlAttributes[attribute],
          };

          delete htmlAttributes[attribute];
        }
      });
    }

    if (isSheetModal) {
      this.currentBreakpoint = this.initialBreakpoint;
    }

    if (breakpoints !== undefined && initialBreakpoint !== undefined && !breakpoints.includes(initialBreakpoint)) {
      printIonWarning('[ion-modal] - Your breakpoints array must include the initialBreakpoint value.');
    }

    if (!this.htmlAttributes?.id) {
      setOverlayId(this.el);
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

    /**
     * When binding values in frameworks such as Angular
     * it is possible for the value to be set after the Web Component
     * initializes but before the value watcher is set up in Stencil.
     * As a result, the watcher callback may not be fired.
     * We work around this by manually calling the watcher
     * callback when the component has loaded and the watcher
     * is configured.
     */
    this.triggerChanged();
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

    // Recalculate isSheetModal before safe-area setup because framework
    // bindings (e.g., Angular) may not have been applied when componentWillLoad ran.
    this.isSheetModal = this.breakpoints !== undefined && this.initialBreakpoint !== undefined;

    // Set initial safe-area overrides before animation
    this.setInitialSafeAreaOverrides();

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

    await present<ModalPresentOptions>(this, 'modalEnter', iosEnterAnimation, mdEnterAnimation, {
      presentingEl: presentingElement,
      currentBreakpoint: this.initialBreakpoint,
      backdropBreakpoint: this.backdropBreakpoint,
      expandToScroll: this.expandToScroll,
    });

    // Update safe-area based on actual position after animation
    this.updateSafeAreaOverrides();

    // Apply fullscreen safe-area padding if needed
    this.applyFullscreenSafeArea();

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

    if (this.isSheetModal) {
      this.initSheetGesture();
    } else if (hasCardModal) {
      this.initSwipeToClose();
    }

    // Initialize view transition listener for iOS card modals
    this.initViewTransitionListener();

    // Initialize parent removal observer
    this.initParentRemovalObserver();

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
    const ani = (this.animation = animationBuilder(el, {
      presentingEl: this.presentingElement,
      expandToScroll: this.expandToScroll,
    }));

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
      expandToScroll: this.expandToScroll,
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
      this.expandToScroll,
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

    /**
     * When backdrop interaction is allowed, nested router outlets from child routes
     * may block pointer events to parent content. Apply passthrough styles only when
     * the modal was the sole content of a child route page.
     * See https://github.com/ionic-team/ionic-framework/issues/30700
     */
    const backdropNotBlocking = this.showBackdrop === false || this.focusTrap === false || backdropBreakpoint > 0;
    if (backdropNotBlocking) {
      this.setupChildRoutePassthrough();
    }
  }

  /**
   * For sheet modals that allow background interaction, sets up pointer-events
   * passthrough on child route page wrappers and nested router outlets.
   */
  private setupChildRoutePassthrough() {
    // Cache the page parent for cleanup
    this.cachedPageParent = this.getOriginalPageParent();
    const pageParent = this.cachedPageParent;

    // Skip ion-app (controller modals) and pages with visible sibling content next to the modal
    if (!pageParent || pageParent.tagName === 'ION-APP') {
      return;
    }

    const hasVisibleContent = Array.from(pageParent.children).some(
      (child) =>
        child !== this.el &&
        !(child instanceof HTMLElement && window.getComputedStyle(child).display === 'none') &&
        child.tagName !== 'TEMPLATE' &&
        child.tagName !== 'SLOT' &&
        !(child.nodeType === Node.TEXT_NODE && !child.textContent?.trim())
    );

    if (hasVisibleContent) {
      return;
    }

    // Child route case: page only contained the modal
    pageParent.classList.add('ion-page-overlay-passthrough');

    // Also make nested router outlets passthrough
    const routerOutlet = pageParent.parentElement;
    if (routerOutlet?.tagName === 'ION-ROUTER-OUTLET' && routerOutlet.parentElement?.tagName !== 'ION-APP') {
      routerOutlet.style.setProperty('pointer-events', 'none');
      routerOutlet.setAttribute('data-overlay-passthrough', 'true');
    }
  }

  /**
   * Finds the ion-page ancestor of the modal's original parent location.
   */
  private getOriginalPageParent(): HTMLElement | null {
    if (!this.cachedOriginalParent) {
      return null;
    }

    let pageParent: HTMLElement | null = this.cachedOriginalParent;
    while (pageParent && !pageParent.classList.contains('ion-page')) {
      pageParent = pageParent.parentElement;
    }
    return pageParent;
  }

  /**
   * Removes passthrough styles added by setupChildRoutePassthrough.
   */
  private cleanupChildRoutePassthrough() {
    const pageParent = this.cachedPageParent;
    if (!pageParent) {
      return;
    }

    pageParent.classList.remove('ion-page-overlay-passthrough');

    const routerOutlet = pageParent.parentElement;
    if (routerOutlet?.hasAttribute('data-overlay-passthrough')) {
      routerOutlet.style.removeProperty('pointer-events');
      routerOutlet.removeAttribute('data-overlay-passthrough');
    }

    // Clear the cached reference
    this.cachedPageParent = undefined;
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
   * This is a no-op if the overlay has not been presented yet. If you want
   * to remove an overlay from the DOM that was never presented, use the
   * [remove](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) method.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the modal.
   * For example, `cancel` or `backdrop`.
   */
  @Method()
  async dismiss(data?: any, role?: string): Promise<boolean> {
    if (this.gestureAnimationDismissing && role !== GESTURE) {
      return false;
    }

    // Cancel any pending resize timeout to prevent stale updates during dismiss
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = undefined;

    /**
     * Because the canDismiss check below is async,
     * we need to claim a lock before the check happens,
     * in case the dismiss transition does run.
     */
    const unlock = await this.lockController.lock();

    /**
     * Dismiss all child modals. This is especially important in
     * Angular and React because it's possible to lose control of a child
     * modal when the parent modal is dismissed.
     */
    await this.dismissNestedModals();

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
        expandToScroll: this.expandToScroll,
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
      this.cleanupViewTransitionListener();
      this.cleanupParentRemovalObserver();
      this.cleanupSafeAreaOverrides();

      this.cleanupChildRoutePassthrough();
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
   * Move a sheet style modal to a specific breakpoint.
   *
   * @param breakpoint The breakpoint value to move the sheet modal to.
   * Must be a value defined in your `breakpoints` array.
   */
  @Method()
  async setCurrentBreakpoint(breakpoint: number): Promise<void> {
    if (!this.isSheetModal) {
      printIonWarning('[ion-modal] - setCurrentBreakpoint is only supported on sheet modals.');
      return;
    }
    if (!this.breakpoints!.includes(breakpoint)) {
      printIonWarning(
        `[ion-modal] - Attempted to set invalid breakpoint value ${breakpoint}. Please double check that the breakpoint value is part of your defined breakpoints.`
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

  /**
   * When the modal receives focus directly, pass focus to the handle
   * if it exists and is focusable, otherwise let the focus trap handle it.
   */
  private onModalFocus = (ev: FocusEvent) => {
    const { dragHandleEl, el } = this;
    // Only handle focus if the modal itself was focused (not a child element)
    if (ev.target === el && dragHandleEl && dragHandleEl.tabIndex !== -1) {
      dragHandleEl.focus();
    }
  };

  private initViewTransitionListener() {
    // Only enable for iOS card modals when no custom animations are provided
    if (getIonMode(this) !== 'ios' || !this.presentingElement || this.enterAnimation || this.leaveAnimation) {
      return;
    }

    // Set initial view state
    this.currentViewIsPortrait = window.innerWidth < 768;
  }

  private handleViewTransition() {
    // Only run view transitions when the modal is presented
    if (!this.presented) {
      return;
    }

    const isPortrait = window.innerWidth < 768;

    // Only transition if view state actually changed
    if (this.currentViewIsPortrait === isPortrait) {
      return;
    }

    // Cancel any ongoing transition animation
    if (this.viewTransitionAnimation) {
      this.viewTransitionAnimation.destroy();
      this.viewTransitionAnimation = undefined;
    }

    const { presentingElement } = this;
    if (!presentingElement) {
      return;
    }

    // Create transition animation
    let transitionAnimation: Animation;
    if (this.currentViewIsPortrait && !isPortrait) {
      // Portrait to landscape transition
      transitionAnimation = portraitToLandscapeTransition(this.el, {
        presentingEl: presentingElement,
        currentBreakpoint: this.currentBreakpoint,
        backdropBreakpoint: this.backdropBreakpoint,
        expandToScroll: this.expandToScroll,
      });
    } else {
      // Landscape to portrait transition
      transitionAnimation = landscapeToPortraitTransition(this.el, {
        presentingEl: presentingElement,
        currentBreakpoint: this.currentBreakpoint,
        backdropBreakpoint: this.backdropBreakpoint,
        expandToScroll: this.expandToScroll,
      });
    }

    // Update state and play animation
    this.currentViewIsPortrait = isPortrait;
    this.viewTransitionAnimation = transitionAnimation;

    transitionAnimation.play().then(() => {
      this.viewTransitionAnimation = undefined;

      // Wait for a layout pass after the transition so getBoundingClientRect()
      // in getPositionBasedSafeAreaConfig() reflects the new dimensions.
      raf(() => this.updateSafeAreaOverrides());

      // After orientation transition, recreate the swipe-to-close gesture
      // with updated animation that reflects the new presenting element state
      this.reinitSwipeToClose();
    });
  }

  private cleanupViewTransitionListener() {
    // Clear any pending resize timeout
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = undefined;
    }

    if (this.viewTransitionAnimation) {
      this.viewTransitionAnimation.destroy();
      this.viewTransitionAnimation = undefined;
    }
  }

  private reinitSwipeToClose() {
    // Only reinitialize if we have a presenting element and are on iOS
    if (getIonMode(this) !== 'ios' || !this.presentingElement) {
      return;
    }

    // Clean up existing gesture and animation
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }

    if (this.animation) {
      // Properly end the progress-based animation at initial state before destroying
      // to avoid leaving modal in intermediate swipe position
      this.animation.progressEnd(0, 0, 0);
      this.animation.destroy();
      this.animation = undefined;
    }

    // Force the modal back to the correct position or it could end up
    // in a weird state after destroying the animation
    raf(() => {
      this.ensureCorrectModalPosition();
      this.initSwipeToClose();
    });
  }

  private ensureCorrectModalPosition() {
    const { el, presentingElement } = this;
    const root = getElementRoot(el);

    const wrapperEl = root.querySelector('.modal-wrapper') as HTMLElement | null;
    if (wrapperEl) {
      wrapperEl.style.transform = 'translateY(0vh)';
      wrapperEl.style.opacity = '1';
    }

    if (presentingElement?.tagName === 'ION-MODAL') {
      const isPortrait = window.innerWidth < 768;

      if (isPortrait) {
        const transformOffset = !CSS.supports('width', 'max(0px, 1px)')
          ? '30px'
          : 'max(30px, var(--ion-safe-area-top))';
        const scale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
        presentingElement.style.transform = `translateY(${transformOffset}) scale(${scale})`;
      } else {
        presentingElement.style.transform = 'translateY(0px) scale(1)';
      }
    }
  }

  /**
   * When the slot changes, we need to find all the modals in the slot
   * and set the data-parent-ion-modal attribute on them so we can find them
   * and dismiss them when we get dismissed.
   * We need to do it this way because when a modal is opened, it's moved to
   * the end of the body and is no longer an actual child of the modal.
   */
  private onSlotChange = ({ target }: Event) => {
    const slot = target as HTMLSlotElement;
    slot.assignedElements().forEach((el) => {
      el.querySelectorAll('ion-modal').forEach((childModal) => {
        // We don't need to write to the DOM if the modal is already tagged
        // If this is a deeply nested modal, this effect should cascade so we don't
        // need to worry about another modal claiming the same child.
        if (childModal.getAttribute('data-parent-ion-modal') === null) {
          childModal.setAttribute('data-parent-ion-modal', this.el.id);
        }
      });
    });
  };

  private async dismissNestedModals(): Promise<void> {
    const nestedModals = document.querySelectorAll(`ion-modal[data-parent-ion-modal="${this.el.id}"]`);
    nestedModals?.forEach(async (modal) => {
      await (modal as HTMLIonModalElement).dismiss(undefined, 'parent-dismissed');
    });
  }

  private initParentRemovalObserver() {
    if (typeof MutationObserver === 'undefined') {
      return;
    }

    // Only observe if we have a cached parent and are in browser environment
    if (typeof window === 'undefined' || !this.cachedOriginalParent) {
      return;
    }

    // Don't observe document or fragment nodes as they can't be "removed"
    if (
      this.cachedOriginalParent.nodeType === Node.DOCUMENT_NODE ||
      this.cachedOriginalParent.nodeType === Node.DOCUMENT_FRAGMENT_NODE
    ) {
      return;
    }

    /**
     * Don't observe for controller-based modals or when the parent is the
     * app root (document.body or ion-app). These parents won't be removed,
     * and observing document.body with subtree: true causes performance
     * issues with frameworks like Angular during change detection.
     */
    if (
      this.hasController ||
      this.cachedOriginalParent === document.body ||
      this.cachedOriginalParent.tagName === 'ION-APP'
    ) {
      return;
    }

    this.parentRemovalObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
          // Check if our cached original parent was removed
          const cachedParentWasRemoved = Array.from(mutation.removedNodes).some((node) => {
            const isDirectMatch = node === this.cachedOriginalParent;
            const isContainedMatch = this.cachedOriginalParent
              ? (node as HTMLElement).contains?.(this.cachedOriginalParent)
              : false;
            return isDirectMatch || isContainedMatch;
          });

          // Also check if parent is no longer connected to DOM
          const cachedParentDisconnected = this.cachedOriginalParent && !this.cachedOriginalParent.isConnected;

          if (cachedParentWasRemoved || cachedParentDisconnected) {
            this.dismiss(undefined, 'parent-removed');
            // Release the reference to the cached original parent
            // so we don't have a memory leak
            this.cachedOriginalParent = undefined;
          }
        }
      });
    });

    // Observe document body with subtree to catch removals at any level
    this.parentRemovalObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private cleanupParentRemovalObserver() {
    this.parentRemovalObserver?.disconnect();
    this.parentRemovalObserver = undefined;
  }

  /**
   * Creates the context object for safe-area utilities.
   */
  private getSafeAreaContext(): ModalSafeAreaContext {
    return {
      isSheetModal: this.isSheetModal,
      isCardModal: this.presentingElement !== undefined && getIonMode(this) === 'ios',
      presentingElement: this.presentingElement,
      breakpoints: this.breakpoints,
      currentBreakpoint: this.currentBreakpoint,
    };
  }

  /**
   * Sets initial safe-area overrides before modal animation.
   * Called in present() before animation starts.
   *
   * For sheet modals, the SCSS --height formula uses --ion-modal-offset-top
   * (an internal property) instead of --ion-safe-area-top. We resolve the
   * root safe-area-top to pixels and set --ion-modal-offset-top, decoupling
   * the height calculation from --ion-safe-area-top (which is zeroed for
   * sheets to prevent header content from getting double-offset padding).
   */
  private setInitialSafeAreaOverrides(): void {
    const context = this.getSafeAreaContext();
    const safeAreaConfig = getInitialSafeAreaConfig(context);
    applySafeAreaOverrides(this.el, safeAreaConfig);

    // Set the internal offset property with the resolved root safe-area-top value
    if (context.isSheetModal) {
      this.updateSheetOffsetTop();
    }
  }

  /**
   * Resolves the current root --ion-safe-area-top value and sets the
   * internal --ion-modal-offset-top property on the host element.
   * Called on present and on resize (e.g., device rotation changes safe-area).
   */
  private updateSheetOffsetTop(): void {
    const safeAreaTop = getRootSafeAreaTop();
    this.el.style.setProperty('--ion-modal-offset-top', `${safeAreaTop}px`);
  }

  /**
   * Updates safe-area overrides during dynamic state changes.
   * Called after animations, during gestures, and on orientation changes.
   */
  private updateSafeAreaOverrides(): void {
    const { wrapperEl, el } = this;
    const context = this.getSafeAreaContext();

    // Sheet modals: safe-area is fully determined at presentation time
    // (top is always 0px, height is frozen). Nothing to update.
    if (context.isSheetModal) return;

    // Card modals have fixed safe-area requirements set by initial prediction.
    if (context.isCardModal) return;

    // wrapperEl is required for position-based detection below
    if (!wrapperEl) return;

    // Regular modals: use position-based detection to correctly handle both
    // fullscreen modals and centered dialogs with custom dimensions.
    const safeAreaConfig = getPositionBasedSafeAreaConfig(wrapperEl);
    applySafeAreaOverrides(el, safeAreaConfig);
  }

  /**
   * Applies padding-bottom to fullscreen modal wrapper to prevent
   * content from overlapping system navigation bar.
   */
  private applyFullscreenSafeArea(): void {
    const { wrapperEl, el } = this;
    if (!wrapperEl) return;

    const context = this.getSafeAreaContext();
    if (context.isSheetModal || context.isCardModal) return;

    // Check for standard Ionic layout children (ion-content, ion-footer),
    // searching one level deep for wrapped components (e.g.,
    // <app-footer><ion-footer>...</ion-footer></app-footer>).
    // Note: uses a manual loop instead of querySelector(':scope > ...') because
    // Stencil's mock-doc (used in spec tests) does not support :scope.
    let hasContent = false;
    let hasFooter = false;
    for (const child of Array.from(el.children)) {
      if (child.tagName === 'ION-CONTENT') hasContent = true;
      if (child.tagName === 'ION-FOOTER') hasFooter = true;
      for (const grandchild of Array.from(child.children)) {
        if (grandchild.tagName === 'ION-CONTENT') hasContent = true;
        if (grandchild.tagName === 'ION-FOOTER') hasFooter = true;
      }
    }

    // Only apply wrapper padding for standard Ionic layouts (has ion-content
    // but no ion-footer). Custom modals with raw HTML are fully
    // developer-controlled and should not be modified.
    if (!hasContent || hasFooter) return;

    // Reduce wrapper height by safe-area and add equivalent padding so the
    // total visual size stays the same but the flex content area shrinks.
    // Using height + padding instead of box-sizing: border-box avoids
    // breaking custom modals that set --border-width (border-box would
    // include the border inside the height, changing the layout).
    wrapperEl.style.setProperty('height', 'calc(var(--height) - var(--ion-safe-area-bottom, 0px))');
    wrapperEl.style.setProperty('padding-bottom', 'var(--ion-safe-area-bottom, 0px)');
  }

  /**
   * Clears all safe-area overrides and padding from wrapper.
   */
  private cleanupSafeAreaOverrides(): void {
    clearSafeAreaOverrides(this.el);

    // Remove internal sheet offset property
    this.el.style.removeProperty('--ion-modal-offset-top');

    if (this.wrapperEl) {
      this.wrapperEl.style.removeProperty('height');
      this.wrapperEl.style.removeProperty('padding-bottom');
    }
  }

  render() {
    const {
      handle,
      isSheetModal,
      presentingElement,
      htmlAttributes,
      handleBehavior,
      inheritedAttributes,
      focusTrap,
      expandToScroll,
    } = this;
    const showHandle = handle !== false && isSheetModal;
    const mode = getIonMode(this);
    const isCardModal = presentingElement !== undefined && mode === 'ios';
    const isHandleCycle = handleBehavior === 'cycle';
    const isSheetModalWithHandle = isSheetModal && showHandle;

    return (
      <Host
        no-router
        // Allow the modal to be navigable when the handle is focusable
        tabIndex={isHandleCycle && isSheetModalWithHandle ? 0 : -1}
        {...(htmlAttributes as any)}
        style={{
          zIndex: `${20000 + this.overlayIndex}`,
        }}
        class={{
          [mode]: true,
          ['modal-default']: !isCardModal && !isSheetModal,
          [`modal-card`]: isCardModal,
          [`modal-sheet`]: isSheetModal,
          [`modal-no-expand-scroll`]: isSheetModal && !expandToScroll,
          'overlay-hidden': true,
          [FOCUS_TRAP_DISABLE_CLASS]: focusTrap === false,
          ...getClassMap(this.cssClass),
        }}
        onIonBackdropTap={this.onBackdropTap}
        onIonModalDidPresent={this.onLifecycle}
        onIonModalWillPresent={this.onLifecycle}
        onIonModalWillDismiss={this.onLifecycle}
        onIonModalDidDismiss={this.onLifecycle}
        onFocus={this.onModalFocus}
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
              ref={(el) => (this.dragHandleEl = el)}
            ></button>
          )}
          <slot onSlotchange={this.onSlotChange}></slot>
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

  /**
   * Whether or not the modal should scroll/drag
   * the content only when fully expanded.
   */
  expandToScroll?: boolean;
}

type ModalPresentOptions = ModalOverlayOptions;
type ModalDismissOptions = ModalOverlayOptions;
