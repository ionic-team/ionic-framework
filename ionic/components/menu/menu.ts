import {Component, forwardRef, Directive, Host, EventEmitter, ElementRef, NgZone, Input, Output, Renderer} from 'angular2/core';

import {Ion} from '../ion';
import {Config} from '../../config/config';
import {Platform} from '../../platform/platform';
import {Keyboard} from '../../util/keyboard';
import * as gestures from  './menu-gestures';
import {Gesture} from '../../gestures/gesture';
import {MenuController} from './menu-controller';
import {MenuType} from './menu-types';


/**
 * @private
 */
@Component({
  selector: 'ion-menu',
  host: {
    'role': 'navigation',
    '[attr.side]': 'side',
    '[attr.type]': 'type',
    '[attr.swipeEnabled]': 'swipeEnabled'
  },
  template: '<ng-content></ng-content><div tappable disable-activated class="backdrop"></div>',
  directives: [forwardRef(() => MenuBackdrop)]
})
export class Menu extends Ion {
  private _preventTime: number = 0;
  private _cntEle: HTMLElement;
  private _gesture: Gesture;
  private _targetGesture: Gesture;
  private _type: MenuType;


  /**
   * @private
   */
  isOpen: boolean = false;

  /**
   * @private
   */
  isEnabled: boolean = true;

  /**
   * @private
   */
  isSwipeEnabled: boolean = true;

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
  @Input() swipeEnabled: any;

  /**
   * @private
   */
  @Input() maxEdgeStart;

  /**
   * @private
   */
  @Output() opening: EventEmitter<any> = new EventEmitter();

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
    let content = self.content;
    self._cntEle = (content instanceof Node) ? content : content && content.getNativeElement && content.getNativeElement();

    if (!self._cntEle) {
      return console.error('Menu: must have a [content] element to listen for drag events on. Example:\n\n<ion-menu [content]="content"></ion-menu>\n\n<ion-nav #content></ion-nav>');
    }

    if (self.side !== 'left' && self.side !== 'right') {
      self.side = 'left';
    }
    self._renderer.setElementAttribute(self._elementRef.nativeElement, 'side', self.side);

    if (self.swipeEnabled === 'false') {
      self.isSwipeEnabled = false;
    }

    this._menuCtrl.register(self);

    self._initGesture();
    self._initType(self.type);

    self._cntEle.classList.add('menu-content');
    self._cntEle.classList.add('menu-content-' + self.type);

    self.onContentClick = function(ev: UIEvent) {
      if (self.isEnabled) {
        ev.preventDefault();
        ev.stopPropagation();
        self.close();
      }
    };
  }

  /**
   * @private
   */
  private _initGesture() {
    this._zone.runOutsideAngular(() => {
      switch(this.side) {
        case 'right':
          this._gesture = new gestures.RightMenuGesture(this);
          break;

        case 'left':
          this._gesture = new gestures.LeftMenuGesture(this);
          break;
      }
      this._targetGesture = new gestures.TargetGesture(this);
    });
  }

  /**
   * @private
   */
  private _initType(type) {
    type = type && type.trim().toLowerCase();
    if (!type) {
      type = this._config.get('menuType');
    }
    this.type = type;
    this._renderer.setElementAttribute(this._elementRef.nativeElement, 'menuType', type);
  }

  /**
   * @private
   */
  private _getType() {
    if (!this._type) {
      this._type = MenuController.create(this.type, this);

      if (this._config.get('animate') === false) {
        this._type.open.duration(33);
        this._type.close.duration(33);
      }
    }
    return this._type;
  }

  /**
   * Sets the state of the Menu to open or not.
   * @param {boolean} shouldOpen  If the Menu is open or not.
   * @return {Promise} returns a promise once set
   */
  setOpen(shouldOpen) {
    // _isPrevented is used to prevent unwanted opening/closing after swiping open/close
    // or swiping open the menu while pressing down on the menuToggle button
    if ((shouldOpen && this.isOpen) || this._isPrevented()) {
      return Promise.resolve();
    }

    this._before();

    return this._getType().setOpen(shouldOpen).then(() => {
      this._after(shouldOpen);
    });
  }

  /**
   * @private
   */
  setProgressStart() {
    // user started swiping the menu open/close
    if (this._isPrevented() || !this.isEnabled || !this.isSwipeEnabled) return;

    this._before();

    this._getType().setProgressStart(this.isOpen);
  }

  /**
   * @private
   */
  setProgess(value) {
    // user actively dragging the menu
    if (this.isEnabled && this.isSwipeEnabled) {
      this._prevent();
      this._getType().setProgess(value);
      this.opening.next(value);
    }
  }

  /**
   * @private
   */
  setProgressEnd(shouldComplete) {
    // user has finished dragging the menu
    if (this.isEnabled && this.isSwipeEnabled) {
      this._prevent();
      this._getType().setProgressEnd(shouldComplete).then(isOpen => {
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
    if (this.isEnabled) {
      this.getNativeElement().classList.add('show-menu');
      this.getBackdropElement().classList.add('show-backdrop');

      this._prevent();
      this._keyboard.close();
    }
  }

  /**
   * @private
   */
  private _after(isOpen) {
    // keep opening/closing the menu disabled for a touch more yet
    // only add listeners/css if it's enabled and isOpen
    // and only remove listeners/css if it's not open
    if ((this.isEnabled && isOpen) || !isOpen) {
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
   * Progamatically open the Menu
   * @return {Promise} returns a promise when the menu is fully opened
   */
  open() {
    return this.setOpen(true);
  }

  /**
   * Progamatically close the Menu
   * @return {Promise} returns a promise when the menu is fully closed
   */
  close() {
    return this.setOpen(false);
  }

  /**
   * Toggle the menu. If it's closed, it will open, and if opened, it will close
   * @return {Promise} returns a promise when the menu has been toggled
   */
  toggle() {
    return this.setOpen(!this.isOpen);
  }

  /**
   * Used to enable or disable a menu. For example, there could be multiple
   * left menus, but only one of them should be able to be dragged open.
   * @param {boolean} shouldEnable  True if it should be enabled, false if not.
   * @return {Menu}  Returns the instance of the menu, which is useful for chaining.
   */
  enable(shouldEnable: boolean) {
    this.isEnabled = shouldEnable;
    if (!shouldEnable && this.isOpen) {
      this.close();
    }
    return this;
  }

  /**
   * Used to enable or disable the ability to swipe open the menu.
   * @param {boolean} shouldEnable  True if it should be swipe-able, false if not.
   * @return {Menu}  Returns the instance of the menu, which is useful for chaining.
   */
  swipeEnable(shouldEnable: boolean) {
    this.isSwipeEnabled = shouldEnable;
    return this;
  }

  /**
   * @private
   */
  getMenuElement() {
    return this.getNativeElement();
  }

  /**
   * @private
   */
  getContentElement() {
    return this._cntEle;
  }

  /**
   * @private
   */
  getBackdropElement() {
    return this.backdrop.elementRef.nativeElement;
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._menuCtrl.unregister(this);
    this._gesture && this._gesture.destroy();
    this._targetGesture && this._targetGesture.destroy();
    this._type && this._type.ngOnDestroy();
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
