import {Component, View, ElementRef, EventEmitter, onInit,
  Host, forwardRef, NgFor, NgIf, NgClass} from 'angular2/angular2';

import {Ion} from '../ion';
import {DragGesture} from 'ionic/gestures/drag-gesture';
import {IonicComponent, IonicDirective} from '../../config/annotations';
import {IonicConfig} from '../../config/config';
import {dom} from 'ionic/util';
import {Platform} from 'ionic/platform/platform';
import * as util from 'ionic/util';

import {Swiper} from './swiper-widget';

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
    'hidePager',
    'options'
  ]
})
@View({
  template: `<div class="swiper-container">
    <div class="swiper-wrapper">
      <ng-content></ng-content>
    </div>
    <div [class.hide]="hidePager" class="swiper-pagination"></div>
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
    //this.getNativeElement().classList.add('swiper-container');

    var options = util.defaults({
      pagination: '.swiper-pagination',
      paginationClickable: true,
      lazyLoading: true
    }, this.options);

    var swiper = new Swiper(this.getNativeElement().children[0], options);

    console.log('Build swiper', swiper, options);

    this.swiper = swiper;
  }

  update() {
    setTimeout(() => {
      this.swiper.update();
      if(this.swiper.slides.length > 10) {
        this.hidePager = true;
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
})
export class Slide {
  /**
   * TODO
   * @param {Slides} slides  The containing slidebox.
   * @param {ElementRef} elementRef  TODO
   */
  constructor(
    //@Host() slides: Slides,
    elementRef: ElementRef
  ) {
    this.ele = elementRef.nativeElement;
    this.ele.classList.add('swiper-slide');
    //slides.add(this);
  }
}

@IonicDirective({
  selector: 'slide-lazy',
})
export class SlideLazy {
  constructor(elementRef: ElementRef) {
    elementRef.getNativeElement().classList.add('swiper-lazy');
  }
}
