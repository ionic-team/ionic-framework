import {Component, View, QueryList, ElementRef, EventEmitter, onInit,
  Host, forwardRef, NgFor, NgIf, NgClass} from 'angular2/angular2';

import {Ion} from '../ion';
import {Animation} from 'ionic/animations/animation';
import {Gesture} from 'ionic/gestures/gesture';
import {DragGesture} from 'ionic/gestures/drag-gesture';
import {IonicComponent, IonicDirective} from '../../config/annotations';
import {IonicConfig} from '../../config/config';
import {dom} from 'ionic/util';
import {Platform} from 'ionic/platform/platform';
import * as util from 'ionic/util';

import {Swiper} from './swiper-widget';
import {Scroll} from '../scroll/scroll';

/**
 * Slides is a slide box implementation based on Swiper.js
 *
 * Swiper.js:
 * The most modern mobile touch slider and framework with hardware accelerated transitions
 *
 * http://www.idangero.us/swiper/
 *
 * Copyright 2015, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under MIT
 *
 */
@IonicComponent({
  selector: 'ion-slides',
  properties: [
    'loop',
    'index',
    'bounce',
    'showPager',
    'options',
    'zoom'
  ]
})
@View({
  template: `<div class="swiper-container">
    <div class="swiper-wrapper">
      <ng-content></ng-content>
    </div>
    <div [class.hide]="!showPager" class="swiper-pagination"></div>
  </div>`,
  directives: [NgIf, NgClass]
})
export class Slides extends Ion {

  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   */
  constructor(elementRef: ElementRef, config: IonicConfig) {
    super(elementRef, config);
  }
  onInit() {

    if(util.isTrueProperty(this.zoom)) {
      this.enableZoom = true;
    }

    var options = util.defaults({
      pagination: '.swiper-pagination',
      paginationClickable: true,
      lazyLoading: true,
      preloadImages: false
    }, this.options);

    options.onTap = (swiper, e) => {
      this.onTap(swiper, e);
      return this.options.onTap && this.options.onTap(swiper, e);
    };
    options.onDoubleTap = (swiper, e) => {
      this.onDoubleTap(swiper, e);
      return this.options.onDoubleTap && this.options.onDoubleTap(swiper, e);
    };
    options.onTransitionStart = (swiper, e) => {
      this.onTransitionStart(swiper, e);
      return this.options.onTransitionStart && this.options.onTransitionStart(swiper, e);
    };
    options.onTransitionEnd = (swiper, e) => {
      this.onTransitionEnd(swiper, e);
      return this.options.onTransitionEnd && this.options.onTransitionEnd(swiper, e);
    };
    options.onSlideChangeStart = (swiper) => {
      console.log('Slide change!', swiper.previousIndex);
      return this.options.onSlideChangeStart && this.options.onSlideChangeStart(swiper);
    };
    options.onSlideChangeEnd = (swiper) => {
      console.log('Slide changED!');
      return this.options.onSlideChangeEnd && this.options.onSlideChangeEnd(swiper);
    };
    options.onLazyImageLoad = (swiper, slide, img) => {
      return this.options.onLazyImageLoad && this.options.onLazyImageLoad(swiper, slide, img);
    };
    options.onLazyImageReady = (swiper, slide, img) => {
      return this.options.onLazyImageReady && this.options.onLazyImageReady(swiper, slide, img);
    };

    var swiper = new Swiper(this.getNativeElement().children[0], options);

    this.swiper = swiper;
  }

  onTap(swiper, e) {
    console.log('Slide tap', swiper, e);
  }
  onDoubleTap(swiper, e) {
    console.log('Slide double tap', swiper, e);
  }
  onTransitionStart(swiper) {
    console.log('Slide transition start', swiper);
  }
  onTransitionEnd(swiper) {
    console.log('Slide transition end', swiper);
  }
  onLazyImageLoad(swiper, slide, img) {
    console.log('Slide lazy load', swiper, slide, img);
  }
  onLazyImageReady(swiper, slide, img) {
    console.log('Slide lazy ready', swiper, slide, img);
  }

  /*
  nextButton(swiper, e) {
    console.log('Slide next button', swiper, e);
  }
  prevButton() {
    console.log('Slide prev button', swiper, e);
  }
  indexButton() {
    console.log('Slide index button', swiper, e);
  }
  */

  initZoomScrolling() {
  }

  /**
   * Update the underlying slider implementation. Call this if you've added or removed
   * child slides.
   */
  update() {
    setTimeout(() => {
      this.swiper.update();

      // Don't allow pager to show with > 10 slides
      if(this.swiper.slides.length > 10) {
        this.showPager = false;
      }
    });
  }

  getSliderWidget() {
    return this.swiper;
  }
}

/**
 * TODO
 */
@IonicDirective({
  selector: 'ion-slide',
  properties: ['zoom']
})
export class Slide {
  /**
   * TODO
   * @param {Slides} slides  The containing slidebox.
   * @param {ElementRef} elementRef  TODO
   */
  constructor(
    elementRef: ElementRef
  ) {
    this.ele = elementRef.nativeElement;
    this.ele.classList.add('swiper-slide');
  }
  onInit() {
    if(this.zoom !== "false") {
      //this.initZoom();
    }
  }
  initZoom() {
    var g = new Gesture(this.ele);

    let zoomAnimation = new Animation(this.ele);
    zoomAnimation.from('scale', '1');

    g.on('doubletap', (e) => {
      zoomAnimation.to('scale', '3');
      zoomAnimation.play();
    });
  }

  /*
  initZoomScrolling() {
    this.zoomElement = this.ele.children[0];

    this.zoomElement && this.zoomElement.classList.add('ion-scroll-zoom');

    this.scrollElement.addEventListener('scroll', (e) => {
      console.log("Scrolling", e);
    });

    this.zoomGesture = new Gesture(this.scrollElement);
    this.zoomGesture.listen();

    this.zoomAnimation = new Animation(this.zoomElement);
    this.zoomAnimation
      .duration(200)
      .easing('ease-in')
      .from('scale', '1');

    this.zoomGesture.on('pinch', (e) => {
      console.log('PINCH', e);
    });

  }
  */

}

@IonicDirective({
  selector: 'slide-lazy',
})
export class SlideLazy {
  constructor(elementRef: ElementRef) {
    elementRef.getNativeElement().classList.add('swiper-lazy');
  }
}
