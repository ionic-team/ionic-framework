import { ariaDisable, ariaHidden } from './swiper-a11y';
import { addClass, removeClass, queryChildren } from './swiper-utils';
import { Slides } from '../slides';
import { updatePaginationClasses } from './swiper-pagination';


/*=========================
  Classes
  ===========================*/
export function updateClasses(s: Slides) {
  var childElements;

  removeClass(s._slides, [CLS.slideActive, CLS.slideNext, CLS.slidePrev, CLS.slideDuplicateActive, CLS.slideDuplicateNext, CLS.slideDuplicatePrev]);
  for (var i = 0; i < s._slides.length; i++) {
    ariaHidden(s._slides[i], true);
  }

  var activeSlide = s._slides[s._activeIndex];
  if (!activeSlide) {
    return;
  }

  // Active classes
  addClass(activeSlide, CLS.slideActive);
  ariaHidden(activeSlide, false);

  if (s.loop) {
    // Duplicate to all looped slides
    if (activeSlide.classList.contains(CLS.slideDuplicate)) {
      childElements = queryChildren(s._wrapper, '.' + CLS.slide + ':not(.' + CLS.slideDuplicate + ')[data-swiper-slide-index="' + s.realIndex + '"]');

    } else {
      childElements = queryChildren(s._wrapper, '.' + CLS.slide + '.' + CLS.slideDuplicate + '[data-swiper-slide-index="' + s.realIndex + '"]');
    }

    addClass(childElements, CLS.slideDuplicateActive);
  }

  // Next Slide
  var nextSlide = activeSlide.nextElementSibling;
  if (s.loop && !nextSlide) {
    nextSlide = s._slides[0];
  }
  nextSlide && nextSlide.classList.add(CLS.slideNext);

  // Prev Slide
  var prevSlide = activeSlide.previousElementSibling;
  if (s.loop && !prevSlide) {
    prevSlide = s._slides[s._slides.length - 1];
  }
  prevSlide && prevSlide.classList.add(CLS.slidePrev);

  if (s.loop) {
    // Duplicate to all looped slides
    if (nextSlide.classList.contains(CLS.slideDuplicate)) {
      childElements = queryChildren(s._wrapper, '.' + CLS.slide + ':not(.' + CLS.slideDuplicate + ')[data-swiper-slide-index="' + nextSlide.getAttribute('data-swiper-slide-index') + '"]');
    } else {
      childElements = queryChildren(s._wrapper, '.' + CLS.slide + '.' + CLS.slideDuplicate + '[data-swiper-slide-index="' + nextSlide.getAttribute('data-swiper-slide-index') + '"]');
    }
    addClass(childElements, CLS.slideDuplicateNext);

    if (prevSlide.classList.contains(CLS.slideDuplicate)) {
      childElements = queryChildren(s._wrapper, '.' + CLS.slide + ':not(.' + CLS.slideDuplicate + ')[data-swiper-slide-index="' + prevSlide.getAttribute('data-swiper-slide-index') + '"]');
    } else {
      childElements = queryChildren(s._wrapper, '.' + CLS.slide + '.' + CLS.slideDuplicate + '[data-swiper-slide-index="' + prevSlide.getAttribute('data-swiper-slide-index') + '"]');
    }
    addClass(childElements, CLS.slideDuplicatePrev);
  }

  // Pagination
  if (s._paginationContainer) {
    updatePaginationClasses(s);
  }

  // Next/active buttons
  if (!s.loop) {
    if (s.prevButton) {
      if (s._isBeginning) {
        s.prevButton.classList.add(CLS.buttonDisabled);
        ariaDisable(s.prevButton, true);

      } else {
        s.prevButton.classList.remove(CLS.buttonDisabled);
        ariaDisable(s.prevButton, false);
      }
    }

    if (s.nextButton) {
      if (s._isEnd) {
        s.nextButton.classList.add(CLS.buttonDisabled);
        ariaDisable(s.nextButton, true);

      } else {
        s.nextButton.classList.remove(CLS.buttonDisabled);
        ariaDisable(s.nextButton, false);
      }
    }
  }
}

export const CLS = {
  // Classnames
  noSwiping: 'swiper-no-swiping',
  containerModifier: 'swiper-container-',
  slide: 'swiper-slide',
  slideActive: 'swiper-slide-active',
  slideDuplicateActive: 'swiper-slide-duplicate-active',
  slideVisible: 'swiper-slide-visible',
  slideDuplicate: 'swiper-slide-duplicate',
  slideNext: 'swiper-slide-next',
  slideDuplicateNext: 'swiper-slide-duplicate-next',
  slidePrev: 'swiper-slide-prev',
  slideDuplicatePrev: 'swiper-slide-duplicate-prev',
  wrapper: 'swiper-wrapper',
  bullet: 'swiper-pagination-bullet',
  bulletActive: 'swiper-pagination-bullet-active',
  buttonDisabled: 'swiper-button-disabled',
  paginationCurrent: 'swiper-pagination-current',
  paginationTotal: 'swiper-pagination-total',
  paginationHidden: 'swiper-pagination-hidden',
  paginationProgressbar: 'swiper-pagination-progressbar',
  paginationClickable: 'swiper-pagination-clickable',
  paginationModifier: 'swiper-pagination-',
  lazyLoading: 'swiper-lazy',
  lazyStatusLoading: 'swiper-lazy-loading',
  lazyStatusLoaded: 'swiper-lazy-loaded',
  lazyPreloader: 'swiper-lazy-preloader',
  notification: 'swiper-notification',
  preloader: 'preloader',
  zoomContainer: 'swiper-zoom-container',
};
