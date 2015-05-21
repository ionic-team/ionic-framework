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

    // Initialize our slides gesture handler
    this.gesture = new SlidesGesture(this);
    this.gesture.listen();

    // Wait a cycle for the children to exist before computing sizes
    setTimeout(() => {
      // Continuous mode, but only if we have at least 2 slides
      this.continuous = this.slides.length > 1 ? true : false;

      this.wrapperElement = this.domElement.children[0];
      this.resize();

      if(this.slideDelay) {
        this.startShow();
      }
    });
  }

  /**
   * Start the slideshow.
   */
  startShow() {
    this._showTimeout = setTimeout(this.slideRight.bind(this), this.slideDelay);
  }

  /**
   * End the slideshow.
   */
  stopShow() {
    clearTimeout(this._showTimout);
  }

  setPager(pager) {
    this._pager = pager;
  }

  resize() {
    // Get the width of the container, which is the viewport
    // that the user will actually see.
    this.containerWidth = this.domElement.offsetWidth || this.domElement.getBoundingClientRect().width;

    // Set the wrapper element to the total width of the child elements
    this.wrapperElement.style.width = ((this.containerWidth * this.slides.length) + 20) + 'px';

    // Position all the child slides
    this._bump();
  }

  // Reposition all the existing slides so they are in the right position
  _bump() {
    let slide;
    let tx;

    let i = this.slides.length;

    while(i--) {
      slide = this.slides[i];

      slide.left  = i * -this.containerWidth;
      slide.width = this.containerWidth;

      tx = 0;

      if(this.currentIndex > i) {
        tx = -this.containerWidth;
      } else if(this.currentIndex < i) {
        tx = this.containerWidth;
      }

      this._move(i, tx);//this.currentIndex > i ? -this.containerWidth : (this.currentIndex < i ? this.containerWidth: 0), 0);
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

  /**
   * Add a new slide to the slides.
   */
  add(slide) {
    this._append(slide);
  }

  drag(dx) {
    /*
    console.log('Moving', dx, 'for slides', s1, s2, s3);
    */

    let index1 = this._circle(this.currentIndex - 1);
    let index2 = this._circle(this.currentIndex);
    let index3 = this._circle(this.currentIndex + 1);

    let s1 = this.slides[index1];
    let s2 = this.slides[index2];
    let s3 = this.slides[index3];

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

  slide(toIndex, isRight) {
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

    // Create a multiplier depending on the direction we want to travel
    let dir = isRight ? 1 : -1;

    let newIndex;

    if(this.continuous) {
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

  slideLeft() {
    this.slide(this._circle(this.currentIndex - 1), false);
  }
  slideRight() {
    this.slide(this._circle(this.currentIndex + 1), true);
  }

  endDrag(event) {
    let isRight = event.gesture.offsetDirection & Hammer.DIRECTION_RIGHT;
    console.log('Slides: ending drag', event, '\n\t', 'Right?', isRight);

    if(isRight) {
      this.slideRight();
    } else {
      this.slideLeft();
    }
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

    this.slides.drag(event.gesture.deltaX);
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

    this.slides.endDrag(event);
  }
}
