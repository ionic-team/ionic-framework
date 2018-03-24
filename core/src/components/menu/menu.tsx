import { Component, Element, Event, EventEmitter, EventListenerEnable, Listen, Method, Prop, State, Watch } from '@stencil/core';
import { Animation, Config, GestureDetail } from '../../index';
import { Side, assert, isRightSide } from '../../utils/helpers';

@Component({
  tag: 'ion-menu',
  styleUrls: {
    ios: 'menu.ios.scss',
    md: 'menu.md.scss'
  },
  host: {
    theme: 'menu'
  }
})
export class Menu {

  private animation: Animation|undefined;
  private isPane = false;
  private _isOpen = false;
  private lastOnEnd = 0;

  mode: string;
  color: string;
  isAnimating = false;
  width: number;

  backdropEl: HTMLElement|undefined;
  menuInnerEl: HTMLElement|undefined;
  contentEl: HTMLElement|undefined;
  menuCtrl: HTMLIonMenuControllerElement|undefined;

  @Element() el: HTMLIonMenuElement;

  @State() isRightSide = false;

  @Prop({ context: 'config' }) config: Config;
  @Prop({ connect: 'ion-menu-controller' }) lazyMenuCtrl: HTMLIonMenuControllerElement;
  @Prop({ context: 'enableListener' }) enableListener: EventListenerEnable;

  /**
   * The content's id the menu should use.
   */
  @Prop() contentId: string;

  /**
   * An id for the menu.
   */
  @Prop() menuId: string;

  /**
   * The display type of the menu. Default varies based on the mode,
   * see the `menuType` in the [config](../../config/Config). Available options:
   * `"overlay"`, `"reveal"`, `"push"`.
   */
  @Prop({ mutable: true }) type = 'overlay';

  @Watch('type')
  typeChanged(type: string, oldType: string | null) {
    const contentEl = this.contentEl;
    if (contentEl && oldType) {
      contentEl.classList.remove(`menu-content-${oldType}`);
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
   * If true, the menu is disabled. Default `false`.
   */
  @Prop({ mutable: true }) disabled = false;

  @Watch('disabled')
  protected disabledChanged(disabled: boolean) {
    this.updateState();
    this.ionMenuChange.emit({ disabled: disabled, open: this._isOpen});
  }

  /**
   * Which side of the view the menu should be placed. Default `"start"`.
   */
  @Prop() side: Side = 'start';

  @Watch('side')
  protected sideChanged() {
    this.isRightSide = isRightSide(this.side);
  }

  /**
   * If true, swiping the menu is enabled. Default `true`.
   */
  @Prop() swipeEnabled = true;

  @Watch('swipeEnabled')
  protected swipeEnabledChanged() {
    this.updateState();
  }

  /**
   * If true, the menu will persist on child pages.
   */
  @Prop() persistent = false;

  @Prop() maxEdgeStart = 50;

  /**
   * Emitted when the menu is open.
   */
  @Event() ionOpen: EventEmitter;

  /**
   * Emitted when the menu is closed.
   */
  @Event() ionClose: EventEmitter;


  @Event() protected ionMenuChange: EventEmitter<MenuChangeEventDetail>;

  async componentWillLoad() {
    this.menuCtrl = await this.lazyMenuCtrl.componentOnReady();
  }

  componentDidLoad() {
    assert(!!this.menuCtrl, 'menucontroller was not initialized');

    const el = this.el;

    const content = (this.contentId)
      ? document.getElementById(this.contentId)
      : el.parentElement.querySelector('[main]');

    if (!content || !content.tagName) {
      // requires content element
      return console.error('Menu: must have a "content" element to listen for drag events on.');
    }
    this.contentEl = content as HTMLElement;

    // add menu's content classes
    content.classList.add('menu-content');

    this.typeChanged(this.type, null);
    this.sideChanged();

    let isEnabled = !this.disabled;
    if (isEnabled === true || typeof isEnabled === 'undefined') {
      const menus = this.menuCtrl.getMenus();
      isEnabled = !menus.some(m => {
        return m.side === this.side && !m.disabled;
      });
    }
    // register this menu with the app's menu controller
    this.menuCtrl._register(this);
    this.ionMenuChange.emit({ disabled: !isEnabled, open: this._isOpen});

    // mask it as enabled / disabled
    this.disabled = !isEnabled;
  }

  componentDidUnload() {
    this.menuCtrl._unregister(this);
    this.animation && this.animation.destroy();

    this.menuCtrl = this.animation = undefined;
    this.contentEl = this.backdropEl = this.menuInnerEl = undefined;
  }

  @Listen('body:ionSplitPaneVisible')
  splitPaneChanged(ev: CustomEvent) {
    this.isPane = (ev.target as any).isPane(this.el);
    this.updateState();
  }

  @Listen('body:click', { enabled: false, capture: true })
  onBackdropClick(ev: UIEvent) {
    const el = ev.target as HTMLElement;
    if (!el.closest('.menu-inner') && this.lastOnEnd < (ev.timeStamp - 100)) {
      ev.preventDefault();
      ev.stopPropagation();
      this.close();
    }
  }

  @Method()
  isOpen(): boolean {
    return this._isOpen;
  }

  @Method()
  open(animated = true): Promise<boolean> {
    return this.setOpen(true, animated);
  }

  @Method()
  close(animated = true): Promise<boolean> {
    return this.setOpen(false, animated);
  }

  @Method()
  toggle(animated = true): Promise<boolean> {
    return this.setOpen(!this._isOpen, animated);
  }

  @Method()
  setOpen(shouldOpen: boolean, animated = true): Promise<boolean> {
    return this.menuCtrl._setOpen(this, shouldOpen, animated);
  }

  async _setOpen(shouldOpen: boolean, animated = true): Promise<boolean> {
    // If the menu is disabled or it is currenly being animated, let's do nothing
    if (!this.isActive() || this.isAnimating || (shouldOpen === this._isOpen)) {
      return this._isOpen;
    }

    this.beforeAnimation();
    await this.loadAnimation();
    await this.startAnimation(shouldOpen, animated);
    await this.afterAnimation(shouldOpen);
    return shouldOpen;
  }

  @Method()
  isActive(): boolean {
    return !this.disabled && !this.isPane;
  }

  private async loadAnimation(): Promise<void> {
    // Menu swipe animation takes the menu's inner width as parameter,
    // If `offsetWidth` changes, we need to create a new animation.
    const width = this.menuInnerEl.offsetWidth;
    if (width === this.width && this.animation !== null) {
      return;
    }
    this.width = width;

    // Destroy existing animation
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }
    // Create new animation
    this.animation = await this.menuCtrl.createAnimation(this.type, this);
  }

  private startAnimation(shouldOpen: boolean, animated: boolean): Promise<Animation> {
    const ani = this.animation.reverse(!shouldOpen);
    if (animated) {
      return ani.playAsync();
    } else {
      ani.playSync();
      return Promise.resolve(ani);
    }
  }

  private canSwipe(): boolean {
    return this.swipeEnabled &&
      !this.isAnimating &&
      this.isActive();
  }

  private canStart(detail: GestureDetail): boolean {
    if (!this.canSwipe()) {
      return false;
    }
    if (this._isOpen) {
      return true;
    } else if (this.menuCtrl.getOpen()) {
      return false;
    }
    return checkEdgeSide(detail.currentX, this.isRightSide, this.maxEdgeStart);
  }

  private onWillStart(): Promise<void> {
    this.beforeAnimation();
    return this.loadAnimation();
  }

  private onDragStart() {
    assert(!!this.animation, '_type is undefined');
    if (!this.isAnimating) {
      assert(false, 'isAnimating has to be true');
      return;
    }

    // the cloned animation should not use an easing curve during seek
    this.animation
      .reverse(this._isOpen)
      .progressStart();
  }

  private onDragMove(detail: GestureDetail) {
    assert(!!this.animation, '_type is undefined');
    if (!this.isAnimating) {
      assert(false, 'isAnimating has to be true');
      return;
    }

    const delta = computeDelta(detail.deltaX, this._isOpen, this.isRightSide);
    const stepValue = delta / this.width;
    this.animation.progressStep(stepValue);
  }

  private onDragEnd(detail: GestureDetail) {
    assert(!!this.animation, '_type is undefined');
    if (!this.isAnimating) {
      assert(false, 'isAnimating has to be true');
      return;
    }
    const isOpen = this._isOpen;
    const isRightSide = this.isRightSide;
    const delta = computeDelta(detail.deltaX, isOpen, isRightSide);
    const width = this.width;
    const stepValue = delta / width;
    const velocity = detail.velocityX;
    const z = width / 2.0;
    const shouldCompleteRight = (velocity >= 0)
      && (velocity > 0.2 || detail.deltaX > z);

    const shouldCompleteLeft = (velocity <= 0)
      && (velocity < -0.2 || detail.deltaX < -z);

    const shouldComplete = (isOpen)
      ? isRightSide ? shouldCompleteRight : shouldCompleteLeft
      : isRightSide ? shouldCompleteLeft : shouldCompleteRight;

    let shouldOpen = (!isOpen && shouldComplete);
    if (isOpen && !shouldComplete) {
      shouldOpen = true;
    }

    const missing = shouldComplete ? 1 - stepValue : stepValue;
    const missingDistance = missing * width;
    let realDur = 0;
    if (missingDistance > 5) {
      const dur = missingDistance / Math.abs(velocity);
      realDur = Math.min(dur, 300);
    }

    this.lastOnEnd = detail.timeStamp;
    this.animation
      .onFinish(() => this.afterAnimation(shouldOpen), { clearExistingCallacks: true })
      .progressEnd(shouldComplete, stepValue, realDur);
  }

  private beforeAnimation() {
    assert(!this.isAnimating, '_before() should not be called while animating');

    // this places the menu into the correct location before it animates in
    // this css class doesn't actually kick off any animations
    this.el.classList.add(SHOW_MENU);
    this.backdropEl.classList.add(SHOW_BACKDROP);
    this.isAnimating = true;
  }

  private afterAnimation(isOpen: boolean) {
    assert(this.isAnimating, '_before() should be called while animating');

    // keep opening/closing the menu disabled for a touch more yet
    // only add listeners/css if it's enabled and isOpen
    // and only remove listeners/css if it's not open
    // emit opened/closed events
    this._isOpen = isOpen;
    this.isAnimating = false;

    // add/remove backdrop click listeners
    this.enableListener(this, 'body:click', isOpen);

    if (isOpen) {
      // add css class
      this.contentEl.classList.add(MENU_CONTENT_OPEN);

      // emit open event
      this.ionOpen.emit();

    } else {
      // remove css classes
      this.el.classList.remove(SHOW_MENU);
      this.contentEl.classList.remove(MENU_CONTENT_OPEN);
      this.backdropEl.classList.remove(SHOW_BACKDROP);

      // emit close event
      this.ionClose.emit();
    }
  }

  private updateState() {
    const isActive = this.isActive();

    // Close menu inmediately
    if (!isActive && this._isOpen) {
      // close if this menu is open, and should not be enabled
      this.forceClosing();
    }

    if (!this.disabled && this.menuCtrl) {
      this.menuCtrl._setActiveMenu(this);
    }
    assert(!this.isAnimating, 'can not be animating');
  }

  private forceClosing() {
    assert(this._isOpen, 'menu cannot be closed');

    this.isAnimating = true;
    this.startAnimation(false, false);
    this.afterAnimation(false);
  }

  hostData() {
    const isRightSide = this.isRightSide;
    return {
      role: 'complementary',
      class: {
        [`menu-type-${this.type}`]: true,
        'menu-enabled': !this.disabled,
        'menu-side-right': isRightSide,
        'menu-side-left': !isRightSide,
      }
    };
  }

  render() {
    return ([
      <div class='menu-inner' ref={el => this.menuInnerEl = el}>
        <slot></slot>
      </div>,

      <ion-backdrop
        ref={el => this.backdropEl = el}
        class='menu-backdrop'
        tappable={false}
        stopPropagation={false}/>,

      <ion-gesture {...{
        'canStart': this.canStart.bind(this),
        'onWillStart': this.onWillStart.bind(this),
        'onStart': this.onDragStart.bind(this),
        'onMove': this.onDragMove.bind(this),
        'onEnd': this.onDragEnd.bind(this),
        'maxEdgeStart': this.maxEdgeStart,
        'edge': this.side,
        'disabled': !this.isActive() || !this.swipeEnabled,
        'gestureName': 'menu-swipe',
        'gesturePriority': 10,
        'type': 'pan',
        'direction': 'x',
        'threshold': 10,
        'attachTo': 'window',
        'disableScroll': true,
      }}/>
    ]);
  }
}

function computeDelta(deltaX: number, isOpen: boolean, isRightSide: boolean): number {
  return Math.max(0, (isOpen !== isRightSide) ? -deltaX : deltaX);
}

function checkEdgeSide(posX: number, isRightSide: boolean, maxEdgeStart: number): boolean {
  if (isRightSide) {
    return posX >= window.innerWidth - maxEdgeStart;
  } else {
    return posX <= maxEdgeStart;
  }
}

const SHOW_MENU = 'show-menu';
const SHOW_BACKDROP = 'show-backdrop';
const MENU_CONTENT_OPEN = 'menu-content-open';

export interface MenuChangeEvent {
  target: HTMLIonMenuElement;
  detail: MenuChangeEventDetail;
}

export interface MenuChangeEventDetail {
  disabled: boolean;
  open: boolean;
}
