import { Component, Element, Event, EventEmitter, Listen, Prop, PropDidChange } from '@stencil/core';
import { Animation, Config, SplitPaneAlert } from '../../index';
import { MenuController } from './menu-controller';
import { Side, assert, checkEdgeSide, isRightSide } from '../../utils/helpers';

export type Lazy<T> = T &
  { componentOnReady(): Promise<T> } &
  { componentOnReady(done: (cmp: T) => void): void };

@Component({
  tag: 'ion-menu',
  styleUrls: {
    ios: 'menu.ios.scss',
    md: 'menu.md.scss',
    wp: 'menu.wp.scss'
  },
  host: {
    theme: 'menu'
  }
})
export class Menu {

  private _backdropEle: HTMLElement;
  private _menuInnerEle: HTMLElement;
  private _unregCntClick: Function;
  private _unregBdClick: Function;
  private _activeBlock: string;

  private _cntElm: HTMLElement;
  private _animation: Animation;
  private _init = false;
  private _isPane = false;
  private _isAnimating: boolean = false;
  private _isOpen: boolean = false;
  private _width: number = null;

  mode: string;
  color: string;

  /**
   * @hidden
   */
  isRightSide: boolean = false;

  @Element() private el: HTMLElement;

  @Event() ionDrag: EventEmitter;
  @Event() ionOpen: EventEmitter;
  @Event() ionClose: EventEmitter;

  @Prop({ context: 'config' }) config: Config;

  @Prop({ connect: 'ion-menu-controller' }) lazyMenuCtrl: Lazy<MenuController>;
  menuCtrl: MenuController;

  /**
   * @input {string} The content's id the menu should use.
   */
  @Prop() content: string;

  /**
   * @input {string} An id for the menu.
   */
  @Prop() menuId: string;

  /**
   * @input {string} The display type of the menu. Default varies based on the mode,
   * see the `menuType` in the [config](../../config/Config). Available options:
   * `"overlay"`, `"reveal"`, `"push"`.
   */
  @Prop() type: string = 'overlay';

  /**
   * @input {boolean} If true, the menu is enabled. Default `true`.
   */
  @Prop({ mutable: true }) enabled: boolean;

  /**
   * @input {string} Which side of the view the menu should be placed. Default `"start"`.
   */
  @Prop() side: Side = 'start';

  /**
   * @input {boolean} If true, swiping the menu is enabled. Default `true`.
   */
  @Prop() swipeEnabled: boolean = true;

  /**
   * @input {boolean} If true, the menu will persist on child pages.
   */
  @Prop() persistent: boolean = false;

  /**
   * @hidden
   */
  @Prop() maxEdgeStart: number = 50;


  // @PropDidChange('side')
  // sideChanged(side: Side) {
  //   // TODO: const isRTL = this._plt.isRTL;
  //   const isRTL = false;
  //   // this.isRightSide = isRightSide(side, isRTL);
  // }
  @Listen('body:ionSplitPaneDidChange')
  splitPaneChanged(ev: SplitPaneAlert) {
    this._isPane = ev.detail.splitPane.isPane(this.el);
    this._updateState();
  }

  @PropDidChange('enabled')
  enabledChanged() {
    this._updateState();
  }

  @PropDidChange('swipeEnabled')
  swipeEnabledChange() {
    this._updateState();
  }

  protected ionViewWillLoad() {
    return this.lazyMenuCtrl.componentOnReady()
      .then(menu => this.menuCtrl = menu);
  }

  /**
   * @hidden
   */
  protected ionViewDidLoad() {
    assert(!!this.menuCtrl, 'menucontroller was not initialized');

    this._menuInnerEle = this.el.querySelector('.menu-inner') as HTMLElement;
    this._backdropEle = this.el.querySelector('.menu-backdrop') as HTMLElement;

    const contentQuery = (this.content)
      ? '> #' + this.content
      : '[main]';
    const parent = this.el.parentElement;
    const content = this._cntElm = parent.querySelector(contentQuery) as HTMLElement;
    if (!content || !content.tagName) {
      // requires content element
      return console.error('Menu: must have a "content" element to listen for drag events on.');
    }
    // TODO: make PropDidChange work
    this.isRightSide = isRightSide(this.side, false);

    // add menu's content classes
    content.classList.add('menu-content');
    content.classList.add('menu-content-' + this.type);

    let isEnabled = this.enabled;
    if (isEnabled === true || typeof isEnabled === 'undefined') {
      const menus = this.menuCtrl.getMenus();
      isEnabled = !menus.some(m => {
        return m.side === this.side && m.enabled;
      });
    }
    // register this menu with the app's menu controller
    this.menuCtrl._register(this);

    // mask it as enabled / disabled
    this.enable(isEnabled);
    this._init = true;
  }

  hostData() {
    return {
      'role': 'navigation',
      'side': this.getSide(),
      'type': this.type,
      class: {
        'menu-enabled': this._canOpen()
      }
    };
  }

  getSide(): string {
    return this.isRightSide ? 'right' : 'left';
  }

  protected render() {
    return ([
      <div class='menu-inner'>
        <slot></slot>
      </div>,
      <ion-backdrop class='menu-backdrop'></ion-backdrop> ,
      <ion-gesture {...{
        'canStart': this.canStart.bind(this),
        'onWillStart': this._swipeWillStart.bind(this),
        'onStart': this._swipeStart.bind(this),
        'onMove': this._swipeProgress.bind(this),
        'onEnd': this._swipeEnd.bind(this),
        'maxEdgeStart': this.maxEdgeStart,
        'edge': this.side,
        'enabled': this._canOpen() && this.swipeEnabled,
        'gestureName': 'menu-swipe',
        'gesturePriority': 10,
        'type': 'pan',
        'direction': 'x',
        'threshold': 10,
        'attachTo': 'body',
        'disableScroll': true,
        'block': this._activeBlock
      }}></ion-gesture>
    ]);
  }

  /**
   * @hidden
   */
  onBackdropClick(ev: UIEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this.close();
  }

  /**
   * @hidden
   */
  private prepareAnimation(): Promise<void> {
    const width = this._menuInnerEle.offsetWidth;
    if (width === this._width) {
      return Promise.resolve();
    }
    if (this._animation) {
      this._animation.destroy();
      this._animation = null;
    }
    this._width = width;
    return this.menuCtrl.create(this.type, this).then(ani => {
      this._animation = ani;
    });
  }

  /**
   * @hidden
   */
  setOpen(shouldOpen: boolean, animated: boolean = true): Promise<boolean> {
    // If the menu is disabled or it is currenly being animated, let's do nothing
    if ((shouldOpen === this._isOpen) || !this._canOpen() || this._isAnimating) {
      return Promise.resolve(this._isOpen);
    }
    this._before();
    return this.prepareAnimation()
      .then(() => this._startAnimation(shouldOpen, animated))
      .then(() => {
        this._after(shouldOpen);
        return this._isOpen;
      });
  }

  _startAnimation(shouldOpen: boolean, animated: boolean): Promise<Animation> {
    let done;
    const promise = new Promise<Animation>(resolve => done = resolve);
    const ani = this._animation
      .onFinish(done, {oneTimeCallback: true, clearExistingCallacks: true })
      .reverse(!shouldOpen);

    if (animated) {
      ani.play();
    } else {
      ani.syncPlay();
    }

    return promise;
  }

  _forceClosing() {
    assert(this._isOpen, 'menu cannot be closed');

    this._isAnimating = true;
    this._startAnimation(false, false);
    this._after(false);
  }

  getWidth(): number {
    return this._width;
  }

  /**
   * @hidden
   */
  canSwipe(): boolean {
    return this.swipeEnabled &&
      !this._isAnimating &&
      this._canOpen();
      // TODO: && this._app.isEnabled();
  }

  /**
   * @hidden
   */
  isAnimating(): boolean {
    return this._isAnimating;
  }

  /**
   * @hidden
   */
  isOpen(): boolean {
    return this._isOpen;
  }

  _swipeWillStart(): Promise<void> {
    this._before();
    return this.prepareAnimation();
  }

  _swipeStart() {
    assert(!!this._animation, '_type is undefined');
    if (!this._isAnimating) {
      assert(false, '_isAnimating has to be true');
      return;
    }

    // the cloned animation should not use an easing curve during seek
    this._animation
      .reverse(this._isOpen)
      .progressStart();
  }

  _swipeProgress(slide: any) {
    assert(!!this._animation, '_type is undefined');
    if (!this._isAnimating) {
      assert(false, '_isAnimating has to be true');
      return;
    }

    const delta = computeDelta(slide.deltaX, this._isOpen, this.isRightSide);
    const stepValue = delta / this._width;
    this._animation.progressStep(stepValue);
  }

  _swipeEnd(slide: any) {
    assert(!!this._animation, '_type is undefined');
    if (!this._isAnimating) {
      assert(false, '_isAnimating has to be true');
      return;
    }
    const isRightSide = this.isRightSide;
    const delta = computeDelta(slide.deltaX, this._isOpen, isRightSide);
    const width = this._width;
    const stepValue = delta / width;
    const velocity = slide.velocityX;
    const z = width / 2;
    const shouldCompleteRight = (velocity >= 0)
      && (velocity > 0.2 || slide.deltaX > z);

    const shouldCompleteLeft = (velocity <= 0)
      && (velocity < -0.2 || slide.deltaX < -z);

    const opening = !this._isOpen;
    const shouldComplete = (opening)
    ? isRightSide ? shouldCompleteLeft : shouldCompleteRight
    : isRightSide ? shouldCompleteRight : shouldCompleteLeft;

    let isOpen = (opening && shouldComplete);
    if (!opening && !shouldComplete) {
      isOpen = true;
    }

    const missing = shouldComplete ? 1 - stepValue : stepValue;
    const missingDistance = missing * width;
    let realDur = 0;
    if (missingDistance > 5) {
      const dur = missingDistance / Math.abs(velocity);
      realDur = Math.min(dur, 380);
    }

    this._animation
      .onFinish(() => this._after(isOpen), { clearExistingCallacks: true })
      .progressEnd(shouldComplete, stepValue, realDur);
  }

  private _before() {
    assert(!this._isAnimating, '_before() should not be called while animating');

    // this places the menu into the correct location before it animates in
    // this css class doesn't actually kick off any animations
    this.el.classList.add('show-menu');
    this._backdropEle.classList.add('show-backdrop');

    this.resize();
    this._isAnimating = true;
  }

  private _after(isOpen: boolean) {
    assert(this._isAnimating, '_before() should be called while animating');

    // TODO: this._app.setEnabled(false, 100);

    // keep opening/closing the menu disabled for a touch more yet
    // only add listeners/css if it's enabled and isOpen
    // and only remove listeners/css if it's not open
    // emit opened/closed events
    this._isOpen = isOpen;
    this._isAnimating = false;

    // add/remove backdrop click listeners
    this._backdropClick(isOpen);

    if (isOpen) {
      // disable swipe to go back gesture
      this._activeBlock = GESTURE_BLOCKER;

      // add css class
      this._cntElm.classList.add('menu-content-open');

      // emit open event
      this.ionOpen.emit({ menu: this });

    } else {
      // enable swipe to go back gesture
      this._activeBlock = null;

      // remove css classes
      this.el.classList.remove('show-menu');
      this._cntElm.classList.remove('menu-content-open');
      this._backdropEle.classList.remove('show-menu');

      // emit close event
      this.ionClose.emit({ menu: this });
    }
  }

  /**
   * @hidden
   */
  open(): Promise<boolean> {
    return this.setOpen(true);
  }

  /**
   * @hidden
   */
  close(): Promise<boolean> {
    return this.setOpen(false);
  }

  /**
   * @hidden
   */
  resize() {
    // TODO
    // const content: Content | Nav = this.menuContent
    //   ? this.menuContent
    //   : this.menuNav;
    // content && content.resize();
  }

  canStart(detail: any): boolean {
    if (!this.canSwipe()) {
      return false;
    }
    if (this._isOpen) {
      return true;
    } else if (this.getMenuController().getOpen()) {
      return false;
    }
    return checkEdgeSide(detail.currentX, this.isRightSide, this.maxEdgeStart);
  }

  /**
   * @hidden
   */
  toggle(): Promise<boolean> {
    return this.setOpen(!this._isOpen);
  }

  _canOpen(): boolean {
    return this.enabled && !this._isPane;
  }

  /**
   * @hidden
   */
  // @PropDidChange('swipeEnabled')
  // @PropDidChange('enabled')
  _updateState() {
    const canOpen = this._canOpen();

    // Close menu inmediately
    if (!canOpen && this._isOpen) {
      assert(this._init, 'menu must be initialized');
      // close if this menu is open, and should not be enabled
      this._forceClosing();
    }

    if (this.enabled && this.menuCtrl) {
      this.menuCtrl._setActiveMenu(this);
    }

    if (!this._init) {
      return;
    }

    if (this._isOpen || (this._isPane && this.enabled)) {
      this.resize();
    }
    assert(!this._isAnimating, 'can not be animating');
  }

  /**
   * @hidden
   */
  enable(shouldEnable: boolean): Menu {
    this.enabled = shouldEnable;
    return this;
  }

  /**
   * @internal
   */
  initPane(): boolean {
    return false;
  }

  /**
   * @hidden
   */
  swipeEnable(shouldEnable: boolean): Menu {
    this.swipeEnabled = shouldEnable;
    return this;
  }

  /**
   * @hidden
   */
  getMenuElement(): HTMLElement {
    return this.el.querySelector('.menu-inner') as HTMLElement;
  }

  /**
   * @hidden
   */
  getContentElement(): HTMLElement {
    return this._cntElm;
  }

  /**
   * @hidden
   */
  getBackdropElement(): HTMLElement {
    return this._backdropEle;
  }

  /**
   * @hidden
   */
  getMenuController(): MenuController {
    return this.menuCtrl;
  }

  private _backdropClick(shouldAdd: boolean) {
    const onBackdropClick = this.onBackdropClick.bind(this);

    if (shouldAdd && !this._unregBdClick) {
      this._unregBdClick = Context.addListener(this._backdropEle, 'click', onBackdropClick, { capture: true });
      this._unregCntClick = Context.addListener(this._backdropEle, 'click', onBackdropClick, { capture: true });

    } else if (!shouldAdd && this._unregBdClick) {
      this._unregBdClick();
      this._unregCntClick();
      this._unregBdClick = this._unregCntClick = null;
    }
  }

  /**
   * @hidden
   */
  protected ionViewDidUnload() {
    this._backdropClick(false);

    this.menuCtrl._unregister(this);
    this._animation && this._animation.destroy();

    this.menuCtrl = this._animation = this._cntElm = this._backdropEle = null;
  }

}

function computeDelta(deltaX: number, isOpen: boolean, isRightSide: boolean): number {
  return Math.max(0, (isOpen !== isRightSide) ? -deltaX : deltaX);
}

const GESTURE_BLOCKER = 'goback-swipe';
