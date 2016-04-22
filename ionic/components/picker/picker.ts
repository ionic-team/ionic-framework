import {Component, ElementRef, Input, ViewChild, Renderer, HostListener, ChangeDetectionStrategy, ViewEncapsulation} from 'angular2/core';
import {NgClass, NgIf, NgFor} from 'angular2/common';

import {Animation} from '../../animations/animation';
import {Transition, TransitionOptions} from '../../transitions/transition';
import {Config} from '../../config/config';
import {isPresent} from '../../util/util';
import {NavParams} from '../nav/nav-params';
import {ViewController} from '../nav/view-controller';
import {raf, CSS, pointerCoord} from '../../util/dom';



/**
 * @name Picker
 * @description
 *
 * @usage
 * ```ts
 * constructor(private nav: NavController) {}
 *
 * presentSelector() {
 *   let picker = Picker.create({
 *
 *   });
 *   this.nav.present(picker);
 * }
 *
 * ```
 *
 */
export class Picker extends ViewController {

  constructor(opts: PickerOptions = {}) {
    opts.columns = opts.columns || [];
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;

    super(PickerDisplayCmp, opts);
    this.viewType = 'picker';
    this.isOverlay = true;

    // by default, pickers should not fire lifecycle events of other views
    // for example, when an picker enters, the current active view should
    // not fire its lifecycle events because it's not conceptually leaving
    this.fireOtherLifecycles = false;
    this.usePortal = true;
  }

  /**
  * @private
  */
  getTransitionName(direction: string) {
    let key = (direction === 'back' ? 'pickerLeave' : 'pickerEnter');
    return this._nav && this._nav.config.get(key);
  }

  /**
   * @param {string} cssClass CSS class name to add to the picker's outer wrapper.
   */
  setCssClass(cssClass: string) {
    this.data.cssClass = cssClass;
  }

  static create(opts: PickerOptions = {}) {
    return new Picker(opts);
  }

}



/**
 * @private
 */
@Component({
  selector: '.picker-column',
  template:
    '<div class="picker-offset">' +
      '<div *ngIf="col.prefix" class="picker-prefix">{{col.prefix}}</div>' +
      '<div class="picker-options" #colEle>' +
        '<div *ngFor="#o of col.options" class="picker-option">' +
          '{{o.text}}' +
        '</div>' +
      '</div>' +
      '<div *ngIf="col.suffix" class="picker-suffix">{{col.suffix}}</div>' +
    '</div>',
  host: {
    '[style.flex]': 'col.flex',
    '(touchstart)': 'pointerStart($event)',
    '(touchmove)': 'pointerMove($event)',
    '(touchend)': 'pointerEnd($event)',
    '(mousedown)': 'pointerStart($event)',
    '(mousemove)': 'pointerMove($event)',
    '(mouseup)': 'pointerEnd($event)',
  }
})
class PickerColumnCmp {
  @ViewChild('colEle') colEle: ElementRef;
  @Input() col: PickerColumn;
  y: number;
  colHeight: number;
  optHeight: number;
  velocity: number;
  pos: number[] = [];
  scrollingDown: boolean;
  msPrv: number = 0;
  startY: number = null;

  ngAfterViewInit() {
    let colEle: HTMLElement = this.colEle.nativeElement;

    this.colHeight = colEle.clientHeight;
    this.optHeight = (colEle.firstElementChild ? colEle.firstElementChild.clientHeight : 0);

    this.setY(0, true);
  }

  pointerStart(ev) {
    if (this.isPrevented(ev)) {
      return;
    }

    this.startY = pointerCoord(ev).y;

    this.velocity = 0;
    this.pos.length = 0;
    this.pos.push(this.startY, Date.now());

    console.debug('picker, pointerStart', ev.type, this.startY);
  }

  pointerMove(ev) {
    if (this.startY !== null) {
      if (this.isPrevented(ev)) {
        return;
      }

      let currentY = pointerCoord(ev).y;
      console.debug('picker, pointerMove', ev.type, currentY);

      this.pos.push(currentY, Date.now());
      this.setY(this.startY + currentY, false);
    }
  }

  pointerEnd(ev) {
    if (this.startY !== null) {

      if (this.isPrevented(ev)) {
        return;
      }

      var endY = pointerCoord(ev).y;

      console.debug('picker, pointerEnd', ev.type, endY);

      this.pos.push(endY, Date.now());
      this.velocity = 0;
      this.scrollingDown = (endY < this.startY);

      var endPos = (this.pos.length - 1);
      var startPos = endPos;
      var timeRange = (Date.now() - 100);

      // move pointer to position measured 100ms ago
      for (var i = endPos; i > 0 && this.pos[i] > timeRange; i -= 2) {
        startPos = i;
      }

      if (startPos !== endPos) {
        // compute relative movement between these two points
        var timeOffset = (this.pos[endPos] - this.pos[startPos]);
        var movedTop = (this.pos[startPos - 1] - this.pos[endPos - 1]);

        // based on XXms compute the movement to apply for each render step
        this.velocity = ((movedTop / timeOffset) * FRAME_MS);
      }

      this.setY(this.startY + endY, true);

      this.decelerate();

      this.startY = null;
    }
  }

  decelerate() {
    var self = this;

    if (self.velocity) {
      self.velocity *= DECELERATION_FRICTION;
      console.log(`decelerate velocity ${self.velocity}`);

      var y = self.y + self.velocity;
      self.setY(y, true);

      raf(self.decelerate.bind(self));

    } else if (self.y % this.optHeight !== 0) {

      self.y = self.y + (this.scrollingDown ? -1 : 1);

      console.log(`lock in ${self.y}`);

      self.setY(self.y, true);

      raf(self.decelerate.bind(self));
    }
  }

  setY(yOffset: number, saveY: boolean) {
    let y = yOffset + this.y;

    console.log(`y: ${y}, yOffset: ${yOffset}, colHeight: ${this.colHeight}, optHeight: ${this.optHeight}`);

    let colEleStyle = this.colEle.nativeElement.style;
    colEleStyle[CSS.transform] = `translate3d(0px,${y}px,0px)`;

    if (saveY) {
      this.y = y;
    }
  }

  isPrevented(ev) {
    if (ev.type.indexOf('touch') > -1) {
      this.msPrv = Date.now() + 2000;

    } else if (this.msPrv > Date.now() && ev.type.indexOf('mouse') > -1) {
      ev.preventDefault();
      ev.stopPropagation();
      return true;
    }
  }

}


/**
 * @private
 */
@Component({
  selector: 'ion-picker-cmp',
  template:
    '<div (click)="bdClick()" tappable disable-activated class="backdrop" role="presentation"></div>' +
    '<div class="picker-wrapper">' +
      '<div class="picker-toolbar">' +
        '<div *ngFor="#b of d.buttons" class="picker-toolbar-button" [ngClass]="b.cssRole">' +
          '<button (click)="btnClick(b)" [ngClass]="b.cssClass" class="picker-button">' +
            '{{b.text}}' +
            '<ion-button-effect></ion-button-effect>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="picker-columns">' +
        '<div *ngFor="#c of d.columns" [col]="c" class="picker-column"></div>' +
      '</div>' +
    '</div>',
  host: {
    'role': 'dialog'
  },
  directives: [NgClass, NgIf, NgFor, PickerColumnCmp],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
class PickerDisplayCmp {
  private d: PickerOptions;
  private created: number;
  private lastClick: number;
  private id: number;

  constructor(
    private _viewCtrl: ViewController,
    private _elementRef: ElementRef,
    private _config: Config,
    params: NavParams,
    renderer: Renderer
  ) {
    this.d = params.data;

    if (this.d.cssClass) {
      this.d.cssClass.split(' ').forEach(cssClass => {
        renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
      });
    }

    this.id = (++pickerIds);
    this.created = Date.now();
    this.lastClick = 0;
  }

  onPageLoaded() {
    // normalize the data
    let data = this.d;

    data.buttons = data.buttons.map(button => {
      if (typeof button === 'string') {
        return { text: button };
      }
      if (button.role) {
        button.cssRole = `picker-toolbar-${button.role}`;
      }
      return button;
    });

    data.columns = data.columns.map(column => {
      if (!column.flex) {
        column.flex = 1;
      }
      return column;
    });
  }

  @HostListener('body:keyup', ['$event'])
  private _keyUp(ev: KeyboardEvent) {
    if (this.isEnabled() && this._viewCtrl.isLast()) {
      if (ev.keyCode === 13) {
        if (this.lastClick + 1000 < Date.now()) {
          // do not fire this click if there recently was already a click
          // this can happen when the button has focus and used the enter
          // key to click the button. However, both the click handler and
          // this keyup event will fire, so only allow one of them to go.
          console.debug('picker, enter button');
          let button = this.d.buttons[this.d.buttons.length - 1];
          this.btnClick(button);
        }

      } else if (ev.keyCode === 27) {
        console.debug('picker, escape button');
        this.bdClick();
      }
    }
  }

  onPageDidEnter() {
    let activeElement: any = document.activeElement;
    if (activeElement) {
      activeElement.blur();
    }

    let focusableEle = this._elementRef.nativeElement.querySelector('button');
    if (focusableEle) {
      focusableEle.focus();
    }
  }

  btnClick(button, dismissDelay?) {
    if (!this.isEnabled()) {
      return;
    }

    // keep the time of the most recent button click
    this.lastClick = Date.now();

    let shouldDismiss = true;

    if (button.handler) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      if (button.handler(this.getValues()) === false) {
        // if the return value of the handler is false then do not dismiss
        shouldDismiss = false;
      }
    }

    if (shouldDismiss) {
      setTimeout(() => {
        this.dismiss(button.role);
      }, dismissDelay || this._config.get('pageTransitionDelay'));
    }
  }

  bdClick() {
    if (this.isEnabled() && this.d.enableBackdropDismiss) {
      this.dismiss('backdrop');
    }
  }

  dismiss(role): Promise<any> {
    return this._viewCtrl.dismiss(this.getValues(), role);
  }

  getValues() {
    // this is an alert with text inputs
    // return an object of all the values with the input name as the key
    let values = {};
    this.d.columns.forEach(col => {
      values[col.name] = col.value;
    });
    return values;
  }

  isEnabled() {
    let tm = this._config.getNumber('overlayCreatedDiff', 750);
    return (this.created + tm < Date.now());
  }
}

export interface PickerOptions {
  buttons?: any[];
  columns?: PickerColumn[];
  cssClass?: string;
  enableBackdropDismiss?: boolean;
}

export interface PickerColumn {
  name?: string;
  value?: string;
  prefix?: string;
  suffix?: string;
  options: PickerColumnOption[];
  flex?: number;
  cssClass?: string;
}

export interface PickerColumnOption {
  value?: string;
  text?: string;
  checked?: boolean;
  id?: string;
}


/**
 * Animations for pickers
 */
class PickerSlideIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.picker-wrapper'));

    backdrop.fromTo('opacity', 0.01, 0.26);
    wrapper.fromTo('translateY', '100%', '0%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
  }
}
Transition.register('picker-slide-in', PickerSlideIn);


class PickerSlideOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.picker-wrapper'));

    backdrop.fromTo('opacity', 0.26, 0);
    wrapper.fromTo('translateY', '0%', '100%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(backdrop).add(wrapper);
  }
}
Transition.register('picker-slide-out', PickerSlideOut);


let pickerIds = -1;
const MIN_VELOCITY_START_DECELERATION = 4;
const MIN_VELOCITY_CONTINUE_DECELERATION = 0.12;
const DECELERATION_FRICTION = 0.97;
const FRAME_MS = (1000 / 60);
