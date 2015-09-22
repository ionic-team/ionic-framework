import {Component, View, QueryList, ElementRef, EventEmitter, onInit,
  Host, forwardRef, NgFor, NgIf, NgClass} from 'angular2/angular2';

import {Ion} from '../ion';
import {Animation} from 'ionic/animations/animation';
import {Gesture} from 'ionic/gestures/gesture';
import {DragGesture} from 'ionic/gestures/drag-gesture';
import {IonicComponent, IonicDirective} from '../../config/decorators';
import {IonicConfig} from '../../config/config';
import {dom} from 'ionic/util';
import {CSS} from '../../util/dom';
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
    'pager',
    'options',
    'zoom',
    'zoomDuration',
    'zoomMax'
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
    this.rapidUpdate = util.debounce(() => {
      this.update();
    }, 10);
  }
  onInit() {
    if(!this.options) {
      this.options = {};
    }

    this.showPager = util.isTrueProperty(this.pager);


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
    options.onClick = (swiper, e) => {
      this.onClick(swiper, e);
      return this.options.onClick && this.options.onClick(swiper, e);
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
      return this.options.onSlideChangeStart && this.options.onSlideChangeStart(swiper);
    };
    options.onSlideChangeEnd = (swiper) => {
      return this.options.onSlideChangeEnd && this.options.onSlideChangeEnd(swiper);
    };
    options.onLazyImageLoad = (swiper, slide, img) => {
      return this.options.onLazyImageLoad && this.options.onLazyImageLoad(swiper, slide, img);
    };
    options.onLazyImageReady = (swiper, slide, img) => {
      return this.options.onLazyImageReady && this.options.onLazyImageReady(swiper, slide, img);
    };

    var swiper = new Swiper(this.getNativeElement().children[0], options);

    this.slider = swiper;

    /*
    * TODO: Finish this
    if(util.isTrueProperty(this.zoom)) {
      this.enableZoom = true;
      setTimeout(() => {
        this.initZoom();
      })
    }
    */

  }

  onTap(swiper, e) {
  }
  onClick(swiper, e) {
  }
  onDoubleTap(swiper, e) {

    this.toggleZoom(swiper, e);
  }
  onLazyImageLoad(swiper, slide, img) {
  }
  onLazyImageReady(swiper, slide, img) {
  }

  /*
  nextButton(swiper, e) {
  }
  prevButton() {
  }
  indexButton() {
  }
  */

  initZoom() {
    this.zoomDuration = this.zoomDuration || 230;
    this.maxScale = this.zoomMax || 3;

    this.zoomElement = this.getNativeElement().children[0].children[0];

    this.zoomElement && this.zoomElement.classList.add('ion-scroll-zoom');

    this.zoomGesture = new Gesture(this.zoomElement);
    this.zoomGesture.listen();

    this.scale = 1;

    this.zoomLastPosX = 0;
    this.zoomLastPosY = 0;


    let last_scale, startX, startY, posX = 0, posY = 0, zoomRect;

    this.viewportWidth = this.getNativeElement().offsetWidth;
    this.viewportHeight = this.getNativeElement().offsetHeight;

    this.zoomElement.addEventListener('touchstart', (e) => {

      this.onTouchStart(e);
    });

    this.zoomElement.addEventListener('touchmove', (e) => {
      this.onTouchMove(e);
    });

    this.zoomElement.addEventListener('touchend', (e) => {
      this.onTouchEnd(e);
    });

    this.zoomGesture.on('pinchstart', (e) => {
      last_scale = this.scale;
      console.log('Last scale', e.scale);
    });

    this.zoomGesture.on('pinch', (e) => {
      this.scale = Math.max(1, Math.min(last_scale * e.scale, 10));
      console.log('Scaling', this.scale);
      this.zoomElement.style[CSS.transform] = 'scale(' + this.scale + ')'

      zoomRect = this.zoomElement.getBoundingClientRect();
    });

    this.zoomGesture.on('pinchend', (e) => {
      //last_scale = Math.max(1, Math.min(last_scale * e.scale, 10));
      if(this.scale > this.maxScale) {
        let za = new Animation(this.zoomElement)
          .duration(this.zoomDuration)
          .easing('linear')
          .from('scale', this.scale)
          .to('scale', this.maxScale);
          za.play();

          this.scale = this.maxScale;
      }
    });
  }

  resetZoom() {

    if(this.zoomElement) {

      this.zoomElement.parentElement.style[CSS.transform] = '';
      this.zoomElement.style[CSS.transform] = 'scale(1)';
    }

    this.scale = 1;
    this.zoomLastPosX = 0;
    this.zoomLastPosY = 0;
  }

  toggleZoom(swiper, e) {
    console.log('Try toggle zoom');
    if(!this.enableZoom) { return; }

    console.log('Toggling zoom', e);

    /*
    let x = e.pointers[0].clientX;
    let y = e.pointers[0].clientY;

    let mx = this.viewportWidth / 2;
    let my = this.viewportHeight / 2;

    let tx, ty;

    if(x > mx) {
      // Greater than half
      tx = -x;
    } else {
      // Less than or equal to half
      tx = (this.viewportWidth - x);
    }
    if(y > my) {
      ty = -y;
    } else {
      ty = y-my;
    }

    console.log(y);
    */

    let zi = new Animation(this.touch.target.children[0])
      .duration(this.zoomDuration)
      .easing('linear')
      .fill('none');

    let zw = new Animation(this.touch.target.children[0])
      .duration(this.zoomDuration)
      .easing('linear');

    let za = new Animation();
    za.fill('none');
    za.add(zi);//, zw);

    if(this.scale > 1) {
      // Zoom out

      //zw.fromTo('translateX', posX + 'px', '0px');
      //zw.fromTo('translateY', posY + 'px', '0px');

      zi.from('scale', this.scale);
      zi.to('scale', 1);
      za.play();

      //posX = 0;
      //posY = 0;

      this.scale = 1;
    } else {
      // Zoom in

      //zw.fromTo('translateX', posX + 'px', tx + 'px');
      //zw.fromTo('translateY', posY + 'px', ty + 'px');

      zi.from('scale', this.scale);
      zi.to('scale', this.maxScale);
      za.play();

      //posX = tx;
      //posY = ty;

      this.scale = this.maxScale;
    }
  }
  onTransitionStart(swiper) {
  }
  onTransitionEnd(swiper) {
  }

  onTouchStart(e) {
    console.log('Touch start', e);

    //TODO: Support mice as well

    let target = dom.closest(e.target, '.slide').children[0].children[0];

    this.touch = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      deltaX: 0,
      deltaY: 0,
      lastX: 0,
      lastY: 0,
      target: target.parentElement,
      zoomable: target,
      zoomableWidth: target.offsetWidth,
      zoomableHeight: target.offsetHeight
    }
    console.log('Target', this.touch.target);

    //TODO: android prevent default

  }

  onTouchMove(e) {
    this.touch.deltaX = e.touches[0].clientX - this.touch.startX;
    this.touch.deltaY = e.touches[0].clientY - this.touch.startY;

    // TODO: Make sure we need to transform (image is bigger than viewport)

    let zoomableScaledWidth = this.touch.zoomableWidth * this.scale;
    let zoomableScaledHeight = this.touch.zoomableHeight * this.scale;

    let x1 = Math.min((this.viewportWidth / 2) - zoomableScaledWidth/2, 0)
    let x2 = -x1;
    let y1 = Math.min((this.viewportHeight / 2) - zoomableScaledHeight/2, 0)
    let y2 = -y1;

    console.log('BOUNDS', x1, x2, y1, y2);

    if(this.scale <= 1) {
      return;
    }

    console.log('PAN', e);

    // Move image
    this.touch.x = this.touch.deltaX + this.touch.lastX;
    this.touch.y = this.touch.deltaY + this.touch.lastY;

    console.log(this.touch.x, this.touch.y);

    if(this.touch.x < x1) {
      console.log('OUT ON LEFT');
    }
    if(this.touch.x > x2 ){
      console.log('OUT ON RIGHT');
    }

    if(this.touch.x > this.viewportWidth) {
      // Too far on the left side, let the event bubble up (to enable slider on edges, for example)
    } else if(-this.touch.x > this.viewportWidth) {
      // Too far on the right side, let the event bubble up (to enable slider on edges, for example)
    } else {
      console.log('TRANSFORM', this.touch.x, this.touch.y, this.touch.target);
      //this.touch.target.style[CSS.transform] = 'translateX(' + this.touch.x + 'px) translateY(' + this.touch.y + 'px)';
      this.touch.target.style[CSS.transform] = 'translateX(' + this.touch.x + 'px) translateY(' + this.touch.y + 'px)';
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

  }
  onTouchEnd(e) {
    console.log('PANEND', e);

    if(this.scale > 1) {

      if(Math.abs(this.touch.x) > this.viewportWidth) {
        posX = posX > 0 ? this.viewportWidth - 1 : -(this.viewportWidth - 1);
        console.log('Setting on posx', this.touch.x);
      }

      /*
      if(posY > this.viewportHeight/2) {
        let z = new Animation(this.zoomElement.parentElement);
        z.fromTo('translateY', posY + 'px', Math.min(this.viewportHeight/2 + 30, posY));
        z.play();
      } else {
        let z = new Animation(this.zoomElement.parentElement);
        z.fromTo('translateY', posY + 'px', Math.max(this.viewportHeight/2 - 30, posY));
        z.play();
      }
      */

      this.touch.lastX = this.touch.x;
      this.touch.lastY = this.touch.y;
    }
  }

  /**
   * Update the underlying slider implementation. Call this if you've added or removed
   * child slides.
   */
  update() {
    setTimeout(() => {
      this.slider.update();

      // Don't allow pager to show with > 10 slides
      if(this.slider.slides.length > 10) {
        this.showPager = false;
      }
    });
  }

  next() {
    this.slider.slideNext();
  }
  prev() {
    this.slider.slidePrev();
  }
  getIndex() {
    return this.slider.activeIndex;
  }
  getNumSlides() {
    return this.slider.slides.length;
  }
  isAtEnd() {
    return this.slider.isEnd;
  }
  isAtBeginning() {
    return this.slider.isBeginning;
  }

  getSliderWidget() {
    return this.slider;
  }
}

/**
 * TODO
 */
@IonicComponent({
  selector: 'ion-slide',
  properties: ['zoom']
})
@View({
  template: `<div class="slide-zoom"><ng-content></ng-content></div>`
})
export class Slide {
  /**
   * TODO
   * @param {Slides} slides  The containing slidebox.
   * @param {ElementRef} elementRef  TODO
   */
  constructor(
    elementRef: ElementRef,
    @Host() slides: Slides
  ) {
    this.ele = elementRef.nativeElement;
    this.ele.classList.add('swiper-slide');

    slides.rapidUpdate();
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
