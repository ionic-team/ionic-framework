import { SlideEffects } from './swiper-interfaces';
import { isHorizontal, transform, transition, eachChild, triggerTransitionEnd } from './swiper-utils';
import { isSafari, isIosUIWebView } from '../../../platform/platform-utils';


/*=========================
  Effects
  ===========================*/
export const SWIPER_EFFECTS: SlideEffects = {
  'fade': {
    setTranslate: function (s, plt) {
      for (var i = 0; i < s.slides.length; i++) {
        var slide = s.slides[i];
        var offset = slide.swiperSlideOffset;
        var tx = -offset;
        if (!s.params.virtualTranslate) tx = tx - s.translate;
        var ty = 0;
        if (!isHorizontal(s)) {
          ty = tx;
          tx = 0;
        }
        var slideOpacity = s.params.fade.crossFade ?
            Math.max(1 - Math.abs(slide.progress), 0) :
            1 + Math.min(Math.max(slide.progress, -1), 0);
        slide.style.opacity = <any>slideOpacity;
        transform(slide, 'translate3d(' + tx + 'px, ' + ty + 'px, 0px)');

      }
    },
    setTransition: function (s, plt, duration) {
      s.slides.forEach(slide => {
        transition(slide, duration);
      });

      if (s.params.virtualTranslate && duration !== 0) {
        var eventTriggered = false;

        s.slides.forEach(slide => {
          plt.transitionEnd(slide, () => {
            if (eventTriggered || !s) return;

            eventTriggered = true;
            s.animating = false;

            triggerTransitionEnd(plt, s.wrapper);
          });
        });
      }
    }
  },

  'flip': {
    setTranslate: function (s, plt) {
      for (var i = 0; i < s.slides.length; i++) {
        var slide = s.slides[i];
        var progress = slide.progress;
        if (s.params.flip.limitRotation) {
          progress = Math.max(Math.min(slide.progress, 1), -1);
        }
        var offset = slide.swiperSlideOffset;
        var rotate = -180 * progress,
          rotateY = rotate,
          rotateX = 0,
          tx = -offset,
          ty = 0;
        if (!isHorizontal(s)) {
          ty = tx;
          tx = 0;
          rotateX = -rotateY;
          rotateY = 0;
        } else if (s.rtl) {
          rotateY = -rotateY;
        }

        slide.style.zIndex = <any>-Math.abs(Math.round(progress)) + s.slides.length;

        if (s.params.flip.slideShadows) {
          // Set shadows
          var shadowBefore = <HTMLElement>(isHorizontal(s) ? slide.querySelector('.swiper-slide-shadow-left') : slide.querySelector('.swiper-slide-shadow-top'));
          var shadowAfter = <HTMLElement>(isHorizontal(s) ? slide.querySelector('.swiper-slide-shadow-right') : slide.querySelector('.swiper-slide-shadow-bottom'));

          if (!shadowBefore) {
            shadowBefore = plt.doc().createElement('div');
            shadowBefore.className = 'swiper-slide-shadow-' + (isHorizontal(s) ? 'left' : 'top');
            slide.appendChild(shadowBefore);
          }

          if (!shadowAfter) {
            shadowAfter = plt.doc().createElement('div');
            shadowAfter.className = 'swiper-slide-shadow-' + (isHorizontal(s) ? 'right' : 'bottom');
            slide.appendChild(shadowAfter);
          }

          if (shadowBefore) {
            shadowBefore.style.opacity = <any>Math.max(-progress, 0);
          }
          if (shadowAfter) {
            shadowAfter.style.opacity = <any>Math.max(progress, 0);
          }
        }

        transform(slide, 'translate3d(' + tx + 'px, ' + ty + 'px, 0px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)');
      }
    },
    setTransition: function (s, plt, duration) {
      s.slides.forEach(slide => {
        transition(slide, duration);
        eachChild(slide, '.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left', el => {
          transition(el, duration);
        });
      });

      if (s.params.virtualTranslate && duration !== 0) {
        var eventTriggered = false;
        plt.transitionEnd(s.slides[s.activeIndex], (ev) => {
          if (eventTriggered || !s) return;

          if (!(<HTMLElement>ev.target).classList.contains(s.params.slideActiveClass)) {
            return;
          }

          eventTriggered = true;
          s.animating = false;

          triggerTransitionEnd(plt, s.wrapper);
        });
      }
    }
  },

  'cube': {
    setTranslate: function (s, plt) {
      var wrapperRotate = 0;
      var cubeShadow: HTMLElement;

      if (s.params.cube.shadow) {
        if (isHorizontal(s)) {
          cubeShadow = <HTMLElement>s.wrapper.querySelector('.swiper-cube-shadow');

          if (!cubeShadow) {
            cubeShadow = plt.doc().createElement('div');
            cubeShadow.className = 'swiper-cube-shadow';
            s.wrapper.appendChild(cubeShadow);
          }
          cubeShadow.style.height = s.width + 'px';

        } else {
          cubeShadow = <HTMLElement>s.container.querySelector('.swiper-cube-shadow');
          if (!cubeShadow) {
            cubeShadow = plt.doc().createElement('div');
            cubeShadow.className = 'swiper-cube-shadow';
            s.wrapper.appendChild(cubeShadow);
          }
        }
      }

      for (var i = 0; i < s.slides.length; i++) {
        var slide = s.slides[i];
        var slideAngle = i * 90;
        var round = Math.floor(slideAngle / 360);
        if (s.rtl) {
          slideAngle = -slideAngle;
          round = Math.floor(-slideAngle / 360);
        }
        var progress = Math.max(Math.min(slide.progress, 1), -1);
        var tx = 0, ty = 0, tz = 0;
        if (i % 4 === 0) {
          tx = - round * 4 * s.size;
          tz = 0;
        } else if ((i - 1) % 4 === 0) {
          tx = 0;
          tz = - round * 4 * s.size;
        } else if ((i - 2) % 4 === 0) {
          tx = s.size + round * 4 * s.size;
          tz = s.size;
        } else if ((i - 3) % 4 === 0) {
          tx = - s.size;
          tz = 3 * s.size + s.size * 4 * round;
        }
        if (s.rtl) {
          tx = -tx;
        }

        if (!isHorizontal(s)) {
          ty = tx;
          tx = 0;
        }

        var transformStr = 'rotateX(' + (isHorizontal(s) ? 0 : -slideAngle) + 'deg) rotateY(' + (isHorizontal(s) ? slideAngle : 0) + 'deg) translate3d(' + tx + 'px, ' + ty + 'px, ' + tz + 'px)';
        if (progress <= 1 && progress > -1) {
          wrapperRotate = i * 90 + progress * 90;
          if (s.rtl) wrapperRotate = -i * 90 - progress * 90;
        }
        transform(slide, transformStr);
        if (s.params.cube.slideShadows) {
          // Set shadows
          var shadowBefore = <HTMLElement>(isHorizontal(s) ? slide.querySelector('.swiper-slide-shadow-left') : slide.querySelector('.swiper-slide-shadow-top'));
          var shadowAfter = <HTMLElement>(isHorizontal(s) ? slide.querySelector('.swiper-slide-shadow-right') : slide.querySelector('.swiper-slide-shadow-bottom'));

          if (!shadowBefore) {
            shadowBefore = plt.doc().createElement('div');
            shadowBefore.className = 'swiper-slide-shadow-' + (isHorizontal(s) ? 'left' : 'top');
            slide.appendChild(shadowBefore);
          }

          if (!shadowAfter) {
            shadowAfter = plt.doc().createElement('div');
            shadowAfter.className = 'swiper-slide-shadow-' + (isHorizontal(s) ? 'right' : 'bottom');
            slide.appendChild(shadowAfter);
          }

          if (shadowBefore) shadowBefore.style.opacity = <any>Math.max(-progress, 0);
          if (shadowAfter) shadowAfter.style.opacity = <any>Math.max(progress, 0);
        }
      }
      s.wrapper.style.transformOrigin = s.wrapper.style.webkitTransformOrigin = '50% 50% -' + (s.size / 2) + 'px';

      if (s.params.cube.shadow) {
        if (isHorizontal(s)) {
          transform(cubeShadow, 'translate3d(0px, ' + (s.width / 2 + s.params.cube.shadowOffset) + 'px, ' + (-s.width / 2) + 'px) rotateX(90deg) rotateZ(0deg) scale(' + (s.params.cube.shadowScale) + ')');

        } else {
          var shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
          var multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
          var scale1 = s.params.cube.shadowScale;
          var scale2 = s.params.cube.shadowScale / multiplier;
          var offset = s.params.cube.shadowOffset;

          transform(cubeShadow, 'scale3d(' + scale1 + ', 1, ' + scale2 + ') translate3d(0px, ' + (s.height / 2 + offset) + 'px, ' + (-s.height / 2 / scale2) + 'px) rotateX(-90deg)');
        }
      }

      var zFactor = (isSafari(plt) || isIosUIWebView(plt)) ? (-s.size / 2) : 0;
      transform(s.wrapper, 'translate3d(0px,0,' + zFactor + 'px) rotateX(' + (isHorizontal(s) ? 0 : wrapperRotate) + 'deg) rotateY(' + (isHorizontal(s) ? -wrapperRotate : 0) + 'deg)');
    },
    setTransition: function (s, plt, duration) {
      s.slides.forEach(slide => {
        transition(slide, duration);
        eachChild(slide, '.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left', el => {
          transition(el, duration);
        });
      });

      if (s.params.cube.shadow && !isHorizontal(s)) {
        eachChild(s.container, '.swiper-cube-shadow', el => {
          transition(el, duration);
        });
      }
    }
  },

  'coverflow': {
    setTranslate: function (s, plt) {
      var transformStr = s.translate;
      var center = isHorizontal(s) ? -transformStr + s.width / 2 : -transformStr + s.height / 2;
      var rotate = isHorizontal(s) ? s.params.coverflow.rotate : -s.params.coverflow.rotate;
      var translate = s.params.coverflow.depth;

      // Each slide offset from center
      for (var i = 0, length = s.slides.length; i < length; i++) {
        var slide = s.slides[i];
        var slideSize = s.slidesSizesGrid[i];
        var slideOffset = slide.swiperSlideOffset;
        var offsetMultiplier = (center - slideOffset - slideSize / 2) / slideSize * s.params.coverflow.modifier;

        var rotateY = isHorizontal(s) ? rotate * offsetMultiplier : 0;
        var rotateX = isHorizontal(s) ? 0 : rotate * offsetMultiplier;
        // var rotateZ = 0
        var translateZ = -translate * Math.abs(offsetMultiplier);

        var translateY = isHorizontal(s) ? 0 : s.params.coverflow.stretch * (offsetMultiplier);
        var translateX = isHorizontal(s) ? s.params.coverflow.stretch * (offsetMultiplier) : 0;

        // Fix for ultra small values
        if (Math.abs(translateX) < 0.001) translateX = 0;
        if (Math.abs(translateY) < 0.001) translateY = 0;
        if (Math.abs(translateZ) < 0.001) translateZ = 0;
        if (Math.abs(rotateY) < 0.001) rotateY = 0;
        if (Math.abs(rotateX) < 0.001) rotateX = 0;

        var slideTransform = 'translate3d(' + translateX + 'px,' + translateY + 'px,' + translateZ + 'px)  rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';

        transform(slide, slideTransform);

        slide.style.zIndex = <any>-Math.abs(Math.round(offsetMultiplier)) + 1;

        if (s.params.coverflow.slideShadows) {
          // Set shadows
          var shadowBefore = <HTMLElement>(isHorizontal(s) ? slide.querySelector('.swiper-slide-shadow-left') : slide.querySelector('.swiper-slide-shadow-top'));
          var shadowAfter = <HTMLElement>(isHorizontal(s) ? slide.querySelector('.swiper-slide-shadow-right') : slide.querySelector('.swiper-slide-shadow-bottom'));

          if (!shadowBefore) {
            shadowBefore = plt.doc().createElement('div');
            shadowBefore.className = 'swiper-slide-shadow-' + (isHorizontal(s) ? 'left' : 'top');
            slide.appendChild(shadowBefore);
          }

          if (!shadowAfter) {
            shadowAfter = plt.doc().createElement('div');
            shadowAfter.className = 'swiper-slide-shadow-' + (isHorizontal(s) ? 'right' : 'bottom');
            slide.appendChild(shadowAfter);
          }

          if (shadowBefore) {
            shadowBefore.style.opacity = <any>(offsetMultiplier > 0 ? offsetMultiplier : 0);
          }
          if (shadowAfter) {
            shadowAfter.style.opacity = <any>((-offsetMultiplier) > 0 ? -offsetMultiplier : 0);
          }
        }
      }
    },
    setTransition: function (s, plt, duration) {
      s.slides.forEach(slide => {
        transition(slide, duration);
        eachChild(slide, '.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left', (el) => {
          transition(el, duration);
        });
      });
    }
  }
};
