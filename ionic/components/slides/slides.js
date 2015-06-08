import {For, ElementRef, Inject, Parent} from 'angular2/angular2'

import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';

import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {DragGesture} from 'ionic/gestures/drag-gesture';
import * as util from 'ionic/util';

import {dom} from 'ionic/util'
import {IonicComponent} from 'ionic/config/component'

import {Hammer} from 'ionic/gestures/hammer';


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
@Component({
  selector: 'ion-slides'
})
@View({
  template: `<div class="slides-view"><content></content></div>`,
  directives: [Slide, SlidePager]
})
export class Slides {
  constructor(elementRef: ElementRef) {
    // Grab the main container, and the slides-view wrapper
    this.domElement = elementRef.domElement;

    this.config = Slides.config.invoke(this);

    this.slides = [];
    this.currentIndex = 0;
    this.animateSpeed = 300;
    this.slideDelay = 0;//3000;
    this.continuous = false;

    // Initialize our slides gesture handler
    this.gesture = new SlidesGesture(this);
    this.gesture.listen();

    // Wait a cycle for the children to exist before computing sizes
    setTimeout(() => {
      // Continuous mode, but only if we have at least 2 slides
      this.setup();
    });
  }

  setup() {
    this.continuous = this.continuous && (this.slides.length > 1 ? true : false);

    // Grab the wrapper element that contains the slides
    this.wrapperElement = this.domElement.children[0];

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
    this.containerWidth = this.domElement.offsetWidth || this.domElement.getBoundingClientRect().width;

    console.log('Computed container width', this.containerWidth);

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
    //offloadFn(options.callback && options.callback(index, slides[index]));
  }

  /**
   * Slide to a specific slide index.
   *
   * @param toIndex the index to slide to.
   * @param isRight, whether to go right or go left, only works in continuous mode
   */
  slide2(toIndex, isRight) {
    console.log('Sliding to', toIndex, this.currentIndex, isRight);
    if(toIndex === this.currentIndex) {
      return;
    }

    // Some simple variables to reduce typing
    let m = this._move.bind(this);
    let c = this._circle.bind(this);
    let i = this.currentIndex;
    let w = this.containerWidth;
    let s = this.slides[c(i)];
    let speed = this.animateSpeed;

    let dir = Math.abs(i-toIndex) / (i-toIndex);

    // Create a multiplier depending on the direction we want to travel
    // TODO: Verify isRight doesn't apply in non-continuous mode
    //let dir = isRight ? 1 : -1;

    let newIndex;

    if(this.continuous) {
      // get the actual position of the slide
      var natural_direction = dir;
      dir = -this.slides[c(toIndex)].x / w;

      // if going forward but to < index, use to = slides.length + to
      // if going backward but to > index, use to = -slides.length + to
      if (dir !== natural_direction) toIndex =  -dir * this.slides.length + toIndex;

      // We are in continuous mode, so wrap the other elements around
      m( c( i - dir * 1 ), - dir*w );
      m( c( i + dir * 2 ), dir*w );

      newIndex = isRight ? c( i + 1 ) : c( i - 1 );
    } else {
      // We aren't in continuous mode, so move forward one
      m( i - dir *1, -dir*w );
      newIndex = c( i + dir*1 );
    }

    // Move the current slide back, animate it
    m( i, s.x - dir*w, speed );

    // Move the next appropriate side into this position, animate it
    m( c( i + dir*1 ), this.slides[ c( i + dir*1 ) ].x - dir*w, speed );

    this.currentIndex = newIndex;

    console.log('Drag ended, new position:', this.currentIndex);
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

  // Process a drag, with a deltaX value
  _drag(dx) {

    // Grab the left/center/right slides
    let index1 = this._circle(this.currentIndex - 1);
    let index2 = this._circle(this.currentIndex);
    let index3 = this._circle(this.currentIndex + 1);

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

  _endDrag(event) {
    //this._finish(event);
    let isRight = event.gesture.offsetDirection & Hammer.DIRECTION_RIGHT;
    console.log('Slides: ending drag', event, '\n\t', 'Right?', isRight);

    if(isRight) {
      this.next();
    } else {
      this.prev();
    }
  }

  _finish(event) {

    // measure duration
    var duration = +new Date - start.time;

    // determine if slide attempt triggers next/prev slide
    var isValidSlide =
          Number(duration) < 250               // if slide duration is less than 250ms
          && Math.abs(delta.x) > 20            // and if slide amt is greater than 20px
          || Math.abs(delta.x) > width/2;      // or if slide amt is greater than half the width

    // determine if slide attempt is past start and end
    var isPastBounds =
          !index && delta.x > 0                            // if first slide and slide amt is greater than 0
          || index == slides.length - 1 && delta.x < 0;    // or if last slide and slide amt is less than 0

    if (options.continuous) isPastBounds = false;

    // determine direction of swipe (true:right, false:left)
    var direction = delta.x < 0;

    // if not scrolling vertically
    if (!isScrolling) {

      if (isValidSlide && !isPastBounds) {

        if (direction) {

          if (options.continuous) { // we need to get the next in this direction in place

            move(circle(index-1), -width, 0);
            move(circle(index+2), width, 0);

          } else {
            move(index-1, -width, 0);
          }

          move(index, slidePos[index]-width, speed);
          move(circle(index+1), slidePos[circle(index+1)]-width, speed);
          index = circle(index+1);

        } else {
          if (options.continuous) { // we need to get the next in this direction in place

            move(circle(index+1), width, 0);
            move(circle(index-2), -width, 0);

          } else {
            move(index+1, width, 0);
          }

          move(index, slidePos[index]+width, speed);
          move(circle(index-1), slidePos[circle(index-1)]+width, speed);
          index = circle(index-1);

        }

        options.callback && options.callback(index, slides[index]);

      } else {

        if (options.continuous) {

          move(circle(index-1), -width, speed);
          move(index, 0, speed);
          move(circle(index+1), width, speed);

        } else {

          move(index-1, -width, speed);
          move(index, 0, speed);
          move(index+1, width, speed);
        }

      }

    }

    // kill touchmove and touchend event listeners until touchstart called again
    element.removeEventListener('touchmove', events, false)
    element.removeEventListener('touchend', events, false)
  }

  _move(pos, translateX, speed) {
    console.log('MOVE', pos, translateX, speed ? speed : 0);
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
new IonicComponent(Slides, {
});

@Component({
  selector: 'ion-slide',
})
@View({
  template: `<content></content>`
})
export class Slide {
  constructor(
    @Ancestor() slides: Slides,
    elementRef: ElementRef
  ) {
    this.domElement = elementRef.domElement;
    this.config = Slide.config.invoke(this);

    slides.add(this);
  }

  translate(x, duration) {
    this._translateX = x;

    duration = duration || 0;

    this.domElement.style[dom.CSS.transition + 'Duration'] = duration + 'ms';
    this.domElement.style[dom.CSS.transform] = 'translate3d(' + x + 'px, 0, 0)';
  }

  get translateX() {
    return this._translateX;
  }

  set left(x) {
    this._left = x;
    this.domElement.style.left = x + 'px';
  }
  get left() {
    return this._left;
  }

  set width(width) {
    this._width = width;
    this.domElement.style.width = width + 'px';
  }

  get width() {
    return this._width;
  }
}

new IonicComponent(Slide, {
});

@Component({
  selector: 'ion-pager',
})
@View({
  //[class.active]="$index == currentSlide}" ng-click="pagerClick($index)"><i class="icon ion-record"></i></span></div>',
  template: `<span class="slide-pager-page" *for="#page of getSlides()">{{page.width}}<i class="icon ion-record"></i>X</span>`,
  direcitves: [For]
})
export class SlidePager {
  constructor(
    @Ancestor() slides: Slides,
    elementRef: ElementRef
  ) {
    this.domElement = elementRef.domElement;
    this.config = SlidePager.config.invoke(this);

    this.slides = slides;

    this.slides.setPager(this);
  }

  getSlides() {
    return this.slides.slides;
  }
}
new IonicComponent(SlidePager, {
});


export class SlidesGesture extends DragGesture {
  constructor(slides) {
    //util.defaults(opts, {});
    super(slides.domElement);
    this.slides = slides;
  }
  onDrag(event) {
    //console.log('Drag', event);
    let x = event.gesture.center.x;
    let y = event.gesture.center.y;

    this._drag.x = x;
    this._drag.y = y;

    this.slides._drag(event.gesture.deltaX);
  }
  onDragStart(event) {
    console.log('Drag start', event);

    this._drag = {
      startX: event.gesture.center.x,
      startY: event.gesture.center.y,
    }
  }
  onDragEnd(event) {
    console.log('Drag end', event);

    this.slides._endDrag(event);
  }
}
