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
  }
  onInit() {
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

    if(util.isTrueProperty(this.zoom)) {
      this.enableZoom = true;
      this.initZoom();
    }

  }

  onTap(swiper, e) {
    console.log('Slide tap', swiper, e);
  }
  onClick(swiper, e) {
    console.log('Slide click', swiper, e);
  }
  onDoubleTap(swiper, e) {
    console.log('Slide double tap', swiper, e);

    this.toggleZoom(swiper, e);
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

  initZoom() {
    this.zoomDuration = this.zoomDuration || 230;
    this.maxScale = this.zoomMax || 3;

    this.zoomElement = this.getNativeElement().children[0].children[0];
    console.log('Zooming', this.zoomElement);

    this.zoomElement && this.zoomElement.classList.add('ion-scroll-zoom');

    console.log(this.swiper.slides);

    this.zoomGesture = new Gesture(this.zoomElement);
    this.zoomGesture.listen();

    this.scale = 1;

    this.zoomLastPosX = 0;
    this.zoomLastPosY = 0;


    let last_scale, deltaX, deltaY, startX, startY, posX = 0, posY = 0, zoomRect;

    this.viewportWidth = this.getNativeElement().offsetWidth;
    this.viewportHeight = this.getNativeElement().offsetHeight;

    this.zoomElement.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    this.zoomElement.addEventListener('touchmove', (e) => {
      deltaX = e.touches[0].clientX - startX;
      deltaY = e.touches[0].clientY - startY;

      if(this.scale > 1) {
        console.log('PAN', e);

        // Move image
        posX = deltaX + this.zoomLastPosX;
        posY = deltaY + this.zoomLastPosY;

        console.log(posX, posY);


        if(posX > this.viewportWidth) {
          // Too far on the left side, let the event bubble up (to enable slider on edges, for example)
        } else if(-posX > this.viewportWidth) {
          // Too far on the right side, let the event bubble up (to enable slider on edges, for example)
        } else {
          console.log('TRANSFORM', posX);
          this.zoomElement.parentElement.style[CSS.transform] = 'translateX(' + posX + 'px) translateY(' + posY + 'px)';
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

      }
    });

    this.zoomElement.addEventListener('touchend', (e) => {
      console.log('PANEND', e);

      if(this.scale > 1) {

        if(Math.abs(posX) > this.viewportWidth) {
          posX = posX > 0 ? this.viewportWidth - 1 : -(this.viewportWidth - 1);
          console.log('Setting on posx', posX);
        }

        if(posY > this.viewportHeight/2) {
          let z = new Animation(this.zoomElement.parentElement);
          z.fromTo('translateY', posY + 'px', Math.min(this.viewportHeight/2 + 30, posY));
          z.play();
        } else {
          let z = new Animation(this.zoomElement.parentElement);
          z.fromTo('translateY', posY + 'px', Math.max(this.viewportHeight/2 - 30, posY));
          z.play();
        }

        this.zoomLastPosX = posX;
        this.zoomLastPosY = posY;
      }
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

    let zi = new Animation(this.zoomElement)
      .duration(this.zoomDuration)
      .easing('linear');
    let zw = new Animation(this.zoomElement.parentElement)
      .duration(this.zoomDuration)
      .easing('linear');

    let za = new Animation();
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
    console.log('Slide transition start', swiper);
  }
  onTransitionEnd(swiper) {
    console.log('Slide transition end', swiper);
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
