import {Component, ElementRef, Input, Output, EventEmitter, ViewChildren, QueryList, ViewChild, Renderer, HostListener, ViewEncapsulation} from 'angular2/core';

import {Animation} from '../../animations/animation';
import {Transition, TransitionOptions} from '../../transitions/transition';
import {Config} from '../../config/config';
import {isPresent, isString, isNumber, clamp} from '../../util/util';
import {NavParams} from '../nav/nav-params';
import {ViewController} from '../nav/view-controller';
import {raf, cancelRaf, CSS, pointerCoord} from '../../util/dom';


/**
 * @name Picker
 * @description
 *
 */
export class Picker extends ViewController {

  @Output() change: EventEmitter<any>;

  constructor(opts: PickerOptions = {}) {
    opts.columns = opts.columns || [];
    opts.buttons = opts.buttons || [];
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;

    super(PickerDisplayCmp, opts);
    this.viewType = 'picker';
    this.isOverlay = true;

    this.change = new EventEmitter();

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

  getColumns(): PickerColumn[] {
    return this.data.columns;
  }

  refresh() {
    this.instance.refresh && this.instance.refresh();
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
      '<button *ngFor="#o of col.options; #i=index" [style.transform]="o._trans" [style.transitionDuration]="o._dur" [class.picker-opt-selected]="col.selectedIndex === i" [class.picker-opt-disabled]="o.disabled" (click)="optClick($event, i)" type="button" category="picker-opt">' +
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
  minY: number;
  maxY: number;
  rotateFactor: number;
  lastIndex: number;
  @Output() change: EventEmitter<any> = new EventEmitter();

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
    this.setSelected(this.col.selectedIndex, 0);
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

    let minY = this.col.options.length - 1;
    let maxY = 0;

    for (var i = 0; i < this.col.options.length; i++) {
      if (this.col.options[i].disabled) {
        continue;
      }
      if (i < minY) {
        minY = i;
      }
      if (i > maxY) {
        maxY = i;
      }
    }

    this.minY = (minY * this.optHeight * -1);
    this.maxY = (maxY * this.optHeight * -1);
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

      if (y > this.minY) {
        // scrolling up higher than scroll area
        y = Math.pow(y, 0.8);
        this.bounceFrom = y;

      } else if (y < this.maxY) {
        // scrolling down below scroll area
        y += Math.pow(this.maxY - y, 0.9);
        this.bounceFrom = y;

      } else {
        this.bounceFrom = 0;
      }

      this.update(y, 0, false, false);
    }
  }

  pointerEnd(ev) {
    if (this.isPrevented(ev)) {
      return;
    }

    this.velocity = 0;

    if (this.bounceFrom > 0) {
      // bounce back up
      this.update(this.minY, 100, true, true);

    } else if (this.bounceFrom < 0) {
      // bounce back down
      this.update(this.maxY, 100, true, true);

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
        this.update(y, 0, true, true);
      }

    }

    this.startY = null;
    this.decelerate();
  }

  decelerate() {
    let y = 0;
    cancelRaf(this.rafId);

    if (isNaN(this.y) || !this.optHeight) {
      // fallback in case numbers get outta wack
      this.update(y, 0, true, true);

    } else if (Math.abs(this.velocity) > 0) {
      // still decelerating
      this.velocity *= DECELERATION_FRICTION;

      // do not let it go slower than a velocity of 1
      this.velocity = (this.velocity > 0 ? Math.max(this.velocity, 1) : Math.min(this.velocity, -1));

      y = Math.round(this.y - this.velocity);

      if (y > this.minY) {
        // whoops, it's trying to scroll up farther than the options we have!
        y = this.minY;
        this.velocity = 0;

      } else if (y < this.maxY) {
        // gahh, it's trying to scroll down farther than we can!
        y = this.maxY;
        this.velocity = 0;
      }

      console.log(`decelerate y: ${y}, velocity: ${this.velocity}, optHeight: ${this.optHeight}`);

      var notLockedIn = (y % this.optHeight !== 0 || Math.abs(this.velocity) > 1);

      this.update(y, 0, true, !notLockedIn);

      if (notLockedIn) {
        // isn't locked in yet, keep decelerating until it is
        this.rafId = raf(this.decelerate.bind(this));
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
    this.update(y, duration, true, true);
  }

  update(y: number, duration: number, saveY: boolean, emitChange: boolean) {
    // ensure we've got a good round number :)
    y = Math.round(y);

    this.col.selectedIndex = Math.max(Math.abs(Math.round(y / this.optHeight)), 0);

    for (var i = 0; i < this.col.options.length; i++) {
      var opt = <any>this.col.options[i];
      var optTop = (i * this.optHeight);
      var optOffset = (optTop + y);

      var rotateX = (optOffset * this.rotateFactor);
      var translateX = 0;
      var translateY = 0;
      var translateZ = 0;

      if (this.rotateFactor !== 0) {
        translateX = 0;
        translateZ = 90;
        if (rotateX > 90 || rotateX < -90) {
          translateX = -9999;
          rotateX = 0;
        }

      } else {
        translateY = optOffset;
      }

      opt._trans = `rotateX(${rotateX}deg) translate3d(${translateX}px,${translateY}px,${translateZ}px)`;
      opt._dur = (duration > 0 ? duration + 'ms' : '');
    }

    if (saveY) {
      this.y = y;
    }

    if (emitChange) {
      if (this.lastIndex === undefined) {
        // have not set a last index yet
        this.lastIndex = this.col.selectedIndex;

      } else if (this.lastIndex !== this.col.selectedIndex) {
        // new selected index has changed from the last index
        // update the lastIndex and emit that it has changed
        this.lastIndex = this.col.selectedIndex;
        this.change.emit(this.col.options[this.col.selectedIndex]);
      }
    }
  }

  refresh() {
    let min = this.col.options.length - 1;
    let max = 0;

    for (var i = 0; i < this.col.options.length; i++) {
      var opt = this.col.options[i];
      if (!opt.disabled) {
        if (i < min) {
          min = i;
        }
        if (i > max) {
          max = i;
        }
      }
    }

    var selectedIndex = clamp(min, this.col.selectedIndex, max);

    if (selectedIndex !== this.col.selectedIndex) {
      var y = (selectedIndex * this.optHeight) * -1;
      this.update(y, 150, true, true);
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
        '<div *ngFor="#b of d.buttons" class="picker-toolbar-button" [ngClass]="b.cssRole">' +
          '<button (click)="btnClick(b)" [ngClass]="b.cssClass" class="picker-button" clear>' +
            '{{b.text}}' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="picker-columns">' +
        '<div class="picker-above-highlight"></div>' +
        '<div *ngFor="#c of d.columns" [col]="c" class="picker-col" (change)="_colChange($event)"></div>' +
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
  @ViewChildren(PickerColumnCmp) private _cols: QueryList<PickerColumnCmp>;
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
          value: '',
          disabled: inputOpt.disabled,
        };

        if (isPresent(inputOpt)) {
          if (isString(inputOpt) || isNumber(inputOpt)) {
            opt.text = inputOpt.toString();
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

  refresh() {
    this._cols.forEach(column => {
      column.refresh();
    });
  }

  private _colChange(selectedOption: PickerColumnOption) {
    // one of the columns has changed its selected index
    var picker = <Picker>this._viewCtrl;
    picker.change.emit(this.getSelected());
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
      if (button.handler(this.getSelected()) === false) {
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
    return this._viewCtrl.dismiss(this.getSelected(), role);
  }

  getSelected(): any {
    let selected = {};
    this.d.columns.forEach((col, index) => {
      let selectedColumn = col.options[col.selectedIndex];
      selected[col.name] = {
        text: selectedColumn ? selectedColumn.text : null,
        value: selectedColumn ? selectedColumn.value : null,
        columnIndex: index,
      };
    });
    return selected;
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
  selectedIndex?: number;
  prefix?: string;
  suffix?: string;
  options?: PickerColumnOption[];
  cssClass?: string;
  columnWidth?: string;
  prefixWidth?: string;
  suffixWidth?: string;
  optionsWidth?: string;
}

export interface PickerColumnOption {
  text?: string;
  value?: any;
  disabled?: boolean;
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
