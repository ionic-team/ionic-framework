import {Component, View, ElementRef, EventEmitter, onInit, Host, forwardRef, NgFor, NgIf} from 'angular2/angular2';

import {DragGesture} from 'ionic/gestures/drag-gesture';
import {IonicComponent, IonicDirective} from '../../config/annotations';
import {dom} from 'ionic/util';
import {Platform} from 'ionic/platform/platform';
import * as util from 'ionic/util';


/**
 * Slides is a slide box implementation based off of swipe.js
 * and the ionic1 implementation.
 *
 * May 21st, 2015
 * @maxlynch
 *
 * * TODO: Finish the slideshow, should continue on transition end or a
 *         similar event.
 * * TODO: Add support for 2 slide cloning
 * * TODO: Test support for N-slide sliding (like go 2 slides ahead)
 * * TODO: Analyze performance, add request animation frame if necessary
 * * TODO: Test mouse support
 * * TODO: Port over mouse handling
 */
@IonicComponent({
  selector: 'ion-slides',
  properties: [
    'loop',
    'index',
    'bounce',
    'showPager'
  ]
})
@View({
  template: '<div class="slides-view"><ng-content></ng-content></div><ion-pager *ng-if="showPager"></ion-pager>',
  directives: [NgIf, forwardRef(() => SlidePager)]
})
export class Slides {
  constructor(elementRef: ElementRef) {
    // Grab the main container, and the slides-view wrapper
    this.ele = elementRef.nativeElement;

    this.slides = [];
    this.currentIndex = 0;

    // How quickly to animate between slides
    this.animateSpeed = 300;

    // How often to switch slides automatically. Zero is no auto sliding
    this.slideDelay = 0;//3000;

    // Whether to bounce on the edges if not continuous (overscrolling)
    this.bounce = false;

    this.showPager = true;

    this.changed = new EventEmitter('changed');

    // Initialize our slides gesture handler
    this.gesture = new SlidesGesture(this);
    this.gesture.listen();
  }

  onInit() {
    this.continuous = util.isDefined(this.loop) && (this.slides.length > 1 ? true : false);

    // Grab the wrapper element that contains the slides
    this.wrapperElement = this.ele.children[0];

    this.resize();

    if(this.slideDelay) {
      this.startShow();
    }

    //special case if two slides
    /*
    if (this.continuous && this.slides.length < 3) {
      this.element.appendChild(this.slides[0].clone())//cloneNode(true));
      element.appendChild(element.children[1].cloneNode(true));
      slides = element.children;
    }
    */
  }

  /**
   * Start the slideshow.
   */
  startShow() {
    this._showTimeout = setTimeout(this.next.bind(this), this.slideDelay);
  }

  /**
   * End the slideshow.
   */
  stopShow() {
    clearTimeout(this._showTimout);
  }

  /**
   * Set the pager element for handling rendering of page icons and
   * switching slides through clicks, etc.
   */
  setPager(pager) {
    this._pager = pager;
  }

  resize() {
    // Get the width of the container, which is the viewport
    // that the user will actually see.
    this.containerWidth = this.ele.offsetWidth || this.ele.getBoundingClientRect().width;

    // Fallback: don't allow zero width
    if(this.containerWidth === 0) {
      this.containerWidth = Platform.width();
    }

    // Set the wrapper element to the total width of the child elements
    this.wrapperElement.style.width = ((this.containerWidth * this.slides.length)) + 'px';

    // Position all the child slides
    this._bump();
  }

  /**
   * Add a new slide to the slides.
   */
  add(slide) {
    this._append(slide);
  }


  slide(to, slideSpeed) {
    let index = this.currentIndex;
    let width = this.containerWidth;

    // do nothing if already on requested slide
    if (index == to) return;

    var direction = Math.abs(index-to) / (index-to); // 1: backward, -1: forward

    // get the actual position of the slide
    if (this.continuous) {
      var natural_direction = direction;
      direction = -this.slides[this._circle(to)].x / width;

      // if going forward but to < index, use to = slides.length + to
      // if going backward but to > index, use to = -slides.length + to
      if (direction !== natural_direction) to =  -direction * this.slides.length + to;

    }

    var diff = Math.abs(index-to) - 1;

    // move all the slides between index and to in the right direction
    while (diff--) this._move( this._circle((to > index ? to : index) - diff - 1), width * direction, 0);

    to = this._circle(to);

    this._move(index, width * direction, slideSpeed || this.animateSpeed);
    this._move(to, 0, slideSpeed || this.animateSpeed);

    if (this.continuous) this._move(this._circle(to - direction), -(width * direction), 0); // we need to get the next in place

    this.currentIndex = to;

    this._changed();
  }

  /**
   * Slide left, possibly wrapping around in continuous mode.
   */
  prev() {
    if(this.continuous) {

      // Always allow us to go back
      this.slide(this.currentIndex - 1);

    } else if(this.currentIndex > 0) {

      // If we have one slide to the left
      this.slide(this.currentIndex - 1);

    }
  }

  /**
   * Slide right, possibly wrapping around in continuous mode.
   */
  next() {
    if(this.continuous) {

      // Always allow us to go next
      this.slide(this.currentIndex + 1);

    } else if(this.currentIndex < this.slides.length - 1) {

      // If not in continuous mode, only slide if we have a right slide
      this.slide(this.currentIndex + 1);

    }
  }

  _changed() {
    this._pager && this._pager.changed(this.currentIndex);

    setTimeout(() => {
      this.changed.next(this.currentIndex);
    });
  }

  // Reposition all the existing slides so they are in the right position
  _bump() {
    let slide;
    let tx;

    let i = this.slides.length;

    while(i--) {
      slide = this.slides[i];

      // Set the slide's left position to a negative of the current index and its width
      slide.left  = i * -this.containerWidth;
      slide.width = this.containerWidth;

      // Check if this slide is before or after the currently active one,
      // since we have to position it before or after it
      tx = 0;
      if(this.currentIndex > i) {
        tx = -this.containerWidth;
      } else if(this.currentIndex < i) {
        tx = this.containerWidth;
      }

      this._move(i, tx);
    }

    if(this.continuous) {
      // If we are in continuous mode, we need to wrap the previous and
      // last element to get a complete "circle"
      let index1 = this._circle(this.currentIndex - 1);
      let index2 = this._circle(this.currentIndex + 1);

      this._move(index1, -this.containerWidth);//, 0);
      this._move(index2, this.containerWidth);//, 0);
    }
  }

  _dragStart(event) {

    this._isScrolling = undefined;

  }


  /**
   * Code to run before operating on a drag.
   */
  _dragPre(event) {
    let dx = event.gesture.deltaX;
    let dy = event.gesture.deltaY;

    if(this.disableScroll) {
      event.preventDefault();
    }

    // determine if scrolling test has run - one time test
    if(typeof this._isScrolling == 'undefined') {
      this._isScrolling = !!(this._isScrolling || Math.abs(dx) < Math.abs(dy));
    }

    // If we're scrolling, never run the drag
    if(this._isScrolling) {
      return false;
    }
  }

  // Process a drag, with a deltaX value
  _drag(event) {
    let dx = event.gesture.deltaX;
    let width = this.containerWidth;
    let index = this.currentIndex;

    // Check if we should run (scroll detection, etc)
    let shouldRun = this._dragPre(event);
    if(shouldRun === false) { return; }

    // We're doing this
    event.preventDefault();

    let index1, index2, index3;

    if(this.continuous) {

      // Grab the left/center/right slides
      index1 = this._circle(this.currentIndex - 1);
      index2 = this.currentIndex;
      index3 = this._circle(this.currentIndex + 1);

    } else {

      index1 = this.currentIndex - 1;
      index2 = this.currentIndex;
      index3 = this.currentIndex + 1;

      var isPastBounds =
        index == 0 && dx > 0 // if first slide and slide amt is greater than 0
        || index == this.slides.length - 1 && dx < 0;    // or if last slide and slide amt is less than 0

      if(this.bounce) {
        // If we have drag bouncing/overscroll enabled,
        // let's slow down the drag on the edges

        // if first slide and sliding left
        // or if last slide and sliding right
        // and if sliding at all,
        // Adjust resistance
        dx = dx /
          ((!index && dx > 0 || index == this.slides.length - 1 && dx < 0) ?
            ( Math.abs(dx) / width + 1 )      // determine resistance level
            : 1 );

      } else if(isPastBounds) {
        // We aren't overscrolling (bouncing), and we're past the bounds
        let slide = this.slides[index];
        return;
      }
    }

    let s1 = this.slides[index1];
    let s2 = this.slides[index2];
    let s3 = this.slides[index3];

    // Translate the left/center/right slides based on the deltaX of the drag
    if(s1) {
      s1.translate(dx + s1.x);
    }
    if(s2) {
      s2.translate(dx + s2.x);
    }
    if(s3) {
      s3.translate(dx + s3.x);
    }
  }

  _endDrag(event, drag) {
    this._finish(event, drag);
  }

  _finish(event, drag) {

    let delta = {
      x: event.gesture.deltaX,
      y: event.gesture.deltaY
    }

    let width = this.containerWidth;
    let index = this.currentIndex;
    let slides = this.slides;
    let move = this._move.bind(this);
    let circle = this._circle.bind(this);
    let isScrolling = this._isScrolling;
    let speed = this.animateSpeed;

    // measure duration
    var duration = +new Date - drag.time;

    // determine if slide attempt triggers next/prev slide
    var isValidSlide =
          Number(duration) < 250               // if slide duration is less than 250ms
          && Math.abs(delta.x) > 20            // and if slide amt is greater than 20px
          || Math.abs(delta.x) > width/3;      // or if slide amt is greater than half the width

    // determine if slide attempt is past start and end
    var isPastBounds =
          !index && delta.x > 0                            // if first slide and slide amt is greater than 0
          || index == slides.length - 1 && delta.x < 0;    // or if last slide and slide amt is less than 0

    if (this.continuous) isPastBounds = false;

    // determine direction of swipe (true:right, false:left)
    var direction = delta.x < 0;

    // if not scrolling vertically
    if (!isScrolling) {

      if (isValidSlide && !isPastBounds) {

        if (direction) {

          if (this.continuous) { // we need to get the next in this direction in place

            move(circle(index-1), -width, 0);
            move(circle(index+2), width, 0);

          } else {
            move(index-1, -width, 0);
          }

          move(index, slides[index].x-width, speed);
          move(circle(index+1), slides[circle(index+1)].x-width, speed);
          this.currentIndex = circle(index+1);

          this._changed();

        } else {
          if (this.continuous) { // we need to get the next in this direction in place

            move(circle(index+1), width, 0);
            move(circle(index-2), -width, 0);

          } else {
            move(index+1, width, 0);
          }

          move(index, slides[index].x+width, speed);
          move(circle(index-1), slides[circle(index-1)].x+width, speed);
          this.currentIndex = circle(index-1);

          this._changed();

        }

        //options.callback && options.callback(index, slides[index]);

      } else {

        if (this.continuous) {

          move(circle(index-1), -width, speed);
          move(index, 0, speed);
          move(circle(index+1), width, speed);

          this._changed();

        } else {

          move(index-1, -width, speed);
          move(index, 0, speed);
          move(index+1, width, speed);

          this._changed();
        }

      }

    }

    // kill touchmove and touchend event listeners until touchstart called again
    //element.removeEventListener('touchmove', events, false)
    //element.removeEventListener('touchend', events, false)
  }

  _move(pos, translateX, speed) {
    // Should already be wrapped with circle
    let slide = this.slides[pos];
    if(!slide) { return; }

    slide.translate(translateX, speed);
    slide.x = translateX;
  }

  // A modulo "circle" to stay in the bounds of the slide array
  _circle(i) {
    return (this.slides.length + (i % this.slides.length)) % this.slides.length;
  }

  _append(slide) {
    this.slides.push(slide);
  }
  _prepend(slide) {
    this.slides.unshift(slide);
  }

}


@IonicDirective({
  selector: 'ion-slide',
})
export class Slide {
  constructor(
    @Host() slides: Slides,
    elementRef: ElementRef
  ) {
    this.ele = elementRef.nativeElement;

    slides.add(this);
  }

  translate(x, duration) {
    this._translateX = x;

    duration = duration || 0;

    this.ele.style[dom.CSS.transition + 'Duration'] = duration + 'ms';
    this.ele.style[dom.CSS.transform] = 'translate3d(' + x + 'px, 0, 0)';
  }

  get translateX() {
    return this._translateX;
  }

  set left(x) {
    this._left = x;
    this.ele.style.left = x + 'px';
  }
  get left() {
    return this._left;
  }

  set width(width) {
    this._width = width;
    this.ele.style.width = width + 'px';
  }

  get width() {
    return this._width;
  }
}


@IonicComponent({
  selector: 'ion-pager',
})
@View({
  //[class.active]="$index == currentSlide}" ng-click="pagerClick($index)"><i class="icon ion-record"></i></span></div>',
  template: `<span class="slide-pager-page" *ng-for="#page of getSlides(); #i = index" [class.active]="i == slides.currentIndex"><i class="icon ion-record"></i></span>`,
  directives: [NgFor]
})
export class SlidePager {
  constructor(
    @Host() slides: Slides,
    elementRef: ElementRef
  ) {
    this.ele = elementRef.nativeElement;

    this.slides = slides;

    this.slides.setPager(this);
  }

  changed() {
  }

  getSlides() {
    return this.slides.slides;
  }
}


export class SlidesGesture extends DragGesture {
  constructor(slides) {
    super(slides.ele);
    this.slides = slides;
  }
  onDrag(event) {
    let x = event.gesture.center.x;
    let y = event.gesture.center.y;

    this._drag.x = x;
    this._drag.y = y;

    this.slides._drag(event);
  }
  onDragStart(event) {

    this._drag = {
      startX: event.gesture.center.x,
      startY: event.gesture.center.y,
      time: +new Date
    }

    this.slides._dragStart(event, this._drag);
  }
  onDragEnd(event) {
    this.slides._endDrag(event, this._drag);
  }
}
