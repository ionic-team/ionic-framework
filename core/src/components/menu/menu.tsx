import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Build, Component, Element, Event, Host, Listen, Method, Prop, State, Watch, h } from '@stencil/core';
import { getTimeGivenProgression } from '@utils/animation/cubic-bezier';
import { GESTURE_CONTROLLER } from '@utils/gesture';
import type { Attributes } from '@utils/helpers';
import { inheritAriaAttributes, assert, clamp, isEndSide as isEnd } from '@utils/helpers';
import { menuController } from '@utils/menu-controller';
import { getPresentedOverlay } from '@utils/overlays';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import type { Animation, Gesture, GestureDetail } from '../../interface';

import type { MenuChangeEventDetail, MenuI, Side } from './menu-interface';

const iosEasing = 'cubic-bezier(0.32,0.72,0,1)';
const mdEasing = 'cubic-bezier(0.0,0.0,0.2,1)';
const iosEasingReverse = 'cubic-bezier(1, 0, 0.68, 0.28)';
const mdEasingReverse = 'cubic-bezier(0.4, 0, 0.6, 1)';
const focusableQueryString =
  '[tabindex]:not([tabindex^="-"]), input:not([type=hidden]):not([tabindex^="-"]), textarea:not([tabindex^="-"]), button:not([tabindex^="-"]), select:not([tabindex^="-"]), .ion-focusable:not([tabindex^="-"])';

/**
 * @part container - The container for the menu content.
 * @part backdrop - The backdrop that appears over the main content when the menu is open.
 */
@Component({
  tag: 'ion-menu',
  styleUrls: {
    ios: 'menu.ios.scss',
    md: 'menu.md.scss',
  },
  shadow: true,
})
export class Menu implements ComponentInterface, MenuI {
  private animation?: any; // TODO(FW-2832): type
  private lastOnEnd = 0;
  private gesture?: Gesture;
  private blocker = GESTURE_CONTROLLER.createBlocker({ disableScroll: true });
  private didLoad = false;

  /**
   * Flag used to determine if an open/close
   * operation was cancelled. For example, if
   * an app calls "menu.open" then disables the menu
   * part way through the animation, then this would
   * be considered a cancelled operation.
   */
  private operationCancelled = false;

  isAnimating = false;
  width!: number;
  _isOpen = false;

  backdropEl?: HTMLElement;
  menuInnerEl?: HTMLElement;
  contentEl?: HTMLElement;
  lastFocus?: HTMLElement;

  private inheritedAttributes: Attributes = {};

  private handleFocus = (ev: FocusEvent) => {
    /**
     * Overlays have their own focus trapping listener
     * so we do not want the two listeners to conflict
     * with each other. If the top-most overlay that is
     * open does not contain this ion-menu, then ion-menu's
     * focus trapping should not run.
     */
    const lastOverlay = getPresentedOverlay(document);
    if (lastOverlay && !lastOverlay.contains(this.el)) {
      return;
    }

    this.trapKeyboardFocus(ev, document);
  };

  @Element() el!: HTMLIonMenuElement;

  @State() isPaneVisible = false;
  @State() isEndSide = false;

  /**
   * The `id` of the main content. When using
   * a router this is typically `ion-router-outlet`.
   * When not using a router, this is typically
   * your main view's `ion-content`. This is not the
   * id of the `ion-content` inside of your `ion-menu`.
   */
  @Prop({ reflect: true }) contentId?: string;

  /**
   * An id for the menu.
   */
  @Prop({ reflect: true }) menuId?: string;

  /**
   * The display type of the menu.
   * Available options: `"overlay"`, `"reveal"`, `"push"`.
   */
  @Prop({ mutable: true }) type?: string;

  @Watch('type')
  typeChanged(type: string, oldType: string | undefined) {
    const contentEl = this.contentEl;
    if (contentEl) {
      if (oldType !== undefined) {
        contentEl.classList.remove(`menu-content-${oldType}`);
      }
      contentEl.classList.add(`menu-content-${type}`);
      contentEl.removeAttribute('style');
    }
    if (this.menuInnerEl) {
      // Remove effects of previous animations
      this.menuInnerEl.removeAttribute('style');
    }
    this.animation = undefined;
  }

  /**
   * If `true`, the menu is disabled.
   */
  @Prop({ mutable: true }) disabled = false;

  @Watch('disabled')
  protected disabledChanged() {
    this.updateState();

    this.ionMenuChange.emit({
      disabled: this.disabled,
      open: this._isOpen,
    });
  }

  /**
   * Which side of the view the menu should be placed.
   */
  @Prop({ reflect: true }) side: Side = 'start';

  @Watch('side')
  protected sideChanged() {
    this.isEndSide = isEnd(this.side);
    /**
     * Menu direction animation is calculated based on the document direction.
     * If the document direction changes, we need to create a new animation.
     */
    this.animation = undefined;
  }

  /**
   * If `true`, swiping the menu is enabled.
   */
  @Prop() swipeGesture = true;

  @Watch('swipeGesture')
  protected swipeGestureChanged() {
    this.updateState();
  }
  /**
   * The edge threshold for dragging the menu open.
   * If a drag/swipe happens over this value, the menu is not triggered.
   */
  @Prop() maxEdgeStart = 50;

  /**
   * Emitted when the menu is about to be opened.
   */
  @Event() ionWillOpen!: EventEmitter<void>;

  /**
   * Emitted when the menu is about to be closed.
   */
  @Event() ionWillClose!: EventEmitter<void>;
  /**
   * Emitted when the menu is open.
   */
  @Event() ionDidOpen!: EventEmitter<void>;

  /**
   * Emitted when the menu is closed.
   */
  @Event() ionDidClose!: EventEmitter<void>;

  /**
   * Emitted when the menu state is changed.
   * @internal
   */
  @Event() protected ionMenuChange!: EventEmitter<MenuChangeEventDetail>;

  async connectedCallback() {
    // TODO: connectedCallback is fired in CE build
    // before WC is defined. This needs to be fixed in Stencil.
    if (typeof (customElements as any) !== 'undefined' && (customElements as any) != null) {
      await customElements.whenDefined('ion-menu');
    }

    if (this.type === undefined) {
      this.type = config.get('menuType', 'overlay');
    }

    if (!Build.isBrowser) {
      return;
    }

    const content = this.contentId !== undefined ? document.getElementById(this.contentId) : null;

    if (content === null) {
      console.error('Menu: must have a "content" element to listen for drag events on.');
      return;
    }

    if (this.el.contains(content)) {
      console.error(
        `Menu: "contentId" should refer to the main view's ion-content, not the ion-content inside of the ion-menu.`
      );
    }

    this.contentEl = content as HTMLElement;

    // add menu's content classes
    content.classList.add('menu-content');

    this.typeChanged(this.type!, undefined);
    this.sideChanged();

    // register this menu with the app's menu controller
    menuController._register(this);
    this.menuChanged();

    this.gesture = (await import('../../utils/gesture')).createGesture({
      el: document,
      gestureName: 'menu-swipe',
      gesturePriority: 30,
      threshold: 10,
      blurOnStart: true,
      canStart: (ev) => this.canStart(ev),
      onWillStart: () => this.onWillStart(),
      onStart: () => this.onStart(),
      onMove: (ev) => this.onMove(ev),
      onEnd: (ev) => this.onEnd(ev),
    });
    this.updateState();
  }

  componentWillLoad() {
    this.inheritedAttributes = inheritAriaAttributes(this.el);
  }

  async componentDidLoad() {
    this.didLoad = true;
    this.menuChanged();
    this.updateState();
  }

  private menuChanged() {
    /**
     * Inform dependent components such as ion-menu-button
     * that the menu is ready. Note that we only want to do this
     * once the menu has been rendered which is why we check for didLoad.
     */
    if (this.didLoad) {
      this.ionMenuChange.emit({ disabled: this.disabled, open: this._isOpen });
    }
  }

  async disconnectedCallback() {
    /**
     * The menu should be closed when it is
     * unmounted from the DOM.
     * This is an async call, so we need to wait for
     * this to finish otherwise contentEl
     * will not have MENU_CONTENT_OPEN removed.
     */
    await this.close(false);

    this.blocker.destroy();
    menuController._unregister(this);
    if (this.animation) {
      this.animation.destroy();
    }
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }

    this.animation = undefined;
    this.contentEl = undefined;
  }

  @Listen('ionSplitPaneVisible', { target: 'body' })
  onSplitPaneChanged(ev: CustomEvent) {
    this.isPaneVisible = ev.detail.isPane(this.el);
    this.updateState();
  }

  @Listen('click', { capture: true })
  onBackdropClick(ev: any) {
    // TODO(FW-2832): type (CustomEvent triggers errors which should be sorted)
    if (this._isOpen && this.lastOnEnd < ev.timeStamp - 100) {
      const shouldClose = ev.composedPath ? !ev.composedPath().includes(this.menuInnerEl) : false;

      if (shouldClose) {
        ev.preventDefault();
        ev.stopPropagation();
        this.close();
      }
    }
  }

  @Listen('keydown')
  onKeydown(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.close();
    }
  }

  /**
   * Returns `true` is the menu is open.
   */
  @Method()
  isOpen(): Promise<boolean> {
    return Promise.resolve(this._isOpen);
  }

  /**
   * Returns `true` is the menu is active.
   *
   * A menu is active when it can be opened or closed, meaning it's enabled
   * and it's not part of a `ion-split-pane`.
   */
  @Method()
  isActive(): Promise<boolean> {
    return Promise.resolve(this._isActive());
  }

  /**
   * Opens the menu. If the menu is already open or it can't be opened,
   * it returns `false`.
   */
  @Method()
  open(animated = true): Promise<boolean> {
    return this.setOpen(true, animated);
  }

  /**
   * Closes the menu. If the menu is already closed or it can't be closed,
   * it returns `false`.
   */
  @Method()
  close(animated = true): Promise<boolean> {
    return this.setOpen(false, animated);
  }

  /**
   * Toggles the menu. If the menu is already open, it will try to close, otherwise it will try to open it.
   * If the operation can't be completed successfully, it returns `false`.
   */
  @Method()
  toggle(animated = true): Promise<boolean> {
    return this.setOpen(!this._isOpen, animated);
  }

  /**
   * Opens or closes the button.
   * If the operation can't be completed successfully, it returns `false`.
   */
  @Method()
  setOpen(shouldOpen: boolean, animated = true): Promise<boolean> {
    return menuController._setOpen(this, shouldOpen, animated);
  }

  private focusFirstDescendant() {
    const { el } = this;
    const firstInput = el.querySelector(focusableQueryString) as HTMLElement | null;

    if (firstInput) {
      firstInput.focus();
    } else {
      el.focus();
    }
  }

  private focusLastDescendant() {
    const { el } = this;
    const inputs = Array.from(el.querySelectorAll<HTMLElement>(focusableQueryString));
    const lastInput = inputs.length > 0 ? inputs[inputs.length - 1] : null;

    if (lastInput) {
      lastInput.focus();
    } else {
      el.focus();
    }
  }

  private trapKeyboardFocus(ev: Event, doc: Document) {
    const target = ev.target as HTMLElement | null;
    if (!target) {
      return;
    }

    /**
     * If the target is inside the menu contents, let the browser
     * focus as normal and keep a log of the last focused element.
     */
    if (this.el.contains(target)) {
      this.lastFocus = target;
    } else {
      /**
       * Otherwise, we are about to have focus go out of the menu.
       * Wrap the focus to either the first or last element.
       */

      /**
       * Once we call `focusFirstDescendant`, another focus event
       * will fire, which will cause `lastFocus` to be updated
       * before we can run the code after that. We cache the value
       * here to avoid that.
       */
      this.focusFirstDescendant();

      /**
       * If the cached last focused element is the same as the now-
       * active element, that means the user was on the first element
       * already and pressed Shift + Tab, so we need to wrap to the
       * last descendant.
       */
      if (this.lastFocus === doc.activeElement) {
        this.focusLastDescendant();
      }
    }
  }

  async _setOpen(shouldOpen: boolean, animated = true): Promise<boolean> {
    // If the menu is disabled or it is currently being animated, let's do nothing
    if (!this._isActive() || this.isAnimating || shouldOpen === this._isOpen) {
      return false;
    }

    this.beforeAnimation(shouldOpen);

    await this.loadAnimation();
    await this.startAnimation(shouldOpen, animated);

    /**
     * If the animation was cancelled then
     * return false because the operation
     * did not succeed.
     */
    if (this.operationCancelled) {
      this.operationCancelled = false;
      return false;
    }

    this.afterAnimation(shouldOpen);

    return true;
  }

  private async loadAnimation(): Promise<void> {
    // Menu swipe animation takes the menu's inner width as parameter,
    // If `offsetWidth` changes, we need to create a new animation.
    const width = this.menuInnerEl!.offsetWidth;
    /**
     * Menu direction animation is calculated based on the document direction.
     * If the document direction changes, we need to create a new animation.
     */
    const isEndSide = isEnd(this.side);
    if (width === this.width && this.animation !== undefined && isEndSide === this.isEndSide) {
      return;
    }
    this.width = width;
    this.isEndSide = isEndSide;

    // Destroy existing animation
    if (this.animation) {
      this.animation.destroy();
      this.animation = undefined;
    }
    // Create new animation
    this.animation = await menuController._createAnimation(this.type!, this);
    if (!config.getBoolean('animated', true)) {
      this.animation.duration(0);
    }
    this.animation.fill('both');
  }

  private async startAnimation(shouldOpen: boolean, animated: boolean): Promise<void> {
    const isReversed = !shouldOpen;
    const mode = getIonMode(this);
    const easing = mode === 'ios' ? iosEasing : mdEasing;
    const easingReverse = mode === 'ios' ? iosEasingReverse : mdEasingReverse;
    const ani = (this.animation as Animation)!
      .direction(isReversed ? 'reverse' : 'normal')
      .easing(isReversed ? easingReverse : easing);

    if (animated) {
      await ani.play();
    } else {
      ani.play({ sync: true });
    }

    /**
     * We run this after the play invocation
     * instead of using ani.onFinish so that
     * multiple onFinish callbacks do not get
     * run if an animation is played, stopped,
     * and then played again.
     */
    if (ani.getDirection() === 'reverse') {
      ani.direction('normal');
    }
  }

  private _isActive() {
    return !this.disabled && !this.isPaneVisible;
  }

  private canSwipe(): boolean {
    return this.swipeGesture && !this.isAnimating && this._isActive();
  }

  private canStart(detail: GestureDetail): boolean {
    // Do not allow swipe gesture if a modal is open
    const isModalPresented = !!document.querySelector('ion-modal.show-modal');
    if (isModalPresented || !this.canSwipe()) {
      return false;
    }
    if (this._isOpen) {
      return true;
    } else if (menuController._getOpenSync()) {
      return false;
    }
    return checkEdgeSide(window, detail.currentX, this.isEndSide, this.maxEdgeStart);
  }

  private onWillStart(): Promise<void> {
    this.beforeAnimation(!this._isOpen);
    return this.loadAnimation();
  }

  private onStart() {
    if (!this.isAnimating || !this.animation) {
      assert(false, 'isAnimating has to be true');
      return;
    }

    // the cloned animation should not use an easing curve during seek
    (this.animation as Animation).progressStart(true, this._isOpen ? 1 : 0);
  }

  private onMove(detail: GestureDetail) {
    if (!this.isAnimating || !this.animation) {
      assert(false, 'isAnimating has to be true');
      return;
    }

    const delta = computeDelta(detail.deltaX, this._isOpen, this.isEndSide);
    const stepValue = delta / this.width;

    this.animation.progressStep(this._isOpen ? 1 - stepValue : stepValue);
  }

  private onEnd(detail: GestureDetail) {
    if (!this.isAnimating || !this.animation) {
      assert(false, 'isAnimating has to be true');
      return;
    }
    const isOpen = this._isOpen;
    const isEndSide = this.isEndSide;
    const delta = computeDelta(detail.deltaX, isOpen, isEndSide);
    const width = this.width;
    const stepValue = delta / width;
    const velocity = detail.velocityX;
    const z = width / 2.0;
    const shouldCompleteRight = velocity >= 0 && (velocity > 0.2 || detail.deltaX > z);

    const shouldCompleteLeft = velocity <= 0 && (velocity < -0.2 || detail.deltaX < -z);

    const shouldComplete = isOpen
      ? isEndSide
        ? shouldCompleteRight
        : shouldCompleteLeft
      : isEndSide
      ? shouldCompleteLeft
      : shouldCompleteRight;

    let shouldOpen = !isOpen && shouldComplete;
    if (isOpen && !shouldComplete) {
      shouldOpen = true;
    }

    this.lastOnEnd = detail.currentTime;

    // Account for rounding errors in JS
    let newStepValue = shouldComplete ? 0.001 : -0.001;

    /**
     * stepValue can sometimes return a negative
     * value, but you can't have a negative time value
     * for the cubic bezier curve (at least with web animations)
     */
    const adjustedStepValue = stepValue < 0 ? 0.01 : stepValue;

    /**
     * Animation will be reversed here, so need to
     * reverse the easing curve as well
     *
     * Additionally, we need to account for the time relative
     * to the new easing curve, as `stepValue` is going to be given
     * in terms of a linear curve.
     */
    newStepValue +=
      getTimeGivenProgression([0, 0], [0.4, 0], [0.6, 1], [1, 1], clamp(0, adjustedStepValue, 0.9999))[0] || 0;

    const playTo = this._isOpen ? !shouldComplete : shouldComplete;

    this.animation
      .easing('cubic-bezier(0.4, 0.0, 0.6, 1)')
      .onFinish(() => this.afterAnimation(shouldOpen), { oneTimeCallback: true })
      .progressEnd(playTo ? 1 : 0, this._isOpen ? 1 - newStepValue : newStepValue, 300);
  }

  private beforeAnimation(shouldOpen: boolean) {
    assert(!this.isAnimating, '_before() should not be called while animating');

    // this places the menu into the correct location before it animates in
    // this css class doesn't actually kick off any animations
    this.el.classList.add(SHOW_MENU);

    /**
     * We add a tabindex here so that focus trapping
     * still works even if the menu does not have
     * any focusable elements slotted inside. The
     * focus trapping utility will fallback to focusing
     * the menu so focus does not leave when the menu
     * is open.
     */
    this.el.setAttribute('tabindex', '0');
    if (this.backdropEl) {
      this.backdropEl.classList.add(SHOW_BACKDROP);
    }

    // add css class and hide content behind menu from screen readers
    if (this.contentEl) {
      this.contentEl.classList.add(MENU_CONTENT_OPEN);

      /**
       * When the menu is open and overlaying the main
       * content, the main content should not be announced
       * by the screenreader as the menu is the main
       * focus. This is useful with screenreaders that have
       * "read from top" gestures that read the entire
       * page from top to bottom when activated.
       * This should be done before the animation starts
       * so that users cannot accidentally scroll
       * the content while dragging a menu open.
       */
      this.contentEl.setAttribute('aria-hidden', 'true');
    }

    this.blocker.block();
    this.isAnimating = true;
    if (shouldOpen) {
      this.ionWillOpen.emit();
    } else {
      this.ionWillClose.emit();
    }
  }

  private afterAnimation(isOpen: boolean) {
    // keep opening/closing the menu disabled for a touch more yet
    // only add listeners/css if it's enabled and isOpen
    // and only remove listeners/css if it's not open
    // emit opened/closed events
    this._isOpen = isOpen;
    this.isAnimating = false;
    if (!this._isOpen) {
      this.blocker.unblock();
    }

    if (isOpen) {
      // emit open event
      this.ionDidOpen.emit();

      /**
       * Move focus to the menu to prepare focus trapping, as long as
       * it isn't already focused. Use the host element instead of the
       * first descendant to avoid the scroll position jumping around.
       */
      const focusedMenu = document.activeElement?.closest('ion-menu');
      if (focusedMenu !== this.el) {
        this.el.focus();
      }

      // start focus trapping
      document.addEventListener('focus', this.handleFocus, true);
    } else {
      // remove css classes and unhide content from screen readers
      this.el.classList.remove(SHOW_MENU);

      /**
       * Remove tabindex from the menu component
       * so that is cannot be tabbed to.
       */
      this.el.removeAttribute('tabindex');
      if (this.contentEl) {
        this.contentEl.classList.remove(MENU_CONTENT_OPEN);

        /**
         * Remove aria-hidden so screen readers
         * can announce the main content again
         * now that the menu is not the main focus.
         */
        this.contentEl.removeAttribute('aria-hidden');
      }

      if (this.backdropEl) {
        this.backdropEl.classList.remove(SHOW_BACKDROP);
      }

      if (this.animation) {
        this.animation.stop();
      }

      // emit close event
      this.ionDidClose.emit();

      // undo focus trapping so multiple menus don't collide
      document.removeEventListener('focus', this.handleFocus, true);
    }
  }

  private updateState() {
    const isActive = this._isActive();
    if (this.gesture) {
      this.gesture.enable(isActive && this.swipeGesture);
    }

    /**
     * If the menu is disabled but it is still open
     * then we should close the menu immediately.
     * Additionally, if the menu is in the process
     * of animating {open, close} and the menu is disabled
     * then it should still be closed immediately.
     */
    if (!isActive) {
      /**
       * It is possible to disable the menu while
       * it is mid-animation. When this happens, we
       * need to set the operationCancelled flag
       * so that this._setOpen knows to return false
       * and not run the "afterAnimation" callback.
       */
      if (this.isAnimating) {
        this.operationCancelled = true;
      }

      /**
       * If the menu is disabled then we should
       * forcibly close the menu even if it is open.
       */
      this.afterAnimation(false);
    }
  }

  render() {
    const { type, disabled, isPaneVisible, inheritedAttributes, side } = this;
    const mode = getIonMode(this);

    return (
      <Host
        role="navigation"
        aria-label={inheritedAttributes['aria-label'] || 'menu'}
        class={{
          [mode]: true,
          [`menu-type-${type}`]: true,
          'menu-enabled': !disabled,
          [`menu-side-${side}`]: true,
          'menu-pane-visible': isPaneVisible,
        }}
      >
        <div class="menu-inner" part="container" ref={(el) => (this.menuInnerEl = el)}>
          <slot></slot>
        </div>

        <ion-backdrop
          ref={(el) => (this.backdropEl = el)}
          class="menu-backdrop"
          tappable={false}
          stopPropagation={false}
          part="backdrop"
        />
      </Host>
    );
  }
}

const computeDelta = (deltaX: number, isOpen: boolean, isEndSide: boolean): number => {
  return Math.max(0, isOpen !== isEndSide ? -deltaX : deltaX);
};

const checkEdgeSide = (win: Window, posX: number, isEndSide: boolean, maxEdgeStart: number): boolean => {
  if (isEndSide) {
    return posX >= win.innerWidth - maxEdgeStart;
  } else {
    return posX <= maxEdgeStart;
  }
};

const SHOW_MENU = 'show-menu';
const SHOW_BACKDROP = 'show-backdrop';
const MENU_CONTENT_OPEN = 'menu-content-open';
