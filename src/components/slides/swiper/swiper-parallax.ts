import { Slides } from '../slides';
import { eachChild, isHorizontal, transform, transition } from './swiper-utils';


/*=========================
  Parallax
  ===========================*/
function setParallaxTransform(s: Slides, el: HTMLElement, progress: number) {
  var p: string;
  var pX: string;
  var pY: string;
  var rtlFactor = s._rtl ? -1 : 1;

  p = el.getAttribute('data-swiper-parallax') || '0';
  pX = el.getAttribute('data-swiper-parallax-x');
  pY = el.getAttribute('data-swiper-parallax-y');

  if (pX || pY) {
    pX = pX || '0';
    pY = pY || '0';

  } else {
    if (isHorizontal(s)) {
      pX = p;
      pY = '0';
    } else {
      pY = p;
      pX = '0';
    }
  }

  if ((pX).indexOf('%') >= 0) {
    pX = parseInt(pX, 10) * progress * rtlFactor + '%';
  } else {
    pX = <any>pX * progress * rtlFactor + 'px' ;
  }

  if ((pY).indexOf('%') >= 0) {
    pY = parseInt(pY, 10) * progress + '%';
  } else {
    pY = <any>pY * progress + 'px' ;
  }

  transform(el, 'translate3d(' + pX + ', ' + pY + ',0px)');
}


export function parallaxSetTranslate(s: Slides) {
  eachChild(s.container, '[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]', (el) => {
    setParallaxTransform(s, el, s.progress);
  });

  for (var i = 0; i < s._slides.length; i++) {
    var slide = s._slides[i];
    eachChild(slide, '[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]', () => {
      var progress = Math.min(Math.max(slide.progress, -1), 1);
      setParallaxTransform(s, slide, progress);
    });
  }
}

export function parallaxSetTransition(s: Slides, duration: number) {
  if (typeof duration === 'undefined') duration = s.speed;

  eachChild(s.container, '[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]', (el) => {
    var parallaxDuration = parseInt(el.getAttribute('data-swiper-parallax-duration'), 10) || duration;
    if (duration === 0) parallaxDuration = 0;
    transition(el, parallaxDuration);
  });
}
