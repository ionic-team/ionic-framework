import {Component, ElementRef, Input, ViewChild, Renderer, HostListener, ViewEncapsulation} from '@angular/core';

import {Animation} from '../../animations/animation';
import {Transition, TransitionOptions} from '../../transitions/transition';
import {Config} from '../../config/config';
import {isPresent, isString, isNumber} from '../../util/util';
import {NavParams} from '../nav/nav-params';
import {ViewController} from '../nav/view-controller';
import {nativeRaf, cancelRaf, CSS, pointerCoord} from '../../util/dom';


/**
 * @name Picker
 * @description
 *
 */
export class Picker extends ViewController {

  constructor(opts: PickerOptions = {}) {
    opts.columns = opts.columns || [];
    opts.buttons = opts.buttons || [];
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
   * @param {any} button Picker toolbar button
   */
  addButton(button: any) {
    this.data.buttons.push(button);
  }

  /**
   * @param {any} button Picker toolbar button
   */
  addColumn(column: PickerColumn) {
    this.data.columns.push(column);
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
  selector: '.picker-col',
  template:
    '<div *ngIf="col.prefix" class="picker-prefix" [style.width]="col.prefixWidth">{{col.prefix}}</div>' +
    '<div class="picker-opts" #colEle [style.width]="col.optionsWidth">' +
      '<button *ngFor="let o of col.options; #i=index" (click)="optClick($event, i)" type="button" category="picker-opt">' +
        '{{o.text}}' +
      '</button>' +
    '</div>' +
    '<div *ngIf="col.suffix" class="picker-suffix" [style.width]="col.suffixWidth">{{col.suffix}}</div>',
  host: {
    '[style.min-width]': 'col.columnWidth',
    '[class.picker-opts-left]': 'col.align=="left"',
    '[class.picker-opts-right]': 'col.align=="right"',
    '(touchstart)': 'pointerStart($event)',
    '(touchmove)': 'pointerMove($event)',
    '(touchend)': 'pointerEnd($event)',
    '(mousedown)': 'pointerStart($event)',
    '(mousemove)': 'pointerMove($event)',
    '(body:mouseup)': 'pointerEnd($event)',
    '(body:mouseout)': 'mouseOut($event)',
  }
})
class PickerColumnCmp {
  @ViewChild('colEle') colEle: ElementRef;
  @Input() col: PickerColumn;
  y: number = 0;
  colHeight: number;
  optHeight: number;
  velocity: number;
  pos: number[] = [];
  msPrv: number = 0;
  startY: number = null;
  rafId: number;
  bounceFrom: number;
  maxY: number;
  rotateFactor: number;

  constructor(config: Config) {
    this.rotateFactor = config.getNumber('pickerRotateFactor', 0);
  }

  ngAfterViewInit() {
    // get the scrollable element within the column
    let colEle: HTMLElement = this.colEle.nativeElement;

    this.colHeight = colEle.clientHeight;

    // get the height of one option
    this.optHeight = (colEle.firstElementChild ? colEle.firstElementChild.clientHeight : 0);

    // set the scroll position for the selected option
    let selectedIndex = this.col.options.indexOf(this.col.selected);
    this.setSelected(selectedIndex, 0);
  }

  pointerStart(ev) {
    console.debug('picker, pointerStart', ev.type, this.startY);

    if (this.isPrevented(ev)) {
      // do not both with mouse events if a touch event already fired
      return;
    }

    // cancel any previous raf's that haven't fired yet
    cancelRaf(this.rafId);

    // remember where the pointer started from`
    this.startY = pointerCoord(ev).y;

    // reset everything
    this.velocity = 0;
    this.pos.length = 0;
    this.pos.push(this.startY, Date.now());
    this.maxY = (this.optHeight * (this.col.options.length - 1)) * -1;
  }

  pointerMove(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    if (this.startY !== null) {
      if (this.isPrevented(ev)) {
        return;
      }

      var currentY = pointerCoord(ev).y;
      this.pos.push(currentY, Date.now());

      // update the scroll position relative to pointer start position
      var y = this.y + (currentY - this.startY);

      if (y > 0) {
        // scrolling up higher than scroll area
        y = Math.pow(y, 0.8);
        this.bounceFrom = y;

      } else if (y < this.maxY) {
        // scrolling down below scroll area
        y = y + Math.pow(this.maxY - y, 0.9);
        this.bounceFrom = y;

      } else {
        this.bounceFrom = 0;
      }

      this.update(y, 0, false);
    }
  }

  pointerEnd(ev) {
    if (this.isPrevented(ev)) {
      return;
    }

    this.velocity = 0;

    if (this.bounceFrom > 0) {
      // bounce back up
      this.update(0, 100, true);

    } else if (this.bounceFrom < 0) {
      // bounce back down
      this.update(this.maxY, 100, true);

    } else if (this.startY !== null) {
      var endY = pointerCoord(ev).y;

      console.debug('picker, pointerEnd', ev.type, endY);

      this.pos.push(endY, Date.now());

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

      if (Math.abs(endY - this.startY) > 3) {
        ev.preventDefault();
        ev.stopPropagation();

        var y = this.y + (endY - this.startY);
        this.update(y, 0, true);
      }

    }

    this.startY = null;
    this.decelerate();
  }

  mouseOut(ev) {
    if (ev.target.classList.contains('picker-col')) {
      this.pointerEnd(ev);
    }
  }

  decelerate() {
    var y = 0;
    cancelRaf(this.rafId);

    if (isNaN(this.y) || !this.optHeight) {
      // fallback in case numbers get outta wack
      this.update(y, 0, true);

    } else if (Math.abs(this.velocity) > 0) {
      // still decelerating
      this.velocity *= DECELERATION_FRICTION;

      // do not let it go slower than a velocity of 1
      this.velocity = (this.velocity > 0 ? Math.max(this.velocity, 1) : Math.min(this.velocity, -1));

      y = Math.round(this.y - this.velocity);

      if (y > 0) {
        // whoops, it's trying to scroll up farther than the options we have!
        y = 0;
        this.velocity = 0;

      } else if (y < this.maxY) {
        // gahh, it's trying to scroll down farther than we can!
        y = this.maxY;
        this.velocity = 0;
      }

      console.log(`decelerate y: ${y}, velocity: ${this.velocity}, optHeight: ${this.optHeight}`);

      this.update(y, 0, true);

      if (y % this.optHeight !== 0 || Math.abs(this.velocity) > 1) {
        // isn't locked in yet, keep decelerating until it is
        this.rafId = nativeRaf(this.decelerate.bind(this));
      }

    } else if (this.y % this.optHeight !== 0) {
      // needs to still get locked into a position so options line up
      var currentPos = Math.abs(this.y  % this.optHeight);

      // create a velocity in the direction it needs to scroll
      this.velocity = (currentPos > (this.optHeight / 2) ? 1 : -1);

      this.decelerate();
    }
  }

  optClick(ev, index: number) {
    if (!this.velocity) {
      ev.preventDefault();
      ev.stopPropagation();

      this.setSelected(index, 150);
    }
  }

  setSelected(selectedIndex: number, duration: number) {
    // if there is a selected index, then figure out it's y position
    // if there isn't a selected index, then just use the top y position
    let y = (selectedIndex > -1) ? ((selectedIndex * this.optHeight) * -1) : 0;

    cancelRaf(this.rafId);
    this.velocity = 0;

    // so what y position we're at
    this.update(y, duration, true);
  }

  update(y: number, duration: number, saveY: boolean) {
    // ensure we've got a good round number :)
    y = Math.round(y);

    let selectedIndex = Math.abs(Math.round(y / this.optHeight));

    this.col.selected = this.col.options[selectedIndex];

    let colEle: HTMLElement = this.colEle.nativeElement;
    let optElements: any = colEle.querySelectorAll('.picker-opt');

    for (var i = 0; i < optElements.length; i++) {
      var optEle: HTMLElement = optElements[i];
      var optTop = (i * this.optHeight);
      var optOffset = (optTop + y);

      var rotateX = (optOffset * this.rotateFactor);
      var translateX = 0;
      var translateY = 0;
      var translateZ = 0;

      if (this.rotateFactor !== 0) {
        translateX = 10;
        translateZ = 90;
        if (rotateX > 90 || rotateX < -90) {
          translateX = -9999;
          rotateX = 0;
        }

      } else {
        translateY = optOffset;
      }

      optEle.style[CSS.transform] = `rotateX(${rotateX}deg) translate3d(${translateX}px,${translateY}px,${translateZ}px)`;

      optEle.style[CSS.transitionDuration] = (duration > 0 ? duration + 'ms' : '');

      optEle.classList[i === selectedIndex ? 'add' : 'remove']('picker-opt-selected');

    }

    if (saveY) {
      this.y = y;
    }
  }

  isPrevented(ev) {
    if (ev.type.indexOf('touch') > -1) {
      // this is a touch event, so prevent mouse events for a while
      this.msPrv = Date.now() + 2000;

    } else if (this.msPrv > Date.now() && ev.type.indexOf('mouse') > -1) {
      // this is a mouse event, and a touch event already happend recently
      // prevent the calling method from continuing
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
        '<div *ngFor="let b of d.buttons" class="picker-toolbar-button" [ngClass]="b.cssRole">' +
          '<button (click)="btnClick(b)" [ngClass]="b.cssClass" class="picker-button" clear>' +
            '{{b.text}}' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="picker-columns">' +
        '<div class="picker-above-highlight"></div>' +
        '<div *ngFor="let c of d.columns" [col]="c" class="picker-col"></div>' +
        '<div class="picker-below-highlight"></div>' +
      '</div>' +
    '</div>',
  host: {
    'role': 'dialog'
  },
  directives: [PickerColumnCmp],
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
      if (isString(button)) {
        return { text: button };
      }
      if (button.role) {
        button.cssRole = `picker-toolbar-${button.role}`;
      }
      return button;
    });

    // clean up dat data
    data.columns = data.columns.map(column => {
      if (!isPresent(column.columnWidth)) {
        column.columnWidth = (100 / data.columns.length) + '%';
      }
      if (!isPresent(column.options)) {
        column.options = [];
      }

      column.options = column.options.map(inputOpt => {
        let opt: PickerColumnOption = {
          text: '',
          value: ''
        };

        if (isPresent(inputOpt)) {
          if (isString(inputOpt) || isNumber(inputOpt)) {
            opt.text = inputOpt;
            opt.value = inputOpt;

          } else {
            opt.text = isPresent(inputOpt.text) ? inputOpt.text : inputOpt.value;
            opt.value = isPresent(inputOpt.value) ? inputOpt.value : inputOpt.text;
          }
        }

        return opt;
      });
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
      values[col.name] = col.selected ? col.selected.value : null;
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
  selected?: PickerColumnOption;
  prefix?: string;
  suffix?: string;
  options: PickerColumnOption[];
  cssClass?: string;
  columnWidth?: string;
  prefixWidth?: string;
  suffixWidth?: string;
  optionsWidth?: string;
}

export interface PickerColumnOption {
  value?: any;
  text?: any;
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
const DECELERATION_FRICTION = 0.97;
const FRAME_MS = (1000 / 60);
