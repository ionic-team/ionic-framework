import {Component, forwardRef, Directive, Host, EventEmitter, ElementRef, NgZone, Input, Output, Renderer} from 'angular2/core';

import {Ion} from '../ion';
import {Config} from '../../config/config';
import {Platform} from '../../platform/platform';
import {Keyboard} from '../../util/keyboard';
import {MenuContentGesture, MenuTargetGesture} from  './menu-gestures';
import {MenuController} from './menu-controller';
import {MenuType} from './menu-types';
import {isTrueProperty} from '../../util/util';


/**
 * @private
 */
@Component({
  selector: 'ion-menu',
  host: {
    'role': 'navigation'
  },
  template:
    '<ng-content></ng-content>' +
    '<div tappable disable-activated class="backdrop"></div>',
  directives: [forwardRef(() => MenuBackdrop)]
})
export class Menu extends Ion {
  private _preventTime: number = 0;
  private _cntEle: HTMLElement;
  private _cntGesture: MenuTargetGesture;
  private _menuGesture: MenuContentGesture;
  private _type: MenuType;
  private _resizeUnreg: Function;
  private _isEnabled: boolean = true;
  private _isSwipeEnabled: boolean = true;
  private _isPers: boolean = false;
  private _init: boolean = false;

  /**
   * @private
   */
  isOpen: boolean = false;

  /**
   * @private
   */
  backdrop: MenuBackdrop;

  /**
   * @private
   */
  onContentClick: EventListener;

  /**
   * @private
   */
  @Input() content: any;

  /**
   * @private
   */
  @Input() id: string;

  /**
   * @private
   */
  @Input() side: string;

  /**
   * @private
   */
  @Input() type: string;

  /**
   * @private
   */
  @Input()
  get enabled(): boolean {
    return this._isEnabled;
  }

  set enabled(val: boolean) {
    this._isEnabled = isTrueProperty(val);
    this._setListeners();
  }

  /**
   * @private
   */
  @Input()
  get swipeEnabled(): boolean {
    return this._isSwipeEnabled;
  }

  set swipeEnabled(val: boolean) {
    this._isSwipeEnabled = isTrueProperty(val);
    this._setListeners();
  }

  /**
   * @private
   */
  @Input()
  get persistent(): boolean {
    return this._isPers;
  }

  set persistent(val: boolean) {
    this._isPers = isTrueProperty(val);
  }

  /**
   * @private
   */
  @Input() maxEdgeStart: number;

  /**
   * @private
   */
  @Output() opening: EventEmitter<number> = new EventEmitter();

  constructor(
    private _menuCtrl: MenuController,
    private _elementRef: ElementRef,
    private _config: Config,
    private _platform: Platform,
    private _renderer: Renderer,
    private _keyboard: Keyboard,
    private _zone: NgZone
  ) {
    super(_elementRef);
  }

  /**
   * @private
   */
  ngOnInit() {
    let self = this;
    self._init = true;

    let content = self.content;
    self._cntEle = (content instanceof Node) ? content : content && content.getNativeElement && content.getNativeElement();

    // requires content element
    if (!self._cntEle) {
      return console.error('Menu: must have a [content] element to listen for drag events on. Example:\n\n<ion-menu [content]="content"></ion-menu>\n\n<ion-nav #content></ion-nav>');
    }

    // normalize the "side"
    if (self.side !== 'left' && self.side !== 'right') {
      self.side = 'left';
    }
    self._renderer.setElementAttribute(self._elementRef.nativeElement, 'side', self.side);

    // normalize the "type"
    if (!self.type) {
      self.type = self._config.get('menuType');
    }
    self._renderer.setElementAttribute(self._elementRef.nativeElement, 'type', self.type);

    // add the gestures
    self._cntGesture = new MenuContentGesture(self, self.getContentElement());
    self._menuGesture = new MenuTargetGesture(self, self.getNativeElement());

    // register listeners if this menu is enabled
    // check if more than one menu is on the same side
    let hasEnabledSameSideMenu = self._menuCtrl.getMenus().some(m => {
      return m.side === self.side && m.enabled;
    });
    if (hasEnabledSameSideMenu) {
      // auto-disable if another menu on the same side is already enabled
      self._isEnabled = false;
    }
    self._setListeners();

    // create a reusable click handler on this instance, but don't assign yet
    self.onContentClick = function(ev: UIEvent) {
      if (self._isEnabled) {
        ev.preventDefault();
        ev.stopPropagation();
        self.close();
      }
    };

    self._cntEle.classList.add('menu-content');
    self._cntEle.classList.add('menu-content-' + self.type);

    // register this menu with the app's menu controller
    self._menuCtrl.register(self);
  }

  /**
   * @private
   */
  private _setListeners() {
    let self = this;

    if (self._init) {
      // only listen/unlisten if the menu has initialized

      if (self._isEnabled && self._isSwipeEnabled && !self._cntGesture.isListening) {
        // should listen, but is not currently listening
        console.debug('menu, gesture listen', self.side);
        self._zone.runOutsideAngular(function() {
          self._cntGesture.listen();
          self._menuGesture.listen();
        });

      } else if (self._cntGesture.isListening && (!self._isEnabled || !self._isSwipeEnabled)) {
        // should not listen, but is currently listening
        console.debug('menu, gesture unlisten', self.side);
        self._cntGesture.unlisten();
        self._menuGesture.unlisten();
      }
    }
  }

  /**
   * @private
   */
  private _getType(): MenuType {
    if (!this._type) {
      this._type = MenuController.create(this.type, this);

      if (this._config.get('animate') === false) {
        this._type.ani.duration(0);
      }
    }
    return this._type;
  }

  /**
   * Sets the state of the Menu to open or not.
   * @param {boolean} shouldOpen  If the Menu is open or not.
   * @return {Promise} returns a promise once set
   */
  setOpen(shouldOpen: boolean): Promise<boolean> {
    // _isPrevented is used to prevent unwanted opening/closing after swiping open/close
    // or swiping open the menu while pressing down on the menuToggle button
    if ((shouldOpen && this.isOpen) || this._isPrevented()) {
      return Promise.resolve(this.isOpen);
    }

    this._before();

    return new Promise(resolve => {
      this._getType().setOpen(shouldOpen, () => {
        this._after(shouldOpen);
        resolve(this.isOpen);
      });
    });
  }

  /**
   * @private
   */
  swipeStart() {
    // user started swiping the menu open/close
    if (this._isPrevented() || !this._isEnabled || !this._isSwipeEnabled) return;

    this._before();
    this._getType().setProgressStart(this.isOpen);
  }

  /**
   * @private
   */
  swipeProgress(stepValue: number) {
    // user actively dragging the menu
    if (this._isEnabled && this._isSwipeEnabled) {
      this._prevent();
      this._getType().setProgessStep(stepValue);
      this.opening.next(stepValue);
    }
  }

  /**
   * @private
   */
  swipeEnd(shouldComplete: boolean, currentStepValue: number) {
    // user has finished dragging the menu
    if (this._isEnabled && this._isSwipeEnabled) {
      this._prevent();
      this._getType().setProgressEnd(shouldComplete, currentStepValue, (isOpen) => {
        console.debug('menu, swipeEnd', this.side);
        this._after(isOpen);
      });
    }
  }

  /**
   * @private
   */
  private _before() {
    // this places the menu into the correct location before it animates in
    // this css class doesn't actually kick off any animations
    if (this._isEnabled) {
      this.getNativeElement().classList.add('show-menu');
      this.getBackdropElement().classList.add('show-backdrop');

      this._prevent();
      this._keyboard.close();
    }
  }

  /**
   * @private
   */
  private _after(isOpen: boolean) {
    // keep opening/closing the menu disabled for a touch more yet
    // only add listeners/css if it's enabled and isOpen
    // and only remove listeners/css if it's not open
    if ((this._isEnabled && isOpen) || !isOpen) {
      this._prevent();

      this.isOpen = isOpen;

      this._cntEle.classList[isOpen ? 'add' : 'remove']('menu-content-open');

      this._cntEle.removeEventListener('click', this.onContentClick);

      if (isOpen) {
        this._cntEle.addEventListener('click', this.onContentClick);

      } else {
        this.getNativeElement().classList.remove('show-menu');
        this.getBackdropElement().classList.remove('show-backdrop');
      }
    }
  }

  /**
   * @private
   */
  private _prevent() {
    // used to prevent unwanted opening/closing after swiping open/close
    // or swiping open the menu while pressing down on the menuToggle
    this._preventTime = Date.now() + 20;
  }

  /**
   * @private
   */
  private _isPrevented() {
    return this._preventTime > Date.now();
  }

  /**
   * Progamatically open the Menu.
   * @return {Promise} returns a promise when the menu is fully opened.
   */
  open() {
    return this.setOpen(true);
  }

  /**
   * Progamatically close the Menu.
   * @return {Promise} returns a promise when the menu is fully closed.
   */
  close() {
    return this.setOpen(false);
  }

  /**
   * Toggle the menu. If it's closed, it will open, and if opened, it will close.
   * @return {Promise} returns a promise when the menu has been toggled.
   */
  toggle() {
    return this.setOpen(!this.isOpen);
  }

  /**
   * Used to enable or disable a menu. For example, there could be multiple
   * left menus, but only one of them should be able to be opened at the same
   * time. If there are multiple menus on the same side, then enabling one menu
   * will also automatically disable all the others that are on the same side.
   * @param {boolean} shouldEnable  True if it should be enabled, false if not.
   * @return {Menu}  Returns the instance of the menu, which is useful for chaining.
   */
  enable(shouldEnable: boolean): Menu {
    this.enabled = shouldEnable;
    if (!shouldEnable && this.isOpen) {
      // close if this menu is open, and should not be enabled
      this.close();
    }

    if (shouldEnable) {
      // if this menu should be enabled
      // then find all the other menus on this same side
      // and automatically disable other same side menus
      let sameSideMenus = this._menuCtrl
                            .getMenus()
                            .filter(m => m.side === this.side && m !== this)
                            .map(m => m.enabled = false);
    }

    return this;
  }

  /**
   * Used to enable or disable the ability to swipe open the menu.
   * @param {boolean} shouldEnable  True if it should be swipe-able, false if not.
   * @return {Menu}  Returns the instance of the menu, which is useful for chaining.
   */
  swipeEnable(shouldEnable: boolean): Menu {
    this.swipeEnabled = shouldEnable;
    return this;
  }

  /**
   * @private
   */
  getMenuElement(): HTMLElement {
    return this.getNativeElement();
  }

  /**
   * @private
   */
  getContentElement(): HTMLElement {
    return this._cntEle;
  }

  /**
   * @private
   */
  getBackdropElement(): HTMLElement {
    return this.backdrop.elementRef.nativeElement;
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._menuCtrl.unregister(this);
    this._cntGesture && this._cntGesture.destroy();
    this._menuGesture && this._menuGesture.destroy();
    this._type && this._type.destroy();
    this._resizeUnreg && this._resizeUnreg();
    this._cntEle = null;
  }

}



/**
 * @private
 */
@Directive({
  selector: '.backdrop',
  host: {
    '(click)': 'clicked($event)',
  }
})
export class MenuBackdrop {

  constructor(@Host() private _menuCtrl: Menu, public elementRef: ElementRef) {
    _menuCtrl.backdrop = this;
  }

  /**
   * @private
   */
  private clicked(ev) {
    console.debug('backdrop clicked');
    ev.preventDefault();
    ev.stopPropagation();
    this._menuCtrl.close();
  }
}
