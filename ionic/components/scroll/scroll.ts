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

  initZoomScrolling() {
    this.zoomElement = this.scrollElement.children[0].children[0];

    this.zoomElement && this.zoomElement.classList.add('ion-scroll-zoom');

    this.scrollElement.addEventListener('scroll', (e) => {
      console.log("Scrolling", e);
    });

    this.zoomGesture = new Gesture(this.scrollElement);
    this.zoomGesture.listen();

    let scale = 1, last_scale, deltaX, deltaY,
    startX, startY, posX = 0, posY = 0, lastPosX = 0, lastPosY = 0,
    zoomRect, viewportWidth, viewportHeight;

    viewportWidth = this.scrollElement.offsetWidth;
    viewportHeight = this.scrollElement.offsetWidth;


    this.zoomElement.addEventListener('touchstart', (e) => {
      console.log('PAN START', e);

      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;

      //lastPosX = 0;
      //lastPosY = 0;

      if(scale > 1) {
        //e.preventDefault();
        //e.stopPropagation();
      }
    });
    this.zoomElement.addEventListener('touchmove', (e) => {
      console.log('PAN', e);
      deltaX = e.touches[0].clientX - startX;
      deltaY = e.touches[0].clientY - startY;

      if(scale > 1) {

        // Move image
        posX = deltaX + lastPosX;
        posY = deltaY + lastPosY;

        console.log(posX, posY);


        if(posX > viewportWidth) {
          // Too far on the left side, let the event bubble up (to enable slider on edges, for example)
        } else if(-posX > viewportWidth) {
          // Too far on the right side, let the event bubble up (to enable slider on edges, for example)
        } else {
          this.zoomElement.parentElement.style[CSS.transform] = 'translate3d(' + posX + 'px, ' + posY + 'px, 0)';
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
      lastPosX = posX;
      lastPosY = posY;
    });

    this.zoomGesture.on('pinchstart', (e) => {
      last_scale = scale;
      console.log('Last scale', e.scale);
    });

    this.zoomGesture.on('pinch', (e) => {
      scale = Math.max(1, Math.min(last_scale * e.scale, 10));
      console.log('Scaling', scale);
      this.zoomElement.style[CSS.transform] = 'scale(' + scale + ')'

      zoomRect = this.zoomElement.getBoundingClientRect();
    });

    this.zoomGesture.on('pinchend', (e) => {
      //last_scale = Math.max(1, Math.min(last_scale * e.scale, 10));
      if(scale > this.maxScale) {
        let za = new Animation(this.zoomElement)
          .duration(this.zoomDuration)
          .easing('linear')
          .from('scale', scale)
          .to('scale', this.maxScale);
          za.play();

          scale = this.maxScale;
      }
    });

    this.zoomGesture.on('doubletap', (e) => {
      console.log("Double tap");
      let za = new Animation(this.zoomElement)
        .duration(this.zoomDuration)
        .easing('linear');

      if(scale > 1) {
        za.from('scale', scale);
        za.to('scale', 1);
        za.play();

        scale = 1;
      } else {
        za.from('scale', scale);
        za.to('scale', this.maxScale);
        za.play();

        scale = this.maxScale;
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
