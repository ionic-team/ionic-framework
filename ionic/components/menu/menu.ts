import {Component, forwardRef, Directive, Host, EventEmitter, ElementRef, NgZone, Input, Output, Renderer} from 'angular2/core';

import {Ion} from '../ion';
import {Config} from '../../config/config';
import {Platform} from '../../platform/platform';
import {Keyboard} from '../../util/keyboard';
import {MenuContentGesture, MenuTargetGesture} from  './menu-gestures';
import {Gesture} from '../../gestures/gesture';
import {MenuController} from './menu-controller';
import {MenuType} from './menu-types';
import {isFalseProperty} from '../../util/util';


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
  private _cntGesture: Gesture;
  private _menuGesture: Gesture;
  private _type: MenuType;
  private _resizeUnreg: Function;


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

    // add the gesture listeners
    self._zone.runOutsideAngular(function() {
      self._cntGesture = new MenuContentGesture(self, self.getContentElement());
      self._menuGesture = new MenuTargetGesture(self, self.getNativeElement());

      self.onContentClick = function(ev: UIEvent) {
        if (self.isEnabled) {
          ev.preventDefault();
          ev.stopPropagation();
          self.close();
        }
      };
    });

    if (isFalseProperty(self.swipeEnabled)) {
      self.isSwipeEnabled = false;
    }

    self._cntEle.classList.add('menu-content');
    self._cntEle.classList.add('menu-content-' + self.type);

    // register this menu with the app's menu controller
    self._menuCtrl.register(self);
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
  setOpen(shouldOpen): Promise<boolean> {
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
  setProgressStart() {
    // user started swiping the menu open/close
    if (this._isPrevented() || !this.isEnabled || !this.isSwipeEnabled) return;

    this._before();
    this._getType().setProgressStart(this.isOpen);
  }

  /**
   * @private
   */
  setProgessStep(stepValue: number) {
    // user actively dragging the menu
    if (this.isEnabled && this.isSwipeEnabled) {
      this._prevent();
      this._getType().setProgessStep(stepValue);
      this.opening.next(stepValue);
    }
  }

  /**
   * @private
   */
  setProgressEnd(shouldComplete: boolean, currentStepValue: number) {
    // user has finished dragging the menu
    if (this.isEnabled && this.isSwipeEnabled) {
      this._prevent();
      this._getType().setProgressEnd(shouldComplete, currentStepValue, (isOpen) => {
        console.debug('menu, progress end', this.side);
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
  private _after(isOpen: boolean) {
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
   * left menus, but only one of them should be able to be dragged open.
   * @param {boolean} shouldEnable  True if it should be enabled, false if not.
   * @return {Menu}  Returns the instance of the menu, which is useful for chaining.
   */
  enable(shouldEnable: boolean): Menu {
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
  swipeEnable(shouldEnable: boolean): Menu {
    this.isSwipeEnabled = shouldEnable;
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
