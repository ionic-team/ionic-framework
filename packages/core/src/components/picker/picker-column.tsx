import { Component, Element, Prop } from '@stencil/core';

import { GestureDetail, PickerColumn, PickerColumnOption } from '../../index';

import { clamp } from '../../utils/helpers';

@Component({
  tag: 'ion-picker-column',
  host: {
    theme: 'picker-col'
  }
})
export class PickerColumnCmp {
  private mode: string;

  private bounceFrom: number;
  private colHeight: number;
  private lastIndex: number;
  private lastTempIndex: number;
  private minY: number;
  private maxY: number;
  private optHeight: number;
  private pos: number[] = [];
  private rotateFactor: number;
  private scaleFactor: number;
  private startY: number;
  private velocity: number;
  private y: number = 0;

  private activeBlock: string;

  @Element() private el: HTMLElement;

  @Prop() col: PickerColumn;

  protected ionViewWillLoad() {
    let pickerRotateFactor = 0;
    let pickerScaleFactor = 0.81;

    if (this.mode === 'ios') {
      pickerRotateFactor = -0.46;
      pickerScaleFactor = 1;
    }

    this.rotateFactor = pickerRotateFactor;
    this.scaleFactor = pickerScaleFactor;
  }

  protected ionViewDidLoad() {
    // get the scrollable element within the column
    let colEle = this.el.querySelector('.picker-opts');
    this.colHeight = colEle.clientHeight;

    // get the height of one option
    this.optHeight = (colEle.firstElementChild ? colEle.firstElementChild.clientHeight : 0);

    // TODO block goback-swipe and menu-swipe
    // this.activeBlock = 'goback-swipe menu-swipe';

    this.refresh();
  }

  protected ionViewDidUnload() {
    // TODO block goback-swipe and menu-swipe
    // this.activeBlock = 'goback-swipe menu-swipe';
  }

  optClick(ev: Event, index: number) {
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

    this.velocity = 0;

    // set what y position we're at
    this.update(y, duration, true, true);
  }

  update(y: number, duration: number, saveY: boolean, emitChange: boolean) {
    // ensure we've got a good round number :)
    y = Math.round(y);

    let i: number;
    let button: any;
    let opt: PickerColumnOption;
    let optOffset: number;
    let visible: boolean;
    let translateX: number;
    let translateY: number;
    let translateZ: number;
    let rotateX: number;
    let transform: string;
    let selected: boolean;

    const parent = this.el.querySelector('.picker-opts');
    const children = parent.children;
    const length = children.length;
    const selectedIndex = this.col.selectedIndex = Math.min(Math.max(Math.round(-y / this.optHeight), 0), length - 1);

    const durationStr = (duration === 0) ? null : duration + 'ms';
    const scaleStr = `scale(${this.scaleFactor})`;

    for (i = 0; i < length; i++) {
      button = children[i];
      opt = this.col.options[i];
      optOffset = (i * this.optHeight) + y;
      visible = true;
      transform = '';

      if (this.rotateFactor !== 0) {
        rotateX = optOffset * this.rotateFactor;
        if (Math.abs(rotateX) > 90) {
          visible = false;
        } else {
          translateX = 0;
          translateY = 0;
          translateZ = 90;
          transform = `rotateX(${rotateX}deg) `;
        }
      } else {
        translateX = 0;
        translateZ = 0;
        translateY = optOffset;
        if (Math.abs(translateY) > 170) {
          visible = false;
        }
      }

      selected = selectedIndex === i;
      if (visible) {
        transform += `translate3d(0px,${translateY}px,${translateZ}px) `;
        if (this.scaleFactor !== 1 && !selected) {
          transform += scaleStr;
        }
      } else {
        transform = 'translate3d(-9999px,0px,0px)';
      }
      // Update transition duration
      if (duration !== opt.duration) {
        opt.duration = duration;
        button.style.transitionDuration = durationStr;
      }
      // Update transform
      if (transform !== opt.transform) {
        opt.transform = transform;
        button.style.transform = transform;
      }
      // Update selected item
      if (selected !== opt.selected) {
        opt.selected = selected;
        if (selected) {
          button.classList.add(PICKER_OPT_SELECTED);
        } else {
          button.classList.remove(PICKER_OPT_SELECTED);
        }
      }
    }
    this.col.prevSelected = selectedIndex;

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
        // TODO ionChange event
        // var ionChange = this.ionChange;
        // if (ionChange.observers.length > 0) {
        //   this._zone.run(ionChange.emit.bind(ionChange, this.col.options[this.col.selectedIndex]));
        // }
      }
    }
  }


  decelerate() {
    let y = 0;

    if (isNaN(this.y) || !this.optHeight) {
      // fallback in case numbers get outta wack
      this.update(y, 0, true, true);

    } else if (Math.abs(this.velocity) > 0) {
      // still decelerating
      this.velocity *= DECELERATION_FRICTION;

      // do not let it go slower than a velocity of 1
      this.velocity = (this.velocity > 0)
        ? Math.max(this.velocity, 1)
        : Math.min(this.velocity, -1);

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

      var notLockedIn = (y % this.optHeight !== 0 || Math.abs(this.velocity) > 1);

      this.update(y, 0, true, !notLockedIn);

      if (notLockedIn) {
        // isn't locked in yet, keep decelerating until it is
        Context.dom.raf(() => this.decelerate());
      }

    } else if (this.y % this.optHeight !== 0) {
      // needs to still get locked into a position so options line up
      var currentPos = Math.abs(this.y % this.optHeight);

      // create a velocity in the direction it needs to scroll
      this.velocity = (currentPos > (this.optHeight / 2) ? 1 : -1);

      this.decelerate();
    }

    let currentIndex = Math.max(Math.abs(Math.round(y / this.optHeight)), 0);

    // TODO
    // if (currentIndex !== this.lastTempIndex) {
    //   // Trigger a haptic event for physical feedback that the index has changed
    //   this._haptic.gestureSelectionChanged();
    // }
    this.lastTempIndex = currentIndex;
  }

  // TODO should this check enabled?
  private canStart() {
    return true;
  }

  onDragStart(detail: GestureDetail): boolean {
    console.debug('picker, onDragStart', detail, this.startY);

    // We have to prevent default in order to block scrolling under the picker
    // but we DO NOT have to stop propagation, since we still want
    // some "click" events to capture
    if (detail.event) {
      // TODO this errors
      // detail.event.preventDefault();
    }

    // remember where the pointer started from
    this.startY = detail.startY;

    // reset everything
    this.velocity = 0;
    this.pos.length = 0;
    this.pos.push(this.startY, Date.now());

    let options = this.col.options;
    let minY = (options.length - 1);
    let maxY = 0;
    for (var i = 0; i < options.length; i++) {
      if (!options[i].disabled) {
        minY = Math.min(minY, i);
        maxY = Math.max(maxY, i);
      }
    }

    this.minY = (minY * this.optHeight * -1);
    this.maxY = (maxY * this.optHeight * -1);
    return true;
  }

  onDragMove(detail: GestureDetail) {
    if (detail.event) {
      detail.event.preventDefault();
      detail.event.stopPropagation();
    }

    console.debug('picker, onDragMove', detail);

    let currentY = detail.currentY;
    this.pos.push(currentY, Date.now());

    if (this.startY === null) {
      return;
    }

    // update the scroll position relative to pointer start position
    let y = this.y + (currentY - this.startY);

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

    let currentIndex = Math.max(Math.abs(Math.round(y / this.optHeight)), 0);
    if (currentIndex !== this.lastTempIndex) {
      this.lastTempIndex = currentIndex;
    }
  }

  onDragEnd(detail: GestureDetail) {
    if (this.startY === null) {
      return;
    }

    console.debug('picker, onDragEnd', detail);

    this.velocity = 0;

    if (this.bounceFrom > 0) {
      // bounce back up
      this.update(this.minY, 100, true, true);
      return;
    } else if (this.bounceFrom < 0) {
      // bounce back down
      this.update(this.maxY, 100, true, true);
      return;
    }

    let endY = detail.currentY;

    this.pos.push(endY, Date.now());

    let endPos = (this.pos.length - 1);
    let startPos = endPos;
    let timeRange = (Date.now() - 100);

    // move pointer to position measured 100ms ago
    for (var i = endPos; i > 0 && this.pos[i] > timeRange; i -= 2) {
      startPos = i;
    }

    if (startPos !== endPos) {
      // compute relative movement between these two points
      var timeOffset = (this.pos[endPos] - this.pos[startPos]);
      var movedTop = (this.pos[startPos - 1] - this.pos[endPos - 1]);

      // based on XXms compute the movement to apply for each render step
      var velocity = ((movedTop / timeOffset) * FRAME_MS);
      this.velocity = clamp(-MAX_PICKER_SPEED, velocity, MAX_PICKER_SPEED);
    }

    if (Math.abs(endY - this.startY) > 3) {
      var y = this.y + (endY - this.startY);
      this.update(y, 0, true, true);
    }

    this.startY = null;
    this.decelerate();
  }

  refresh() {
    let min = this.col.options.length - 1;
    let max = 0;
    const options = this.col.options;
    for (var i = 0; i < options.length; i++) {
      if (!options[i].disabled) {
        min = Math.min(min, i);
        max = Math.max(max, i);
      }
    }

    const selectedIndex = clamp(min, this.col.selectedIndex, max);
    if (this.col.prevSelected !== selectedIndex) {
      var y = (selectedIndex * this.optHeight) * -1;
      this.velocity = 0;
      this.update(y, 150, true, false);
    }
  }

  protected hostData() {
    return {
      class: {
        'picker-opts-left': this.col.align === 'left',
        'picker-opts-right': this.col.align === 'right'
      },
      style: {
        'max-width': this.col.columnWidth
      }
    };
  }

  protected render() {
    let col = this.col;

    let options = this.col.options
    .map(o => {
      if (typeof o === 'string') {
        o = { text: o };
      }
      return o;
    })
    .filter(clientInformation => clientInformation !== null);

    let results: any[] = [];

    if (col.prefix) {
      results.push(
        <div class='picker-prefix' style={{width: col.prefixWidth}}>
          {col.prefix}
        </div>
      );
    }

    results.push(
      <ion-gesture {...{
        'canStart': this.canStart.bind(this),
        'onStart': this.onDragStart.bind(this),
        'onMove': this.onDragMove.bind(this),
        'onEnd': this.onDragEnd.bind(this),
        'gestureName': 'picker-swipe',
        'gesturePriority': 10,
        'type': 'pan',
        'direction': 'y',
        'maxAngle': 20,
        'threshold': 10,
        'attachTo': 'parent',
        'block': this.activeBlock
      }}></ion-gesture>,
      <div class='picker-opts' style={{maxWidth: col.optionsWidth}}>
        {options.map((o, index) =>
        <button
          class={{'picker-opt': true, 'picker-opt-disabled': o.disabled}}
          disable-activated
          onClick={() => this.optClick(event, index)}>
          {o.text}
        </button>
        )}
      </div>
    );

    if (col.suffix) {
      results.push(
        <div class='picker-suffix' style={{width: col.suffixWidth}}>
          {col.suffix}
        </div>
      );
    }

    return results;
  }
}

export const PICKER_OPT_SELECTED = 'picker-opt-selected';
export const DECELERATION_FRICTION = 0.97;
export const FRAME_MS = (1000 / 60);
export const MAX_PICKER_SPEED = 60;
