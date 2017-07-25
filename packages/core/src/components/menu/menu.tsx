import { Component, Element, Event, EventEmitter, Prop, PropDidChange } from '@stencil/core';
import { MenuController } from './menu-controller';
import { MenuType } from './menu-types';


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
  @Element() private el: HTMLElement;
  private _backdropElm: HTMLElement;
  private _ctrl: MenuController;
  private _unregCntClick: Function;
  private _unregBdClick: Function;
  private _activeBlock: string;

  private _cntElm: HTMLElement;
  private _type: MenuType;
  private _init = false;
  private _isPane = false;

  mode: string;
  color: string;

  @Event() ionDrag: EventEmitter;
  @Event() ionOpen: EventEmitter;
  @Event() ionClose: EventEmitter;

  /**
   * @hidden
   */
  @Prop() isOpen: boolean = false;

  /**
   * @hidden
   */
  @Prop() isAnimating: boolean = false;

  /**
   * @hidden
   */
  isRightSide: boolean = false;

  /**
   * @input {any} A reference to the content element the menu should use.
   */
  @Prop() content: any;

  /**
   * @input {string} An id for the menu.
   */
  @Prop() id: string;

  /**
   * @input {string} The display type of the menu. Default varies based on the mode,
   * see the `menuType` in the [config](../../config/Config). Available options:
   * `"overlay"`, `"reveal"`, `"push"`.
   */
  @Prop() type: string;

  /**
   * @input {boolean} If true, the menu is enabled. Default `true`.
   */
  @Prop() enabled: boolean;

  /**
   * @input {string} Which side of the view the menu should be placed. Default `"start"`.
   */
  @Prop() side: string = 'start';

  /**
   * @input {boolean} If true, swiping the menu is enabled. Default `true`.
   */
  @Prop() swipeEnabled: boolean;

  @PropDidChange('swipeEnabled')
  swipeEnabledChange(isEnabled: boolean) {
    this.swipeEnable(isEnabled);
  }

  /**
   * @input {boolean} If true, the menu will persist on child pages.
   */
  @Prop() persistent: boolean = false;

  /**
   * @hidden
   */
  @Prop() maxEdgeStart: number;


  constructor() {
    // get or create the MenuController singleton
    this._ctrl = Ionic.controllers.menu = (Ionic.controllers.menu || new MenuController());
  }


  /**
   * @hidden
   */
  ionViewDidLoad() {
    this._backdropElm = this.el.querySelector('.menu-backdrop') as HTMLElement;

    this._init = true;

    if (this.content) {
      if ((this.content).tagName as HTMLElement) {
        this._cntElm = this.content;
      } else if (typeof this.content === 'string') {
        this._cntElm = document.querySelector(this.content) as any;
      }
    }

    if (!this._cntElm || !this._cntElm.tagName) {
      // requires content element
      return console.error('Menu: must have a "content" element to listen for drag events on.');
    }

    // add menu's content classes
    this._cntElm.classList.add('menu-content');
    this._cntElm.classList.add('menu-content-' + this.type);

    let isEnabled = this.enabled;
    if (isEnabled === true || typeof isEnabled === 'undefined') {
      // check if more than one menu is on the same side
      isEnabled = !this._ctrl.getMenus().some(m => {
        return m.side === this.side && m.enabled;
      });
    }
    // register this menu with the app's menu controller
    this._ctrl._register(this);

    // mask it as enabled / disabled
    this.enable(isEnabled);
  }

  hostData() {
    return {
      attrs: {
        'role': 'navigation',
        'side': this.side,
        'type': this.type
      },
      class: {
        'menu-enabled': this.enabled
      }
    };
  }

  render() {
    // normalize the "type"
    if (!this.type) {
      this.type = Ionic.config.get('menuType', 'overlay');
    }

    return [
      <div class='menu-inner'>
        <slot></slot>
      </div>,
      <ion-gesture class='menu-backdrop' props={{
        // 'canStart': this.canStart.bind(this),
        // 'onStart': this.onDragStart.bind(this),
        // 'onMove': this.onDragMove.bind(this),
        // 'onEnd': this.onDragEnd.bind(this),
        'gestureName': 'menu-swipe',
        'gesturePriority': 10,
        'type': 'pan',
        'direction': 'x',
        'threshold': 5,
        'attachTo': 'body',
        'disableScroll': true,
        'block': this._activeBlock
      }}></ion-gesture>
    ];
  }

  /**
   * @hidden
   */
  onBackdropClick(ev: UIEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this._ctrl.close();
  }

  /**
   * @hidden
   */
  private _getType(): MenuType {
    if (!this._type) {
      this._type = this._ctrl.create(this.type, this);

      if (Ionic.config.getBoolean('animate') === false) {
        this._type.ani.duration(0);
      }
    }
    return this._type;
  }

  /**
   * @hidden
   */
  setOpen(shouldOpen: boolean, animated: boolean = true): Promise<boolean> {
    // If the menu is disabled or it is currenly being animated, let's do nothing
    if ((shouldOpen === this.isOpen) || !this._canOpen() || this.isAnimating) {
      return Promise.resolve(this.isOpen);
    }
    return new Promise(resolve => {
      this._before();
      this._getType().setOpen(shouldOpen, animated, () => {
        this._after(shouldOpen);
        resolve(this.isOpen);
      });
    });
  }

  _forceClosing() {
    this.isAnimating = true;
    this._getType().setOpen(false, false, () => {
      this._after(false);
    });
  }

  /**
   * @hidden
   */
  canSwipe(): boolean {
    return this.swipeEnabled &&
      !this.isAnimating &&
      this._canOpen();
      // TODO: && this._app.isEnabled();
  }


  _swipeBeforeStart() {
    if (!this.canSwipe()) {
      return;
    }
    this._before();
  }

  _swipeStart() {
    if (!this.isAnimating) {
      return;
    }

    this._getType().setProgressStart(this.isOpen);
  }

  _swipeProgress(stepValue: number) {
    if (!this.isAnimating) {
      return;
    }

    this._getType().setProgessStep(stepValue);

    this.ionDrag.emit({ menu: this });
  }

  _swipeEnd(shouldCompleteLeft: boolean, shouldCompleteRight: boolean, stepValue: number, velocity: number) {
    if (!this.isAnimating) {
      return;
    }

    // user has finished dragging the menu
    const isRightSide = this.isRightSide;
    const opening = !this.isOpen;
    const shouldComplete = (opening)
    ? isRightSide ? shouldCompleteLeft : shouldCompleteRight
    : isRightSide ? shouldCompleteRight : shouldCompleteLeft;

    this._getType().setProgressEnd(shouldComplete, stepValue, velocity, (isOpen: boolean) => {
      console.debug('menu, swipeEnd', this.side);
      this._after(isOpen);
    });
  }

  private _before() {
    // this places the menu into the correct location before it animates in
    // this css class doesn't actually kick off any animations
    this.el.classList.add('show-menu');
    this._backdropElm.classList.add('show-backdrop');

    this.resize();

    // TODO: this._keyboard.close();

    this.isAnimating = true;
  }

  private _after(isOpen: boolean) {
    // TODO: this._app.setEnabled(false, 100);

    // keep opening/closing the menu disabled for a touch more yet
    // only add listeners/css if it's enabled and isOpen
    // and only remove listeners/css if it's not open
    // emit opened/closed events
    this.isOpen = isOpen;
    this.isAnimating = false;

    // add/remove backdrop click listeners
    this._backdropClick(isOpen);

    if (isOpen) {
      // disable swipe to go back gesture
      this._activeBlock = GESTURE_BLOCKER;

      // add css class
      Core.dom.write(() => {
        this._cntElm.classList.add('menu-content-open');
      });

      // emit open event
      this.ionOpen.emit({ menu: this });

    } else {
      // enable swipe to go back gesture
      this._activeBlock = null;

      // remove css classes
      Core.dom.write(() => {
        this._cntElm.classList.remove('menu-content-open');
        this._cntElm.classList.remove('show-menu');
        this._backdropElm.classList.remove('show-menu');
      });

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

  /**
   * @hidden
   */
  toggle(): Promise<boolean> {
    return this.setOpen(!this.isOpen);
  }

  _canOpen(): boolean {
    return this.enabled && !this._isPane;
  }

  /**
   * @hidden
   */
  _updateState() {
    const canOpen = this._canOpen();

    // Close menu inmediately
    if (!canOpen && this.isOpen) {
      // close if this menu is open, and should not be enabled
      this._forceClosing();
    }

    if (this.enabled && this._ctrl) {
      this._ctrl._setActiveMenu(this);
    }

    if (!this._init) {
      return;
    }

    // TODO
    // const gesture = this._gesture;
    // // only listen/unlisten if the menu has initialized
    // if (canOpen && this.swipeEnabled && !gesture.isListening) {
    //   // should listen, but is not currently listening
    //   console.debug('menu, gesture listen', this.side);
    //   gesture.listen();

    // } else if (gesture.isListening && (!canOpen || !this.swipeEnabled)) {
    //   // should not listen, but is currently listening
    //   console.debug('menu, gesture unlisten', this.side);
    //   gesture.unlisten();
    // }

    if (this.isOpen || (this._isPane && this.enabled)) {
      this.resize();
    }
  }

  /**
   * @hidden
   */
  enable(shouldEnable: boolean): Menu {
    this.enabled = shouldEnable;
    this._updateState();
    return this;
  }

  /**
   * @internal
   */
  initPane(): boolean {
    return false;
  }

  /**
   * @internal
   */
  paneChanged(isPane: boolean) {
    this._isPane = isPane;
    this._updateState();
  }

  /**
   * @hidden
   */
  swipeEnable(shouldEnable: boolean): Menu {
    this.swipeEnabled = shouldEnable;
    this._updateState();
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
    return this._backdropElm;
  }

  /**
   * @hidden
   */
  width(): number {
    return this.getMenuElement().offsetWidth;
  }

  /**
   * @hidden
   */
  getMenuController(): MenuController {
    return this._ctrl;
  }

  private _backdropClick(shouldAdd: boolean) {
    const onBackdropClick = this.onBackdropClick.bind(this);

    if (shouldAdd && !this._unregBdClick) {
      this._unregBdClick = Core.addListener(this._cntElm, 'click', onBackdropClick, { capture: true });
      this._unregCntClick = Core.addListener(this._cntElm, 'click', onBackdropClick, { capture: true });

    } else if (!shouldAdd && this._unregBdClick) {
      this._unregBdClick();
      this._unregCntClick();
      this._unregBdClick = this._unregCntClick = null;
    }
  }

  /**
   * @hidden
   */
  ionViewDidUnload() {
    this._backdropClick(false);

    this._ctrl._unregister(this);
    this._type && this._type.destroy();

    this._ctrl = this._type = this._cntElm = this._backdropElm = null;
  }

}

const GESTURE_BLOCKER = 'goback-swipe';
