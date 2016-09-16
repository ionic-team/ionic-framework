import { Component, ElementRef, EventEmitter, Input, HostListener, Output, QueryList, Renderer, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { cancelRaf, pointerCoord, raf } from '../../util/dom';
import { clamp, isNumber, isPresent, isString } from '../../util/util';
import { Config } from '../../config/config';
import { Key } from '../../util/key';
import { NavParams } from '../../navigation/nav-params';
import { Picker } from './picker';
import { PickerOptions, PickerColumn, PickerColumnOption } from './picker-options';
import { UIEventManager } from '../../util/ui-event-manager';
import { ViewController } from '../../navigation/view-controller';


/**
 * @private
 */
@Component({
  selector: '.picker-col',
  template:
    '<div *ngIf="col.prefix" class="picker-prefix" [style.width]="col.prefixWidth">{{col.prefix}}</div>' +
    '<div class="picker-opts" #colEle [style.width]="col.optionsWidth">' +
      '<button *ngFor="let o of col.options; let i=index" [style.transform]="o._trans" ' +
              '[style.transitionDuration]="o._dur" ' +
              '[style.webkitTransform]="o._trans" ' +
              '[style.webkitTransitionDuration]="o._dur" ' +
              '[class.picker-opt-selected]="col.selectedIndex === i" [class.picker-opt-disabled]="o.disabled" ' +
              '(click)="optClick($event, i)" ' +
              'type="button" ' +
              'ion-button="picker-opt">' +
        '{{o.text}}' +
      '</button>' +
    '</div>' +
    '<div *ngIf="col.suffix" class="picker-suffix" [style.width]="col.suffixWidth">{{col.suffix}}</div>',
  host: {
    '[style.min-width]': 'col.columnWidth',
    '[class.picker-opts-left]': 'col.align=="left"',
    '[class.picker-opts-right]': 'col.align=="right"',
  }
})
export class PickerColumnCmp {
  @ViewChild('colEle') colEle: ElementRef;
  @Input() col: PickerColumn;
  y: number = 0;
  colHeight: number;
  optHeight: number;
  velocity: number;
  pos: number[] = [];
  startY: number = null;
  rafId: number;
  bounceFrom: number;
  minY: number;
  maxY: number;
  rotateFactor: number;
  lastIndex: number;
  receivingEvents: boolean = false;
  events: UIEventManager = new UIEventManager();

  @Output() ionChange: EventEmitter<any> = new EventEmitter();

  constructor(config: Config, private elementRef: ElementRef, private _sanitizer: DomSanitizer) {
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

    // Listening for pointer events
    this.events.pointerEvents({
      elementRef: this.elementRef,
      pointerDown: this.pointerStart.bind(this),
      pointerMove: this.pointerMove.bind(this),
      pointerUp: this.pointerEnd.bind(this)
    });
  }

  ngOnDestroy() {
    this.events.unlistenAll();
  }

  pointerStart(ev: UIEvent): boolean {
    console.debug('picker, pointerStart', ev.type, this.startY);

    // cancel any previous raf's that haven't fired yet
    cancelRaf(this.rafId);

    // remember where the pointer started from`
    this.startY = pointerCoord(ev).y;

    // reset everything
    this.receivingEvents = true;
    this.velocity = 0;
    this.pos.length = 0;
    this.pos.push(this.startY, Date.now());

    let minY = (this.col.options.length - 1);
    let maxY = 0;

    for (var i = 0; i < this.col.options.length; i++) {
      if (!this.col.options[i].disabled) {
        minY = Math.min(minY, i);
        maxY = Math.max(maxY, i);
      }
    }

    this.minY = (minY * this.optHeight * -1);
    this.maxY = (maxY * this.optHeight * -1);
    return true;
  }

  pointerMove(ev: UIEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    if (this.startY === null) {
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

  pointerEnd(ev: UIEvent) {
    if (!this.receivingEvents) {
      return;
    }
    this.receivingEvents = false;
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
      var currentPos = Math.abs(this.y % this.optHeight);

      // create a velocity in the direction it needs to scroll
      this.velocity = (currentPos > (this.optHeight / 2) ? 1 : -1);

      this.decelerate();
    }
  }

  optClick(ev: UIEvent, index: number) {
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

      opt._trans = this._sanitizer.bypassSecurityTrustStyle(`rotateX(${rotateX}deg) translate3d(${translateX}px,${translateY}px,${translateZ}px)`);
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
        this.ionChange.emit(this.col.options[this.col.selectedIndex]);
      }
    }
  }

  refresh() {
    let min = this.col.options.length - 1;
    let max = 0;

    for (var i = 0; i < this.col.options.length; i++) {
      if (!this.col.options[i].disabled) {
        min = Math.min(min, i);
        max = Math.max(max, i);
      }
    }

    var selectedIndex = clamp(min, this.col.selectedIndex, max);

    if (selectedIndex !== this.col.selectedIndex) {
      var y = (selectedIndex * this.optHeight) * -1;
      this.update(y, 150, true, true);
    }
  }

}


/**
 * @private
 */
@Component({
  selector: 'ion-picker-cmp',
  template: `
    <ion-backdrop (click)="bdClick()"></ion-backdrop>
    <div class="picker-wrapper">
      <div class="picker-toolbar">
        <div *ngFor="let b of d.buttons" class="picker-toolbar-button" [ngClass]="b.cssRole">
          <button ion-button (click)="btnClick(b)" [ngClass]="b.cssClass" class="picker-button" clear>
            {{b.text}}
          </button>
        </div>
      </div>
      <div class="picker-columns">
        <div class="picker-above-highlight"></div>
        <div *ngFor="let c of d.columns" [col]="c" class="picker-col" (ionChange)="_colChange($event)"></div>
        <div class="picker-below-highlight"></div>
      </div>
    </div>
  `,
  host: {
    'role': 'dialog'
  },
  encapsulation: ViewEncapsulation.None,
})
export class PickerCmp {
  @ViewChildren(PickerColumnCmp) _cols: QueryList<PickerColumnCmp>;
  d: PickerOptions;
  enabled: boolean;
  lastClick: number;
  id: number;
  mode: string;

  constructor(
    private _viewCtrl: ViewController,
    private _elementRef: ElementRef,
    private _config: Config,
    params: NavParams,
    renderer: Renderer
  ) {
    this.d = params.data;
    this.mode = _config.get('mode');
    renderer.setElementClass(_elementRef.nativeElement, `picker-${this.mode}`, true);

    if (this.d.cssClass) {
      this.d.cssClass.split(' ').forEach(cssClass => {
        renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
      });
    }

    this.id = (++pickerIds);
    this.lastClick = 0;
  }

  ionViewDidLoad() {
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

  _colChange(selectedOption: PickerColumnOption) {
    // one of the columns has changed its selected index
    var picker = <Picker>this._viewCtrl;
    picker.ionChange.emit(this.getSelected());
  }

  @HostListener('body:keyup', ['$event'])
  _keyUp(ev: KeyboardEvent) {
    if (this.enabled && this._viewCtrl.isLast()) {
      if (ev.keyCode === Key.ENTER) {
        if (this.lastClick + 1000 < Date.now()) {
          // do not fire this click if there recently was already a click
          // this can happen when the button has focus and used the enter
          // key to click the button. However, both the click handler and
          // this keyup event will fire, so only allow one of them to go.
          console.debug('picker, enter button');
          let button = this.d.buttons[this.d.buttons.length - 1];
          this.btnClick(button);
        }

      } else if (ev.keyCode === Key.ESCAPE) {
        console.debug('picker, escape button');
        this.bdClick();
      }
    }
  }

  ionViewDidEnter() {
    let activeElement: any = document.activeElement;
    if (activeElement) {
      activeElement.blur();
    }

    let focusableEle = this._elementRef.nativeElement.querySelector('button');
    if (focusableEle) {
      focusableEle.focus();
    }
    this.enabled = true;
  }

  btnClick(button: any, dismissDelay?: number) {
    if (!this.enabled) {
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
    if (this.enabled && this.d.enableBackdropDismiss) {
      this.dismiss('backdrop');
    }
  }

  dismiss(role: any): Promise<any> {
    return this._viewCtrl.dismiss(this.getSelected(), role);
  }

  getSelected(): any {
    let selected: {[k: string]: any} = {};
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
}

let pickerIds = -1;
const DECELERATION_FRICTION = 0.97;
const FRAME_MS = (1000 / 60);
