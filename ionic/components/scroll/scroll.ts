import {View, ElementRef, onInit} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';
import {Gesture} from '../../gestures/gesture';
import {CSS} from '../../util/dom';
import {Animation} from '../../animations/animation';

import * as util from 'ionic/util';

/**
 * ion-scroll is a non-flexboxed scroll area that can
 * scroll horizontally or vertically.
 */
@IonicComponent({
  selector: 'ion-scroll',
  properties: [
    'scrollX', 'scrollY', 'zoom', 'maxZoom'
  ],
  host: {
    '[class.scroll-x]': 'scrollX',
    '[class.scroll-y]': 'scrollY'
  },
})
@View({
  template: '<scroll-content><div class="scroll-zoom-wrapper"><ng-content></ng-content></div></scroll-content>'
})
export class Scroll extends Ion {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} config  TODO
   */
  constructor(elementRef: ElementRef, ionicConfig: IonicConfig) {
    super(elementRef, ionicConfig);

    this.maxScale = 3;
    this.zoomDuration = 250;
  }

  onInit() {
    this.scrollElement = this.getNativeElement().children[0];

    if(util.isTrueProperty(this.zoom)) {
      this.initZoomScrolling();
    }
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

  initZoomScrolling() {
    this.zoomElement = this.scrollElement.children[0].children[0];

    this.zoomElement && this.zoomElement.classList.add('ion-scroll-zoom');

    this.scrollElement.addEventListener('scroll', (e) => {
      console.log("Scrolling", e);
    });

    this.zoomGesture = new Gesture(this.scrollElement);
    this.zoomGesture.listen();

    this.scale = 1;

    this.zoomLastPosX = 0;
    this.zoomLastPosY = 0;


    let last_scale, deltaX, deltaY, startX, startY, posX = 0, posY = 0, zoomRect, viewportWidth, viewportHeight;

    viewportWidth = this.scrollElement.offsetWidth;
    viewportHeight = this.scrollElement.offsetWidth;

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


        if(posX > viewportWidth) {
          // Too far on the left side, let the event bubble up (to enable slider on edges, for example)
        } else if(-posX > viewportWidth) {
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

      if(Math.abs(posX) > viewportWidth) {
        posX = posX > 0 ? viewportWidth - 1 : -(viewportWidth - 1);
        console.log('Setting on posx', posX);
      }
      this.zoomLastPosX = posX;
      this.zoomLastPosY = posY;
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

    this.zoomGesture.on('doubletap', (e) => {

      let x = e.pointers[0].clientX;
      let y = e.pointers[0].clientY;

      let mx = viewportWidth / 2;
      let my = viewportHeight / 2;

      let tx, ty;

      if(x > mx) {
        // Greater than half
        tx = -x;
      } else {
        // Less than or equal to half
        tx = (viewportWidth - x);
      }
      if(y > my) {
        ty = -y;
      } else {
        ty = y-my;
      }

      console.log(y);

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

        posX = 0;
        posY = 0;

        this.scale = 1;
      } else {
        // Zoom in

        //zw.fromTo('translateX', posX + 'px', tx + 'px');
        //zw.fromTo('translateY', posY + 'px', ty + 'px');

        zi.from('scale', this.scale);
        zi.to('scale', this.maxScale);
        za.play();

        posX = tx;
        posY = ty;

        this.scale = this.maxScale;
      }
      //this.zoomElement.style[CSS.transform] = 'scale(3)';
    });
  }

  /**
   * Add a scroll event handler to the scroll element if it exists.
   * @param {Function} handler  The scroll handler to add to the scroll element.
   * @returns {?Function} a function to remove the specified handler, otherwise
   * undefined if the scroll element doesn't exist.
   */
  addScrollEventListener(handler) {
    if(!this.scrollElement) { return; }

    this.scrollElement.addEventListener('scroll', handler);

    return () => {
      this.scrollElement.removeEventListener('scroll', handler);
    }
  }
}
